import { describe, expect, it } from 'vitest';
import { studioEn } from './en';
import { studioTh } from './th';
import { getStudioStrings } from './strings';
import { STUDIO_TYPES } from './types';

/** Every leaf path ("a.b.0") in a nested object/array, sorted. */
function keyPaths(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object') return [prefix];
  return Object.entries(value)
    .flatMap(([k, v]) => keyPaths(v, prefix ? `${prefix}.${k}` : k))
    .sort();
}

function leaves(value: unknown): unknown[] {
  if (value === null || typeof value !== 'object') return [value];
  return Object.values(value).flatMap(leaves);
}

const tokens = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();

describe('studio Thai bundle', () => {
  it('has exactly the same key structure as English', () => {
    expect(keyPaths(studioTh)).toEqual(keyPaths(studioEn));
  });

  it('every string is non-empty', () => {
    for (const leaf of leaves(studioTh)) {
      expect(typeof leaf).toBe('string');
      expect((leaf as string).trim()).not.toBe('');
    }
  });

  it('each follow-up set has 3 items', () => {
    expect(studioTh.guardrails.text.followUps.items).toHaveLength(3);
    expect(studioTh.guardrails.media.followUps.items).toHaveLength(3);
  });

  it('keeps list-field defaults at the same line count as English', () => {
    for (const t of STUDIO_TYPES) {
      const thFields = studioTh.types[t].fields as Record<string, { def: string }>;
      for (const [id, f] of Object.entries(studioEn.types[t].fields)) {
        expect(thFields[id]?.def.split('\n').length, `${t}.${id}`).toBe(f.def.split('\n').length);
      }
    }
  });

  it('keeps every {placeholder} token of each English ui template', () => {
    const en = studioEn.ui as unknown as Record<string, unknown>;
    const th = studioTh.ui as unknown as Record<string, unknown>;
    for (const [key, value] of Object.entries(en)) {
      if (typeof value !== 'string') continue;
      expect(tokens(th[key] as string), key).toEqual(tokens(value));
    }
  });

  it('resolves th and falls back to English for unknown locales', () => {
    expect(getStudioStrings('th')).toBe(studioTh);
    expect(getStudioStrings('fr')).toBe(studioEn);
    expect(getStudioStrings()).toBe(studioEn);
  });
});
