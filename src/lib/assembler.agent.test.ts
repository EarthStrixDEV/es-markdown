import { describe, expect, it } from 'vitest';
import { agentDefaults } from '@/data/agent-fields';
import { en } from '@/data/i18n/en';
import { assembleAgent } from './assembler';

const defaults = agentDefaults(en);

function expectInOrder(haystack: string, needles: string[]) {
  let at = -1;
  for (const needle of needles) {
    const next = haystack.indexOf(needle, at + 1);
    expect(next, `expected "${needle}" after index ${at}`).toBeGreaterThan(at);
    at = next;
  }
}

describe('assembleAgent — empty form (spec §4 acceptance)', () => {
  const md = assembleAgent({ fields: {}, strings: en });

  it('emits complete frontmatter with the read-only tools default', () => {
    expectInOrder(md, ['---', 'name: new-agent', 'description: ', 'tools: read-only', '---']);
  });

  it('derives the frontmatter description from the role DEF first sentence', () => {
    expect(md).toContain(`description: ${defaults.role}`);
  });

  it('emits all 10 body sections in spec §6 order, each with DEF text', () => {
    expectInOrder(md, [
      '## Role',
      '## Instruction',
      '## Used when',
      '## Input',
      '## Tools',
      '## Steps',
      '## Boundaries & escalation',
      '## Voice',
      '## Output & handoff',
      '## Success criteria',
      '## If information is missing',
    ]);
    // no empty section
    expect(md).not.toMatch(/## .+\n\n## /);
  });

  it('keeps the strict tools and rule DEFs verbatim', () => {
    expect(md).toContain('read & search only — no send, no delete, no irreversible action');
    expect(md).toContain(defaults.rule);
  });

  it('ends with the fixed guardrail', () => {
    expect(md.trimEnd().endsWith(en.guardrail.body)).toBe(true);
  });
});

describe('assembleAgent — filled fields', () => {
  it('slugifies a Latin name into frontmatter', () => {
    const md = assembleAgent({ fields: { name: 'Support Triage Agent' }, strings: en });
    expect(md).toContain('name: support-triage-agent');
  });

  it('passes a Thai name through verbatim (known limitation, no transliteration)', () => {
    const md = assembleAgent({ fields: { name: 'ผู้ช่วยคัดกรอง' }, strings: en });
    expect(md).toContain('name: ผู้ช่วยคัดกรอง');
  });

  it('passes a filled tools field into frontmatter as a single line', () => {
    const md = assembleAgent({
      fields: { tools: 'Zendesk read,\ninternal wiki search' },
      strings: en,
    });
    expect(md).toContain('tools: Zendesk read, internal wiki search');
    expect(md).not.toContain('tools: read-only');
  });

  it('uses only the first sentence of a filled role for the description', () => {
    const md = assembleAgent({
      fields: { role: 'Triages tickets. Also does other things later.' },
      strings: en,
    });
    expect(md).toContain('description: Triages tickets.');
    expect(md).not.toContain('description: Triages tickets. Also');
  });

  it('filled fields replace their DEF in the body', () => {
    const md = assembleAgent({ fields: { voice: 'playful but precise' }, strings: en });
    expect(md).toContain('playful but precise');
    expect(md).not.toContain(defaults.voice);
  });
});
