import type { Difficulty } from './types';

export const FRUITS = [
  { name: 'banana',    emoji: '🍌' },
  { name: 'apple',     emoji: '🍎' },
  { name: 'grape',     emoji: '🍇' },
  { name: 'orange',    emoji: '🍊' },
  { name: 'cherry',    emoji: '🍒' },
  { name: 'coconut',   emoji: '🥥' },
  { name: 'pear',      emoji: '🍐' },
  { name: 'peach',     emoji: '🍑' },
  { name: 'blueberry', emoji: '🫐' },
];

export const TOTAL_PAIRS = FRUITS.length;
export const STORAGE_KEY = 'mabels_memory_stats';
export const MUTE_KEY = 'mabels_muted';

export const DIFFICULTY_PAIRS: Record<Difficulty, number> = {
  easy:   4,
  medium: 6,
  hard:   9,
};
