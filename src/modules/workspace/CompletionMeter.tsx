'use client';

import { FIELD_KEYS, type Strings } from '@/data/i18n/types';
import type { FieldValues } from './useWorkspaceState';

interface CompletionMeterProps {
  strings: Strings;
  fields: FieldValues;
  /** Length of the currently assembled markdown. */
  charCount: number;
}

/* Footer chips: "N chars" (neutral) + "X/9 written" (pink), per wireframe. */
export function CompletionMeter({ strings, fields, charCount }: CompletionMeterProps) {
  const written = FIELD_KEYS.filter((k) => (fields[k] ?? '').trim() !== '').length;
  return (
    <div className="ws-meter">
      <span className="ws-chip">
        {charCount.toLocaleString(strings.locale === 'th' ? 'th-TH' : 'en-US')} {strings.ui.chars}
      </span>
      <span className="ws-chip ws-chip-pink">
        {written}/{FIELD_KEYS.length} {strings.ui.written}
      </span>
    </div>
  );
}
