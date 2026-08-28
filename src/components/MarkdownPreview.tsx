'use client';

import { memo } from 'react';
import { renderMarkdown } from '@/lib/markdown';

/*
 * Shared rendered-markdown view. Memoized on the md string so parent
 * re-renders (selection changes, toggles) never re-parse the document.
 * Typography lives under `.md-preview` in globals.css.
 */
export const MarkdownPreview = memo(function MarkdownPreview({ md }: { md: string }) {
  return <div className="md-preview" dangerouslySetInnerHTML={{ __html: renderMarkdown(md) }} />;
});
