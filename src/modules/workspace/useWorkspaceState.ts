'use client';

/*
 * Workspace state: one useReducer, session-only (spec §2 non-goal: no
 * cross-session persistence). Per-topic field values live in `byTopic`, so
 * switching topics never loses data; the format applies globally, so
 * switching formats reuses the same fields.
 */

import { useCallback, useReducer } from 'react';
import type { FieldKey, FormatId, TopicId } from '@/data/i18n/types';

export type FieldValues = Partial<Record<FieldKey, string>>;

export interface HistoryEntry {
  id: string;
  topicId: TopicId;
  format: FormatId;
  fields: FieldValues;
  savedAt: number;
  title: string;
}

export interface WorkspaceState {
  activeTopic: TopicId;
  activeFormat: FormatId;
  byTopic: Record<TopicId, FieldValues>;
  history: HistoryEntry[];
}

type WorkspaceAction =
  | { type: 'selectTopic'; topicId: TopicId }
  | { type: 'selectFormat'; format: FormatId }
  | { type: 'setField'; key: FieldKey; value: string }
  | { type: 'resetTopic' }
  | { type: 'save'; title: string }
  | { type: 'restore'; id: string };

const INITIAL: WorkspaceState = {
  activeTopic: 'swe',
  activeFormat: 'prompt',
  byTopic: { swe: {}, research: {}, content: {}, everyday: {} },
  history: [],
};

let seq = 0;
function nextId(): string {
  seq += 1;
  return `h-${Date.now()}-${seq}`;
}

export function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'selectTopic':
      return { ...state, activeTopic: action.topicId };

    case 'selectFormat':
      return { ...state, activeFormat: action.format };

    case 'setField':
      return {
        ...state,
        byTopic: {
          ...state.byTopic,
          [state.activeTopic]: {
            ...state.byTopic[state.activeTopic],
            [action.key]: action.value,
          },
        },
      };

    case 'resetTopic':
      return { ...state, byTopic: { ...state.byTopic, [state.activeTopic]: {} } };

    case 'save': {
      const entry: HistoryEntry = {
        id: nextId(),
        topicId: state.activeTopic,
        format: state.activeFormat,
        // Deep-copied so later edits never mutate a saved entry.
        fields: { ...state.byTopic[state.activeTopic] },
        savedAt: Date.now(),
        title: action.title,
      };
      return { ...state, history: [entry, ...state.history] };
    }

    case 'restore': {
      const entry = state.history.find((h) => h.id === action.id);
      if (!entry) return state;
      return {
        ...state,
        activeTopic: entry.topicId,
        activeFormat: entry.format,
        byTopic: { ...state.byTopic, [entry.topicId]: { ...entry.fields } },
      };
    }
  }
}

export function useWorkspaceState() {
  const [state, dispatch] = useReducer(workspaceReducer, INITIAL);

  return {
    state,
    selectTopic: useCallback((topicId: TopicId) => dispatch({ type: 'selectTopic', topicId }), []),
    selectFormat: useCallback((format: FormatId) => dispatch({ type: 'selectFormat', format }), []),
    setField: useCallback((key: FieldKey, value: string) => dispatch({ type: 'setField', key, value }), []),
    resetTopic: useCallback(() => dispatch({ type: 'resetTopic' }), []),
    save: useCallback((title: string) => dispatch({ type: 'save', title }), []),
    restore: useCallback((id: string) => dispatch({ type: 'restore', id }), []),
  };
}
