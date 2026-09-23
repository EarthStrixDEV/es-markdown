import { describe, expect, it } from 'vitest';
import {
  getStudioStrings,
  STUDIO_TYPES,
  studioCommonFields,
  studioEn,
  studioExtraFields,
  type StudioType,
} from '@/data/studio';
import { assembleAll, toJson, toMarkdown, toPlain } from './studio-assembler';

const JSON_KEYS = [
  'type',
  'task',
  'context',
  'audience',
  'constraints',
  'output',
  'tone',
  'examples',
  'params',
  'guardrail',
  'follow_ups',
];
const text = studioEn.guardrails.text;
const media = studioEn.guardrails.media;

function expectInOrder(haystack: string, needles: string[]) {
  let at = -1;
  for (const needle of needles) {
    const next = haystack.indexOf(needle, at + 1);
    expect(next, `expected "${needle}" after index ${at}`).toBeGreaterThan(at);
    at = next;
  }
}

const labels = (t: StudioType) => [...studioCommonFields(), ...studioExtraFields(t)].map((f) => f.label);

describe.each<StudioType>(['code', 'image'])('studio assembler — %s', (type) => {
  const set = type === 'image' ? media : text;
  const other = type === 'image' ? text : media;

  it('markdown: H1, every section in form order, guardrail, divider, follow-ups', () => {
    const md = toMarkdown(type, {});
    expect(md.startsWith(`# ${studioEn.types[type].label} prompt\n`)).toBe(true);
    expectInOrder(md, [
      ...labels(type).map((l) => `## ${l}\n`),
      `## ${set.guardrail.heading}`,
      '\n---\n',
      ...set.followUps.items.map((it, i) => `${i + 1}. ${it}`),
    ]);
    expect(md).not.toContain(other.guardrail.body);
  });

  it('plain: UPPERCASE labels in order, no Markdown syntax', () => {
    const plain = toPlain(type, { task: 'Draw a cat' });
    expectInOrder(plain, [
      ...labels(type).map((l) => `${l.toUpperCase()}:\n`),
      `${set.guardrail.heading.toUpperCase()}:\n${set.guardrail.body}`,
      `${set.followUps.heading.toUpperCase()}:\n`,
      ...set.followUps.items,
    ]);
    for (const bad of ['#', '**', '```']) expect(plain).not.toContain(bad);
    expect(plain).not.toContain(other.guardrail.body);
  });

  it('json: parses, exact key set, params = selected extra fields, correct guardrail', () => {
    const doc = JSON.parse(toJson(type, {}));
    expect(Object.keys(doc).sort()).toEqual([...JSON_KEYS].sort());
    expect(doc.type).toBe(type);
    expect(Object.keys(doc.params)).toEqual(studioExtraFields(type).map((f) => f.id));
    expect(doc.guardrail).toBe(set.guardrail.body);
    expect(doc.follow_ups).toEqual(set.followUps.items);
    expect(Array.isArray(doc.constraints)).toBe(true);
  });

  it('empty values resolve every section to its default', () => {
    const md = toMarkdown(type, {});
    const plain = toPlain(type, {});
    for (const f of [...studioCommonFields(), ...studioExtraFields(type)]) {
      const first = f.def.split('\n')[0];
      expect(md).toContain(first);
      expect(plain).toContain(first);
    }
  });
});

describe('studio assembler — resolution', () => {
  it('user input overrides default; whitespace-only counts as empty', () => {
    const { markdown, plain, json } = assembleAll('image', { task: '  Paint a fox  ', tone: '   \n ' });
    const tone = studioEn.common.tone.def;
    expect(markdown).toContain('## Task\n\nPaint a fox\n');
    expect(markdown).not.toContain(studioEn.common.task.def);
    expect(markdown).toContain(tone);
    expect(plain).toContain('TASK:\nPaint a fox\n');
    expect(JSON.parse(json)).toMatchObject({ task: 'Paint a fox', tone });
  });

  it('list fields split on newlines, trimmed, empties dropped', () => {
    const values = { constraints: ' a \n\n  b\n   \nc ', scope: 'x\n\ny' };
    const doc = JSON.parse(toJson('new-project', values));
    expect(doc.constraints).toEqual(['a', 'b', 'c']);
    expect(doc.params.scope).toEqual(['x', 'y']);
    expect(toMarkdown('new-project', values)).toContain('## Constraints\n\n- a\n- b\n- c\n');
    expect(toPlain('new-project', values)).toContain('CONSTRAINTS:\n- a\n- b\n- c\n');
  });

  it('list defaults are split too', () => {
    const doc = JSON.parse(toJson('code', {}));
    expect(doc.constraints).toEqual(studioEn.common.constraints.def.split('\n'));
  });

  it("'other' has no params", () => {
    const doc = JSON.parse(toJson('other', { language: 'Go' }));
    expect(doc.params).toEqual({});
  });

  it('leftover values from another type are ignored', () => {
    const values = { language: 'LEFTOVER-LANG', existingCode: 'LEFTOVER-CODE', aspectRatio: '4:5' };
    const { markdown, plain, json } = assembleAll('image', values);
    for (const out of [markdown, plain, json]) {
      expect(out).not.toContain('LEFTOVER');
    }
    expect(Object.keys(JSON.parse(json).params)).not.toContain('language');
    expect(JSON.parse(json).params.aspectRatio).toBe('4:5');
  });

  it('JSON always parses for every type, even with quotes/newlines in input', () => {
    for (const t of STUDIO_TYPES) {
      const json = toJson(t, { task: 'say "hi"\nthen \\ leave', context: '{}' });
      const doc = JSON.parse(json);
      expect(Object.keys(doc).sort()).toEqual([...JSON_KEYS].sort());
      expect(doc.task).toBe('say "hi"\nthen \\ leave');
      expect(json).toContain('\n  "type"');
    }
  });

  it('media types get the media guardrail, text types the text one', () => {
    for (const t of STUDIO_TYPES) {
      const isMedia = ['image', 'video', 'audio', 'music'].includes(t);
      const g = JSON.parse(toJson(t, {})).guardrail;
      expect(g).toBe((isMedia ? media : text).guardrail.body);
    }
  });
});

describe('Thai output', () => {
  const th = getStudioStrings('th');
  const en = getStudioStrings('en');

  it('uses Thai section headings and the Thai text guardrail for a text type', () => {
    const md = toMarkdown('code', {}, th);
    expect(md).toContain(`## ${th.common.task.label}`);
    expect(md).toContain(th.guardrails.text.guardrail.body);
    expect(md).not.toContain(`## ${en.common.task.label}\n`);
  });

  it('uses the Thai media guardrail and follow-ups for a media type', () => {
    const md = toMarkdown('image', {}, th);
    expect(md).toContain(th.guardrails.media.guardrail.body);
    for (const item of th.guardrails.media.followUps.items) expect(md).toContain(item);
  });

  it('keeps JSON keys in English with Thai values', () => {
    const obj = JSON.parse(toJson('image', {}, th));
    expect(Object.keys(obj)).toEqual(Object.keys(JSON.parse(toJson('image', {}, en))));
    expect(Object.keys(obj.params)).toEqual(['aspectRatio', 'visualStyle', 'subject', 'negativePrompt']);
    expect(obj.task).toBe(th.common.task.def);
  });

  it('plain output keeps Thai labels and has no Markdown syntax', () => {
    const plain = toPlain('music', {}, th);
    expect(plain).toContain(`${th.common.context.label.toUpperCase()}:`);
    expect(plain).not.toMatch(/#|\*\*|```/);
  });
});
