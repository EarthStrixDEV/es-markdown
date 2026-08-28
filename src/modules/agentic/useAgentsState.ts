'use client';

/*
 * Agentic session state. Agents live in a Record keyed by id with a separate
 * `order` list for the sidebar; "New agent" always creates a fresh id and
 * never touches existing entries (spec §4 acceptance). Sidebar title/subtitle
 * are snapshots refreshed on Save, so the list doesn't churn while typing.
 * Session-only — nothing is persisted.
 */

import { useCallback, useReducer } from 'react';
import type { AgentFieldKey } from '@/data/i18n/types';

export type AgentFieldValues = Partial<Record<AgentFieldKey, string>>;

export interface AgentRecord {
  id: string;
  fields: AgentFieldValues;
  /** Sidebar snapshot — refreshed on Save, not on every keystroke. */
  savedTitle: string | null;
  savedSubtitle: string | null;
}

export interface AgentsState {
  agents: Record<string, AgentRecord>;
  order: string[];
  activeId: string;
}

type AgentsAction =
  | { type: 'newAgent' }
  | { type: 'selectAgent'; id: string }
  | { type: 'setField'; key: AgentFieldKey; value: string }
  | { type: 'resetAgent' }
  | { type: 'save'; title: string; subtitle: string };

let seq = 0;
function nextId(): string {
  seq += 1;
  return `agent-${Date.now()}-${seq}`;
}

function blankAgent(): AgentRecord {
  return { id: nextId(), fields: {}, savedTitle: null, savedSubtitle: null };
}

export function initAgentsState(): AgentsState {
  const first = blankAgent();
  return { agents: { [first.id]: first }, order: [first.id], activeId: first.id };
}

export function agentsReducer(state: AgentsState, action: AgentsAction): AgentsState {
  switch (action.type) {
    case 'newAgent': {
      const agent = blankAgent();
      return {
        agents: { ...state.agents, [agent.id]: agent },
        order: [...state.order, agent.id],
        activeId: agent.id,
      };
    }

    case 'selectAgent':
      return state.agents[action.id] ? { ...state, activeId: action.id } : state;

    case 'setField': {
      const active = state.agents[state.activeId];
      return {
        ...state,
        agents: {
          ...state.agents,
          [active.id]: { ...active, fields: { ...active.fields, [action.key]: action.value } },
        },
      };
    }

    case 'resetAgent': {
      const active = state.agents[state.activeId];
      return {
        ...state,
        agents: { ...state.agents, [active.id]: { ...active, fields: {} } },
      };
    }

    case 'save': {
      const active = state.agents[state.activeId];
      return {
        ...state,
        agents: {
          ...state.agents,
          [active.id]: { ...active, savedTitle: action.title, savedSubtitle: action.subtitle },
        },
      };
    }
  }
}

export function useAgentsState() {
  const [state, dispatch] = useReducer(agentsReducer, undefined, initAgentsState);

  return {
    state,
    newAgent: useCallback(() => dispatch({ type: 'newAgent' }), []),
    selectAgent: useCallback((id: string) => dispatch({ type: 'selectAgent', id }), []),
    setField: useCallback(
      (key: AgentFieldKey, value: string) => dispatch({ type: 'setField', key, value }),
      [],
    ),
    resetAgent: useCallback(() => dispatch({ type: 'resetAgent' }), []),
    save: useCallback(
      (title: string, subtitle: string) => dispatch({ type: 'save', title, subtitle }),
      [],
    ),
  };
}
