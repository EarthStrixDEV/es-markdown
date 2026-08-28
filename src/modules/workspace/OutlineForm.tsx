'use client';

import { Field } from '@/components/Field';
import { FIELD_KEYS, type FieldKey, type Strings, type TopicId } from '@/data/i18n/types';
import type { FieldValues } from './useWorkspaceState';

interface OutlineFormProps {
  strings: Strings;
  topicId: TopicId;
  fields: FieldValues;
  onChange: (key: FieldKey, value: string) => void;
}

/* Fields spanning both form columns; the rest pair up two per row. */
const WIDE_FIELDS: ReadonlySet<FieldKey> = new Set(['goal', 'context', 'requirements']);

export function OutlineForm({ strings, topicId, fields, onChange }: OutlineFormProps) {
  const topic = strings.topics[topicId];

  return (
    <section className="ws-form" aria-label={topic.formTitle}>
      <header className="ws-form-head">
        {/* Wireframe shows a single-glyph pink chip; we use the topic initial. */}
        <span className="ws-form-chip" aria-hidden="true">
          {topic.label.charAt(0)}
        </span>
        <div>
          <div className="ws-form-title">{topic.formTitle}</div>
          <div className="ws-form-note">{topic.formNote}</div>
        </div>
      </header>

      <div className="ws-form-grid">
        {FIELD_KEYS.map((key) => (
          <Field
            key={`${topicId}-${key}`}
            className={WIDE_FIELDS.has(key) ? 'field-wide' : undefined}
            label={topic.fields[key].label}
            placeholder={topic.fields[key].placeholder}
            hint={topic.fields[key].def}
            hintLabel={strings.ui.ifEmpty}
            required={key === 'goal'}
            value={fields[key] ?? ''}
            onChange={(value) => onChange(key, value)}
          />
        ))}
      </div>

      <div className="ws-followup-note">
        <span className="ws-followup-dot" aria-hidden="true" />
        <span>{strings.ui.followUpNote}</span>
      </div>
    </section>
  );
}
