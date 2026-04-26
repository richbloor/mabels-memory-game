import { FRUITS } from '../constants';
import type { CardData } from '../types';

export function buildAndShuffleDeck(pairs: number = FRUITS.length): CardData[] {
  const fruits = FRUITS.slice(0, pairs);
  const deck: CardData[] = fruits.flatMap((fruit, i) => [
    { id: i * 2,     fruit: fruit.name, emoji: fruit.emoji, isFlipped: false, isMatched: false },
    { id: i * 2 + 1, fruit: fruit.name, emoji: fruit.emoji, isFlipped: false, isMatched: false },
  ]);

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}
