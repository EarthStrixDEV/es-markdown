'use client';

import type { Strings } from '@/data/i18n/types';
import type { HistoryEntry } from './useWorkspaceState';

interface HistoryListProps {
  strings: Strings;
  entries: HistoryEntry[];
  onRestore: (id: string) => void;
}

function timeLabel(savedAt: number): string {
  const mins = Math.round((Date.now() - savedAt) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function HistoryList({ strings, entries, onRestore }: HistoryListProps) {
  return (
    <div className="ws-history">
      <div className="ws-side-title">{strings.ui.history}</div>
      {entries.length === 0 ? (
        <p className="ws-history-empty">{strings.ui.historyEmpty}</p>
      ) : (
        <div className="ws-history-list">
          {entries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className="ws-history-item"
              onClick={() => onRestore(entry.id)}
            >
              <span className="ws-history-title">{entry.title}</span>
              <span className="ws-history-meta">
                {strings.topics[entry.topicId].label} · {strings.formats[entry.format].label} ·{' '}
                {timeLabel(entry.savedAt)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
