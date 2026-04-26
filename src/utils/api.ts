import type { ScoreEntry, Difficulty } from '../types';

export async function fetchScores(difficulty: Difficulty): Promise<ScoreEntry[]> {
  const res = await fetch(`/api/scores?difficulty=${difficulty}`);
  if (!res.ok) throw new Error('Failed to fetch scores');
  return res.json() as Promise<ScoreEntry[]>;
}

export async function postScore(timeMs: number, name: string, difficulty: Difficulty): Promise<ScoreEntry[]> {
  const res = await fetch('/api/scores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ timeMs, name, difficulty }),
  });
  if (!res.ok) throw new Error('Failed to save score');
  return res.json() as Promise<ScoreEntry[]>;
}
