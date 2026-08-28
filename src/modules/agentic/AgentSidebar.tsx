'use client';

import type { Strings } from '@/data/i18n/types';
import type { AgentRecord } from './useAgentsState';

interface AgentSidebarProps {
  strings: Strings;
  agents: AgentRecord[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
}

/** "Support Triage" → "ST"; single word → first two letters; empty → "NA". */
export function agentInitials(name: string | undefined): string {
  const words = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'NA';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function AgentSidebar({ strings, agents, activeId, onSelect, onNew }: AgentSidebarProps) {
  const a = strings.agent;
  return (
    <aside className="ag-side">
      <button type="button" className="ag-new-btn" onClick={onNew}>
        + {a.newAgent}
      </button>
      <div>
        <div className="ag-side-title">{a.yourAgents}</div>
        <div className="ag-agent-list">
          {agents.map((agent, i) => {
            const title = agent.savedTitle ?? agent.fields.name?.trim() ?? '';
            return (
              <button
                key={agent.id}
                type="button"
                className={`ag-agent${agent.id === activeId ? ' is-active' : ''}`}
                onClick={() => onSelect(agent.id)}
              >
                {/* Gradient initials tile — palette rotates like the wireframe. */}
                <span className={`ag-agent-tile ag-tile-${i % 3}`} aria-hidden="true">
                  {agentInitials(title)}
                </span>
                <span className="ag-agent-text">
                  <span className="ag-agent-name">{title || a.defaultTitle}</span>
                  <span className="ag-agent-sub">{agent.savedSubtitle ?? a.defaultSubtitle}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
