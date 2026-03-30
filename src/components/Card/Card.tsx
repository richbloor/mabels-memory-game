import type { CardData } from '../../types';
import './Card.css';

interface CardProps {
  card: CardData;
  onClick: () => void;
  disabled: boolean;
}

export function Card({ card, onClick, disabled }: CardProps) {
  const handleClick = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onClick();
    }
  };

  return (
    <div className="card-scene" onClick={handleClick} role="button" aria-label={card.isFlipped ? card.fruit : 'face-down card'}>
      <div className={`card-inner${card.isFlipped || card.isMatched ? ' flipped' : ''}${card.isMatched ? ' matched' : ''}`}>
        <div className="card-back">
          <span className="card-back-icon">🌸</span>
        </div>
        <div className="card-front">
          <span className="card-emoji">{card.emoji}</span>
          <span className="card-label">{card.fruit}</span>
        </div>
      </div>
    </div>
  );
}
