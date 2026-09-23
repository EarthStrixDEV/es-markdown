import { describe, expect, it } from 'vitest';
import { applyBlock, applyInline, applyList, insertSnippet, type EditState } from './actions';

function st(text: string, selStart: number, selEnd: number): EditState {
  return { text, selStart, selEnd };
}

describe('applyInline', () => {
  it('wraps a selection and selects the inner text', () => {
    expect(applyInline(st('hello world', 0, 5), '**')).toEqual(st('**hello** world', 2, 7));
  });

  it('trims whitespace edges so markers hug the words', () => {
    expect(applyInline(st('hello world', 5, 11), '**')).toEqual(st('hello **world**', 8, 13));
  });

  it('unwraps when the markers are inside the selection', () => {
    expect(applyInline(st('**bold** x', 0, 8), '**')).toEqual(st('bold x', 0, 4));
  });

  it('unwraps when the markers are around the selection', () => {
    expect(applyInline(st('a **bold** b', 4, 8), '**')).toEqual(st('a bold b', 2, 6));
  });

  it('inserts an empty pair with the caret inside for a collapsed selection', () => {
    expect(applyInline(st('ab', 1, 1), '`')).toEqual(st('a``b', 2, 2));
  });

  it('does not eat bold markers when toggling italic on bold text', () => {
    expect(applyInline(st('**bold**', 0, 8), '*')).toEqual(st('***bold***', 1, 9));
  });

  it('toggles strikethrough off', () => {
    expect(applyInline(st('~~gone~~', 0, 8), '~~')).toEqual(st('gone', 0, 4));
  });
});

describe('applyBlock', () => {
  it('prefixes the caret line with the heading marker', () => {
    expect(applyBlock(st('hello\nworld', 2, 2), 'h2')).toEqual(st('## hello\nworld', 5, 5));
  });

  it('replaces an existing heading level and keeps the caret on its content', () => {
    // caret on the "T" of Title
    expect(applyBlock(st('# Title', 2, 2), 'h3')).toEqual(st('### Title', 4, 4));
  });

  it('strips headings back to paragraph', () => {
    expect(applyBlock(st('## Head', 4, 4), 'p')).toEqual(st('Head', 1, 1));
  });

  it('applies to every line of a multi-line selection', () => {
    expect(applyBlock(st('one\ntwo', 0, 7), 'h1').text).toBe('# one\n# two');
  });
});

describe('applyList', () => {
  it('bullets every selected line', () => {
    expect(applyList(st('a\nb', 0, 3), 'bullet').text).toBe('- a\n- b');
  });

  it('toggles a uniform bullet list off', () => {
    expect(applyList(st('- a\n- b', 0, 7), 'bullet').text).toBe('a\nb');
  });

  it('renumbers ordered lists sequentially', () => {
    expect(applyList(st('- a\n- b\n- c', 0, 11), 'ordered').text).toBe('1. a\n2. b\n3. c');
  });

  it('converts an ordered list to bullets, stripping the numbers', () => {
    expect(applyList(st('7. a\n9. b', 0, 9), 'bullet').text).toBe('- a\n- b');
  });

  it('creates task items and toggles them off again', () => {
    const on = applyList(st('a', 0, 1), 'task');
    expect(on.text).toBe('- [ ] a');
    expect(applyList(st('- [x] a', 0, 7), 'task').text).toBe('a');
  });

  it('skips blank lines inside the selection', () => {
    expect(applyList(st('a\n\nb', 0, 4), 'bullet').text).toBe('- a\n\n- b');
  });
});

describe('insertSnippet', () => {
  it('link: wraps the selection and selects the url placeholder', () => {
    expect(insertSnippet(st('click here', 0, 5), 'link')).toEqual(st('[click](url) here', 8, 11));
  });

  it('link: uses a placeholder label when collapsed', () => {
    expect(insertSnippet(st('', 0, 0), 'link')).toEqual(st('[link text](url)', 12, 15));
  });

  it('image: prefixes with a bang and selects the url', () => {
    expect(insertSnippet(st('logo', 0, 4), 'image')).toEqual(st('![logo](url)', 8, 11));
  });

  it('table: inserts a 3-column skeleton on its own block', () => {
    const out = insertSnippet(st('abc', 3, 3), 'table');
    expect(out.text).toBe('abc\n\n| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n|  |  |  |');
    // first header cell text is selected
    expect(out.text.slice(out.selStart, out.selEnd)).toBe('Column 1');
  });

  it('quote: toggles the > prefix per line', () => {
    expect(insertSnippet(st('a\nb', 0, 3), 'quote').text).toBe('> a\n> b');
    expect(insertSnippet(st('> a\n> b', 0, 7), 'quote').text).toBe('a\nb');
  });

  it('codeblock: fences the selected lines and selects the code', () => {
    expect(insertSnippet(st('code', 0, 4), 'codeblock')).toEqual(st('```\ncode\n```', 4, 8));
  });

  it('divider: inserts \\n---\\n at the caret', () => {
    expect(insertSnippet(st('ab', 1, 1), 'divider')).toEqual(st('a\n---\nb', 6, 6));
  });
});
