import { describe, expect, it } from 'vitest';
import { getStudioStrings } from '@/data/studio';
import { assembleAll } from '@/lib/studio-assembler';
import { STUDIO_FORMATS } from '@/lib/studio-history';
import {
  initialStudioState,
  isStale,
  studioReducer,
  toHistoryEntry,
  type StudioState,
} from './studio-state';

function withTask(task: string): StudioState {
  return studioReducer(initialStudioState(), { type: 'setField', key: 'task', value: task });
}

describe('studioReducer', () => {
  it('starts unlocked with outputs assembled from the default type', () => {
    const s = initialStudioState();
    const expected = assembleAll('code', {});
    expect(s.type).toBe('code');
    expect(s.locked).toBe(false);
    expect(s.entryId).toBeNull();
    for (const f of STUDIO_FORMATS) expect(s.outputs[f]).toEqual({ text: expected[f], edited: false });
  });

  it('setField recomputes all outputs while unlocked', () => {
    const s = withTask('Fix login bug');
    const expected = assembleAll('code', { task: 'Fix login bug' });
    for (const f of STUDIO_FORMATS) expect(s.outputs[f].text).toBe(expected[f]);
  });

  it('locks on the first output edit', () => {
    const s = studioReducer(withTask('A'), { type: 'editOutput', format: 'markdown', text: 'mine' });
    expect(s.locked).toBe(true);
    expect(s.outputs.markdown).toEqual({ text: 'mine', edited: true });
  });

  it('marks the other formats stale after an edit, each format independent', () => {
    const base = withTask('A');
    let s = studioReducer(base, { type: 'editOutput', format: 'markdown', text: 'mine' });
    expect(isStale(s, 'markdown')).toBe(false);
    expect(isStale(s, 'plain')).toBe(true);
    expect(isStale(s, 'json')).toBe(true);
    expect(s.outputs.plain).toEqual(base.outputs.plain);

    s = studioReducer(s, { type: 'editOutput', format: 'plain', text: 'also mine' });
    expect(isStale(s, 'plain')).toBe(false);
    expect(isStale(s, 'json')).toBe(true);
    expect(s.outputs.markdown.text).toBe('mine');
  });

  it('never reports stale while unlocked', () => {
    const s = withTask('A');
    for (const f of STUDIO_FORMATS) expect(isStale(s, f)).toBe(false);
  });

  it('ignores setField and selectType while locked', () => {
    const s = studioReducer(withTask('A'), { type: 'editOutput', format: 'json', text: '{}' });
    expect(studioReducer(s, { type: 'setField', key: 'task', value: 'B' })).toBe(s);
    expect(studioReducer(s, { type: 'selectType', studioType: 'image' })).toBe(s);
  });

  it('regenerate clears edits, unlocks, and reflects the latest values', () => {
    let s = withTask('Old');
    s = studioReducer(s, { type: 'editOutput', format: 'markdown', text: 'mine' });
    s = studioReducer(s, { type: 'regenerate' });
    expect(s.locked).toBe(false);
    s = studioReducer(s, { type: 'setField', key: 'task', value: 'New' });
    const expected = assembleAll('code', { task: 'New' });
    for (const f of STUDIO_FORMATS) expect(s.outputs[f]).toEqual({ text: expected[f], edited: false });
  });

  it('regenerate rebuilds from current values', () => {
    let s = withTask('Keep');
    s = studioReducer(s, { type: 'editOutput', format: 'plain', text: 'x' });
    s = studioReducer(s, { type: 'regenerate' });
    expect(s.outputs.plain).toEqual({ text: assembleAll('code', { task: 'Keep' }).plain, edited: false });
  });

  it('selectType recomputes outputs for the new type while unlocked', () => {
    const s = studioReducer(withTask('A sunset'), { type: 'selectType', studioType: 'image' });
    const expected = assembleAll('image', { task: 'A sunset' });
    expect(s.type).toBe('image');
    for (const f of STUDIO_FORMATS) expect(s.outputs[f].text).toBe(expected[f]);
  });

  it('setActiveFormat changes only the active format', () => {
    const base = withTask('A');
    const s = studioReducer(base, { type: 'setActiveFormat', format: 'json' });
    expect(s.activeFormat).toBe('json');
    expect(s.outputs).toBe(base.outputs);
  });

  it('loadHistory round-trips toHistoryEntry', () => {
    let s = studioReducer(withTask('Research pricing'), { type: 'selectType', studioType: 'research' });
    s = studioReducer(s, { type: 'editOutput', format: 'markdown', text: 'edited md' });
    const entry = toHistoryEntry(s, 1000, 'id-1');
    expect(entry).toMatchObject({ id: 'id-1', title: 'Research pricing', savedAt: 1000, locked: true });

    const loaded = studioReducer(initialStudioState(), { type: 'loadHistory', entry });
    expect(loaded.type).toBe('research');
    expect(loaded.values).toEqual(s.values);
    expect(loaded.outputs).toEqual(s.outputs);
    expect(loaded.locked).toBe(true);
    expect(loaded.entryId).toBe('id-1');
    expect(toHistoryEntry(loaded, 1000)).toEqual(entry);
  });

  it('toHistoryEntry reuses entryId so re-saving upserts', () => {
    const entry = toHistoryEntry(withTask('A'), 1, 'first');
    const loaded = studioReducer(initialStudioState(), { type: 'loadHistory', entry });
    expect(toHistoryEntry(loaded, 2, 'other').id).toBe('first');
  });

  it('reset returns the initial state', () => {
    let s = studioReducer(withTask('A'), { type: 'editOutput', format: 'json', text: '{}' });
    s = studioReducer(s, { type: 'loadHistory', entry: toHistoryEntry(s, 1, 'x') });
    expect(studioReducer(s, { type: 'reset' })).toEqual(initialStudioState());
  });
});

describe('studioReducer locale', () => {
  const th = () => getStudioStrings('th');

  it('setLocale recomputes outputs in the new language while unlocked', () => {
    const s = studioReducer(withTask('A'), { type: 'setLocale', locale: 'th' });
    const expected = assembleAll('code', { task: 'A' }, th());
    expect(s.locale).toBe('th');
    for (const f of STUDIO_FORMATS) expect(s.outputs[f]).toEqual({ text: expected[f], edited: false });
  });

  it('setLocale while locked keeps every output byte-identical', () => {
    const locked = studioReducer(withTask('A'), { type: 'editOutput', format: 'json', text: '{"mine":1}' });
    const s = studioReducer(locked, { type: 'setLocale', locale: 'th' });
    expect(s.locale).toBe('th');
    expect(s.locked).toBe(true);
    expect(s.outputs).toEqual(locked.outputs);
  });

  it('regenerate after a locked setLocale produces the new language', () => {
    let s = studioReducer(withTask('A'), { type: 'editOutput', format: 'plain', text: 'mine' });
    s = studioReducer(s, { type: 'setLocale', locale: 'th' });
    s = studioReducer(s, { type: 'regenerate' });
    const expected = assembleAll('code', { task: 'A' }, th());
    expect(s.locked).toBe(false);
    for (const f of STUDIO_FORMATS) expect(s.outputs[f].text).toBe(expected[f]);
  });

  it('setField and reset keep the current locale', () => {
    let s = studioReducer(initialStudioState(), { type: 'setLocale', locale: 'th' });
    s = studioReducer(s, { type: 'setField', key: 'task', value: 'B' });
    expect(s.outputs.markdown.text).toBe(assembleAll('code', { task: 'B' }, th()).markdown);
    expect(studioReducer(s, { type: 'reset' }).locale).toBe('th');
  });
});
