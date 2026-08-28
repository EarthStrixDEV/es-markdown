'use client';

import { useState } from 'react';
import type { Strings } from '@/data/i18n';
import type { BlockStyle, InlineMarker, ListKind, SnippetKind } from './actions';

interface ToolbarProps {
  strings: Strings;
  onInline: (marker: InlineMarker) => void;
  onBlock: (style: BlockStyle) => void;
  onList: (kind: ListKind) => void;
  onSnippet: (kind: SnippetKind) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

/* --- 16px stroke icons (wireframe used emoji here; we ship real vectors) --- */

const stroke = { stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' } as const;

function BulletIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 3.5h8M6 8h8M6 12.5h8" {...stroke} />
      <circle cx="2.6" cy="3.5" r="1.1" fill="currentColor" />
      <circle cx="2.6" cy="8" r="1.1" fill="currentColor" />
      <circle cx="2.6" cy="12.5" r="1.1" fill="currentColor" />
    </svg>
  );
}

function TaskIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.8" y="1.8" width="12.4" height="12.4" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="m5 8.2 2.1 2.1L11.2 6" {...stroke} strokeLinejoin="round" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6.5 9.5 9.5 6.5" {...stroke} />
      <path d="M7.5 4.8l1.5-1.5a2.7 2.7 0 0 1 3.8 3.8L11.2 8.6" {...stroke} />
      <path d="M8.5 11.2 7 12.7a2.7 2.7 0 0 1-3.8-3.8l1.6-1.5" {...stroke} />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.8" y="2.8" width="12.4" height="10.4" rx="2.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="5.6" cy="6.4" r="1.2" fill="currentColor" />
      <path d="m3 12 3.4-3.2 2.4 2.2 2.4-2.6 2.6 3" {...stroke} strokeLinejoin="round" />
    </svg>
  );
}

function TableIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.8" y="2.3" width="12.4" height="11.4" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1.8 6.2h12.4M6 6.2v7.5M10.2 6.2v7.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6.6 4.5c-2 .8-3.1 2.2-3.1 4.4A2 2 0 1 0 5.6 7h-.4c.2-.8.8-1.5 1.8-2l-.4-.5Zm6 0c-2 .8-3.1 2.2-3.1 4.4A2 2 0 1 0 11.6 7h-.4c.2-.8.8-1.5 1.8-2l-.4-.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CodeBlockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="m5.5 5-3 3 3 3M10.5 5l3 3-3 3" {...stroke} strokeLinejoin="round" />
    </svg>
  );
}

function DividerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 8h12" {...stroke} />
      <path d="M4.5 3.8h7M4.5 12.2h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
    </svg>
  );
}

function UndoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M5.2 3.2 2.4 6l2.8 2.8" {...stroke} strokeLinejoin="round" />
      <path d="M2.6 6h6.6a4.2 4.2 0 0 1 0 8.4H6" {...stroke} />
    </svg>
  );
}

function RedoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10.8 3.2 13.6 6l-2.8 2.8" {...stroke} strokeLinejoin="round" />
      <path d="M13.4 6H6.8a4.2 4.2 0 0 0 0 8.4H10" {...stroke} />
    </svg>
  );
}

/* ------------------------------------------------------------------------ */

function Divider() {
  return <span className="tb-divider" aria-hidden="true" />;
}

interface TbButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}

function TbButton({ label, onClick, disabled, wide, children }: TbButtonProps) {
  return (
    <button
      type="button"
      className={`tb-btn${wide ? ' tb-btn-wide' : ''}`}
      aria-label={label}
      title={label}
      disabled={disabled}
      // Keep focus (and selection) in the textarea while clicking the toolbar.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

const BLOCK_VALUES: BlockStyle[] = ['p', 'h1', 'h2', 'h3'];

export function Toolbar(props: ToolbarProps) {
  const { strings, onInline, onBlock, onList, onSnippet, onUndo, onRedo, canUndo, canRedo } =
    props;
  const tb = strings.editor.toolbar;
  const aria = strings.editor.ariaLabels;
  const [blockValue, setBlockValue] = useState<BlockStyle>('p');

  return (
    <div className="tb" role="toolbar" aria-label={aria.toolbar}>
      <span className="tb-select-wrap">
        <select
          className="tb-select"
          aria-label={aria.blockStyle}
          value={blockValue}
          onChange={(e) => {
            const style = e.target.value as BlockStyle;
            setBlockValue(style);
            onBlock(style);
          }}
        >
          {BLOCK_VALUES.map((value) => (
            <option key={value} value={value}>
              {strings.editor.blockOptions[value]}
            </option>
          ))}
        </select>
      </span>

      <Divider />

      <TbButton label={tb.bold} onClick={() => onInline('**')}>
        <span className="tb-glyph tb-glyph-b">B</span>
      </TbButton>
      <TbButton label={tb.italic} onClick={() => onInline('*')}>
        <span className="tb-glyph tb-glyph-i">I</span>
      </TbButton>
      <TbButton label={tb.strikethrough} onClick={() => onInline('~~')}>
        <span className="tb-glyph tb-glyph-s">S</span>
      </TbButton>
      <TbButton label={tb.inlineCode} onClick={() => onInline('`')}>
        <span className="tb-glyph tb-glyph-code">&lt;/&gt;</span>
      </TbButton>

      <Divider />

      <TbButton label={tb.heading2} onClick={() => onBlock('h2')}>
        <span className="tb-glyph tb-glyph-h">H</span>
      </TbButton>
      <TbButton label={tb.bullet} onClick={() => onList('bullet')}>
        <BulletIcon />
      </TbButton>
      <TbButton label={tb.ordered} onClick={() => onList('ordered')}>
        <span className="tb-glyph tb-glyph-ol">1.</span>
      </TbButton>
      <TbButton label={tb.task} onClick={() => onList('task')}>
        <TaskIcon />
      </TbButton>

      <Divider />

      <TbButton label={tb.link} onClick={() => onSnippet('link')}>
        <LinkIcon />
      </TbButton>
      <TbButton label={tb.image} onClick={() => onSnippet('image')}>
        <ImageIcon />
      </TbButton>
      <TbButton label={tb.table} onClick={() => onSnippet('table')} wide>
        <TableIcon />
        <span className="tb-wide-label">{tb.tableWideLabel}</span>
      </TbButton>
      <TbButton label={tb.quote} onClick={() => onSnippet('quote')}>
        <QuoteIcon />
      </TbButton>
      <TbButton label={tb.codeblock} onClick={() => onSnippet('codeblock')}>
        <CodeBlockIcon />
      </TbButton>
      <TbButton label={tb.divider} onClick={() => onSnippet('divider')}>
        <DividerIcon />
      </TbButton>

      <Divider />

      <TbButton label={tb.undo} onClick={onUndo} disabled={!canUndo}>
        <UndoIcon />
      </TbButton>
      <TbButton label={tb.redo} onClick={onRedo} disabled={!canRedo}>
        <RedoIcon />
      </TbButton>
    </div>
  );
}
