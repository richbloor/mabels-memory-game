import './Confetti.css';

const COLORS = ['#e91e63', '#f06292', '#ffeb3b', '#66bb6a', '#42a5f5', '#ab47bc', '#ff7043'];
const COUNT = 80;

interface Particle {
  x: number;
  color: string;
  delay: number;
  duration: number;
  width: number;
  height: number;
  drift: number;
}

function makeParticles(): Particle[] {
  return Array.from({ length: COUNT }, (_, i) => ({
    x: Math.random() * 100,
    color: COLORS[i % COLORS.length],
    delay: Math.random() * 1.2,
    duration: 2 + Math.random() * 1.5,
    width: 6 + Math.random() * 8,
    height: 8 + Math.random() * 10,
    drift: (Math.random() - 0.5) * 80,
  }));
}

export function Confetti() {
  const particles = makeParticles();

  return (
    <div className="confetti-container" aria-hidden="true">
      {particles.map((p, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.x}%`,
            background: p.color,
            width: p.width,
            height: p.height,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
