import { useEffect, useRef } from "react";

interface Props {
  onPlayAgain: () => void;
}

const STAR_COUNT = 18;

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface Star {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: string;
  color: string;
  rotate: string;
}

function generateStars(): Star[] {
  const colors = ["#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#a855f7", "#ef4444"];
  return Array.from({ length: STAR_COUNT }, (_, i) => ({
    id: i,
    left: `${randomBetween(2, 98)}%`,
    delay: `${randomBetween(0, 1.2)}s`,
    duration: `${randomBetween(1.8, 3)}s`,
    size: `${randomBetween(18, 36)}px`,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotate: `${randomBetween(-180, 180)}deg`,
  }));
}

export function CompletionScreen({ onPlayAgain }: Props) {
  const starsRef = useRef<Star[]>(generateStars());

  useEffect(() => {
    starsRef.current = generateStars();
  }, []);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#0f172a" }}
    >
      {/* Confetti stars */}
      {starsRef.current.map((star) => (
        <div
          key={star.id}
          className="confetti-star"
          style={{
            position: "absolute",
            left: star.left,
            top: "-40px",
            width: star.size,
            height: star.size,
            backgroundColor: star.color,
            borderRadius: "50%",
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}

      {/* Centre content */}
      <div className="flex flex-col items-center justify-center gap-8 z-10 px-6">
        {/* Big celebration emoji */}
        <div className="celebration-bounce" style={{ fontSize: "clamp(80px, 18vw, 128px)" }}>
          🌟
        </div>

        {/* Stars row */}
        <div className="flex gap-3" style={{ fontSize: "clamp(36px, 8vw, 56px)" }}>
          {"⭐⭐⭐".split("").map((star, i) => (
            <span
              key={i}
              className="star-pop"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {star}
            </span>
          ))}
        </div>

        {/* Play Again button — large, icon-led */}
        <button
          onClick={onPlayAgain}
          className="flex items-center justify-center gap-4 rounded-3xl select-none active:scale-95 transition-transform duration-150"
          style={{
            backgroundColor: "#f59e0b",
            minHeight: "96px",
            minWidth: "240px",
            paddingInline: "40px",
            fontSize: "clamp(22px, 5vw, 32px)",
            color: "#0f172a",
            fontWeight: "bold",
            boxShadow: "0 8px 32px rgba(245,158,11,0.5)",
            marginTop: "16px",
          }}
          aria-label="Play again"
        >
          <span style={{ fontSize: "1.2em" }}>▶</span>
          <span>Play Again</span>
        </button>
      </div>
    </div>
  );
}
