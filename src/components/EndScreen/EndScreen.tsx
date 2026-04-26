import { useState } from 'react';
import type { TimeStats, ScoreEntry } from '../../types';
import { formatTime } from '../Timer/Timer';
import { loadScores, saveScore } from '../../utils/storage';
import './EndScreen.css';

interface EndScreenProps {
  finalMs: number;
  stats: TimeStats;
  onPlayAgain: () => void;
}

function displayTime(ms: number | null): string {
  if (ms === null) return '—';
  return formatTime(ms);
}

export function EndScreen({ finalMs, stats, onPlayAgain }: EndScreenProps) {
  const [scores, setScores] = useState<ScoreEntry[]>(() => loadScores());
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [newScoreIdx, setNewScoreIdx] = useState(-1);

  const qualifies = scores.length < 10 || finalMs < scores[scores.length - 1].timeMs;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const updated = saveScore(finalMs, name);
    const idx = updated.findIndex(s => s.name === name.trim() && s.timeMs === finalMs);
    setScores(updated);
    setNewScoreIdx(idx);
    setSubmitted(true);
  }

  return (
    <div className="end-overlay">
      <div className="end-card">
        <div className="end-title">You did it!</div>
        <div className="end-subtitle">Well done, Mabel!</div>

        <div className="end-stats">
          <div className="stat-row stat-current">
            <span className="stat-label">Your time</span>
            <span className="stat-value">{formatTime(finalMs)}</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-row">
            <span className="stat-label">Best time</span>
            <span className="stat-value stat-best">{displayTime(stats.best)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Slowest time</span>
            <span className="stat-value stat-worst">{displayTime(stats.worst)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Last time</span>
            <span className="stat-value">{displayTime(stats.last)}</span>
          </div>
        </div>

        {qualifies && !submitted && (
          <div className="score-entry">
            <div className="score-entry-title">You made the top 10!</div>
            <form className="score-entry-form" onSubmit={handleSubmit}>
              <input
                className="score-name-input"
                type="text"
                maxLength={20}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
                autoFocus
              />
              <button className="score-save-btn" type="submit">Save</button>
            </form>
            <button className="score-skip-btn" type="button" onClick={() => setSubmitted(true)}>
              Skip
            </button>
          </div>
        )}

        {scores.length > 0 && (
          <div className="leaderboard">
            <div className="leaderboard-title">Top 10</div>
            <ol className="leaderboard-list">
              {scores.map((entry, i) => (
                <li
                  key={i}
                  className={`leaderboard-row${i === newScoreIdx ? ' leaderboard-new' : ''}`}
                >
                  <span className="score-rank">{i + 1}</span>
                  <span className="score-player">{entry.name}</span>
                  <span className="score-time">{formatTime(entry.timeMs)}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <button className="play-again-btn" onClick={onPlayAgain}>
          Play Again!
        </button>
      </div>
    </div>
  );
}
