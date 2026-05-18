import { useEffect, useRef } from "react";
import { MAX_LEVEL } from "../data/phonemes";
import { useTheme } from "../hooks/useTheme";

interface Props {
  level: number;
  onNext: () => void;
}

const LEVEL_COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#a855f7", "#ec4899", "#ef4444"];
const LEVEL_LABELS = ["One", "Two", "Three", "Four", "Five", "Six"];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface Particle {
  id: number; left: string; size: string;
  color: string; delay: string; duration: string;
}

function makeParticles(colors: string[], count = 28): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${rand(2, 98)}%`,
    size: `${rand(12, 28)}px`,
    color: colors[i % colors.length],
    delay: `${rand(0, 1.4)}s`,
    duration: `${rand(1.8, 3.2)}s`,
  }));
}

// Positioning for each theme's fly-by hero element
const flyByPos: Record<string, React.CSSProperties> = {
  marbleRun: { position: 'absolute', top: '28%', left: '50%', zIndex: 5 },
  raceCar:   { position: 'absolute', top: '26%', left: '50%', zIndex: 5 },
  space:     { position: 'absolute', bottom: '8%', left: '50%', zIndex: 5 },
  princess:  { position: 'absolute', top: '8%',  left: '50%', zIndex: 5 },
};

export function LevelCompleteScreen({ level, onNext }: Props) {
  const { theme } = useTheme();
  const { celebration } = theme;
  const particles = useRef<Particle[]>(makeParticles(celebration.particleColors));
  const isLast  = level >= MAX_LEVEL;
  const color   = LEVEL_COLORS[(level - 1) % LEVEL_COLORS.length];
  const label   = LEVEL_LABELS[(level - 1) % LEVEL_LABELS.length];

  useEffect(() => {
    particles.current = makeParticles(celebration.particleColors);
  }, [level, theme.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const particleRadius = celebration.particleShape === 'circle' ? '50%' : '4px';

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: theme.bg }}
    >
      {/* Theme-coloured particle rain */}
      {particles.current.map((p) => (
        <div
          key={p.id}
          className="confetti-star"
          style={{
            position: "absolute",
            left: p.left,
            top: "-40px",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: particleRadius,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      {/* Theme fly-by hero (marble rolls / car zooms / rocket launches / crown drops) */}
      <div style={flyByPos[theme.id]} className="pointer-events-none select-none">
        <span
          className={celebration.levelHeroAnim}
          style={{ fontSize: "clamp(60px, 13vw, 96px)", display: "inline-block" }}
        >
          {celebration.levelHero}
        </span>
      </div>

      {/* Central content */}
      <div className="flex flex-col items-center gap-6 z-10 px-8 text-center">
        {/* Bouncing center emoji */}
        <div
          className="celebration-bounce"
          style={{ fontSize: "clamp(72px, 16vw, 120px)" }}
        >
          {isLast ? "🏆" : celebration.centerEmoji}
        </div>

        {/* Level badge — keeps level-specific colour */}
        <div
          className="rounded-3xl px-10 py-4 font-bold"
          style={{
            backgroundColor: color,
            color: "#0f172a",
            fontSize: "clamp(22px, 5vw, 34px)",
            boxShadow: `0 8px 32px ${color}66`,
          }}
        >
          {isLast ? "All Levels Done!" : `Level ${label} Done!`}
        </div>

        {/* Star row — progress */}
        <div className="flex gap-2" style={{ fontSize: "clamp(24px, 5vw, 36px)" }}>
          {Array.from({ length: MAX_LEVEL }, (_, i) => (
            <span
              key={i}
              className={i < level ? "star-pop" : ""}
              style={{ animationDelay: `${i * 0.15}s`, opacity: i < level ? 1 : 0.2 }}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Next / restart button */}
        <button
          onClick={onNext}
          className="flex items-center justify-center gap-4 rounded-3xl select-none active:scale-95 transition-transform duration-150"
          style={{
            backgroundColor: color,
            minHeight: "96px",
            minWidth: "240px",
            paddingInline: "40px",
            fontSize: "clamp(20px, 4.5vw, 30px)",
            color: "#0f172a",
            fontWeight: "bold",
            boxShadow: `0 8px 32px ${color}66`,
            marginTop: "8px",
          }}
          aria-label={isLast ? "Start over" : "Go to next level"}
        >
          <span style={{ fontSize: "1.2em" }}>{isLast ? "🔁" : "▶"}</span>
          <span>{isLast ? "Start Over!" : "Next Level!"}</span>
        </button>
      </div>
    </div>
  );
}
