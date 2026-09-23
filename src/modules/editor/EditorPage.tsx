'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CopyButton } from '@/components/CopyButton';
import { MarkdownPreview } from '@/components/MarkdownPreview';
import { getStrings } from '@/data/i18n';
import { useLanguage } from '@/i18n/useLanguage';
import { renderMarkdown } from '@/lib/markdown';
import { Toolbar, useMarkdownEditor } from '@/components/MarkdownEditPane';
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

  const [text, setTextValue] = useState(ed.sampleDoc);
  const { text: currentText, toolbarProps, textareaProps, setText } = useMarkdownEditor({
    value: text,
    onChange: setTextValue,
  });

  const [previewMd, setPreviewMd] = useState(ed.sampleDoc);
  const [view, setView] = useState<'rendered' | 'raw'>('rendered');
  const [saved, setSaved] = useState(false);
  const savedTimer = useRef<number | null>(null);

  /*
   * Pristine sample-doc swap: when the language changes and the document is
   * still exactly the previous locale's untouched seed, replace it with the
   * new locale's sample. Any user-modified document is left alone. `setText`
   * records one undoable step, so undo behaves sanely after the swap.
   */
  const prevLang = useRef(lang);
  useEffect(() => {
    if (prevLang.current === lang) return;
    const prevSample = getStrings(prevLang.current).editor.sampleDoc;
    prevLang.current = lang;
    if (currentText === prevSample) {
      setText(ed.sampleDoc);
    }
  }, [lang, currentText, setText, ed.sampleDoc]);

  /* Debounced preview: typing on the left renders on the right ~80ms later. */
  useEffect(() => {
    const t = window.setTimeout(() => setPreviewMd(currentText), PREVIEW_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [currentText]);

  useEffect(
    () => () => {
      if (savedTimer.current !== null) window.clearTimeout(savedTimer.current);
    },
    [],
  );

  function handleClear() {
    setText('');
  }

  function handleSave() {
    // Persistence lands with the Workspace module; for now just acknowledge.
    setSaved(true);
    if (savedTimer.current !== null) window.clearTimeout(savedTimer.current);
    savedTimer.current = window.setTimeout(() => setSaved(false), 1600);
  }

  const renderedHtml = useMemo(() => renderMarkdown(previewMd), [previewMd]);
  const charCount = currentText.length;
  const lineCount = currentText === '' ? 0 : currentText.split('\n').length;

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

      <Toolbar strings={strings} {...toolbarProps} />

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
            {...textareaProps}
            className="ed-textarea"
            spellCheck={false}
            aria-label={ed.ariaLabels.markdownSource}
          />
          <footer className="ed-pane-foot">
            <span className="ed-pill">
              {charCount} {ed.chars} · {lineCount} {ed.lines}
            </span>
            <CopyButton label={ed.copyRaw} getText={() => currentText} />
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
            <CopyButton label={ed.copyHtml} getText={() => renderMarkdown(currentText)} />
          </footer>
        </section>
      </div>
    </div>
  );
}
