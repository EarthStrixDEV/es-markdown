'use client';

import { Field } from '@/components/Field';
import { AGENT_GROUPS, AGENT_REQUIRED, AGENT_WIDE } from '@/data/agent-fields';
import type { AgentFieldKey, Strings } from '@/data/i18n/types';
import type { AgentFieldValues } from './useAgentsState';

interface AgentFormProps {
  strings: Strings;
  fields: AgentFieldValues;
  onChange: (key: AgentFieldKey, value: string) => void;
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.5 13.5 3.6v4.2c0 3.2-2.3 5.5-5.5 6.7-3.2-1.2-5.5-3.5-5.5-6.7V3.6L8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="m5.6 7.9 1.7 1.7 3.1-3.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AgentForm({ strings, fields, onChange }: AgentFormProps) {
  const a = strings.agent;
  return (
    <section className="ag-form" aria-label="Agent form">
      {AGENT_GROUPS.map((group, i) => (
        <div key={group.id} className={`ag-group${i > 0 ? ' ag-group-divided' : ''}`}>
          <div className="ag-group-title">{a.groups[group.id]}</div>
          <div className="ag-group-grid">
            {group.fields.map((key) => (
              <Field
                key={key}
                className={AGENT_WIDE.has(key) ? 'field-wide' : undefined}
                label={a.fields[key].label}
                placeholder={a.fields[key].placeholder}
                hint={a.fields[key].def}
                hintLabel={strings.ui.ifEmpty}
                required={AGENT_REQUIRED.has(key)}
                rows={key === 'instruction' || key === 'steps' ? 3 : 2}
                value={fields[key] ?? ''}
                onChange={(value) => onChange(key, value)}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="ag-safety">
        <span className="ag-safety-icon" aria-hidden="true">
          <ShieldIcon />
        </span>
        <span>
          <strong>{a.safetyStrong}</strong> {a.safetyBody}
        </span>
      </div>
    </section>
  );
}
