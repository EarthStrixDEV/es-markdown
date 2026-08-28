import type {
  FieldKey,
  PromptSectionKey,
  SkillSectionKey,
  WorkflowSectionKey,
} from './i18n/types';

/*
 * Section templates per output format (spec §6).
 *
 * Field → section mapping. The 9 field keys feed differently-named sections
 * per format; `prefixed: true` marks the topic-flavored slots (audience,
 * avoid) that render as an inline "Label: value" line inside their host
 * section instead of getting a heading of their own:
 *
 *   field         prompt          skill              workflow
 *   ------------  --------------  -----------------  -------------
 *   goal          Goal            frontmatter desc.  Objective
 *   context       Context         When to use        Context
 *   audience      ↳ Context (Audience: …)  ↳ When to use     ↳ Context
 *   startingData  Starting data   Required info      Inputs
 *   requirements  Requirements    Steps              Task sequence (checkboxes)
 *   constraints   Constraints     Constraints        Constraints
 *   avoid         ↳ Constraints (Avoid: …) ↳ Constraints     ↳ Constraints
 *   outputFormat  Output format   Output format      Deliverables
 *   qualityBar    Quality bar     Quality bar        Done when
 *
 * Every format then appends the fixed guardrail; prompt additionally appends
 * the follow-up pack below `---` (assembler.ts).
 */

export interface SectionFieldRef {
  key: FieldKey;
  /** Render as "{prefix label}: {value}" inside the section body. */
  prefixed?: boolean;
}

export interface SectionSpec<K extends string = string> {
  key: K;
  fields: SectionFieldRef[];
  /** 'checklist' renders each line of the value as a checkbox step with a confirm line. */
  render?: 'text' | 'checklist';
}

export const PROMPT_SECTIONS: SectionSpec<PromptSectionKey>[] = [
  { key: 'goal', fields: [{ key: 'goal' }] },
  { key: 'context', fields: [{ key: 'context' }, { key: 'audience', prefixed: true }] },
  { key: 'startingData', fields: [{ key: 'startingData' }] },
  { key: 'requirements', fields: [{ key: 'requirements' }] },
  { key: 'constraints', fields: [{ key: 'constraints' }, { key: 'avoid', prefixed: true }] },
  { key: 'outputFormat', fields: [{ key: 'outputFormat' }] },
  { key: 'qualityBar', fields: [{ key: 'qualityBar' }] },
];

/* `goal` is absent here on purpose: it becomes the frontmatter description. */
export const SKILL_SECTIONS: SectionSpec<SkillSectionKey>[] = [
  { key: 'whenToUse', fields: [{ key: 'context' }, { key: 'audience', prefixed: true }] },
  { key: 'requiredInfo', fields: [{ key: 'startingData' }] },
  { key: 'steps', fields: [{ key: 'requirements' }] },
  { key: 'constraints', fields: [{ key: 'constraints' }, { key: 'avoid', prefixed: true }] },
  { key: 'outputFormat', fields: [{ key: 'outputFormat' }] },
  { key: 'qualityBar', fields: [{ key: 'qualityBar' }] },
];

export const WORKFLOW_SECTIONS: SectionSpec<WorkflowSectionKey>[] = [
  { key: 'objective', fields: [{ key: 'goal' }] },
  { key: 'context', fields: [{ key: 'context' }, { key: 'audience', prefixed: true }] },
  { key: 'inputs', fields: [{ key: 'startingData' }] },
  { key: 'taskSequence', fields: [{ key: 'requirements' }], render: 'checklist' },
  { key: 'constraints', fields: [{ key: 'constraints' }, { key: 'avoid', prefixed: true }] },
  { key: 'deliverables', fields: [{ key: 'outputFormat' }] },
  { key: 'doneWhen', fields: [{ key: 'qualityBar' }] },
];
