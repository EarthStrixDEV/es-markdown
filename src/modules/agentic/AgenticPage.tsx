'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CopyButton } from '@/components/CopyButton';
import { MarkdownPreview } from '@/components/MarkdownPreview';
import { getStrings } from '@/data/i18n';
import { useLanguage } from '@/i18n/useLanguage';
import { AGENT_FIELD_KEYS } from '@/data/i18n/types';
import { assembleAgent } from '@/lib/assembler';
import { slugify } from '@/lib/slugify';
import { AgentForm } from './AgentForm';
import { AgentSidebar } from './AgentSidebar';
import { WorkflowGraph } from './WorkflowGraph';
import { useAgentsState } from './useAgentsState';
import './agentic.css';

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

/*
 * `marked` would misread YAML frontmatter (the closing --- turns the last
 * line into a setext heading), so the Formatted view splits it off and shows
 * it as a verbatim block above the rendered body.
 */
function splitFrontmatter(md: string): { frontmatter: string | null; body: string } {
  const m = md.match(/^---\n[\s\S]*?\n---\n?/);
  if (!m) return { frontmatter: null, body: md };
  return { frontmatter: m[0].trimEnd(), body: md.slice(m[0].length) };
}

export function AgenticPage() {
  const { lang } = useLanguage();
  const strings = getStrings(lang);
  const a = strings.agent;
  const { state, newAgent, selectAgent, setField, resetAgent, save } = useAgentsState();
  const [view, setView] = useState<'formatted' | 'plain'>('formatted');
  const [saved, setSaved] = useState(false);
  const savedTimer = useRef<number | null>(null);

  const active = state.agents[state.activeId];
  const agents = state.order.map((id) => state.agents[id]);

  /* Live on every keystroke — small doc, memoized on the fields object. */
  const markdown = useMemo(
    () => assembleAgent({ fields: active.fields, strings }),
    [active.fields, strings],
  );
  const { frontmatter, body } = useMemo(() => splitFrontmatter(markdown), [markdown]);

  const title = active.fields.name?.trim() || a.defaultTitle;
  const fileName = `${slugify(title)}.md`;
  const writtenCount = AGENT_FIELD_KEYS.filter((k) => (active.fields[k] ?? '').trim() !== '').length;

  useEffect(
    () => () => {
      if (savedTimer.current !== null) window.clearTimeout(savedTimer.current);
    },
    [],
  );

  function handleSave() {
    const roleLine = active.fields.role?.trim().split('\n')[0].slice(0, 40);
    save(title, roleLine || a.defaultSubtitle);
    setSaved(true);
    if (savedTimer.current !== null) window.clearTimeout(savedTimer.current);
    savedTimer.current = window.setTimeout(() => setSaved(false), 1600);
  }

  return (
    <div className="ag">
      <AgentSidebar
        strings={strings}
        agents={agents}
        activeId={state.activeId}
        onSelect={selectAgent}
        onNew={newAgent}
      />

      <div className="ag-main">
        <div className="ag-head">
          <div>
            <h1>{title}</h1>
            <p>{a.pageSubtitle}</p>
          </div>
          <div className="ag-head-actions">
            <button type="button" className="ag-btn-neutral" onClick={resetAgent}>
              <ResetIcon />
              {strings.ui.reset}
            </button>
            <button type="button" className="ag-btn-pink" onClick={handleSave}>
              <CheckIcon />
              {saved ? a.savedFlash : a.saveAgent}
            </button>
          </div>
        </div>

        <div className="ag-view-label">{a.formViewLabel}</div>

        <div className="ag-grid">
          <AgentForm strings={strings} fields={active.fields} onChange={setField} />

          <section className="ag-preview" aria-label="AGENT.md preview">
            <header className="ag-preview-head">
              <div className="ag-preview-left">
                <span className="ag-format-pill">AGENT.md</span>
                <div className="ag-seg" role="tablist" aria-label="Preview mode">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={view === 'formatted'}
                    className={`ag-seg-btn${view === 'formatted' ? ' is-active' : ''}`}
                    onClick={() => setView('formatted')}
                  >
                    {strings.ui.formatted}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={view === 'plain'}
                    className={`ag-seg-btn${view === 'plain' ? ' is-active' : ''}`}
                    onClick={() => setView('plain')}
                  >
                    {strings.ui.plainText}
                  </button>
                </div>
              </div>
              <span className="ag-file">{fileName}</span>
            </header>

            <div className="ag-preview-body">
              {view === 'formatted' ? (
                <>
                  {frontmatter && <pre className="ag-frontmatter">{frontmatter}</pre>}
                  <MarkdownPreview md={body} />
                </>
              ) : (
                <pre className="ag-plain">{markdown}</pre>
              )}
            </div>

            <footer className="ag-preview-foot">
              <div className="ag-meter">
                <span className="ag-chip">
                  {markdown.length.toLocaleString(strings.locale === 'th' ? 'th-TH' : 'en-US')}{' '}
                  {strings.ui.chars}
                </span>
                <span className="ag-chip ag-chip-pink">
                  {writtenCount}/{AGENT_FIELD_KEYS.length} {strings.ui.written}
                </span>
              </div>
              <CopyButton label={strings.ui.copy} getText={() => markdown} />
            </footer>
          </section>
        </div>

        <WorkflowGraph strings={strings} />
      </div>
    </div>
  );
}
