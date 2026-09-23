/**
 * Studio history: saved prompts persisted to localStorage via the
 * never-throwing safe-storage wrapper. Pure helpers are exported for tests.
 */

import { STUDIO_TYPES, type StudioType, type StudioValues } from '@/data/studio';
import { safeGet, safeSet } from './storage';

export const STUDIO_HISTORY_KEY = 'es-markdown:studio-history:v1';
export const STUDIO_HISTORY_CAP = 50;
export const STUDIO_TITLE_MAX = 60;

export type StudioFormat = 'plain' | 'json' | 'markdown';
export const STUDIO_FORMATS: readonly StudioFormat[] = ['plain', 'json', 'markdown'];

export interface StudioOutput {
  text: string;
  edited: boolean;
}

export interface StudioHistoryEntry {
  id: string;
  type: StudioType;
  title: string;
  values: StudioValues;
  outputs: Record<StudioFormat, StudioOutput>;
  locked: boolean;
  savedAt: number;
}

/** Title from the task value: whitespace-collapsed, truncated, 'Untitled' fallback. */
export function deriveTitle(values: StudioValues, max = STUDIO_TITLE_MAX): string {
  const task = (values.task ?? '').replace(/\s+/g, ' ').trim();
  if (!task) return 'Untitled';
  return task.length > max ? `${task.slice(0, max - 1).trimEnd()}…` : task;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function isOutput(v: unknown): v is StudioOutput {
  return isRecord(v) && typeof v.text === 'string' && typeof v.edited === 'boolean';
}

/** Light shape check for entries read back from storage. */
export function isHistoryEntry(v: unknown): v is StudioHistoryEntry {
  if (!isRecord(v)) return false;
  if (typeof v.id !== 'string' || !v.id) return false;
  if (!(STUDIO_TYPES as readonly unknown[]).includes(v.type)) return false;
  if (typeof v.title !== 'string') return false;
  if (typeof v.locked !== 'boolean') return false;
  if (typeof v.savedAt !== 'number' || !Number.isFinite(v.savedAt)) return false;
  if (!isRecord(v.values) || !Object.values(v.values).every((x) => typeof x === 'string')) {
    return false;
  }
  const outputs = v.outputs;
  return isRecord(outputs) && STUDIO_FORMATS.every((f) => isOutput(outputs[f]));
}

/** Parse raw storage text; corrupt / non-array → [], bad entries dropped. */
export function parseHistory(raw: string | null): StudioHistoryEntry[] {
  if (!raw) return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  return Array.isArray(data) ? data.filter(isHistoryEntry) : [];
}

/** Upsert by id at the front; drop the oldest beyond cap. */
export function applySave(
  list: readonly StudioHistoryEntry[],
  entry: StudioHistoryEntry,
  cap = STUDIO_HISTORY_CAP,
): StudioHistoryEntry[] {
  return [entry, ...list.filter((e) => e.id !== entry.id)].slice(0, Math.max(0, cap));
}

export function applyDelete(
  list: readonly StudioHistoryEntry[],
  id: string,
): StudioHistoryEntry[] {
  return list.filter((e) => e.id !== id);
}

/** Newest first. Never throws (SSR / blocked storage → []). */
export function loadHistory(): StudioHistoryEntry[] {
  return parseHistory(safeGet(STUDIO_HISTORY_KEY));
}

function persist(list: StudioHistoryEntry[]): void {
  let json: string;
  try {
    json = JSON.stringify(list);
  } catch {
    return;
  }
  safeSet(STUDIO_HISTORY_KEY, json);
}

/** Returns the updated list. */
export function saveEntry(entry: StudioHistoryEntry): StudioHistoryEntry[] {
  const next = applySave(loadHistory(), entry);
  persist(next);
  return next;
}

/** Returns the updated list. */
export function deleteEntry(id: string): StudioHistoryEntry[] {
  const next = applyDelete(loadHistory(), id);
  persist(next);
  return next;
}
