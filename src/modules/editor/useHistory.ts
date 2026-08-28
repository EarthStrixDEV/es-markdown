'use client';

/*
 * Grouped undo/redo for the editor.
 *
 * Model: {past, present, future} of full {text, selStart, selEnd} snapshots,
 * plus a `pending` snapshot — the state as it was when the current typing
 * burst started. The burst becomes one undo step when it is committed:
 *   - after 600 ms of idle, or
 *   - when the input kind changes (typing ↔ deleting / paste / newline), or
 *   - on any toolbar action, undo, or redo.
 * Toolbar actions are always their own single step; redo is cleared by any
 * new edit; `past` is capped at 100 steps.
 *
 * The reducer is exported on its own so tests can drive it without a DOM.
 */

import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { EditState } from './actions';

export type InputKind = 'typing' | 'deleting' | 'newline' | 'paste';

export interface HistoryState {
  past: EditState[];
  present: EditState;
  future: EditState[];
  pending: EditState | null;
  pendingKind: InputKind | null;
}

export type HistoryAction =
  | { type: 'input'; entry: EditState; kind: InputKind }
  | { type: 'commit' }
  | { type: 'replace'; entry: EditState }
  | { type: 'undo' }
  | { type: 'redo' };

const PAST_CAP = 100;
const IDLE_COMMIT_MS = 600;

export function initHistory(initial: EditState): HistoryState {
  return { past: [], present: initial, future: [], pending: null, pendingKind: null };
}

function pushPast(past: EditState[], entry: EditState): EditState[] {
  const next = [...past, entry];
  return next.length > PAST_CAP ? next.slice(next.length - PAST_CAP) : next;
}

export function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'input': {
      let { past, pending } = state;
      // Input kind changed mid-burst → close the previous group.
      if (pending !== null && state.pendingKind !== action.kind) {
        past = pushPast(past, pending);
        pending = null;
      }
      if (pending === null) pending = state.present;
      return { past, present: action.entry, future: [], pending, pendingKind: action.kind };
    }

    case 'commit': {
      if (state.pending === null) return state;
      return {
        ...state,
        past: pushPast(state.past, state.pending),
        pending: null,
        pendingKind: null,
      };
    }

    case 'replace': {
      // Toolbar action: close any open typing group, then take one step.
      let past = state.past;
      if (state.pending !== null) past = pushPast(past, state.pending);
      past = pushPast(past, state.present);
      return { past, present: action.entry, future: [], pending: null, pendingKind: null };
    }

    case 'undo': {
      let past = state.past;
      if (state.pending !== null) past = pushPast(past, state.pending);
      if (past.length === 0) return { ...state, past, pending: null, pendingKind: null };
      return {
        past: past.slice(0, -1),
        present: past[past.length - 1],
        future: [state.present, ...state.future],
        pending: null,
        pendingKind: null,
      };
    }

    case 'redo': {
      if (state.future.length === 0) return state;
      const [present, ...future] = state.future;
      return {
        past: pushPast(state.past, state.present),
        present,
        future,
        pending: null,
        pendingKind: null,
      };
    }
  }
}

/* Classify an onChange diff into an input kind (no keyboard event needed). */
export function classifyInput(prev: string, next: string): InputKind {
  if (next.length < prev.length) return 'deleting';
  if (next.length === prev.length + 1) {
    let i = 0;
    while (i < prev.length && prev[i] === next[i]) i++;
    return next[i] === '\n' ? 'newline' : 'typing';
  }
  return next.length === prev.length ? 'typing' : 'paste';
}

export function useHistory(initial: EditState) {
  const [state, dispatch] = useReducer(historyReducer, initial, initHistory);
  const idleTimer = useRef<number | null>(null);

  const clearIdle = useCallback(() => {
    if (idleTimer.current !== null) {
      window.clearTimeout(idleTimer.current);
      idleTimer.current = null;
    }
  }, []);

  const input = useCallback(
    (entry: EditState, kind: InputKind) => {
      dispatch({ type: 'input', entry, kind });
      clearIdle();
      idleTimer.current = window.setTimeout(() => dispatch({ type: 'commit' }), IDLE_COMMIT_MS);
    },
    [clearIdle],
  );

  const replace = useCallback(
    (entry: EditState) => {
      clearIdle();
      dispatch({ type: 'replace', entry });
    },
    [clearIdle],
  );

  const undo = useCallback(() => {
    clearIdle();
    dispatch({ type: 'undo' });
  }, [clearIdle]);

  const redo = useCallback(() => {
    clearIdle();
    dispatch({ type: 'redo' });
  }, [clearIdle]);

  useEffect(() => clearIdle, [clearIdle]);

  return {
    present: state.present,
    canUndo: state.past.length > 0 || state.pending !== null,
    canRedo: state.future.length > 0,
    input,
    replace,
    undo,
    redo,
  };
}
