import { describe, expect, it } from 'vitest';
import { agentsReducer, initAgentsState } from './useAgentsState';

describe('agentsReducer', () => {
  it('new agent always creates a fresh entry and never overwrites existing ones (spec §4)', () => {
    let s = initAgentsState();
    const firstId = s.activeId;
    s = agentsReducer(s, { type: 'setField', key: 'name', value: 'Support Triage' });
    s = agentsReducer(s, { type: 'newAgent' });

    expect(s.activeId).not.toBe(firstId);
    expect(s.order).toHaveLength(2);
    expect(s.agents[firstId].fields.name).toBe('Support Triage');
    expect(s.agents[s.activeId].fields).toEqual({});
  });

  it('setField edits only the active agent', () => {
    let s = initAgentsState();
    const firstId = s.activeId;
    s = agentsReducer(s, { type: 'newAgent' });
    s = agentsReducer(s, { type: 'setField', key: 'name', value: 'Second' });
    expect(s.agents[firstId].fields.name).toBeUndefined();
    expect(s.agents[s.activeId].fields.name).toBe('Second');
  });

  it('save snapshots the sidebar title/subtitle without touching fields', () => {
    let s = initAgentsState();
    s = agentsReducer(s, { type: 'setField', key: 'name', value: 'Reviewer' });
    s = agentsReducer(s, { type: 'save', title: 'Reviewer', subtitle: 'Review · comments only' });
    s = agentsReducer(s, { type: 'setField', key: 'name', value: 'Reviewer v2' });
    expect(s.agents[s.activeId].savedTitle).toBe('Reviewer');
    expect(s.agents[s.activeId].fields.name).toBe('Reviewer v2');
  });

  it('selectAgent switches back to an existing agent with its data intact', () => {
    let s = initAgentsState();
    const firstId = s.activeId;
    s = agentsReducer(s, { type: 'setField', key: 'role', value: 'Triage' });
    s = agentsReducer(s, { type: 'newAgent' });
    s = agentsReducer(s, { type: 'selectAgent', id: firstId });
    expect(s.activeId).toBe(firstId);
    expect(s.agents[firstId].fields.role).toBe('Triage');
  });
});
