import { useEffect, useRef } from "react";
import type { Phoneme } from "../data/phonemes";
import { useAudio } from "../hooks/useAudio";
import { useTheme } from "../hooks/useTheme";

interface Props {
  phoneme: Phoneme;
  onNext: () => void;
}

export function PhonicsCard({ phoneme, onNext }: Props) {
  const { playPhoneme, stop } = useAudio();
  const { theme } = useTheme();
  const hasPlayed = useRef(false);

  const isCircular = theme.cardRadius === '50%';
  const circularSize = 'clamp(240px, 55vw, 300px)';

  useEffect(() => {
    hasPlayed.current = false;
  }, [phoneme.id]);

  useEffect(() => {
    if (!hasPlayed.current) {
      hasPlayed.current = true;
      const t = setTimeout(() => playPhoneme(phoneme.audioFile, phoneme.display), 300);
      return () => clearTimeout(t);
    }
    return () => stop();
  }, [phoneme, playPhoneme, stop]);

  const handleReplay = () => playPhoneme(phoneme.audioFile, phoneme.display);

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full max-w-lg mx-auto px-4">
      {/* Main phoneme card — tap to replay */}
      <button
        onClick={handleReplay}
        className="phonics-card flex flex-col items-center justify-center gap-6 select-none active:scale-95 transition-transform duration-150"
        style={{
          backgroundColor: theme.surface,
          boxShadow: `0 12px 40px ${theme.surfaceShadow}`,
          borderRadius: theme.cardRadius,
          ...(isCircular
            ? {
                width: circularSize,
                height: circularSize,
                padding: '0',
              }
            : {
                width: '100%',
                minHeight: '320px',
                borderRadius: theme.cardRadius,
                paddingTop: '48px',
                paddingBottom: '48px',
                paddingLeft: '32px',
                paddingRight: '32px',
              }),
        }}
        aria-label={`Tap to hear the sound ${phoneme.display}`}
      >
        {/* Speaker icon */}
        <div className="text-5xl opacity-60">🔊</div>

        {/* Large phoneme letter(s) */}
        <div
          className="font-bold leading-none text-center"
          style={{ fontSize: "clamp(96px, 20vw, 160px)", color: theme.text }}
        >
          {phoneme.display}
        </div>

        {/* Example word */}
        <div
          className="text-center"
          style={{ fontSize: "clamp(24px, 5vw, 36px)", color: theme.textMuted }}
        >
          {phoneme.example}
        </div>
      </button>

      {/* Next button — big arrow to go to match game */}
      <button
        onClick={onNext}
        className="flex items-center justify-center gap-3 rounded-2xl px-12 select-none active:scale-95 transition-transform duration-150"
        style={{
          backgroundColor: theme.accent,
          minHeight: "88px",
          minWidth: "200px",
          fontSize: "clamp(18px, 4vw, 26px)",
          color: theme.accentText,
          fontWeight: "bold",
          boxShadow: `0 6px 20px ${theme.accentShadow}`,
        }}
        aria-label="Play the matching game"
      >
        <span>▶</span>
        <span>Play!</span>
      </button>
    </div>
  );
}
