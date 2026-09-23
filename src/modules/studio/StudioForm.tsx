'use client';

import { Field } from '@/components/Field';
import {
  fillTemplate,
  type StudioFieldDef,
  type StudioFieldKey,
  type StudioType,
  type StudioUiStrings,
  type StudioValues,
} from '@/data/studio';

interface StudioFormProps {
  type: StudioType;
  typeLabel: string;
  commonFields: StudioFieldDef[];
  extraFields: StudioFieldDef[];
  values: StudioValues;
  locked: boolean;
  ifEmptyLabel: string;
  ui: StudioUiStrings;
  onChange: (key: StudioFieldKey, value: string) => void;
  onRegenerate: () => void;
}

export function StudioForm({
  type,
  typeLabel,
  commonFields,
  extraFields,
  values,
  locked,
  ifEmptyLabel,
  ui,
  onChange,
  onRegenerate,
}: StudioFormProps) {
  const renderField = (f: StudioFieldDef) => (
    <Field
      key={`${type}-${f.id}`}
      className={f.multiline ? 'field-wide' : undefined}
      label={f.label}
      placeholder={f.placeholder}
      hint={f.def}
      hintLabel={ifEmptyLabel}
      required={f.required}
      rows={f.multiline ? 3 : 1}
      value={values[f.id] ?? ''}
      onChange={(value) => onChange(f.id, value)}
    />
  );

  return (
    <section className="ws-form" aria-label={fillTemplate(ui.formLabel, { type: typeLabel })}>
      {locked && (
        <div className="st-locked" role="status">
          <span>{ui.lockedBanner}</span>
          <button type="button" className="ws-btn-neutral" onClick={onRegenerate}>
            {ui.regenerate}
          </button>
        </div>
      )}

      {/* A disabled fieldset natively disables every textarea inside it. */}
      <fieldset className="st-fieldset" disabled={locked}>
        <legend className="st-group-title">{ui.commonGroup}</legend>
        <div className="ws-form-grid">{commonFields.map(renderField)}</div>
      </fieldset>

      {extraFields.length > 0 && (
        <fieldset className="st-fieldset" disabled={locked}>
          <legend className="st-group-title">
            {fillTemplate(ui.typeGroup, { type: typeLabel })}
          </legend>
          <div className="ws-form-grid">{extraFields.map(renderField)}</div>
        </fieldset>
      )}
    </section>
  );
}
