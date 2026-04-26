import { useState, useEffect } from 'react';
import type { ScoreEntry } from '../../types';
import { fetchScores } from '../../utils/api';
import { formatTime } from '../Timer/Timer';
import './HighScoresModal.css';

interface HighScoresModalProps {
  onClose: () => void;
}

export function HighScoresModal({ onClose }: HighScoresModalProps) {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchScores()
      .then(setScores)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="hs-overlay" onClick={onClose}>
      <div className="hs-card" onClick={e => e.stopPropagation()}>
        <div className="hs-title">High Scores</div>
        {loading && <div className="hs-message">Loading…</div>}
        {error && <div className="hs-message hs-error">Couldn't load scores.</div>}
        {!loading && !error && scores.length === 0 && (
          <div className="hs-message">No scores yet — be the first!</div>
        )}
        {!loading && !error && scores.length > 0 && (
          <ol className="hs-list">
            {scores.map((entry, i) => (
              <li key={i} className="hs-row">
                <span className="hs-rank">{i + 1}</span>
                <span className="hs-player">{entry.name}</span>
                <span className="hs-time">{formatTime(entry.timeMs)}</span>
              </li>
            ))}
          </ol>
        )}
        <button className="hs-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
