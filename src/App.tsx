import { useState, useEffect, useRef } from 'react';
import type { GamePhase, Difficulty, CardData, TimeStats } from './types';
import { DIFFICULTY_PAIRS } from './constants';
import { buildAndShuffleDeck } from './utils/shuffle';
import { saveStats } from './utils/storage';
import { playFlip, playMatch, playNoMatch, playWin, isMuted, setMuted } from './utils/sounds';
import { Header } from './components/Header/Header';
import { Board } from './components/Board/Board';
import { Timer } from './components/Timer/Timer';
import { EndScreen } from './components/EndScreen/EndScreen';
import { Confetti } from './components/Confetti/Confetti';
import { HighScoresModal } from './components/HighScoresModal/HighScoresModal';
import './App.css';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [cards, setCards] = useState<CardData[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [finalStats, setFinalStats] = useState<TimeStats | null>(null);
  const [showHighScores, setShowHighScores] = useState(false);
  const [muted, setMutedState] = useState(() => isMuted());

  // Refs for synchronous reads inside event handlers
  const phaseRef = useRef<GamePhase>('setup');
  const cardsRef = useRef<CardData[]>([]);
  const flippedIdsRef = useRef<number[]>([]);
  const matchedPairsRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const totalPairsRef = useRef(DIFFICULTY_PAIRS['medium']);

  const updatePhase = (p: GamePhase) => { phaseRef.current = p; setPhase(p); };
  const updateCards = (c: CardData[]) => { cardsRef.current = c; setCards(c); };

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

  const handleStartGame = (d: Difficulty) => {
    const pairs = DIFFICULTY_PAIRS[d];
    const deck = buildAndShuffleDeck(pairs);
    const revealed = deck.map(c => ({ ...c, isFlipped: true }));

    totalPairsRef.current = pairs;
    cardsRef.current = revealed;
    flippedIdsRef.current = [];
    matchedPairsRef.current = 0;
    startTimeRef.current = null;

    setDifficulty(d);
    setCards(revealed);
    setElapsedMs(0);
    setMoves(0);
    setFinalStats(null);
    updatePhase('preview');

    setTimeout(() => {
      const faceDown = cardsRef.current.map(c => ({ ...c, isFlipped: false }));
      updateCards(faceDown);
      updatePhase('idle');
    }, 3000);
  };

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
      playFlip();
      flippedIdsRef.current = [id];
      updateCards(currentCards.map(c => c.id === id ? { ...c, isFlipped: true } : c));
      return;
    }

    // Second card of a pair
    const firstId = flipped[0];
    flippedIdsRef.current = [];
    updatePhase('checking');
    setMoves(m => m + 1);

    const firstCard = currentCards.find(c => c.id === firstId)!;
    playFlip();
    const withBothFlipped = currentCards.map(c =>
      c.id === firstId || c.id === id ? { ...c, isFlipped: true } : c
    );
    updateCards(withBothFlipped);

    if (firstCard.fruit === card.fruit) {
      const matched = withBothFlipped.map(c =>
        c.id === firstId || c.id === id ? { ...c, isMatched: true } : c
      );
      matchedPairsRef.current += 1;

      if (matchedPairsRef.current === totalPairsRef.current) {
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
    cardsRef.current = [];
    flippedIdsRef.current = [];
    matchedPairsRef.current = 0;
    startTimeRef.current = null;
    phaseRef.current = 'setup';
    setCards([]);
    setPhase('setup');
    setElapsedMs(0);
    setMoves(0);
    setFinalStats(null);
  };

  const handleToggleMute = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  };

  return (
    <div className="app">
      <Header
        onHighScores={() => setShowHighScores(true)}
        muted={muted}
        onToggleMute={handleToggleMute}
      />

      {phase === 'setup' && (
        <div className="setup-screen">
          <p className="setup-prompt">Choose your difficulty</p>
          <div className="difficulty-btns">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
              <button
                key={d}
                className={`difficulty-btn difficulty-btn--${d}`}
                onClick={() => handleStartGame(d)}
              >
                <span className="difficulty-name">{d.charAt(0).toUpperCase() + d.slice(1)}</span>
                <span className="difficulty-sub">{DIFFICULTY_PAIRS[d]} pairs</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'preview' && (
        <p className="preview-hint">Memorise the cards!</p>
      )}

      {phase !== 'setup' && (
        <>
          {phase !== 'preview' && (
            <Timer elapsedMs={elapsedMs} moves={moves} />
          )}
          <Board
            cards={cards}
            onCardClick={handleCardClick}
            disabled={phase === 'checking' || phase === 'won' || phase === 'preview'}
            difficulty={difficulty}
          />
          {phase === 'idle' && (
            <p className="hint">Flip a card to start!</p>
          )}
        </>
      )}

      {phase === 'won' && finalStats && (
        <>
          <Confetti />
          <EndScreen
            finalMs={elapsedMs}
            stats={finalStats}
            difficulty={difficulty}
            onPlayAgain={handlePlayAgain}
          />
        </>
      )}

      {showHighScores && (
        <HighScoresModal onClose={() => setShowHighScores(false)} />
      )}
    </div>
  );
}
