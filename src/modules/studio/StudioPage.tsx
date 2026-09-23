'use client';

import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { getStrings } from '@/data/i18n';
import {
  fillTemplate,
  getStudioStrings,
  studioCommonFields,
  studioExtraFields,
} from '@/data/studio';
import {
  deleteEntry,
  loadHistory,
  saveEntry,
  STUDIO_FORMATS,
  type StudioHistoryEntry,
} from '@/lib/studio-history';
import { initialStudioState, isStale, studioReducer, toHistoryEntry } from './studio-state';
import { StudioForm } from './StudioForm';
import { StudioOutput } from './StudioOutput';
import { StudioSidebar } from './StudioSidebar';
import '../workspace/workspace.css';
import './studio.css';

function ResetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M5.2 3.2 2.4 6l2.8 2.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.6 6h6.6a4.2 4.2 0 0 1 0 8.4H6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="m2.8 8.6 3.4 3.4 7-7.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StudioPage() {
  const ui = getStrings('en').ui;
  const strings = getStudioStrings('en');
  const [state, dispatch] = useReducer(studioReducer, undefined, initialStudioState);
  const [history, setHistory] = useState<StudioHistoryEntry[]>([]);
  const [saved, setSaved] = useState(false);
  const savedTimer = useRef<number | null>(null);

  /* localStorage only exists client-side — load after mount (static export). */
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  useEffect(
    () => () => {
      if (savedTimer.current !== null) window.clearTimeout(savedTimer.current);
    },
    [],
  );

  const typeStrings = strings.types[state.type];
  const commonFields = useMemo(() => studioCommonFields(strings), [strings]);
  const extraFields = useMemo(() => studioExtraFields(state.type, strings), [state.type, strings]);
  const staleFormats = useMemo(
    () => new Set(STUDIO_FORMATS.filter((f) => isStale(state, f))),
    [state],
  );

  function handleSave() {
    const entry = toHistoryEntry(state, Date.now());
    setHistory(saveEntry(entry));
    dispatch({ type: 'loadHistory', entry });
    setSaved(true);
    if (savedTimer.current !== null) window.clearTimeout(savedTimer.current);
    savedTimer.current = window.setTimeout(() => setSaved(false), 1600);
  }

  function handleDelete(entry: StudioHistoryEntry) {
    if (!window.confirm(fillTemplate(strings.ui.confirmDelete, { title: entry.title }))) return;
    setHistory(deleteEntry(entry.id));
  }

  function handleRegenerate() {
    const ok = window.confirm(strings.ui.confirmRegenerate);
    if (ok) dispatch({ type: 'regenerate' });
  }

  return (
    <div className="ws st">
      <StudioSidebar
        strings={strings}
        historyTitle={ui.history}
        activeType={state.type}
        typesDisabled={state.locked}
        history={history}
        activeEntryId={state.entryId}
        onSelectType={(studioType) => dispatch({ type: 'selectType', studioType })}
        onLoad={(entry) => dispatch({ type: 'loadHistory', entry })}
        onDelete={handleDelete}
      />

      <div className="ws-main">
        <div className="ws-head">
          <div>
            <h1>{typeStrings.label}</h1>
            <p>{typeStrings.description}</p>
          </div>
          <div className="ws-head-actions">
            <button
              type="button"
              className="ws-btn-neutral"
              onClick={() => dispatch({ type: 'reset' })}
            >
              <ResetIcon />
              {ui.reset}
            </button>
            <button type="button" className="ws-btn-pink" onClick={handleSave}>
              <CheckIcon />
              {saved ? ui.savedFlash : ui.saveToHistory}
            </button>
          </div>
        </div>

        <div className="ws-grid st-grid">
          <StudioForm
            type={state.type}
            typeLabel={typeStrings.label}
            commonFields={commonFields}
            extraFields={extraFields}
            values={state.values}
            locked={state.locked}
            ifEmptyLabel={ui.ifEmpty}
            ui={strings.ui}
            onChange={(key, value) => dispatch({ type: 'setField', key, value })}
            onRegenerate={handleRegenerate}
          />

          <StudioOutput
            active={state.activeFormat}
            text={state.outputs[state.activeFormat].text}
            staleFormats={staleFormats}
            copyLabel={ui.copy}
            ui={strings.ui}
            onSelect={(format) => dispatch({ type: 'setActiveFormat', format })}
            onEdit={(format, text) => dispatch({ type: 'editOutput', format, text })}
          />
        </div>
      </div>
    </div>
  );
}
