export type GamePhase = 'setup' | 'preview' | 'idle' | 'playing' | 'checking' | 'won';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface CardData {
  id: number;
  fruit: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface TimeStats {
  best: number | null;
  worst: number | null;
  last: number | null;
}

export interface ScoreEntry {
  name: string;
  timeMs: number;
}
