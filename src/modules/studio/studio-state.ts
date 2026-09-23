/*
 * Studio state: a pure reducer (no storage, no clock). While unlocked, every
 * output mirrors the assembled form. The first hand edit locks the form;
 * `regenerate` rebuilds all outputs from the current values and unlocks.
 */

import type { StudioFieldKey, StudioType, StudioValues } from '@/data/studio';
import { assembleAll } from '@/lib/studio-assembler';
import {
  deriveTitle,
  STUDIO_FORMATS,
  type StudioFormat,
  type StudioHistoryEntry,
  type StudioOutput,
} from '@/lib/studio-history';

export type StudioOutputs = Record<StudioFormat, StudioOutput>;

export interface StudioState {
  type: StudioType;
  values: StudioValues;
  outputs: StudioOutputs;
  locked: boolean;
  activeFormat: StudioFormat;
  entryId: string | null;
}

export type StudioAction =
  | { type: 'selectType'; studioType: StudioType }
  | { type: 'setField'; key: StudioFieldKey; value: string }
  | { type: 'editOutput'; format: StudioFormat; text: string }
  | { type: 'regenerate' }
  | { type: 'setActiveFormat'; format: StudioFormat }
  | { type: 'loadHistory'; entry: StudioHistoryEntry }
  | { type: 'reset' };

export const DEFAULT_STUDIO_TYPE: StudioType = 'code';
export const DEFAULT_STUDIO_FORMAT: StudioFormat = 'markdown';

function assembleOutputs(type: StudioType, values: StudioValues): StudioOutputs {
  const texts = assembleAll(type, values);
  return Object.fromEntries(
    STUDIO_FORMATS.map((f) => [f, { text: texts[f], edited: false }]),
  ) as StudioOutputs;
}

export function initialStudioState(): StudioState {
  return {
    type: DEFAULT_STUDIO_TYPE,
    values: {},
    outputs: assembleOutputs(DEFAULT_STUDIO_TYPE, {}),
    locked: false,
    activeFormat: DEFAULT_STUDIO_FORMAT,
    entryId: null,
  };
}

export function studioReducer(state: StudioState, action: StudioAction): StudioState {
  switch (action.type) {
    case 'selectType': {
      if (state.locked || action.studioType === state.type) return state;
      return {
        ...state,
        type: action.studioType,
        outputs: assembleOutputs(action.studioType, state.values),
      };
    }

    case 'setField': {
      if (state.locked) return state;
      const values = { ...state.values, [action.key]: action.value };
      return { ...state, values, outputs: assembleOutputs(state.type, values) };
    }

    case 'editOutput':
      return {
        ...state,
        locked: true,
        outputs: { ...state.outputs, [action.format]: { text: action.text, edited: true } },
      };

    case 'regenerate':
      return { ...state, locked: false, outputs: assembleOutputs(state.type, state.values) };

    case 'setActiveFormat':
      return state.activeFormat === action.format
        ? state
        : { ...state, activeFormat: action.format };

    case 'loadHistory': {
      const { entry } = action;
      return {
        ...state,
        type: entry.type,
        values: { ...entry.values },
        outputs: Object.fromEntries(
          STUDIO_FORMATS.map((f) => [f, { ...entry.outputs[f] }]),
        ) as StudioOutputs,
        locked: entry.locked,
        entryId: entry.id,
      };
    }

    case 'reset':
      return initialStudioState();

    default:
      return state;
  }
}

/** A format is stale when the form is locked by edits elsewhere and this one wasn't edited. */
export function isStale(state: StudioState, format: StudioFormat): boolean {
  return state.locked && !state.outputs[format].edited;
}

/** Build a history entry; reuses `entryId` so re-saving the same prompt upserts. */
export function toHistoryEntry(state: StudioState, now: number, id?: string): StudioHistoryEntry {
  return {
    id: state.entryId ?? id ?? `studio-${now}`,
    type: state.type,
    title: deriveTitle(state.values),
    values: { ...state.values },
    outputs: Object.fromEntries(
      STUDIO_FORMATS.map((f) => [f, { ...state.outputs[f] }]),
    ) as StudioOutputs,
    locked: state.locked,
    savedAt: now,
  };
}
