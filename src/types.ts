export type GamePhase = 'idle' | 'playing' | 'checking' | 'won';

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
