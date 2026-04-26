import './Timer.css';

interface TimerProps {
  elapsedMs: number;
  moves: number;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((ms % 1000) / 100);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`;
}

export function Timer({ elapsedMs, moves }: TimerProps) {
  return (
    <div className="timer">
      <div className="timer-stat">
        <span className="timer-label">Time</span>
        <span className="timer-value">{formatTime(elapsedMs)}</span>
      </div>
      <div className="timer-sep">·</div>
      <div className="timer-stat">
        <span className="timer-label">Moves</span>
        <span className="timer-value">{moves}</span>
      </div>
    </div>
  );
}

export { formatTime };
