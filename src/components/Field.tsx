'use client';

import { useId } from 'react';

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** DEF text shown under the field as "If empty: …" (gold). */
  hint?: string;
  /** The "If empty:" label — comes from i18n. */
  hintLabel?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

/*
 * Shared labeled textarea with the gold DEF hint underneath — the workspace
 * and agentic forms are built from this. Styles: `.field*` in globals.css.
 */
export function Field({
  label,
  value,
  onChange,
  placeholder,
  hint,
  hintLabel,
  required,
  rows = 2,
  className,
}: FieldProps) {
  const id = useId();
  return (
    <div className={`field${className ? ` ${className}` : ''}`}>
      <label className="field-label" htmlFor={id}>
        {label}
        {required && (
          <span className="field-star" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      <textarea
        id={id}
        className="field-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        spellCheck={false}
      />
      {hint && (
        <span className="field-hint">
          {hintLabel} <em className="field-hint-value">{hint}</em>
        </span>
      )}
    </div>
  );
}
