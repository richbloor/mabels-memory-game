import './Timer.css';

interface TimerProps {
  elapsedMs: number;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((ms % 1000) / 100);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`;
}

export function Timer({ elapsedMs }: TimerProps) {
  return (
    <div className="timer">
      <span className="timer-label">Time</span>
      <span className="timer-value">{formatTime(elapsedMs)}</span>
    </div>
  );
}

export { formatTime };
