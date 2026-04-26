import { useState, useEffect, useRef } from 'react';
import type { GamePhase, CardData, TimeStats } from './types';
import { TOTAL_PAIRS } from './constants';
import { buildAndShuffleDeck } from './utils/shuffle';
import { saveStats } from './utils/storage';
import { playFlip, playMatch, playNoMatch, playWin } from './utils/sounds';
import { Header } from './components/Header/Header';
import { Board } from './components/Board/Board';
import { Timer } from './components/Timer/Timer';
import { EndScreen } from './components/EndScreen/EndScreen';
import { HighScoresModal } from './components/HighScoresModal/HighScoresModal';
import './App.css';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [cards, setCards] = useState<CardData[]>(() => buildAndShuffleDeck());
  const [elapsedMs, setElapsedMs] = useState(0);
  const [finalStats, setFinalStats] = useState<TimeStats | null>(null);
  const [showHighScores, setShowHighScores] = useState(false);

  // Refs for synchronous reads inside event handlers
  const phaseRef = useRef<GamePhase>('idle');
  const cardsRef = useRef<CardData[]>(cards);
  const flippedIdsRef = useRef<number[]>([]);
  const matchedPairsRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  // Keep phaseRef in sync
  const updatePhase = (p: GamePhase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  // Keep cardsRef in sync
  const updateCards = (c: CardData[]) => {
    cardsRef.current = c;
    setCards(c);
  };

  // Live timer tick
  useEffect(() => {
    if (phase !== 'playing') return;
    const id = setInterval(() => {
      if (startTimeRef.current !== null) {
        setElapsedMs(Date.now() - startTimeRef.current);
      }
    }, 100);
    return () => clearInterval(id);
  }, [phase]);

  const handleCardClick = (id: number) => {
    if (phaseRef.current === 'checking' || phaseRef.current === 'won') return;

    const currentCards = cardsRef.current;
    const card = currentCards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    // Start timer on first flip
    if (phaseRef.current === 'idle') {
      startTimeRef.current = Date.now();
      setElapsedMs(0);
      updatePhase('playing');
    }

    const flipped = flippedIdsRef.current;

    if (flipped.length === 0) {
      // First card of a pair
      playFlip();
      flippedIdsRef.current = [id];
      updateCards(currentCards.map(c => c.id === id ? { ...c, isFlipped: true } : c));
      return;
    }

    // Second card of a pair
    const firstId = flipped[0];
    flippedIdsRef.current = [];
    updatePhase('checking');

    const firstCard = currentCards.find(c => c.id === firstId)!;
    playFlip();
    const withBothFlipped = currentCards.map(c =>
      c.id === firstId || c.id === id ? { ...c, isFlipped: true } : c
    );
    updateCards(withBothFlipped);

    if (firstCard.fruit === card.fruit) {
      // Match!
      const matched = withBothFlipped.map(c =>
        c.id === firstId || c.id === id ? { ...c, isMatched: true } : c
      );
      matchedPairsRef.current += 1;

      if (matchedPairsRef.current === TOTAL_PAIRS) {
        const finalMs = Date.now() - startTimeRef.current!;
        setElapsedMs(finalMs);
        const stats = saveStats(finalMs);
        setFinalStats(stats);
        updateCards(matched);
        playWin();
        updatePhase('won');
      } else {
        playMatch();
        updateCards(matched);
        updatePhase('playing');
      }
    } else {
      // No match — flip back after delay
      playNoMatch();
      setTimeout(() => {
        updateCards(
          cardsRef.current.map(c =>
            c.id === firstId || c.id === id ? { ...c, isFlipped: false } : c
          )
        );
        updatePhase('playing');
      }, 700);
    }
  };

  const handlePlayAgain = () => {
    const newCards = buildAndShuffleDeck();
    cardsRef.current = newCards;
    flippedIdsRef.current = [];
    matchedPairsRef.current = 0;
    startTimeRef.current = null;
    phaseRef.current = 'idle';
    setCards(newCards);
    setPhase('idle');
    setElapsedMs(0);
    setFinalStats(null);
  };

  return (
    <div className="app">
      <Header />
      <Timer elapsedMs={elapsedMs} />
      <Board
        cards={cards}
        onCardClick={handleCardClick}
        disabled={phase === 'checking' || phase === 'won'}
      />
      {phase === 'idle' && (
        <>
          <p className="hint">Flip a card to start!</p>
          <button className="highscores-btn" onClick={() => setShowHighScores(true)}>
            High Scores
          </button>
        </>
      )}
      {phase === 'won' && finalStats && (
        <EndScreen
          finalMs={elapsedMs}
          stats={finalStats}
          onPlayAgain={handlePlayAgain}
        />
      )}
      {showHighScores && (
        <HighScoresModal onClose={() => setShowHighScores(false)} />
      )}
    </div>
  );
}
