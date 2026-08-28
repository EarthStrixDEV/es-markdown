'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CopyButton } from '@/components/CopyButton';
import { MarkdownPreview } from '@/components/MarkdownPreview';
import { getStrings } from '@/data/i18n';
import { fileNameFor, topicDefaults } from '@/data/topics';
import { assemble } from '@/lib/assembler';
import { CompletionMeter } from './CompletionMeter';
import { FormatSwitch } from './FormatSwitch';
import { HistoryList } from './HistoryList';
import { OutlineForm } from './OutlineForm';
import { TopicPicker } from './TopicPicker';
import { useWorkspaceState } from './useWorkspaceState';
import './workspace.css';

function ResetIcon() {
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

export function WorkspacePage() {
  const strings = getStrings('en');
  const { state, selectTopic, selectFormat, setField, resetTopic, save, restore } =
    useWorkspaceState();
  const [view, setView] = useState<'formatted' | 'plain'>('formatted');
  const [saved, setSaved] = useState(false);
  const savedTimer = useRef<number | null>(null);

  const topic = strings.topics[state.activeTopic];
  const fields = state.byTopic[state.activeTopic];

  /* Live on every keystroke — docs are small, no debounce needed (spec §2). */
  const markdown = useMemo(
    () =>
      assemble({
        format: state.activeFormat,
        fields,
        defaults: topicDefaults(topic),
        strings,
        title: topic.docTitle,
      }),
    [state.activeFormat, fields, topic, strings],
  );

  useEffect(
    () => () => {
      if (savedTimer.current !== null) window.clearTimeout(savedTimer.current);
    },
    [],
  );

  function handleSave() {
    const title = fields.goal?.trim().slice(0, 48) || topic.docTitle;
    save(title);
    setSaved(true);
    if (savedTimer.current !== null) window.clearTimeout(savedTimer.current);
    savedTimer.current = window.setTimeout(() => setSaved(false), 1600);
  }

  return (
    <div className="ws">
      <aside className="ws-side">
        <TopicPicker strings={strings} activeTopic={state.activeTopic} onSelect={selectTopic} />
        <HistoryList strings={strings} entries={state.history} onRestore={restore} />
      </aside>

      <div className="ws-main">
        <div className="ws-head">
          <div>
            <h1>{topic.label}</h1>
            <p>{strings.ui.pageSubtitle}</p>
          </div>
          <div className="ws-head-actions">
            <button type="button" className="ws-btn-neutral" onClick={resetTopic}>
              <ResetIcon />
              {strings.ui.reset}
            </button>
            <button type="button" className="ws-btn-pink" onClick={handleSave}>
              <CheckIcon />
              {saved ? strings.ui.savedFlash : strings.ui.saveToHistory}
            </button>
          </div>
        </div>

        <div className="ws-grid">
          <OutlineForm
            strings={strings}
            topicId={state.activeTopic}
            fields={fields}
            onChange={setField}
          />

          <div className="ws-preview-col">
            <FormatSwitch strings={strings} active={state.activeFormat} onSelect={selectFormat} />

            <section className="ws-preview" aria-label="Preview">
              <header className="ws-preview-head">
                <div className="ws-seg" role="tablist" aria-label="Preview mode">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={view === 'formatted'}
                    className={`ws-seg-btn${view === 'formatted' ? ' is-active' : ''}`}
                    onClick={() => setView('formatted')}
                  >
                    {strings.ui.formatted}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={view === 'plain'}
                    className={`ws-seg-btn${view === 'plain' ? ' is-active' : ''}`}
                    onClick={() => setView('plain')}
                  >
                    {strings.ui.plainText}
                  </button>
                </div>
                <span className="ws-file">{fileNameFor(state.activeTopic, state.activeFormat)}</span>
              </header>

              <div className="ws-preview-body">
                {view === 'formatted' ? (
                  <MarkdownPreview md={markdown} />
                ) : (
                  <pre className="ws-plain">{markdown}</pre>
                )}
              </div>

              <footer className="ws-preview-foot">
                <CompletionMeter strings={strings} fields={fields} charCount={markdown.length} />
                <CopyButton label={strings.ui.copy} getText={() => markdown} />
              </footer>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
