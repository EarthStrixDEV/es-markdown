'use client';

import type { FormatId, Strings } from '@/data/i18n/types';

const FORMAT_IDS: FormatId[] = ['prompt', 'skill', 'workflow'];

interface FormatSwitchProps {
  strings: Strings;
  active: FormatId;
  onSelect: (format: FormatId) => void;
}

/* Prompt .md / SKILL.md / Workflow .md segmented control (spec §2). */
export function FormatSwitch({ strings, active, onSelect }: FormatSwitchProps) {
  return (
    <div className="ws-format" role="tablist" aria-label="Output format">
      {FORMAT_IDS.map((id) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={active === id}
          className={`ws-format-btn${active === id ? ' is-active' : ''}`}
          onClick={() => onSelect(id)}
        >
          {strings.formats[id].label}
        </button>
      ))}
    </div>
  );
}
