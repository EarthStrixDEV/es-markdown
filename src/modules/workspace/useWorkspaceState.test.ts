import { describe, expect, it } from 'vitest';
import { workspaceReducer, type WorkspaceState } from './useWorkspaceState';

const initial: WorkspaceState = {
  activeTopic: 'swe',
  activeFormat: 'prompt',
  byTopic: { swe: {}, research: {}, content: {}, everyday: {} },
  history: [],
};

describe('workspaceReducer', () => {
  it('keeps per-topic data intact when switching away and back (spec §2)', () => {
    let s = workspaceReducer(initial, { type: 'setField', key: 'goal', value: 'Fix login' });
    s = workspaceReducer(s, { type: 'selectTopic', topicId: 'research' });
    s = workspaceReducer(s, { type: 'setField', key: 'goal', value: 'Pricing study' });
    s = workspaceReducer(s, { type: 'selectTopic', topicId: 'swe' });
    expect(s.byTopic.swe.goal).toBe('Fix login');
    expect(s.byTopic.research.goal).toBe('Pricing study');
  });

  it('format switch changes only the format, never the fields', () => {
    let s = workspaceReducer(initial, { type: 'setField', key: 'goal', value: 'Fix login' });
    s = workspaceReducer(s, { type: 'selectFormat', format: 'skill' });
    expect(s.activeFormat).toBe('skill');
    expect(s.byTopic.swe.goal).toBe('Fix login');
  });

  it('reset clears only the active topic', () => {
    let s = workspaceReducer(initial, { type: 'setField', key: 'goal', value: 'A' });
    s = workspaceReducer(s, { type: 'selectTopic', topicId: 'content' });
    s = workspaceReducer(s, { type: 'setField', key: 'goal', value: 'B' });
    s = workspaceReducer(s, { type: 'resetTopic' });
    expect(s.byTopic.content).toEqual({});
    expect(s.byTopic.swe.goal).toBe('A');
  });

  it('saved history entries are copies — later edits do not mutate them', () => {
    let s = workspaceReducer(initial, { type: 'setField', key: 'goal', value: 'v1' });
    s = workspaceReducer(s, { type: 'save', title: 'First' });
    s = workspaceReducer(s, { type: 'setField', key: 'goal', value: 'v2' });
    expect(s.history[0].fields.goal).toBe('v1');
  });

  it('restore brings back topic, format, and fields of the entry', () => {
    let s = workspaceReducer(initial, { type: 'setField', key: 'goal', value: 'v1' });
    s = workspaceReducer(s, { type: 'selectFormat', format: 'workflow' });
    s = workspaceReducer(s, { type: 'save', title: 'First' });
    const id = s.history[0].id;
    s = workspaceReducer(s, { type: 'setField', key: 'goal', value: 'v2' });
    s = workspaceReducer(s, { type: 'selectTopic', topicId: 'everyday' });
    s = workspaceReducer(s, { type: 'selectFormat', format: 'prompt' });
    s = workspaceReducer(s, { type: 'restore', id });
    expect(s.activeTopic).toBe('swe');
    expect(s.activeFormat).toBe('workflow');
    expect(s.byTopic.swe.goal).toBe('v1');
  });
});
