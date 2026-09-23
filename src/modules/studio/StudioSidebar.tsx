'use client';

import {
  fillTemplate,
  STUDIO_REGISTRY,
  STUDIO_TYPES,
  type StudioStrings,
  type StudioType,
} from '@/data/studio';
import type { Strings } from '@/data/i18n/types';
import type { StudioHistoryEntry } from '@/lib/studio-history';
import { StudioIcon } from './StudioIcon';

interface StudioSidebarProps {
  strings: StudioStrings;
  /** Shared app strings: History title and relative-time labels. */
  shared: Strings;
  activeType: StudioType;
  /** Locked form: switching type would silently discard edits, so it's blocked. */
  typesDisabled: boolean;
  history: StudioHistoryEntry[];
  activeEntryId: string | null;
  onSelectType: (type: StudioType) => void;
  onLoad: (entry: StudioHistoryEntry) => void;
  onDelete: (entry: StudioHistoryEntry) => void;
}

/* Same relative-time rules and strings as Workspace's HistoryList. */
function timeLabel(savedAt: number, shared: Strings): string {
  const mins = Math.round((Date.now() - savedAt) / 60000);
  if (mins < 1) return shared.ui.timeJustNow;
  if (mins < 60) return shared.ui.timeMinutesAgo.replace('{n}', String(mins));
  const hours = Math.round(mins / 60);
  if (hours < 24) return shared.ui.timeHoursAgo.replace('{n}', String(hours));
  const locale = shared.locale === 'th' ? 'th-TH' : 'en-US';
  return new Date(savedAt).toLocaleDateString(locale, { month: 'short', day: 'numeric' });
}

export function StudioSidebar({
  strings,
  shared,
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
        <div className="ws-side-title">{shared.ui.history}</div>
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
                    {strings.types[entry.type].label} · {timeLabel(entry.savedAt, shared)}
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
