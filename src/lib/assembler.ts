import {
  PROMPT_SECTIONS,
  SKILL_SECTIONS,
  WORKFLOW_SECTIONS,
  type SectionSpec,
} from '@/data/templates';
import { AGENT_SECTION_ORDER, agentDefaults } from '@/data/agent-fields';
import type { AgentFieldKey, FieldKey, FormatId, Strings } from '@/data/i18n/types';
import { slugify } from './slugify';

/*
 * The single template engine (Prompt Format v1, spec §0 + §6).
 * Guarantees: every section of the chosen format is always present; empty
 * fields resolve to their DEF default (never blank); every document ends with
 * the fixed guardrail; the prompt format additionally carries the follow-up
 * pack below a `---` divider, prefixed by its warning line.
 */

export interface AssembleArgs {
  format: FormatId;
  fields: Partial<Record<FieldKey, string>>;
  defaults: Record<FieldKey, string>;
  strings: Strings;
  /** Document h1 / SKILL.md name source. Defaults to the resolved goal. */
  title?: string;
}

function sectionBody(
  spec: SectionSpec,
  resolve: (k: FieldKey) => string,
  strings: Strings,
): string {
  const parts = spec.fields.map((f) => {
    const value = resolve(f.key);
    if (!f.prefixed) return value;
    const prefix = f.key === 'audience' ? strings.prefixes.audience : strings.prefixes.avoid;
    return `${prefix}: ${value}`;
  });

  if (spec.render === 'checklist') {
    // Workflow task sequence: one checkbox per line of the value, each with a
    // confirm line before the next step may start (spec §6).
    const steps = parts[0]
      .split('\n')
      .map((l) => l.replace(/^\s*(?:[-*+]|\d+\.)\s+/, '').trim())
      .filter((l) => l !== '');
    return steps
      .map((step) => `- [ ] ${step}\n  - [ ] ${strings.workflow.stepConfirm}`)
      .join('\n');
  }

  return parts.join('\n\n');
}

export function assemble({ format, fields, defaults, strings, title }: AssembleArgs): string {
  const resolve = (k: FieldKey): string => fields[k]?.trim() || defaults[k];
  const docTitle = title?.trim() || resolve('goal');
  const out: string[] = [];

  const pushSections = (specs: SectionSpec[], headings: Record<string, string>) => {
    for (const spec of specs) {
      out.push(`## ${headings[spec.key]}`, '', sectionBody(spec, resolve, strings), '');
    }
  };

  if (format === 'skill') {
    // Description lives in YAML frontmatter — collapse newlines to keep it valid.
    const description = resolve('goal').replace(/\s+/g, ' ').trim();
    out.push('---', `name: ${slugify(docTitle)}`, `description: ${description}`, '---', '');
    pushSections(SKILL_SECTIONS, strings.sections.skill);
  } else {
    out.push(`# ${docTitle}`, '');
    pushSections(
      format === 'prompt' ? PROMPT_SECTIONS : WORKFLOW_SECTIONS,
      format === 'prompt' ? strings.sections.prompt : strings.sections.workflow,
    );
  }

  out.push(`## ${strings.guardrail.heading}`, '', strings.guardrail.body, '');

  if (format === 'prompt') {
    out.push('---', '', `> ${strings.followUpPack.warning}`, '');
    strings.followUpPack.items.forEach((item, i) => out.push(`${i + 1}. ${item}`));
    out.push('');
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

/* --------------------------------------------------------------- AGENT.md */

export interface AssembleAgentArgs {
  fields: Partial<Record<AgentFieldKey, string>>;
  strings: Strings;
}

/** First sentence of a value, whitespace-collapsed — frontmatter description. */
function firstSentence(text: string): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  const match = flat.match(/^.*?[.!?](?=\s|$)/);
  return match ? match[0] : flat;
}

/*
 * AGENT.md assembly (spec §4 + §6). Same guarantees as the workspace
 * formats: every section resolves field-or-DEF, guardrail last. Frontmatter:
 * `name` slugified (Thai passes through verbatim — known limitation, no
 * transliteration), `description` derived from the resolved role, `tools`
 * short form — 'read-only' for the strict default, the user's own text
 * (single-line) when the field is filled.
 */
export function assembleAgent({ fields, strings }: AssembleAgentArgs): string {
  const a = strings.agent;
  const defaults = agentDefaults(strings);
  const resolve = (k: AgentFieldKey): string => fields[k]?.trim() || defaults[k];

  const userTools = fields.tools?.trim();
  const toolsFm = userTools ? userTools.replace(/\s+/g, ' ') : a.toolsFrontmatterDefault;

  const out: string[] = [
    '---',
    `name: ${slugify(resolve('name'))}`,
    `description: ${firstSentence(resolve('role'))}`,
    `tools: ${toolsFm}`,
    '---',
    '',
  ];

  for (const key of AGENT_SECTION_ORDER) {
    out.push(`## ${a.sections[key]}`, '', resolve(key), '');
  }

  out.push(`## ${strings.guardrail.heading}`, '', strings.guardrail.body, '');

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}
