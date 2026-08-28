'use client';

import Link from 'next/link';
import type { Strings, TopicId } from '@/data/i18n/types';
import { TOPICS, type TopicIconId } from '@/data/topics';

interface TopicPickerProps {
  strings: Strings;
  activeTopic: TopicId;
  onSelect: (topicId: TopicId) => void;
}

const stroke = { stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' } as const;

function TopicIcon({ icon }: { icon: TopicIconId }) {
  switch (icon) {
    case 'code':
      return (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="m5.5 5-3 3 3 3M10.5 5l3 3-3 3" {...stroke} strokeLinejoin="round" />
        </svg>
      );
    case 'search':
      return (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="4.4" stroke="currentColor" strokeWidth="1.5" />
          <path d="m10.4 10.4 3.2 3.2" {...stroke} />
        </svg>
      );
    case 'pen':
      return (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="m3 13 .8-3.2 7.4-7.4a1.6 1.6 0 0 1 2.3 2.3l-7.4 7.4L3 13Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'sun':
      return (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 1.5v1.6M8 12.9v1.6M14.5 8h-1.6M3.1 8H1.5M12.6 3.4l-1.2 1.2M4.6 11.4l-1.2 1.2M12.6 12.6l-1.2-1.2M4.6 4.6 3.4 3.4" {...stroke} />
        </svg>
      );
    case 'bot':
      return (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="2.5" y="5" width="11" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 5V2.2" {...stroke} />
          <circle cx="8" cy="1.8" r="1" fill="currentColor" />
          <circle cx="5.8" cy="8.7" r="1" fill="currentColor" />
          <circle cx="10.2" cy="8.7" r="1" fill="currentColor" />
        </svg>
      );
  }
}

export function TopicPicker({ strings, activeTopic, onSelect }: TopicPickerProps) {
  return (
    <div className="ws-topics">
      <div className="ws-side-title">{strings.ui.chooseTopic}</div>
      <div className="ws-topic-list">
        {TOPICS.map((topic) =>
          topic.kind === 'form' ? (
            <button
              key={topic.id}
              type="button"
              className={`ws-topic${topic.id === activeTopic ? ' is-active' : ''}`}
              onClick={() => onSelect(topic.id)}
              aria-pressed={topic.id === activeTopic}
            >
              <span className="ws-topic-icon" aria-hidden="true">
                <TopicIcon icon={topic.icon} />
              </span>
              <span className="ws-topic-text">
                {strings.topics[topic.id].label}
                <span className="ws-topic-tagline">{strings.topics[topic.id].tagline}</span>
              </span>
            </button>
          ) : (
            <Link key={topic.id} href={topic.href} className="ws-topic ws-topic-link">
              <span className="ws-topic-icon" aria-hidden="true">
                <TopicIcon icon={topic.icon} />
              </span>
              <span className="ws-topic-text">
                {strings.ui.agentLinkLabel}
                <span className="ws-topic-tagline">{strings.ui.agentLinkTagline}</span>
              </span>
              <span className="ws-topic-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ),
        )}
      </div>
    </div>
  );
}
