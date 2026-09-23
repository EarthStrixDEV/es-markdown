import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  STUDIO_HISTORY_KEY,
  applySave,
  deleteEntry,
  deriveTitle,
  loadHistory,
  parseHistory,
  saveEntry,
  type StudioHistoryEntry,
} from './studio-history';

function entry(id: string, savedAt = 0, task = `task ${id}`): StudioHistoryEntry {
  const out = { text: `out ${id}`, edited: false };
  return {
    id,
    type: 'code',
    title: deriveTitle({ task }),
    values: { task },
    outputs: { plain: out, json: out, markdown: out },
    locked: false,
    savedAt,
  };
}

function memoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
  };
}

describe('applySave', () => {
  it('drops the oldest on the 51st save', () => {
    let list: StudioHistoryEntry[] = [];
    for (let i = 1; i <= 51; i++) list = applySave(list, entry(`e${i}`, i));
    expect(list).toHaveLength(50);
    expect(list[0].id).toBe('e51');
    expect(list.some((e) => e.id === 'e1')).toBe(false);
    expect(list[49].id).toBe('e2');
  });

  it('upserts by id and moves to front without duplicating', () => {
    const list = [entry('a'), entry('b'), entry('c')];
    const updated = { ...entry('c'), title: 'new' };
    const next = applySave(list, updated);
    expect(next.map((e) => e.id)).toEqual(['c', 'a', 'b']);
    expect(next[0].title).toBe('new');
  });
});

describe('deriveTitle', () => {
  it('trims, collapses whitespace, truncates, falls back', () => {
    expect(deriveTitle({ task: '  hello \n world ' })).toBe('hello world');
    expect(deriveTitle({})).toBe('Untitled');
    expect(deriveTitle({ task: '   ' })).toBe('Untitled');
    expect(deriveTitle({ task: 'x'.repeat(100) }, 10)).toHaveLength(10);
  });
});

describe('parseHistory', () => {
  it('corrupt or non-array JSON -> []', () => {
    expect(parseHistory('{not json')).toEqual([]);
    expect(parseHistory('{"a":1}')).toEqual([]);
    expect(parseHistory(null)).toEqual([]);
  });

  it('drops entries failing the shape check', () => {
    const good = entry('ok');
    const raw = JSON.stringify([good, { id: 'bad' }, 42, { ...good, id: 'x', type: 'nope' }]);
    expect(parseHistory(raw).map((e) => e.id)).toEqual(['ok']);
  });
});

describe('localStorage persistence', () => {
  beforeEach(() => {
    vi.stubGlobal('window', { localStorage: memoryStorage() });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('save / load / delete round-trip, newest first', () => {
    saveEntry(entry('a', 1));
    saveEntry(entry('b', 2));
    expect(loadHistory().map((e) => e.id)).toEqual(['b', 'a']);
    deleteEntry('b');
    expect(loadHistory().map((e) => e.id)).toEqual(['a']);
  });

  it('corrupt stored JSON -> []', () => {
    window.localStorage.setItem(STUDIO_HISTORY_KEY, '[[[');
    expect(loadHistory()).toEqual([]);
  });

  it('storage throwing -> no crash', () => {
    const boom = () => {
      throw new Error('blocked');
    };
    vi.stubGlobal('window', {
      localStorage: { getItem: boom, setItem: boom, removeItem: boom },
    });
    expect(loadHistory()).toEqual([]);
    expect(() => saveEntry(entry('a'))).not.toThrow();
    expect(() => deleteEntry('a')).not.toThrow();
  });

  it('no window (SSR) -> no crash', () => {
    vi.stubGlobal('window', undefined);
    expect(loadHistory()).toEqual([]);
    expect(() => saveEntry(entry('a'))).not.toThrow();
  });
});
