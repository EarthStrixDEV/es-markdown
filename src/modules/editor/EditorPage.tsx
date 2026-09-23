'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CopyButton } from '@/components/CopyButton';
import { MarkdownPreview } from '@/components/MarkdownPreview';
import { SAMPLE_DOC } from '@/data/sample-doc';
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
  const [text, setTextValue] = useState(SAMPLE_DOC);
  const { text: currentText, toolbarProps, textareaProps, setText } = useMarkdownEditor({
    value: text,
    onChange: setTextValue,
  });

  const [previewMd, setPreviewMd] = useState(SAMPLE_DOC);
  const [view, setView] = useState<'rendered' | 'raw'>('rendered');
  const [saved, setSaved] = useState(false);
  const savedTimer = useRef<number | null>(null);

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
          <h1>Markdown Editor</h1>
          <p>
            Write Markdown directly — no guided form, just a toolbar, a textbox, and a live
            preview.
          </p>
        </div>
        <div className="ed-head-actions">
          <button type="button" className="ed-btn-neutral" onClick={handleClear}>
            <ClearIcon />
            Clear
          </button>
          <button
            type="button"
            className="ed-btn-pink"
            onClick={handleSave}
            title="History arrives with the workspace module"
          >
            <CheckIcon />
            {saved ? 'Saved (session)' : 'Save to history'}
          </button>
        </div>
      </div>

      <Toolbar {...toolbarProps} />

      <div className="ed-workbench">
        {/* Plain text pane */}
        <section className="ed-pane" aria-label="Markdown source">
          <header className="ed-pane-head">
            <span className="ed-pane-title">
              <span className="ed-dot" aria-hidden="true" />
              Plain text
            </span>
            <span className="ed-pane-meta">draft.md</span>
          </header>
          <textarea
            {...textareaProps}
            className="ed-textarea"
            spellCheck={false}
            aria-label="Markdown source"
          />
          <footer className="ed-pane-foot">
            <span className="ed-pill">
              {charCount} chars · {lineCount} lines
            </span>
            <CopyButton label="Copy raw" getText={() => currentText} />
          </footer>
        </section>

        {/* Preview pane */}
        <section className="ed-pane" aria-label="Preview">
          <header className="ed-pane-head">
            <div className="ed-seg" role="tablist" aria-label="Preview mode">
              <button
                type="button"
                role="tab"
                aria-selected={view === 'rendered'}
                className={`ed-seg-btn${view === 'rendered' ? ' is-active' : ''}`}
                onClick={() => setView('rendered')}
              >
                Rendered
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={view === 'raw'}
                className={`ed-seg-btn${view === 'raw' ? ' is-active' : ''}`}
                onClick={() => setView('raw')}
              >
                Raw source
              </button>
            </div>
            <span className="ed-pane-meta">live preview</span>
          </header>
          <div className="ed-preview-scroll">
            {view === 'rendered' ? (
              <MarkdownPreview md={previewMd} />
            ) : (
              <pre className="ed-raw-source">{previewMd}</pre>
            )}
          </div>
          <footer className="ed-pane-foot">
            <span className="ed-pill">Formatted · synced</span>
            <CopyButton label="Copy HTML" getText={() => renderMarkdown(currentText)} />
          </footer>
        </section>
      </div>
    </div>
  );
}
