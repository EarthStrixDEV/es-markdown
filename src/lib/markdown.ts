import { Marked } from 'marked';

/*
 * Single markdown pipeline for the whole app (editor, workspace, agentic).
 * Behavior is pinned here: GFM on (tables + task lists), `breaks` off so a
 * single newline does NOT become <br> — standard markdown paragraph rules.
 */
const marked = new Marked({ gfm: true, breaks: false });

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false });
}
