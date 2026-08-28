import { describe, expect, it } from 'vitest';
import { slugify } from './slugify';

describe('slugify', () => {
  it('kebab-cases Latin titles', () => {
    expect(slugify('Software Engineering Brief')).toBe('software-engineering-brief');
  });

  it('collapses punctuation and trims edge dashes', () => {
    expect(slugify('  Hello, World! (v2)  ')).toBe('hello-world-v2');
  });

  it('passes Thai through unchanged', () => {
    expect(slugify('สรุปประชุมทีม')).toBe('สรุปประชุมทีม');
  });

  it('passes mixed Thai/Latin through unchanged', () => {
    expect(slugify('Agent ผู้ช่วย')).toBe('Agent ผู้ช่วย');
  });

  it('falls back to "untitled" when nothing sluggable remains', () => {
    expect(slugify('!!!')).toBe('untitled');
    expect(slugify('')).toBe('untitled');
  });
});
