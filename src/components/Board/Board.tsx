import type { CardData } from '../../types';
import { Card } from '../Card/Card';
import './Board.css';

interface BoardProps {
  cards: CardData[];
  onCardClick: (id: number) => void;
  disabled: boolean;
}

export function Board({ cards, onCardClick, disabled }: BoardProps) {
  return (
    <div className="board">
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
