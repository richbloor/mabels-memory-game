import './Header.css';

interface HeaderProps {
  onHighScores: () => void;
  muted: boolean;
  onToggleMute: () => void;
}

export function Header({ onHighScores, muted, onToggleMute }: HeaderProps) {
  return (
    <header className="header">
      <h1 className="header-title">Mabel's Memory Game</h1>
      <div className="header-actions">
        <button className="header-btn" onClick={onHighScores}>
          🏆 High Scores
        </button>
        <button
          className="header-btn header-mute-btn"
          onClick={onToggleMute}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </div>
    </header>
  );
}
