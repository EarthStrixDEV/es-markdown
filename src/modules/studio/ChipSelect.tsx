'use client';

import { useId, useState } from 'react';
import type { StudioFieldDef, StudioFieldKey, StudioValues } from '@/data/studio';
import { parseOptionValue } from '@/lib/studio-assembler';

interface ChipSelectProps {
  field: StudioFieldDef;
  /** The `otherKey` companion field (label/placeholder for the Other input). */
  otherField?: StudioFieldDef;
  values: StudioValues;
  hintLabel: string;
  onChange: (key: StudioFieldKey, value: string) => void;
}

/*
 * Multi-select preset chips for an option field (Image/Video style). The value
 * is the selected preset ids joined by '\n' in preset order; the "Other" chip
 * reveals a one-line input bound to `field.otherKey`. Disabled state comes
 * from the surrounding <fieldset disabled>.
 */
export function ChipSelect({ field, otherField, values, hintLabel, onChange }: ChipSelectProps) {
  const labelId = useId();
  const otherId = useId();
  const options = field.options ?? [];
  const selected = parseOptionValue(field, values[field.id]);
  const otherKey = field.otherKey;
  const otherText = otherKey ? (values[otherKey] ?? '') : '';
  // Other is open when it has text, or after the user clicked it (empty text).
  const [otherOpen, setOtherOpen] = useState(otherText !== '');
  const showOther = otherOpen || otherText !== '';

  const toggle = (id: string) => {
    const next = selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id];
    onChange(field.id, options.filter((o) => next.includes(o)).join('\n'));
  };

  const toggleOther = () => {
    if (!otherKey) return;
    if (showOther) {
      setOtherOpen(false);
      if (otherText !== '') onChange(otherKey, '');
    } else {
      setOtherOpen(true);
    }
  };

  return (
    <div className="field field-wide">
      <span className="field-label" id={labelId}>
        {field.label}
      </span>
      <div className="st-chips" role="group" aria-labelledby={labelId}>
        {options.map((id) => (
          <button
            key={id}
            type="button"
            className="st-chip"
            aria-pressed={selected.includes(id)}
            onClick={() => toggle(id)}
          >
            {field.optionLabels?.[id] ?? id}
          </button>
        ))}
        {otherKey && (
          <button
            type="button"
            className="st-chip"
            aria-pressed={showOther}
            aria-controls={showOther ? otherId : undefined}
            onClick={toggleOther}
          >
            {field.otherLabel}
          </button>
        )}
      </div>
      {otherKey && showOther && (
        <input
          id={otherId}
          type="text"
          className="field-input"
          aria-label={otherField?.label ?? field.otherLabel}
          placeholder={otherField?.placeholder}
          value={otherText}
          onChange={(e) => onChange(otherKey, e.target.value)}
          spellCheck={false}
        />
      )}
      <span className="field-hint">
        {hintLabel} <em className="field-hint-value">{field.def}</em>
      </span>
    </div>
  );
}
