import {
  AGENT_FIELD_KEYS,
  type AgentFieldKey,
  type AgentGroupId,
  type AgentSectionKey,
  type Strings,
} from './i18n/types';

/*
 * Agentic form structure (spec §4). 11 fields in 3 groups (4/4/3); labels,
 * placeholders, and DEFs live in i18n. `description` is not a form field —
 * the assembler derives it from the resolved role (first sentence).
 */

export const AGENT_GROUPS: { id: AgentGroupId; fields: AgentFieldKey[] }[] = [
  { id: 'identity', fields: ['name', 'role', 'instruction', 'voice'] },
  { id: 'behavior', fields: ['usedWhen', 'input', 'tools', 'steps'] },
  { id: 'guardrails', fields: ['rule', 'outputHandoff', 'successCriteria'] },
];

/* AGENT.md body section order (spec §6): Role → Instruction → Used when →
   Input → Tools → Steps → Boundaries/escalation → Voice → Output/handoff →
   Success criteria. Guardrail follows last (assembler). */
export const AGENT_SECTION_ORDER: AgentSectionKey[] = [
  'role',
  'instruction',
  'usedWhen',
  'input',
  'tools',
  'steps',
  'rule',
  'voice',
  'outputHandoff',
  'successCriteria',
];

/* Starred in the form (wireframe); like all fields they still DEF-resolve. */
export const AGENT_REQUIRED: ReadonlySet<AgentFieldKey> = new Set([
  'name',
  'instruction',
  'tools',
  'rule',
]);

/* Fields spanning both form columns; the rest pair two per row. */
export const AGENT_WIDE: ReadonlySet<AgentFieldKey> = new Set([
  'role',
  'instruction',
  'tools',
  'steps',
  'rule',
  'outputHandoff',
  'successCriteria',
]);

/** Extract the DEF defaults record from the agent field strings. */
export function agentDefaults(strings: Strings): Record<AgentFieldKey, string> {
  return Object.fromEntries(
    AGENT_FIELD_KEYS.map((k) => [k, strings.agent.fields[k].def]),
  ) as Record<AgentFieldKey, string>;
}
