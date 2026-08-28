'use client';

/**
 * Static fake mac-style editor window from the home wireframe (home.html ~71–99):
 * traffic dots, "agent-instruction.md" title, the Support Triage Agent markdown
 * body with a CSS-blinking caret, and a "Live preview" footer. Purely
 * presentational — all motion is CSS keyframes in home.css.
 */
export function FakeWindow() {
  return (
    <div className="fake-window">
      <div className="fake-window-titlebar">
        <div className="fake-window-dots" aria-hidden="true">
          <span className="fake-window-dot is-pink" />
          <span className="fake-window-dot is-gold" />
          <span className="fake-window-dot is-green" />
        </div>
        <div className="fake-window-filename">agent-instruction.md</div>
        <div className="fake-window-titlebar-spacer" aria-hidden="true" />
      </div>

      <div className="fake-window-body">
        <div>
          <span className="fw-syntax-mark"># </span>
          <span className="fw-syntax-title">Support Triage Agent</span>
        </div>
        <div>&nbsp;</div>
        <div className="fw-syntax-heading">## Role</div>
        <div>First-line triage for inbound support tickets.</div>
        <div>&nbsp;</div>
        <div className="fw-syntax-heading">## Instruction</div>
        <div>
          <span className="fw-syntax-bullet">-</span> Read the ticket and prior thread
        </div>
        <div>
          <span className="fw-syntax-bullet">-</span> Tag severity: P1 / P2 / P3
        </div>
        <div>
          <span className="fw-syntax-bullet">-</span> Draft a first reply, don&apos;t send
        </div>
        <div>&nbsp;</div>
        <div className="fw-syntax-heading">## Rule</div>
        <div>
          Never close a ticket without human sign-off
          <span className="fake-window-caret" aria-hidden="true" />
        </div>
      </div>

      <div className="fake-window-footer">
        <span className="fake-window-live-pill">
          <span className="fake-window-live-dot" aria-hidden="true" />
          Live preview
        </span>
        <span>1,204 chars · 6/6 sections</span>
      </div>
    </div>
  );
}
