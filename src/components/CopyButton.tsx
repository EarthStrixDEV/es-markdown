'use client';

import { useEffect, useRef, useState } from 'react';

interface CopyButtonProps {
  /** Called at click time, so the copied text is always current. */
  getText: () => string;
  label: string;
  className?: string;
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="4.5" y="4.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M9.5 4.5v-2A1.5 1.5 0 0 0 8 1H3A1.5 1.5 0 0 0 1.5 2.5V8A1.5 1.5 0 0 0 3 9.5h1.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

/*
 * Pink pill copy button (wireframe "⧉ Copy raw" / "⧉ Copy HTML").
 * Reused later by Workspace and Agentic. Base style: `.copy-btn` in globals.css.
 */
export function CopyButton({ getText, label, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(getText());
      setCopied(true);
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable (permissions / insecure context): keep quiet,
      // the label simply doesn't flip to "Copied".
    }
  }

  return (
    <button type="button" className={`copy-btn${className ? ` ${className}` : ''}`} onClick={copy}>
      <CopyIcon />
      {copied ? 'Copied ✓' : label}
    </button>
  );
}
