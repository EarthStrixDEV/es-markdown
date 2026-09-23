'use client';

import {
  fillTemplate,
  STUDIO_REGISTRY,
  STUDIO_TYPES,
  type StudioStrings,
  type StudioType,
} from '@/data/studio';
import type { StudioHistoryEntry } from '@/lib/studio-history';
import { StudioIcon } from './StudioIcon';

interface StudioSidebarProps {
  strings: StudioStrings;
  /** Shared Workspace label. */
  historyTitle: string;
  activeType: StudioType;
  /** Locked form: switching type would silently discard edits, so it's blocked. */
  typesDisabled: boolean;
  history: StudioHistoryEntry[];
  activeEntryId: string | null;
  onSelectType: (type: StudioType) => void;
  onLoad: (entry: StudioHistoryEntry) => void;
  onDelete: (entry: StudioHistoryEntry) => void;
}

function timeLabel(savedAt: number): string {
  const mins = Math.round((Date.now() - savedAt) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function StudioSidebar({
  strings,
  historyTitle,
  activeType,
  typesDisabled,
  history,
  activeEntryId,
  onSelectType,
  onLoad,
  onDelete,
}: StudioSidebarProps) {
  return (
    <aside className="ws-side">
      <div className="ws-topics">
        <div className="ws-side-title">{strings.ui.typeListTitle}</div>
        <div className="ws-topic-list">
          {STUDIO_TYPES.map((id) => (
            <button
              key={id}
              type="button"
              className={`ws-topic${id === activeType ? ' is-active' : ''}`}
              onClick={() => onSelectType(id)}
              aria-pressed={id === activeType}
              disabled={typesDisabled && id !== activeType}
              title={typesDisabled ? strings.ui.typeSwitchLocked : undefined}
            >
              <span className="ws-topic-icon" aria-hidden="true">
                <StudioIcon icon={STUDIO_REGISTRY[id].icon} />
              </span>
              <span className="ws-topic-text">
                {strings.types[id].label}
                <span className="ws-topic-tagline">{strings.types[id].description}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="ws-history">
        <div className="ws-side-title">{historyTitle}</div>
        {history.length === 0 ? (
          <p className="ws-history-empty">{strings.ui.historyEmpty}</p>
        ) : (
          <ul className="ws-history-list st-history-list">
            {history.map((entry) => (
              <li
                key={entry.id}
                className={`st-history-row${entry.id === activeEntryId ? ' is-active' : ''}`}
              >
                <button type="button" className="ws-history-item" onClick={() => onLoad(entry)}>
                  <span className="ws-history-title">{entry.title}</span>
                  <span className="ws-history-meta">
                    {strings.types[entry.type].label} · {timeLabel(entry.savedAt)}
                  </span>
                </button>
                <button
                  type="button"
                  className="st-history-delete"
                  onClick={() => onDelete(entry)}
                  aria-label={fillTemplate(strings.ui.deleteEntryLabel, { title: entry.title })}
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="m4 4 8 8M12 4l-8 8"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
