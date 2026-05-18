import { useRef } from 'react';

interface Props {
  bgEffect: 'none' | 'stars' | 'sparkles';
}

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

const STAR_COLORS = ['#ffffff', '#e0e7ff', '#c7d2fe'];
const SPARKLE_COLORS = ['#f0abfc', '#e879a0', '#c084fc', '#fbcfe8'];

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function ThemeBg({ bgEffect }: Props) {
  const starsRef = useRef<Particle[] | null>(null);
  const sparklesRef = useRef<Particle[] | null>(null);

  if (bgEffect === 'none') return null;

  if (bgEffect === 'stars') {
    if (!starsRef.current) {
      starsRef.current = Array.from({ length: 50 }, () => ({
        x: randomBetween(0, 100),
        y: randomBetween(0, 100),
        size: randomBetween(4, 8),
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        delay: randomBetween(0, 3),
        duration: randomBetween(2, 4),
      }));
    }
    const stars = starsRef.current;

    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
        aria-hidden
      >
        {stars.map((star, i) => (
          <div
            key={i}
            className="twinkle"
            style={{
              position: 'absolute',
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              borderRadius: '50%',
              backgroundColor: star.color,
              ['--dur' as string]: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (bgEffect === 'sparkles') {
    if (!sparklesRef.current) {
      sparklesRef.current = Array.from({ length: 24 }, () => ({
        x: randomBetween(0, 100),
        y: randomBetween(20, 100),
        size: randomBetween(6, 14),
        color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
        delay: randomBetween(0, 5),
        duration: randomBetween(3, 6),
      }));
    }
    const sparkles = sparklesRef.current;

    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
        aria-hidden
      >
        {sparkles.map((sp, i) => (
          <div
            key={i}
            className="sparkle-float"
            style={{
              position: 'absolute',
              left: `${sp.x}%`,
              top: `${sp.y}%`,
              width: `${sp.size}px`,
              height: `${sp.size}px`,
              borderRadius: '50%',
              backgroundColor: sp.color,
              ['--dur' as string]: `${sp.duration}s`,
              animationDelay: `${sp.delay}s`,
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}
