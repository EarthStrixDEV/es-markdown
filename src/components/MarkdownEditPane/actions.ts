/*
 * Pure text transforms for the editor toolbar.
 * Every function is (EditState) → EditState with zero DOM knowledge, so the
 * whole file is unit-testable and the page component only wires events.
 */

export interface EditState {
  text: string;
  selStart: number;
  selEnd: number;
}

export type InlineMarker = '**' | '*' | '~~' | '`';
export type BlockStyle = 'p' | 'h1' | 'h2' | 'h3';
export type ListKind = 'bullet' | 'ordered' | 'task';
export type SnippetKind = 'link' | 'image' | 'table' | 'quote' | 'codeblock' | 'divider';

/* ---------------------------------------------------------------- helpers */

function lineStartAt(text: string, pos: number): number {
  return text.lastIndexOf('\n', pos - 1) + 1;
}

function lineEndAt(text: string, pos: number): number {
  const nl = text.indexOf('\n', pos);
  return nl === -1 ? text.length : nl;
}

function blockRange(state: EditState): { start: number; end: number } {
  return {
    start: lineStartAt(state.text, state.selStart),
    end: lineEndAt(state.text, state.selEnd),
  };
}

/*
 * Rewrite every full line touched by the selection via `fn` (all edits happen
 * at the line head: prefixes stripped/added), then remap the selection so the
 * caret stays on the same content it was on before.
 */
function transformLines(state: EditState, fn: (line: string, index: number) => string): EditState {
  const { text, selStart, selEnd } = state;
  const { start, end } = blockRange(state);
  const oldLines = text.slice(start, end).split('\n');
  const newLines = oldLines.map(fn);

  const map = (pos: number): number => {
    let oldAt = start;
    let newAt = start;
    for (let i = 0; i < oldLines.length; i++) {
      if (pos <= oldAt + oldLines[i].length) {
        const delta = newLines[i].length - oldLines[i].length;
        const k = pos - oldAt + delta;
        return newAt + Math.min(Math.max(k, 0), newLines[i].length);
      }
      oldAt += oldLines[i].length + 1;
      newAt += newLines[i].length + 1;
    }
    return newAt - 1;
  };

  return {
    text: text.slice(0, start) + newLines.join('\n') + text.slice(end),
    selStart: map(selStart),
    selEnd: map(selEnd),
  };
}

/* ----------------------------------------------------------- inline marks */

export function applyInline(state: EditState, marker: InlineMarker): EditState {
  const { text } = state;
  const m = marker.length;
  let s = state.selStart;
  let e = state.selEnd;

  // Collapsed selection: insert an empty pair with the caret inside.
  if (s === e) {
    return {
      text: text.slice(0, s) + marker + marker + text.slice(s),
      selStart: s + m,
      selEnd: s + m,
    };
  }

  // Trim whitespace edges so markers hug the words (`**word** ` never happens).
  while (s < e && /\s/.test(text[s])) s++;
  while (e > s && /\s/.test(text[e - 1])) e--;
  const sel = text.slice(s, e);

  // Unwrap — markers inside the selection (user selected `**bold**` whole).
  // For `*` we must not eat half of a `**` bold pair.
  const boldGuard = marker === '*' && sel.startsWith('**') && sel.endsWith('**') && sel.length >= 4;
  if (sel.length >= 2 * m && sel.startsWith(marker) && sel.endsWith(marker) && !boldGuard) {
    const inner = sel.slice(m, sel.length - m);
    return {
      text: text.slice(0, s) + inner + text.slice(e),
      selStart: s,
      selEnd: s + inner.length,
    };
  }

  // Unwrap — markers around the selection (user selected `bold` in `**bold**`).
  const partOfBold =
    marker === '*' && (text.slice(s - 2, s) === '**' || text.slice(e, e + 2) === '**');
  if (
    s >= m &&
    text.slice(s - m, s) === marker &&
    text.slice(e, e + m) === marker &&
    !partOfBold
  ) {
    return {
      text: text.slice(0, s - m) + sel + text.slice(e + m),
      selStart: s - m,
      selEnd: e - m,
    };
  }

  // Wrap.
  return {
    text: text.slice(0, s) + marker + sel + marker + text.slice(e),
    selStart: s + m,
    selEnd: e + m,
  };
}

/* ----------------------------------------------------------- block styles */

const HEADING_RE = /^#{1,6}\s+/;

const BLOCK_PREFIX: Record<BlockStyle, string> = {
  p: '',
  h1: '# ',
  h2: '## ',
  h3: '### ',
};

export function applyBlock(state: EditState, style: BlockStyle): EditState {
  const prefix = BLOCK_PREFIX[style];
  return transformLines(state, (line) => prefix + line.replace(HEADING_RE, ''));
}

/* ------------------------------------------------------------------ lists */

const TASK_RE = /^[-*+]\s+\[[ xX]\]\s+/;
const ORDERED_RE = /^\d+\.\s+/;
const BULLET_RE = /^[-*+]\s+/;

function stripListPrefix(line: string): string {
  if (TASK_RE.test(line)) return line.replace(TASK_RE, '');
  if (ORDERED_RE.test(line)) return line.replace(ORDERED_RE, '');
  return line.replace(BULLET_RE, '');
}

function hasListKind(line: string, kind: ListKind): boolean {
  if (kind === 'task') return TASK_RE.test(line);
  if (kind === 'ordered') return ORDERED_RE.test(line);
  return BULLET_RE.test(line) && !TASK_RE.test(line);
}

export function applyList(state: EditState, kind: ListKind): EditState {
  const { start, end } = blockRange(state);
  const targets = state.text.slice(start, end).split('\n').filter((l) => l.trim() !== '');
  const allMatch = targets.length > 0 && targets.every((l) => hasListKind(l, kind));

  let n = 0;
  return transformLines(state, (line) => {
    if (line.trim() === '') return line;
    const stripped = stripListPrefix(line);
    if (allMatch) return stripped; // toggle off
    if (kind === 'bullet') return `- ${stripped}`;
    if (kind === 'task') return `- [ ] ${stripped}`;
    n += 1;
    return `${n}. ${stripped}`;
  });
}

/* --------------------------------------------------------------- snippets */

const TABLE_SKELETON = [
  '| Column 1 | Column 2 | Column 3 |',
  '| --- | --- | --- |',
  '|  |  |  |',
].join('\n');

/* Insert `block` at the selection, padding with newlines so it sits alone. */
function insertOwnBlock(state: EditState, block: string): EditState {
  const { text, selStart: s, selEnd: e } = state;
  const before = text.slice(0, s);
  const after = text.slice(e);

  let pre = '';
  if (before !== '' && !before.endsWith('\n')) pre = '\n\n';
  else if (before !== '' && !before.endsWith('\n\n')) pre = '\n';

  let post = '';
  if (after !== '' && !after.startsWith('\n')) post = '\n\n';
  else if (after !== '' && !after.startsWith('\n\n')) post = '\n';

  return {
    text: before + pre + block + post + after,
    selStart: s + pre.length,
    selEnd: s + pre.length + block.length,
  };
}

export function insertSnippet(state: EditState, kind: SnippetKind): EditState {
  const { text, selStart: s, selEnd: e } = state;
  const sel = text.slice(s, e);

  switch (kind) {
    case 'link':
    case 'image': {
      const label = sel || 'link text';
      const bang = kind === 'image' ? '!' : '';
      const snippet = `${bang}[${label}](url)`;
      // Select `url` so the user can type over it immediately.
      const urlStart = s + bang.length + label.length + 3;
      return {
        text: text.slice(0, s) + snippet + text.slice(e),
        selStart: urlStart,
        selEnd: urlStart + 3,
      };
    }

    case 'table': {
      const inserted = insertOwnBlock(state, TABLE_SKELETON);
      // Select the first header cell text ("Column 1").
      const cellStart = inserted.selStart + 2;
      return { ...inserted, selStart: cellStart, selEnd: cellStart + 8 };
    }

    case 'quote':
      return transformLines(state, (line) => {
        if (line.trim() === '') return line;
        return line.startsWith('> ') ? line.slice(2) : `> ${line}`;
      });

    case 'codeblock': {
      const { start, end } = blockRange(state);
      const block = text.slice(start, end);
      const fenced = '```\n' + block + '\n```';
      return {
        text: text.slice(0, start) + fenced + text.slice(end),
        selStart: start + 4,
        selEnd: start + 4 + block.length,
      };
    }

    case 'divider': {
      const snippet = '\n---\n';
      const pos = s + snippet.length;
      return { text: text.slice(0, s) + snippet + text.slice(e), selStart: pos, selEnd: pos };
    }
  }
}
