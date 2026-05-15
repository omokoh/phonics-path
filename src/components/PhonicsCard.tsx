import { useEffect, useRef } from "react";
import type { Phoneme } from "../data/phonemes";
import { useAudio } from "../hooks/useAudio";

interface Props {
  phoneme: Phoneme;
  onNext: () => void;
}

export function PhonicsCard({ phoneme, onNext }: Props) {
  const { playPhoneme, stop } = useAudio();
  const hasPlayed = useRef(false);

  useEffect(() => {
    hasPlayed.current = false;
  }, [phoneme.id]);

  useEffect(() => {
    if (!hasPlayed.current) {
      hasPlayed.current = true;
      const t = setTimeout(() => playPhoneme(phoneme.audioFile, phoneme.display, phoneme.example), 300);
      return () => clearTimeout(t);
    }
    return () => stop();
  }, [phoneme, playPhoneme, stop]);

  const handleReplay = () => playPhoneme(phoneme.audioFile, phoneme.display, phoneme.example);

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full max-w-lg mx-auto px-4">
      {/* Main phoneme card — tap to replay */}
      <button
        onClick={handleReplay}
        className="phonics-card w-full rounded-3xl flex flex-col items-center justify-center gap-6 py-12 px-8 select-none active:scale-95 transition-transform duration-150"
        style={{
          backgroundColor: "#fefce8",
          minHeight: "320px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
        }}
        aria-label={`Tap to hear the sound ${phoneme.display}`}
      >
        {/* Speaker icon */}
        <div className="text-5xl opacity-60">🔊</div>

        {/* Large phoneme letter(s) */}
        <div
          className="font-bold leading-none text-center"
          style={{ fontSize: "clamp(96px, 20vw, 160px)", color: "#0f172a" }}
        >
          {phoneme.display}
        </div>

        {/* Example word */}
        <div
          className="text-center opacity-70"
          style={{ fontSize: "clamp(24px, 5vw, 36px)", color: "#0f172a" }}
        >
          {phoneme.example}
        </div>
      </button>

      {/* Next button — big arrow to go to match game */}
      <button
        onClick={onNext}
        className="flex items-center justify-center gap-3 rounded-2xl px-12 select-none active:scale-95 transition-transform duration-150"
        style={{
          backgroundColor: "#f59e0b",
          minHeight: "88px",
          minWidth: "200px",
          fontSize: "clamp(18px, 4vw, 26px)",
          color: "#0f172a",
          fontWeight: "bold",
          boxShadow: "0 6px 20px rgba(245,158,11,0.4)",
        }}
        aria-label="Play the matching game"
      >
        <span>▶</span>
        <span>Play!</span>
      </button>
    </div>
  );
}
