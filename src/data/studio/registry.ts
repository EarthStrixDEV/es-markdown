import { getStudioStrings } from './strings';
import {
  STUDIO_COMMON_FIELD_KEYS,
  type StudioCommonFieldKey,
  type StudioExtraFieldKey,
  type StudioFieldDef,
  type StudioFieldShape,
  type StudioGuardrailSet,
  type StudioIconId,
  type StudioKind,
  type StudioStrings,
  type StudioType,
} from './types';

/*
 * Studio type registry — structure only. Labels, descriptions, and field
 * text live in the strings bundle (en.ts).
 */

export interface StudioTypeEntry {
  id: StudioType;
  icon: StudioIconId;
  kind: StudioKind;
  extraFields: StudioFieldShape[];
}

export const STUDIO_COMMON_FIELDS: Record<StudioCommonFieldKey, StudioFieldShape> = {
  task: { id: 'task', multiline: true, required: true },
  context: { id: 'context', multiline: true },
  audience: { id: 'audience' },
  constraints: { id: 'constraints', multiline: true, list: true },
  output: { id: 'output', multiline: true },
  tone: { id: 'tone' },
  examples: { id: 'examples', multiline: true },
};

export const STUDIO_REGISTRY: Record<StudioType, StudioTypeEntry> = {
  code: {
    id: 'code',
    icon: 'code',
    kind: 'text',
    extraFields: [{ id: 'language' }, { id: 'existingCode', multiline: true }],
  },
  'new-project': {
    id: 'new-project',
    icon: 'folder',
    kind: 'text',
    extraFields: [{ id: 'stack' }, { id: 'scope', multiline: true, list: true }, { id: 'platform' }],
  },
  image: {
    id: 'image',
    icon: 'image',
    kind: 'media',
    extraFields: [
      { id: 'aspectRatio' },
      { id: 'visualStyle' },
      { id: 'subject', multiline: true },
      { id: 'negativePrompt', multiline: true },
    ],
  },
  video: {
    id: 'video',
    icon: 'video',
    kind: 'media',
    extraFields: [
      { id: 'duration' },
      { id: 'shot', multiline: true },
      { id: 'visualStyle' },
      { id: 'aspectRatio' },
    ],
  },
  audio: {
    id: 'audio',
    icon: 'mic',
    kind: 'media',
    extraFields: [{ id: 'voice' }, { id: 'script', multiline: true }, { id: 'pace' }],
  },
  music: {
    id: 'music',
    icon: 'music',
    kind: 'media',
    extraFields: [
      { id: 'genre' },
      { id: 'mood' },
      { id: 'bpm' },
      { id: 'vocals' },
      { id: 'lyrics', multiline: true },
    ],
  },
  'agent-task': {
    id: 'agent-task',
    icon: 'bot',
    kind: 'text',
    extraFields: [
      { id: 'tools', multiline: true, list: true },
      { id: 'stopConditions', multiline: true, list: true },
      { id: 'approvalPoints', multiline: true, list: true },
    ],
  },
  research: {
    id: 'research',
    icon: 'search',
    kind: 'text',
    extraFields: [
      { id: 'question', multiline: true },
      { id: 'sources', multiline: true, list: true },
      { id: 'depth' },
    ],
  },
  content: {
    id: 'content',
    icon: 'pen',
    kind: 'text',
    extraFields: [{ id: 'platform' }, { id: 'length' }, { id: 'cta' }],
  },
  ideation: {
    id: 'ideation',
    icon: 'bulb',
    kind: 'text',
    extraFields: [{ id: 'count' }, { id: 'novelty', multiline: true }],
  },
  other: { id: 'other', icon: 'dots', kind: 'text', extraFields: [] },
};

/** The 7 common fields resolved with locale text, in form order. */
export function studioCommonFields(strings: StudioStrings = getStudioStrings()): StudioFieldDef[] {
  return STUDIO_COMMON_FIELD_KEYS.map((k) => ({ ...STUDIO_COMMON_FIELDS[k], ...strings.common[k] }));
}

/** A type's extra fields resolved with locale text, in form order. */
export function studioExtraFields(
  type: StudioType,
  strings: StudioStrings = getStudioStrings(),
): StudioFieldDef[] {
  return STUDIO_REGISTRY[type].extraFields.map((shape) => {
    const text = strings.types[type].fields[shape.id as StudioExtraFieldKey];
    if (!text) throw new Error(`Missing Studio strings for ${type}.${shape.id}`);
    return { ...shape, ...text };
  });
}

/** Guardrail + follow-ups for a type (media set for media kinds). */
export function studioGuardrailSet(
  type: StudioType,
  strings: StudioStrings = getStudioStrings(),
): StudioGuardrailSet {
  return strings.guardrails[STUDIO_REGISTRY[type].kind];
}
