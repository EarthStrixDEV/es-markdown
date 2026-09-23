/*
 * Studio data contract. Structure (which fields a type has, multiline/list
 * flags) lives in registry.ts; every piece of display text (labels,
 * placeholders, "If empty" defaults, guardrail, follow-ups) lives behind
 * StudioStrings so a Thai bundle can be added without refactoring.
 */

import type { Locale } from '../i18n/types';

export const STUDIO_TYPES = [
  'code',
  'new-project',
  'image',
  'video',
  'audio',
  'music',
  'agent-task',
  'research',
  'content',
  'ideation',
  'other',
] as const;

export type StudioType = (typeof STUDIO_TYPES)[number];

/** 'media' types (image/video/audio/music) get the media guardrail set. */
export type StudioKind = 'text' | 'media';

export type StudioIconId =
  | 'code'
  | 'folder'
  | 'image'
  | 'video'
  | 'mic'
  | 'music'
  | 'bot'
  | 'search'
  | 'pen'
  | 'bulb'
  | 'dots';

/* The 7 common fields, in form order. */
export const STUDIO_COMMON_FIELD_KEYS = [
  'task',
  'context',
  'audience',
  'constraints',
  'output',
  'tone',
  'examples',
] as const;

export type StudioCommonFieldKey = (typeof STUDIO_COMMON_FIELD_KEYS)[number];

/* Per-type extra field ids. Ids are unique within a type; the same id may
   recur across types (e.g. aspectRatio on image and video). */
export type StudioExtraFieldKey =
  | 'language'
  | 'existingCode'
  | 'stack'
  | 'scope'
  | 'platform'
  | 'aspectRatio'
  | 'visualStyle'
  | 'subject'
  | 'negativePrompt'
  | 'duration'
  | 'shot'
  | 'voice'
  | 'script'
  | 'pace'
  | 'genre'
  | 'mood'
  | 'bpm'
  | 'vocals'
  | 'lyrics'
  | 'tools'
  | 'stopConditions'
  | 'approvalPoints'
  | 'question'
  | 'sources'
  | 'depth'
  | 'length'
  | 'cta'
  | 'count'
  | 'novelty';

export type StudioFieldKey = StudioCommonFieldKey | StudioExtraFieldKey;

/** Structural flags for a field (no text). */
export interface StudioFieldShape {
  id: StudioFieldKey;
  multiline?: boolean;
  /** Newline-split into a list by the assembler. */
  list?: boolean;
  required?: boolean;
}

export interface StudioFieldStrings {
  label: string;
  placeholder: string;
  /** "If empty" default — never blank. */
  def: string;
}

/** A fully resolved field: shape + locale text. */
export interface StudioFieldDef extends StudioFieldShape {
  label: string;
  placeholder: string;
  def: string;
}

/** Raw form input keyed by field id. Missing/blank → field default. */
export type StudioValues = Partial<Record<StudioFieldKey, string>>;

export interface StudioTypeStrings {
  label: string;
  description: string;
  /** Text only for this type's extra fields (keyed by extra field id). */
  fields: Partial<Record<StudioExtraFieldKey, StudioFieldStrings>>;
}

export interface StudioGuardrailSet {
  guardrail: { heading: string; body: string };
  followUps: { heading: string; items: [string, string, string] };
}

export interface StudioStrings {
  locale: Locale;
  common: Record<StudioCommonFieldKey, StudioFieldStrings>;
  types: Record<StudioType, StudioTypeStrings>;
  guardrails: Record<StudioKind, StudioGuardrailSet>;
  ui: StudioUiStrings;
}

/**
 * Studio-only UI text. Templates use `{name}` placeholders, filled by
 * `fillTemplate`, so bundles stay plain data.
 */
export interface StudioUiStrings {
  typeListTitle: string;
  typeSwitchLocked: string;
  historyEmpty: string;
  /** {title} */
  deleteEntryLabel: string;
  /** {title} */
  confirmDelete: string;
  confirmRegenerate: string;
  lockedBanner: string;
  regenerate: string;
  /** {type} */
  formLabel: string;
  commonGroup: string;
  /** {type} */
  typeGroup: string;
  formatTabsLabel: string;
  formats: Record<'plain' | 'json' | 'markdown', string>;
  /** {format} */
  outputLabel: string;
  stale: string;
  staleSr: string;
  jsonErrorPrefix: string;
  /** {count} */
  charCount: string;
}
