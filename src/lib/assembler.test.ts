import { describe, expect, it } from 'vitest';
import { en } from '@/data/i18n/en';
import { FIELD_KEYS, type FieldKey, type FormatId } from '@/data/i18n/types';
import { topicDefaults } from '@/data/topics';
import { assemble } from './assembler';

const defaults = topicDefaults(en.topics.swe);
const FORMATS: FormatId[] = ['prompt', 'skill', 'workflow'];

function make(format: FormatId, fields: Partial<Record<FieldKey, string>> = {}, title?: string) {
  return assemble({ format, fields, defaults, strings: en, title });
}

/** Assert each needle appears in order, each after the previous one. */
function expectInOrder(haystack: string, needles: string[]) {
  let at = -1;
  for (const needle of needles) {
    const next = haystack.indexOf(needle, at + 1);
    expect(next, `expected "${needle}" after index ${at}`).toBeGreaterThan(at);
    at = next;
  }
}

describe('assemble — section completeness and order', () => {
  it('prompt emits every section in spec §6 order', () => {
    expectInOrder(make('prompt', {}, 'T'), [
      '# T',
      '## Goal',
      '## Context',
      '## Starting data',
      '## Requirements',
      '## Constraints',
      '## Output format',
      '## Quality bar',
      '## If information is missing',
      '---',
    ]);
  });

  it('skill emits frontmatter then every section in order', () => {
    expectInOrder(make('skill', {}, 'My Skill'), [
      '---',
      'name: my-skill',
      'description: ',
      '---',
      '## When to use',
      '## Required info',
      '## Steps',
      '## Constraints',
      '## Output format',
      '## Quality bar',
      '## If information is missing',
    ]);
  });

  it('workflow emits every section in order', () => {
    expectInOrder(make('workflow', {}, 'T'), [
      '# T',
      '## Objective',
      '## Context',
      '## Inputs',
      '## Task sequence',
      '## Constraints',
      '## Deliverables',
      '## Done when',
      '## If information is missing',
    ]);
  });
});

describe('assemble — DEF resolution', () => {
  it('empty fields resolve to DEF text, never blank', () => {
    const md = make('prompt');
    for (const k of FIELD_KEYS) {
      expect(md).toContain(defaults[k]);
    }
    // no empty section: a heading is never followed directly by another heading
    expect(md).not.toMatch(/## .+\n\n## /);
  });

  it('whitespace-only input still falls back to DEF', () => {
    const md = make('prompt', { goal: '   ' });
    expect(md).toContain(defaults.goal);
  });

  it('filled fields replace their DEF', () => {
    const md = make('prompt', { goal: 'Ship the CSV export' });
    expect(md).toContain('Ship the CSV export');
    expect(md).not.toContain(defaults.goal);
  });

  it('audience and avoid render as prefixed lines in their host sections', () => {
    const md = make('prompt', { audience: 'junior devs', avoid: 'gold-plating' });
    expect(md).toContain('Audience: junior devs');
    expect(md).toContain('Avoid: gold-plating');
  });
});

describe('assemble — guardrail and follow-up pack', () => {
  it('every format ends with the guardrail section', () => {
    for (const format of FORMATS) {
      const md = make(format, {}, 'T');
      expect(md).toContain('## If information is missing');
      expect(md).toContain(en.guardrail.body);
    }
  });

  it('prompt carries the follow-up pack below a --- divider, after the guardrail', () => {
    const md = make('prompt', {}, 'T');
    const guardAt = md.indexOf(en.guardrail.body);
    const dividerAt = md.indexOf('\n---\n', guardAt);
    expect(dividerAt).toBeGreaterThan(guardAt);
    expect(md.indexOf(en.followUpPack.warning)).toBeGreaterThan(dividerAt);
    for (const item of en.followUpPack.items) {
      expect(md.indexOf(item)).toBeGreaterThan(dividerAt);
    }
  });

  it('skill and workflow do NOT carry the follow-up pack', () => {
    for (const format of ['skill', 'workflow'] as FormatId[]) {
      const md = make(format, {}, 'T');
      expect(md).not.toContain(en.followUpPack.warning);
      expect(md).not.toContain(en.followUpPack.items[0]);
    }
  });
});

describe('assemble — format switching and misc', () => {
  it('user content is identical across all three formats', () => {
    const fields = {
      goal: 'Launch the roastery site',
      context: 'Small brand, first web presence',
      requirements: 'Hero section\nProduct grid',
      qualityBar: 'Owner signs off',
    };
    for (const format of FORMATS) {
      const md = make(format, fields, 'T');
      expect(md).toContain('Launch the roastery site');
      expect(md).toContain('Small brand, first web presence');
      expect(md).toContain('Owner signs off');
    }
  });

  it('workflow renders requirements lines as checkboxes with a confirm line each', () => {
    const md = make('workflow', { requirements: '- Design review\n- Build\n- QA pass' }, 'T');
    expect(md).toContain('- [ ] Design review');
    expect(md).toContain('- [ ] Build');
    expect(md).toContain('- [ ] QA pass');
    const confirms = md.split(en.workflow.stepConfirm).length - 1;
    expect(confirms).toBe(3);
  });

  it('skill frontmatter name passes Thai titles through unchanged', () => {
    const md = make('skill', {}, 'สคริปต์รีวิว');
    expect(md).toContain('name: สคริปต์รีวิว');
  });

  it('skill description collapses newlines to stay valid YAML', () => {
    const md = make('skill', { goal: 'line one\nline two' }, 'T');
    expect(md).toContain('description: line one line two');
  });

  it('untitled documents fall back to the resolved goal as h1', () => {
    const md = make('prompt', { goal: 'Fix the login bug' });
    expect(md.startsWith('# Fix the login bug\n')).toBe(true);
  });
});
