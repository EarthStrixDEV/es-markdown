import {
  getStudioStrings,
  studioCommonFields,
  studioExtraFields,
  studioGuardrailSet,
  studioOtherKeys,
  type StudioExtraFieldKey,
  type StudioFieldDef,
  type StudioStrings,
  type StudioType,
  type StudioValues,
} from '@/data/studio';
import type { StudioFormat } from './studio-history';

export type { StudioFormat };

/*
 * Studio assembler (plan steps 2–3). Pure functions turning a Studio form into
 * Plain / JSON / Markdown. Same resolution rule as the Workspace assembler:
 * trimmed user input, else the field's DEF (whitespace-only counts as empty).
 * Only fields of the selected type are read — leftover values from other
 * types in `values` are ignored.
 */

interface ResolvedSection {
  field: StudioFieldDef;
  /** Scalar text, or list items for `list` fields. */
  value: string | string[];
}

function splitList(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l !== '');
}

/** Selected preset ids from a stored option value, in preset order. */
export function parseOptionValue(field: StudioFieldDef, stored: string | undefined): string[] {
  const picked = new Set(splitList(stored ?? ''));
  return (field.options ?? []).filter((id) => picked.has(id));
}

/** Option field → selected preset labels + trimmed "Other" text, else DEF lines. */
function resolveOptions(field: StudioFieldDef, values: StudioValues): string[] {
  const items = parseOptionValue(field, values[field.id]).map(
    (id) => field.optionLabels?.[id] ?? id,
  );
  const other = field.otherKey ? values[field.otherKey]?.trim() : '';
  if (other) items.push(other);
  return items.length > 0 ? items : splitList(field.def);
}

function resolveField(field: StudioFieldDef, values: StudioValues): ResolvedSection {
  if (field.options) return { field, value: resolveOptions(field, values) };
  const raw = values[field.id]?.trim() || field.def;
  return { field, value: field.list ? splitList(raw) : raw };
}

function resolveAll(type: StudioType, values: StudioValues, strings: StudioStrings) {
  const otherKeys = studioOtherKeys(type);
  return {
    common: studioCommonFields(strings).map((f) => resolveField(f, values)),
    // "Other" companions are folded into their option field, never emitted alone.
    extra: studioExtraFields(type, strings)
      .filter((f) => !otherKeys.has(f.id as StudioExtraFieldKey))
      .map((f) => resolveField(f, values)),
    set: studioGuardrailSet(type, strings),
    title: `${strings.types[type].label} prompt`,
  };
}

const bullets = (items: string[]) => items.map((i) => `- ${i}`).join('\n');
const renderValue = (v: string | string[]) => (Array.isArray(v) ? bullets(v) : v);

export function toMarkdown(
  type: StudioType,
  values: StudioValues,
  strings: StudioStrings = getStudioStrings(),
): string {
  const { common, extra, set, title } = resolveAll(type, values, strings);
  const out: string[] = [`# ${title}`, ''];
  for (const { field, value } of [...common, ...extra]) {
    out.push(`## ${field.label}`, '', renderValue(value), '');
  }
  out.push(`## ${set.guardrail.heading}`, '', set.guardrail.body, '');
  out.push('---', '', `## ${set.followUps.heading}`, '');
  set.followUps.items.forEach((item, i) => out.push(`${i + 1}. ${item}`));
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

export function toPlain(
  type: StudioType,
  values: StudioValues,
  strings: StudioStrings = getStudioStrings(),
): string {
  const { common, extra, set } = resolveAll(type, values, strings);
  const sections: string[] = [...common, ...extra].map(
    ({ field, value }) => `${field.label.toUpperCase()}:\n${renderValue(value)}`,
  );
  sections.push(`${set.guardrail.heading.toUpperCase()}:\n${set.guardrail.body}`);
  sections.push(
    `${set.followUps.heading.toUpperCase()}:\n` +
      set.followUps.items.map((item, i) => `${i + 1}. ${item}`).join('\n'),
  );
  return sections.join('\n\n') + '\n';
}

export interface StudioJson {
  type: StudioType;
  task: string;
  context: string;
  audience: string;
  constraints: string[];
  output: string;
  tone: string;
  examples: string;
  params: Record<string, string | string[]>;
  guardrail: string;
  follow_ups: [string, string, string];
}

export function toJson(
  type: StudioType,
  values: StudioValues,
  strings: StudioStrings = getStudioStrings(),
): string {
  const { common, extra, set } = resolveAll(type, values, strings);
  const c = Object.fromEntries(common.map((s) => [s.field.id, s.value]));
  const doc: StudioJson = {
    type,
    task: c.task as string,
    context: c.context as string,
    audience: c.audience as string,
    constraints: c.constraints as string[],
    output: c.output as string,
    tone: c.tone as string,
    examples: c.examples as string,
    params: Object.fromEntries(extra.map((s) => [s.field.id, s.value])),
    guardrail: set.guardrail.body,
    follow_ups: [set.followUps.items[0], set.followUps.items[1], set.followUps.items[2]],
  };
  return JSON.stringify(doc, null, 2);
}

export function assembleAll(
  type: StudioType,
  values: StudioValues,
  strings: StudioStrings = getStudioStrings(),
): Record<StudioFormat, string> {
  return {
    plain: toPlain(type, values, strings),
    json: toJson(type, values, strings),
    markdown: toMarkdown(type, values, strings),
  };
}
