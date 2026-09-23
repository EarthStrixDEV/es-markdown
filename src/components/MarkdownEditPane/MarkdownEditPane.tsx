'use client';

import { Toolbar } from './Toolbar';
import { useMarkdownEditor } from './useMarkdownEditor';
import './toolbar.css';

export interface MarkdownEditPaneProps {
  value: string;
  onChange: (value: string) => void;
  /** Accessible name for the textarea. */
  label?: string;
  /** Extra class on the <textarea> (layout/sizing is the caller's job). */
  textareaClassName?: string;
}

/* Toolbar + textarea with grouped undo/redo, controlled from outside. */
export function MarkdownEditPane({
  value,
  onChange,
  label = 'Markdown source',
  textareaClassName,
}: MarkdownEditPaneProps) {
  const { toolbarProps, textareaProps } = useMarkdownEditor({ value, onChange });
  return (
    <div className="mep">
      <Toolbar {...toolbarProps} />
      <textarea
        {...textareaProps}
        className={`mep-textarea${textareaClassName ? ` ${textareaClassName}` : ''}`}
        spellCheck={false}
        aria-label={label}
      />
    </div>
  );
}
