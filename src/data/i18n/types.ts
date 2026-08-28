/*
 * Typed i18n contract. v1 ships English only, but every piece of app-authored
 * text (labels, defaults, guardrail, follow-up pack, section headings) lives
 * behind this interface so a Thai locale can be added without refactoring.
 */

export type Locale = 'en';

export type FormatId = 'prompt' | 'skill' | 'workflow';

/* The four form topics. The fifth sidebar item ('agent') is a link, not a form. */
export type TopicId = 'swe' | 'research' | 'content' | 'everyday';

/*
 * The 9 shared field keys, in form order. `audience` and `avoid` are the
 * topic-flavored slots: they render inside the Context and Constraints
 * sections respectively (see templates.ts) rather than as own sections.
 */
export const FIELD_KEYS = [
  'goal',
  'context',
  'audience',
  'startingData',
  'requirements',
  'constraints',
  'avoid',
  'outputFormat',
  'qualityBar',
] as const;

export type FieldKey = (typeof FIELD_KEYS)[number];

/* Section keys per output format (spec §6). */
export type PromptSectionKey =
  | 'goal'
  | 'context'
  | 'startingData'
  | 'requirements'
  | 'constraints'
  | 'outputFormat'
  | 'qualityBar';

export type SkillSectionKey =
  | 'whenToUse'
  | 'requiredInfo'
  | 'steps'
  | 'constraints'
  | 'outputFormat'
  | 'qualityBar';

export type WorkflowSectionKey =
  | 'objective'
  | 'context'
  | 'inputs'
  | 'taskSequence'
  | 'constraints'
  | 'deliverables'
  | 'doneWhen';

export interface FieldStrings {
  label: string;
  placeholder: string;
  /** The DEF value injected when the field is left empty — never blank. */
  def: string;
}

export interface TopicStrings {
  /** Sidebar / page-head label. */
  label: string;
  /** One-line sidebar description. */
  tagline: string;
  /** H1 of the generated document; also the slug source for SKILL.md. */
  docTitle: string;
  /** Form card header, e.g. "Engineering brief". */
  formTitle: string;
  /** Small note under the form card header. */
  formNote: string;
  fields: Record<FieldKey, FieldStrings>;
}

/*
 * Agentic module — the 11 form fields in 3 groups (spec §4, 4/4/3):
 * Identity (name, role, instruction, voice) · Behavior (usedWhen, input,
 * tools, steps) · Guardrails (rule, outputHandoff, successCriteria).
 * The frontmatter `description` is derived from `role` (first sentence),
 * not a 12th field. Every field except `name` maps 1:1 onto an AGENT.md
 * body section (spec §6 order lives in data/agent-fields.ts).
 */
export const AGENT_FIELD_KEYS = [
  'name',
  'role',
  'instruction',
  'voice',
  'usedWhen',
  'input',
  'tools',
  'steps',
  'rule',
  'outputHandoff',
  'successCriteria',
] as const;

export type AgentFieldKey = (typeof AGENT_FIELD_KEYS)[number];

export type AgentGroupId = 'identity' | 'behavior' | 'guardrails';

/** The 10 AGENT.md body sections — every field but `name`. */
export type AgentSectionKey = Exclude<AgentFieldKey, 'name'>;

export interface AgentGraphNodeStrings {
  kind: string;
  text: string;
}

export interface AgentStrings {
  pageSubtitle: string;
  formViewLabel: string;
  newAgent: string;
  yourAgents: string;
  saveAgent: string;
  savedFlash: string;
  /** Sidebar title / doc name when the name field is empty. */
  defaultTitle: string;
  /** Sidebar subtitle before the first save. */
  defaultSubtitle: string;
  /** Frontmatter `tools:` value when the tools field is empty. */
  toolsFrontmatterDefault: string;
  safetyStrong: string;
  safetyBody: string;
  groups: Record<AgentGroupId, string>;
  sections: Record<AgentSectionKey, string>;
  fields: Record<AgentFieldKey, FieldStrings>;
  graph: {
    heading: string;
    optionalBadge: string;
    previewOnlyBadge: string;
    paletteChips: string[];
    canvasHint: string;
    nodes: AgentGraphNodeStrings[];
  };
}

export interface Strings {
  locale: Locale;

  ui: {
    chooseTopic: string;
    history: string;
    historyEmpty: string;
    reset: string;
    saveToHistory: string;
    savedFlash: string;
    pageSubtitle: string;
    ifEmpty: string;
    formatted: string;
    plainText: string;
    copy: string;
    chars: string;
    written: string;
    followUpNote: string;
    agentLinkLabel: string;
    agentLinkTagline: string;
  };

  formats: Record<FormatId, { label: string }>;

  /** Section headings per format. */
  sections: {
    prompt: Record<PromptSectionKey, string>;
    skill: Record<SkillSectionKey, string>;
    workflow: Record<WorkflowSectionKey, string>;
  };

  /** Inline labels for the flavored slots ("Audience: …", "Avoid: …"). */
  prefixes: { audience: string; avoid: string };

  /** Fixed guardrail appended to every generated document (spec §6). */
  guardrail: { heading: string; body: string };

  /** 3 pre-written follow-up messages — prompt format only, below `---`. */
  followUpPack: { warning: string; items: [string, string, string] };

  workflow: { stepConfirm: string };

  topics: Record<TopicId, TopicStrings>;

  agent: AgentStrings;
}
