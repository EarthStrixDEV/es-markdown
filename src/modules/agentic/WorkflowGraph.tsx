'use client';

import type { Strings } from '@/data/i18n/types';

/*
 * Static workflow-graph teaser (spec §4). Display-only: nothing here is
 * saved, wired to the form, or interactive — and the UI says so twice
 * (heading badge + header pill), per the acceptance criterion. Node texts
 * live in i18n; positions recreate the wireframe composition.
 */

interface WorkflowGraphProps {
  strings: Strings;
}

/* Per-node placement/variant, index-matched to strings.agent.graph.nodes. */
const NODE_LAYOUT: { top: number; left: number; ghost?: boolean }[] = [
  { top: 30, left: 40 },
  { top: 30, left: 330 },
  { top: 160, left: 410 },
  { top: 210, left: 130 },
  { top: 310, left: 130, ghost: true },
];

const EDGES = [
  'M 190 60 C 260 60, 260 60, 330 60',
  'M 480 80 C 480 130, 480 130, 480 160',
  'M 410 230 C 340 230, 340 230, 270 230',
  'M 190 250 C 190 295, 190 295, 190 310',
];

function DiamondIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <rect
        x="6"
        y="0.9"
        width="7.2"
        height="7.2"
        transform="rotate(45 6 0.9)"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

export function WorkflowGraph({ strings }: WorkflowGraphProps) {
  const g = strings.agent.graph;

  return (
    <div className="ag-graph">
      <div className="ag-graph-headrow">
        <div className="ag-graph-heading">
          <DiamondIcon />
          {g.heading}
        </div>
        <span className="ag-graph-badge">{g.optionalBadge}</span>
      </div>

      <div className="ag-graph-card">
        <div className="ag-graph-toolbar">
          <div className="ag-graph-chips">
            {g.paletteChips.map((chip) => (
              <span key={chip} className="ag-graph-chip">
                {chip}
              </span>
            ))}
          </div>
          {/* The acceptance-critical label: clearly visible, in the card itself. */}
          <span className="ag-graph-preview-badge">{g.previewOnlyBadge}</span>
        </div>

        <div className="ag-graph-scroll">
          <div className="ag-graph-canvas">
            <svg className="ag-graph-edges" viewBox="0 0 620 380" preserveAspectRatio="none">
              <defs>
                <marker id="ag-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" opacity="0.7" />
                </marker>
              </defs>
              {EDGES.map((d) => (
                <path
                  key={d}
                  d={d}
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.7"
                  markerEnd="url(#ag-arrow)"
                />
              ))}
            </svg>

            {g.nodes.map((node, i) => {
              const layout = NODE_LAYOUT[i];
              return (
                <div
                  key={`${node.kind}-${i}`}
                  className={`ag-node${layout.ghost ? ' ag-node-ghost' : ''}`}
                  style={{ top: layout.top, left: layout.left }}
                >
                  <div className="ag-node-kind">{node.kind}</div>
                  <div className="ag-node-text">{node.text}</div>
                </div>
              );
            })}

            <div className="ag-graph-hint">{g.canvasHint}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
