import type { TimeStats } from '../../types';
import { formatTime } from '../Timer/Timer';
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

        <button className="play-again-btn" onClick={onPlayAgain}>
          Play Again!
        </button>
      </div>
    </div>
  );
}
