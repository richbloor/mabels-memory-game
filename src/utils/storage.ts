import { STORAGE_KEY, SCORES_KEY } from '../constants';
import type { TimeStats, ScoreEntry } from '../types';

export function loadStats(): TimeStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { best: null, worst: null, last: null };
    return JSON.parse(raw) as TimeStats;
  } catch {
    return { best: null, worst: null, last: null };
  }
}

export function saveStats(currentMs: number): TimeStats {
  const prev = loadStats();
  const updated: TimeStats = {
    best:  prev.best  === null ? currentMs : Math.min(prev.best, currentMs),
    worst: prev.worst === null ? currentMs : Math.max(prev.worst, currentMs),
    last:  currentMs,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function loadScores(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(SCORES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ScoreEntry[];
  } catch {
    return [];
  }
}

export function saveScore(timeMs: number, name: string): ScoreEntry[] {
  const scores = loadScores();
  const updated = [...scores, { name: name.trim(), timeMs }]
    .sort((a, b) => a.timeMs - b.timeMs)
    .slice(0, 10);
  localStorage.setItem(SCORES_KEY, JSON.stringify(updated));
  return updated;
}
