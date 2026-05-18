import { useEffect, useRef } from "react";
import { LEVEL_META } from "../data/levelData";
import { useAudio } from "../hooks/useAudio";

interface Props {
  onReset: () => void;
  onChooseLevel: () => void;
}

const PARTICLE_COUNT = 54;
const LEVEL_COLORS = LEVEL_META.map((m) => m.color);

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface Particle {
  id: number; left: string; size: string;
  color: string; delay: string; duration: string;
}

function makeParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    left: `${rand(1, 99)}%`,
    size: `${rand(10, 30)}px`,
    color: LEVEL_COLORS[i % LEVEL_COLORS.length],
    delay: `${rand(0, 2.2)}s`,
    duration: `${rand(1.6, 3.4)}s`,
  }));
}

export function GrandCelebrationScreen({ onReset, onChooseLevel }: Props) {
  const { playSuccess } = useAudio();
  const particles = useRef<Particle[]>(makeParticles());

  // Chain 3 success phrases with 500 ms gaps
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      for (let i = 0; i < 3; i++) {
        if (cancelled) return;
        await playSuccess(5);
        if (cancelled) return;
        await new Promise<void>((r) => setTimeout(r, 500));
      }
    };
    const t = setTimeout(run, 600);
    return () => { cancelled = true; clearTimeout(t); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#0f172a" }}
    >
      {/* Heavy confetti rain */}
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
            borderRadius: "50%",
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      <div className="flex flex-col items-center gap-5 z-10 px-6 text-center">
        {/* Trophy */}
        <div
          className="celebration-bounce"
          style={{ fontSize: "clamp(80px, 18vw, 128px)", lineHeight: 1 }}
        >
          🏆
        </div>

        {/* Heading */}
        <div
          className="font-bold"
          style={{
            fontSize: "clamp(38px, 8.5vw, 64px)",
            color: "#f59e0b",
            lineHeight: 1.1,
          }}
        >
          You did it!
        </div>

        {/* Sub-heading */}
        <div
          style={{
            fontSize: "clamp(17px, 3.8vw, 25px)",
            color: "#cbd5e1",
            maxWidth: "360px",
            lineHeight: 1.3,
          }}
        >
          You learned all the sounds!
        </div>

        {/* All 6 level badges */}
        <div
          className="flex flex-wrap gap-3 justify-center"
          style={{ maxWidth: "420px", marginTop: "4px" }}
        >
          {LEVEL_META.map((meta, i) => (
            <div
              key={meta.level}
              className="star-pop flex flex-col items-center gap-1 rounded-2xl px-4 py-2"
              style={{
                backgroundColor: meta.color,
                color: "#0f172a",
                fontWeight: "bold",
                fontSize: "clamp(10px, 2vw, 13px)",
                animationDelay: `${0.25 + i * 0.13}s`,
                minWidth: "58px",
                boxShadow: `0 4px 16px ${meta.color}55`,
              }}
            >
              <span style={{ fontSize: "clamp(18px, 4vw, 24px)" }}>{meta.icon}</span>
              <span style={{ fontSize: "clamp(14px, 3vw, 18px)" }}>⭐</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div
          className="flex flex-col gap-4 w-full"
          style={{ maxWidth: "340px", marginTop: "8px" }}
        >
          {/* Play Again — full reset */}
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-3 rounded-3xl select-none active:scale-95 transition-transform duration-150"
            style={{
              backgroundColor: "#f59e0b",
              minHeight: "88px",
              fontSize: "clamp(20px, 4.5vw, 28px)",
              color: "#0f172a",
              fontWeight: "bold",
              boxShadow: "0 8px 32px rgba(245,158,11,0.5)",
              paddingInline: "32px",
            }}
            aria-label="Reset all progress and play again from level 1"
          >
            <span>🔁</span>
            <span>Play Again</span>
          </button>

          {/* Choose a Level */}
          <button
            onClick={onChooseLevel}
            className="flex items-center justify-center gap-3 rounded-3xl select-none active:scale-95 transition-transform duration-150"
            style={{
              backgroundColor: "transparent",
              border: "3px solid #f59e0b",
              minHeight: "80px",
              fontSize: "clamp(18px, 4vw, 24px)",
              color: "#f59e0b",
              fontWeight: "bold",
              paddingInline: "32px",
            }}
            aria-label="Choose a level to practice again"
          >
            <span style={{ fontSize: "0.85em" }}>▦</span>
            <span>Choose a Level</span>
          </button>
        </div>
      </div>
    </div>
  );
}
