'use client';

import { useMemo } from 'react';
import { CopyButton } from '@/components/CopyButton';
import { MarkdownEditPane } from '@/components/MarkdownEditPane';
import { fillTemplate, type StudioUiStrings } from '@/data/studio';
import { STUDIO_FORMATS, type StudioFormat } from '@/lib/studio-history';



interface StudioOutputProps {
  active: StudioFormat;
  text: string;
  staleFormats: ReadonlySet<StudioFormat>;
  copyLabel: string;
  /** BCP 47 locale for the char count, e.g. 'th-TH'. */
  numberLocale: string;
  ui: StudioUiStrings;
  onSelect: (format: StudioFormat) => void;
  onEdit: (format: StudioFormat, text: string) => void;
}

function jsonError(text: string): string | null {
  try {
    JSON.parse(text);
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : String(err);
  }
}

export function StudioOutput({
  active,
  text,
  staleFormats,
  copyLabel,
  numberLocale,
  ui,
  onSelect,
  onEdit,
}: StudioOutputProps) {
  const error = useMemo(() => (active === 'json' ? jsonError(text) : null), [active, text]);
  const stale = staleFormats.has(active);
  const label = fillTemplate(ui.outputLabel, { format: ui.formats[active] });

  return (
    <div className="ws-preview-col">
      <div className="ws-format" role="tablist" aria-label={ui.formatTabsLabel}>
        {STUDIO_FORMATS.map((f) => (
          <button
            key={f}
            id={`st-tab-${f}`}
            type="button"
            role="tab"
            aria-selected={active === f}
            aria-controls={active === f ? 'st-panel' : undefined}
            className={`ws-format-btn${active === f ? ' is-active' : ''}`}
            onClick={() => onSelect(f)}
          >
            {ui.formats[f]}
            {staleFormats.has(f) && (
              <span className="st-stale-dot" title={ui.stale}>
                <span className="st-sr">{ui.staleSr}</span>
              </span>
            )}
          </button>
        ))}
      </div>

      <section
        className="ws-preview"
        id="st-panel"
        role="tabpanel"
        aria-labelledby={`st-tab-${active}`}
      >
        {stale && (
          <div className="st-stale" role="note">
            {ui.stale}
          </div>
        )}

        <div className="st-pane">
          {active === 'markdown' ? (
            <MarkdownEditPane
              value={text}
              onChange={(v) => onEdit('markdown', v)}
              label={label}
              textareaClassName="st-mep-textarea"
            />
          ) : (
            <textarea
              key={active}
              className="st-textarea"
              value={text}
              onChange={(e) => onEdit(active, e.target.value)}
              aria-label={label}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'st-json-error' : undefined}
              spellCheck={false}
            />
          )}
        </div>

        {error && (
          <p id="st-json-error" className="st-json-error" role="alert">
            {ui.jsonErrorPrefix} {error}
          </p>
        )}

        <footer className="ws-preview-foot">
          <span className="ws-chip">
            {fillTemplate(ui.charCount, { count: text.length.toLocaleString(numberLocale) })}
          </span>
          <CopyButton label={copyLabel} getText={() => text} />
        </footer>
      </section>
    </div>
  );
}
