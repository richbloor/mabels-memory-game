import type { CardData, Difficulty } from '../../types';
import { Card } from '../Card/Card';
import './Board.css';

interface BoardProps {
  cards: CardData[];
  onCardClick: (id: number) => void;
  disabled: boolean;
  difficulty: Difficulty;
}

export function Board({ cards, onCardClick, disabled, difficulty }: BoardProps) {
  return (
    <div className={`board board--${difficulty}`}>
      {cards.map(card => (
        <Card
          key={card.id}
          card={card}
          onClick={() => onCardClick(card.id)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
