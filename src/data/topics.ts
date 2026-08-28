import { FIELD_KEYS, type FieldKey, type FormatId, type TopicId, type TopicStrings } from './i18n/types';

/*
 * Topic catalog (spec §2, canonical list — the wireframe's topic list is
 * outdated). Four form topics + one link card that routes to /agentic.
 * All display text lives in i18n; this file is structure only.
 */

export type TopicIconId = 'code' | 'search' | 'pen' | 'sun' | 'bot';

export interface FormTopic {
  kind: 'form';
  id: TopicId;
  icon: TopicIconId;
}

export interface LinkTopic {
  kind: 'link';
  id: 'agent';
  icon: TopicIconId;
  href: '/agentic';
}

export type Topic = FormTopic | LinkTopic;

export const TOPICS: Topic[] = [
  { kind: 'form', id: 'swe', icon: 'code' },
  { kind: 'form', id: 'research', icon: 'search' },
  { kind: 'form', id: 'content', icon: 'pen' },
  { kind: 'form', id: 'everyday', icon: 'sun' },
  { kind: 'link', id: 'agent', icon: 'bot', href: '/agentic' },
];

export const FORM_TOPIC_IDS: TopicId[] = ['swe', 'research', 'content', 'everyday'];

/** Extract the DEF defaults record from a topic's field strings. */
export function topicDefaults(topic: TopicStrings): Record<FieldKey, string> {
  return Object.fromEntries(FIELD_KEYS.map((k) => [k, topic.fields[k].def])) as Record<
    FieldKey,
    string
  >;
}

/** Mono filename shown in the preview header, derived from topic + format. */
export function fileNameFor(topicId: TopicId, format: FormatId): string {
  if (format === 'skill') return 'SKILL.md';
  if (format === 'workflow') return `${topicId}-workflow.md`;
  return `${topicId}-brief.md`;
}
