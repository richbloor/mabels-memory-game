import { useState, useEffect } from 'react';
import type { ScoreEntry, Difficulty } from '../../types';
import { fetchScores } from '../../utils/api';
import { formatTime } from '../Timer/Timer';
import './HighScoresModal.css';

interface HighScoresModalProps {
  onClose: () => void;
}

const TABS: Difficulty[] = ['easy', 'medium', 'hard'];

export function HighScoresModal({ onClose }: HighScoresModalProps) {
  const [tab, setTab] = useState<Difficulty>('hard');
  const [cache, setCache] = useState<Partial<Record<Difficulty, ScoreEntry[]>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (cache[tab] !== undefined) return;
    setLoading(true);
    setError(false);
    fetchScores(tab)
      .then(scores => setCache(prev => ({ ...prev, [tab]: scores })))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [tab, cache]);

  const scores = cache[tab];

  return (
    <div className="hs-overlay" onClick={onClose}>
      <div className="hs-card" onClick={e => e.stopPropagation()}>
        <div className="hs-title">High Scores</div>

        <div className="hs-tabs">
          {TABS.map(d => (
            <button
              key={d}
              className={`hs-tab${tab === d ? ' hs-tab--active' : ''}`}
              onClick={() => setTab(d)}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>

        {loading && <div className="hs-message">Loading…</div>}
        {error && <div className="hs-message hs-error">Couldn't load scores.</div>}
        {!loading && !error && scores !== undefined && scores.length === 0 && (
          <div className="hs-message">No scores yet — be the first!</div>
        )}
        {!loading && !error && scores && scores.length > 0 && (
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
