import { STORAGE_KEY } from '../constants';
import type { TimeStats } from '../types';

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

