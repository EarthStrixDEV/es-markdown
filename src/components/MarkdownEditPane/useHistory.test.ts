import { describe, expect, it } from 'vitest';
import type { EditState } from './actions';
import {
  classifyInput,
  historyReducer,
  initHistory,
  type HistoryState,
  type InputKind,
} from './useHistory';

function entry(text: string): EditState {
  return { text, selStart: text.length, selEnd: text.length };
}

function type(state: HistoryState, text: string, kind: InputKind = 'typing'): HistoryState {
  return historyReducer(state, { type: 'input', entry: entry(text), kind });
}

describe('historyReducer', () => {
  it('groups a typing burst into a single undo step', () => {
    let s = initHistory(entry(''));
    s = type(s, 'h');
    s = type(s, 'he');
    s = type(s, 'hel');
    s = historyReducer(s, { type: 'undo' });
    expect(s.present.text).toBe('');
    expect(s.future[0].text).toBe('hel');
  });

  it('idle commit closes the group; the next burst is a separate step', () => {
    let s = initHistory(entry(''));
    s = type(s, 'a');
    s = type(s, 'ab');
    s = historyReducer(s, { type: 'commit' });
    s = type(s, 'abc');
    s = historyReducer(s, { type: 'undo' });
    expect(s.present.text).toBe('ab');
    s = historyReducer(s, { type: 'undo' });
    expect(s.present.text).toBe('');
  });

  it('an input-kind change (typing → deleting) closes the group', () => {
    let s = initHistory(entry(''));
    s = type(s, 'a');
    s = type(s, '', 'deleting');
    s = historyReducer(s, { type: 'undo' });
    expect(s.present.text).toBe('a');
    s = historyReducer(s, { type: 'undo' });
    expect(s.present.text).toBe('');
  });

  it('a toolbar action is always its own single step', () => {
    let s = initHistory(entry(''));
    s = type(s, 'a');
    s = historyReducer(s, { type: 'replace', entry: entry('**a**') });
    s = historyReducer(s, { type: 'undo' });
    expect(s.present.text).toBe('a');
    s = historyReducer(s, { type: 'undo' });
    expect(s.present.text).toBe('');
  });

  it('redo restores what undo removed', () => {
    let s = initHistory(entry(''));
    s = historyReducer(s, { type: 'replace', entry: entry('one') });
    s = historyReducer(s, { type: 'undo' });
    s = historyReducer(s, { type: 'redo' });
    expect(s.present.text).toBe('one');
  });

  it('redo is cleared by any new edit', () => {
    let s = initHistory(entry(''));
    s = historyReducer(s, { type: 'replace', entry: entry('one') });
    s = historyReducer(s, { type: 'undo' });
    expect(s.future.length).toBe(1);
    s = type(s, 'x');
    expect(s.future.length).toBe(0);
  });

  it('undo at the initial state is a no-op', () => {
    let s = initHistory(entry('start'));
    s = historyReducer(s, { type: 'undo' });
    expect(s.present.text).toBe('start');
    expect(s.future.length).toBe(0);
  });

  it('caps past at 100 steps', () => {
    let s = initHistory(entry(''));
    for (let i = 0; i < 120; i++) {
      s = historyReducer(s, { type: 'replace', entry: entry(`v${i}`) });
    }
    expect(s.past.length).toBe(100);
    expect(s.present.text).toBe('v119');
  });
});

describe('classifyInput', () => {
  it('detects single-character typing', () => {
    expect(classifyInput('ab', 'abc')).toBe('typing');
  });

  it('detects newline insertion', () => {
    expect(classifyInput('ab', 'ab\n')).toBe('newline');
  });

  it('detects deletion', () => {
    expect(classifyInput('abc', 'ab')).toBe('deleting');
  });

  it('detects multi-character paste', () => {
    expect(classifyInput('a', 'a lot of text')).toBe('paste');
  });
});
