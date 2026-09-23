'use client';

import { getStrings } from '@/data/i18n';
import { useLanguage } from '@/i18n/useLanguage';
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
  const { lang } = useLanguage();
  const { toolbarProps, textareaProps } = useMarkdownEditor({ value, onChange });
  return (
    <div className="mep">
      <Toolbar strings={getStrings(lang)} {...toolbarProps} />
      <textarea
        {...textareaProps}
        className={`mep-textarea${textareaClassName ? ` ${textareaClassName}` : ''}`}
        spellCheck={false}
        aria-label={label}
      />
    </div>
  );
}
