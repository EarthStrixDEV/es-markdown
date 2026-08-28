'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { CopyButton } from '@/components/CopyButton';
import { MarkdownPreview } from '@/components/MarkdownPreview';
import { getStrings } from '@/data/i18n';
import { useLanguage } from '@/i18n/useLanguage';
import { renderMarkdown } from '@/lib/markdown';
import {
  applyBlock,
  applyInline,
  applyList,
  insertSnippet,
  type BlockStyle,
  type EditState,
  type InlineMarker,
  type ListKind,
  type SnippetKind,
} from './actions';
import { classifyInput, useHistory } from './useHistory';
import { Toolbar } from './Toolbar';
import './editor.css';

const PREVIEW_DEBOUNCE_MS = 80;

function ClearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M5.2 3.2 2.4 6l2.8 2.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.6 6h6.6a4.2 4.2 0 0 1 0 8.4H6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="m2.8 8.6 3.4 3.4 7-7.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EditorPage() {
  const { lang } = useLanguage();
  const strings = getStrings(lang);
  const ed = strings.editor;

  const taRef = useRef<HTMLTextAreaElement>(null);
  const restoreSel = useRef(false);
  const { present, canUndo, canRedo, input, replace, undo, redo } = useHistory({
    text: ed.sampleDoc,
    selStart: 0,
    selEnd: 0,
  });

  const [previewMd, setPreviewMd] = useState(ed.sampleDoc);
  const [view, setView] = useState<'rendered' | 'raw'>('rendered');
  const [saved, setSaved] = useState(false);
  const savedTimer = useRef<number | null>(null);

  /*
   * Pristine sample-doc swap: when the language changes and the document is
   * still exactly the previous locale's untouched seed, replace it with the
   * new locale's sample. Any user-modified document is left alone. `replace`
   * goes through the history reducer, so undo behaves sanely after the swap.
   */
  const prevLang = useRef(lang);
  useEffect(() => {
    if (prevLang.current === lang) return;
    const prevSample = getStrings(prevLang.current).editor.sampleDoc;
    prevLang.current = lang;
    if (present.text === prevSample) {
      replace({ text: ed.sampleDoc, selStart: 0, selEnd: 0 });
    }
  }, [lang, present.text, replace, ed.sampleDoc]);

  /* Debounced preview: typing on the left renders on the right ~80ms later. */
  useEffect(() => {
    const t = window.setTimeout(() => setPreviewMd(present.text), PREVIEW_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [present.text]);

  /* Restore caret/selection after every programmatic change (toolbar, undo…). */
  useLayoutEffect(() => {
    if (!restoreSel.current || !taRef.current) return;
    restoreSel.current = false;
    taRef.current.focus();
    taRef.current.setSelectionRange(present.selStart, present.selEnd);
  }, [present]);

  useEffect(
    () => () => {
      if (savedTimer.current !== null) window.clearTimeout(savedTimer.current);
    },
    [],
  );

  /* Selection truth at action time is the DOM, not the last input event. */
  function currentState(): EditState {
    const ta = taRef.current;
    return {
      text: present.text,
      selStart: ta ? ta.selectionStart : present.selStart,
      selEnd: ta ? ta.selectionEnd : present.selEnd,
    };
  }

  function runAction(fn: (state: EditState) => EditState) {
    restoreSel.current = true;
    replace(fn(currentState()));
  }

  const onInline = (marker: InlineMarker) => runAction((st) => applyInline(st, marker));
  const onBlock = (style: BlockStyle) => runAction((st) => applyBlock(st, style));
  const onList = (kind: ListKind) => runAction((st) => applyList(st, kind));
  const onSnippet = (kind: SnippetKind) => runAction((st) => insertSnippet(st, kind));

  const onUndo = () => {
    restoreSel.current = true;
    undo();
  };
  const onRedo = () => {
    restoreSel.current = true;
    redo();
  };

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const el = e.target;
    input(
      { text: el.value, selStart: el.selectionStart, selEnd: el.selectionEnd },
      classifyInput(present.text, el.value),
    );
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!(e.ctrlKey || e.metaKey)) return;
    const key = e.key.toLowerCase();
    if (key === 'z') {
      e.preventDefault();
      if (e.shiftKey) onRedo();
      else onUndo();
    } else if (key === 'y') {
      e.preventDefault();
      onRedo();
    }
  }

  function handleClear() {
    restoreSel.current = true;
    replace({ text: '', selStart: 0, selEnd: 0 });
  }

  function handleSave() {
    // Persistence lands with the Workspace module; for now just acknowledge.
    setSaved(true);
    if (savedTimer.current !== null) window.clearTimeout(savedTimer.current);
    savedTimer.current = window.setTimeout(() => setSaved(false), 1600);
  }

  const renderedHtml = useMemo(() => renderMarkdown(previewMd), [previewMd]);
  const charCount = present.text.length;
  const lineCount = present.text === '' ? 0 : present.text.split('\n').length;

  return (
    <div className="ed-page">
      <div className="ed-head">
        <div>
          <h1>{ed.title}</h1>
          <p>{ed.subtitle}</p>
        </div>
        <div className="ed-head-actions">
          <button type="button" className="ed-btn-neutral" onClick={handleClear}>
            <ClearIcon />
            {ed.clear}
          </button>
          <button
            type="button"
            className="ed-btn-pink"
            onClick={handleSave}
            title={ed.saveTitle}
          >
            <CheckIcon />
            {saved ? ed.savedFlash : ed.saveToHistory}
          </button>
        </div>
      </div>

      <Toolbar
        strings={strings}
        onInline={onInline}
        onBlock={onBlock}
        onList={onList}
        onSnippet={onSnippet}
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      <div className="ed-workbench">
        {/* Plain text pane */}
        <section className="ed-pane" aria-label={ed.ariaLabels.markdownSource}>
          <header className="ed-pane-head">
            <span className="ed-pane-title">
              <span className="ed-dot" aria-hidden="true" />
              {ed.pane.plainText}
            </span>
            <span className="ed-pane-meta">{ed.pane.draftFileName}</span>
          </header>
          <textarea
            ref={taRef}
            className="ed-textarea"
            value={present.text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            aria-label={ed.ariaLabels.markdownSource}
          />
          <footer className="ed-pane-foot">
            <span className="ed-pill">
              {charCount} {ed.chars} · {lineCount} {ed.lines}
            </span>
            <CopyButton label={ed.copyRaw} getText={() => present.text} />
          </footer>
        </section>

        {/* Preview pane */}
        <section className="ed-pane" aria-label={ed.ariaLabels.preview}>
          <header className="ed-pane-head">
            <div className="ed-seg" role="tablist" aria-label={ed.ariaLabels.previewMode}>
              <button
                type="button"
                role="tab"
                aria-selected={view === 'rendered'}
                className={`ed-seg-btn${view === 'rendered' ? ' is-active' : ''}`}
                onClick={() => setView('rendered')}
              >
                {ed.pane.rendered}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={view === 'raw'}
                className={`ed-seg-btn${view === 'raw' ? ' is-active' : ''}`}
                onClick={() => setView('raw')}
              >
                {ed.pane.rawSource}
              </button>
            </div>
            <span className="ed-pane-meta">{ed.pane.livePreview}</span>
          </header>
          <div className="ed-preview-scroll">
            {view === 'rendered' ? (
              <MarkdownPreview md={previewMd} />
            ) : (
              <pre className="ed-raw-source">{previewMd}</pre>
            )}
          </div>
          <footer className="ed-pane-foot">
            <span className="ed-pill">{ed.pill}</span>
            <CopyButton label={ed.copyHtml} getText={() => renderMarkdown(present.text)} />
          </footer>
        </section>
      </div>
    </div>
  );
}
