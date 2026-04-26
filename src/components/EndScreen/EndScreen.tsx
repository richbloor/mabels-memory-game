import { useState, useEffect } from 'react';
import type { TimeStats, ScoreEntry, Difficulty } from '../../types';
import { formatTime } from '../Timer/Timer';
import { fetchScores, postScore } from '../../utils/api';
import './EndScreen.css';

interface EndScreenProps {
  finalMs: number;
  stats: TimeStats;
  difficulty: Difficulty;
  onPlayAgain: () => void;
}

function displayTime(ms: number | null): string {
  if (ms === null) return '—';
  return formatTime(ms);
}

export function EndScreen({ finalMs, stats, difficulty, onPlayAgain }: EndScreenProps) {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [scoresLoading, setScoresLoading] = useState(true);
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [newScoreIdx, setNewScoreIdx] = useState(-1);

  useEffect(() => {
    fetchScores(difficulty)
      .then(setScores)
      .catch(() => {})
      .finally(() => setScoresLoading(false));
  }, [difficulty]);

  const qualifies =
    !scoresLoading &&
    (scores.length < 10 || finalMs < scores[scores.length - 1].timeMs);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || saving) return;
    setSaving(true);
    setSaveError(false);
    try {
      const updated = await postScore(finalMs, name, difficulty);
      const idx = updated.findIndex(s => s.name === name.trim() && s.timeMs === finalMs);
      setScores(updated);
      setNewScoreIdx(idx);
      setSubmitted(true);
    } catch {
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  }

  const difficultyLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  return (
    <div className="end-overlay">
      <div className="end-card">
        <div className="end-title">You did it!</div>
        <div className="end-subtitle">{submitted && name.trim() ? `Well done, ${name.trim()}!` : 'Well done!'}</div>

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
            <span className="stat-label">Last time</span>
            <span className="stat-value">{displayTime(stats.last)}</span>
          </div>
        </div>

        {qualifies && !submitted && (
          <div className="score-entry">
            <div className="score-entry-title">You made the {difficultyLabel} top 10!</div>
            <form className="score-entry-form" onSubmit={handleSubmit}>
              <input
                className="score-name-input"
                type="text"
                maxLength={20}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
                autoFocus
                disabled={saving}
              />
              <button className="score-save-btn" type="submit" disabled={saving}>
                {saving ? '…' : 'Save'}
              </button>
            </form>
            {saveError && <p className="save-error">Couldn't save — try again?</p>}
            <button className="score-skip-btn" type="button" onClick={() => setSubmitted(true)}>
              Skip
            </button>
          </div>
        )}

        {scoresLoading ? (
          <div className="leaderboard-loading">Loading scores…</div>
        ) : scores.length > 0 && (
          <div className="leaderboard">
            <div className="leaderboard-title">{difficultyLabel} Top 10</div>
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
