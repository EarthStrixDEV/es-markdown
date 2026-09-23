'use client';

/*
 * Controlled Markdown editing: wires a <textarea>, the formatting <Toolbar>
 * and grouped undo/redo around an external `value` + `onChange`.
 *
 * History lives here (the parent only owns the text). Any change the hook
 * makes — typing, toolbar action, undo/redo — is reported via onChange.
 * If the parent changes `value` from outside, the new text is taken as one
 * undoable step, like a toolbar action.
 */

import { useEffect, useLayoutEffect, useRef } from 'react';
import {
  applyBlock,
  applyInline,
  applyList,
  insertSnippet,
  type BlockStyle,
  type EditState,
  type InlineMarker,
  type ListKind,
  type SnippetKind,
} from './actions';
import type { ToolbarProps } from './Toolbar';
import { classifyInput, useHistory } from './useHistory';

export interface UseMarkdownEditorOptions {
  value: string;
  onChange: (value: string) => void;
}

export function useMarkdownEditor({ value, onChange }: UseMarkdownEditorOptions) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const restoreSel = useRef(false);
  const { present, canUndo, canRedo, input, replace, undo, redo } = useHistory({
    text: value,
    selStart: 0,
    selEnd: 0,
  });

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  /* Report internal changes upward. */
  const lastReported = useRef(value);
  useEffect(() => {
    if (present.text === lastReported.current) return;
    lastReported.current = present.text;
    onChangeRef.current(present.text);
  }, [present.text]);

  /* Adopt external changes as one undoable step. */
  useEffect(() => {
    if (value === lastReported.current) return;
    lastReported.current = value;
    replace({ text: value, selStart: value.length, selEnd: value.length });
  }, [value, replace]);

  /* Restore caret/selection after every programmatic change (toolbar, undo…). */
  useLayoutEffect(() => {
    if (!restoreSel.current || !textareaRef.current) return;
    restoreSel.current = false;
    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(present.selStart, present.selEnd);
  }, [present]);

  /* Selection truth at action time is the DOM, not the last input event. */
  function currentState(): EditState {
    const ta = textareaRef.current;
    return {
      text: present.text,
      selStart: ta ? ta.selectionStart : present.selStart,
      selEnd: ta ? ta.selectionEnd : present.selEnd,
    };
  }

  function runAction(fn: (state: EditState) => EditState) {
    restoreSel.current = true;
    replace(fn(currentState()));
  }

  /** Replace the whole text as one undoable step (e.g. a "Clear" button). */
  function setText(text: string, selStart = 0, selEnd = selStart) {
    restoreSel.current = true;
    replace({ text, selStart, selEnd });
  }

  const onUndo = () => {
    restoreSel.current = true;
    undo();
  };
  const onRedo = () => {
    restoreSel.current = true;
    redo();
  };

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const el = e.target;
    input(
      { text: el.value, selStart: el.selectionStart, selEnd: el.selectionEnd },
      classifyInput(present.text, el.value),
    );
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!(e.ctrlKey || e.metaKey)) return;
    const key = e.key.toLowerCase();
    if (key === 'z') {
      e.preventDefault();
      if (e.shiftKey) onRedo();
      else onUndo();
    } else if (key === 'y') {
      e.preventDefault();
      onRedo();
    }
  }

  const toolbarProps: ToolbarProps = {
    onInline: (marker: InlineMarker) => runAction((st) => applyInline(st, marker)),
    onBlock: (style: BlockStyle) => runAction((st) => applyBlock(st, style)),
    onList: (kind: ListKind) => runAction((st) => applyList(st, kind)),
    onSnippet: (kind: SnippetKind) => runAction((st) => insertSnippet(st, kind)),
    onUndo,
    onRedo,
    canUndo,
    canRedo,
  };

  const textareaProps = {
    ref: textareaRef,
    value: present.text,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
  };

  return { text: present.text, toolbarProps, textareaProps, setText };
}
