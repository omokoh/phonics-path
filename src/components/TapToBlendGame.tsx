import { useState } from "react";
import type { DecodableWord } from "../data/decodableWords";
import { recordReadingResult } from "../data/readingProgress";
import { useAudio } from "../hooks/useAudio";
import { useTheme } from "../hooks/useTheme";

interface Props {
  word: DecodableWord;
  onDone: () => void;
}

export function TapToBlendGame({ word, onDone }: Props) {
  const { theme } = useTheme();
  const { playPhoneme, speakText } = useAudio();
  const [heard, setHeard] = useState<boolean[]>(() => word.graphemes.map(() => false));
  const [hasBlended, setHasBlended] = useState(false);

  async function handleChunk(index: number) {
    setHeard((items) => items.map((item, i) => i === index ? true : item));
    await playPhoneme(word.audioFiles[index], word.graphemes[index]);
  }

  async function handleBlend() {
    const missed = heard.some((item) => !item);
    setHasBlended(true);
    await speakText(word.word);
    recordReadingResult("tap-blend", word.id, missed);
    setTimeout(onDone, 800);
  }

  return (
    <div className="flex flex-col items-center gap-7 w-full max-w-2xl mx-auto px-4">
      <div
        className="font-bold text-center"
        style={{ color: theme.textMuted, fontSize: "clamp(15px, 3.5vw, 20px)" }}
      >
        Tap the sounds, then blend
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        {word.graphemes.map((chunk, index) => (
          <button
            key={`${word.id}-${chunk}-${index}`}
            onClick={() => handleChunk(index)}
            className="flex items-center justify-center font-bold select-none active:scale-95 transition-transform"
            style={{
              minWidth: "clamp(90px, 22vw, 130px)",
              minHeight: "clamp(90px, 22vw, 130px)",
              paddingInline: "18px",
              borderRadius: theme.optionRadius,
              backgroundColor: heard[index] ? theme.accent : theme.surface,
              color: heard[index] ? theme.accentText : theme.text,
              fontSize: "clamp(38px, 10vw, 62px)",
              boxShadow: heard[index]
                ? `0 8px 28px ${theme.accentShadow}`
                : `0 6px 20px ${theme.surfaceShadow}`,
            }}
            aria-label={`Hear ${chunk}`}
          >
            {chunk}
          </button>
        ))}
      </div>

      <div
        className="font-bold text-center"
        style={{ color: theme.text, fontSize: "clamp(54px, 14vw, 92px)", lineHeight: 1 }}
      >
        {word.word}
      </div>

      <button
        onClick={handleBlend}
        className={`flex items-center justify-center gap-3 select-none active:scale-95 transition-transform ${hasBlended ? theme.correctAnim : ""}`}
        style={{
          minHeight: "88px",
          minWidth: "240px",
          paddingInline: "34px",
          borderRadius: theme.cardRadius,
          backgroundColor: theme.accent,
          color: theme.accentText,
          fontSize: "clamp(20px, 5vw, 30px)",
          fontWeight: "bold",
          boxShadow: `0 8px 30px ${theme.accentShadow}`,
        }}
        aria-label={`Read ${word.word}`}
      >
        <span>Blend</span>
        <span>▶</span>
      </button>
    </div>
  );
}
