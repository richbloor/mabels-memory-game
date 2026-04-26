import type { ScoreEntry } from '../types';

export async function fetchScores(): Promise<ScoreEntry[]> {
  const res = await fetch('/api/scores');
  if (!res.ok) throw new Error('Failed to fetch scores');
  return res.json() as Promise<ScoreEntry[]>;
}

export async function postScore(timeMs: number, name: string): Promise<ScoreEntry[]> {
  const res = await fetch('/api/scores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ timeMs, name }),
  });
  if (!res.ok) throw new Error('Failed to save score');
  return res.json() as Promise<ScoreEntry[]>;
}
