import { useRef, useState } from "react";
import type { DecodableWord } from "../data/decodableWords";
import { recordReadingResult } from "../data/readingProgress";
import { useAudio } from "../hooks/useAudio";
import { useTheme } from "../hooks/useTheme";

interface Props {
  word: DecodableWord;
  onDone: () => void;
}

export function WordBuilderGame({ word, onDone }: Props) {
  const { theme } = useTheme();
  const { playPhoneme, speakText } = useAudio();
  const [slots, setSlots] = useState<Array<string | null>>(() => word.graphemes.map(() => null));
  const [used, setUsed] = useState<Set<number>>(() => new Set());
  const [hint, setHint] = useState("Build the word");
  const [softResetKey, setSoftResetKey] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const hadMiss = useRef(false);

  const nextIndex = slots.findIndex((slot) => slot === null);
  const tileSize = "clamp(76px, 18vw, 112px)";

  async function handleTile(tile: string, index: number) {
    if (isComplete || used.has(index) || nextIndex === -1) return;

    const expected = word.graphemes[nextIndex];
    const tileIndex = word.graphemes.findIndex((chunk) => chunk === tile);
    const audioFile = tileIndex >= 0 ? word.audioFiles[tileIndex] : `${tile}.mp3`;
    await playPhoneme(audioFile, tile);

    if (tile !== expected) {
      hadMiss.current = true;
      setHint("Listen for the next sound");
      setSoftResetKey((key) => key + 1);
      return;
    }

    const nextSlots = [...slots];
    const nextUsed = new Set(used);
    nextSlots[nextIndex] = tile;
    nextUsed.add(index);
    setSlots(nextSlots);
    setUsed(nextUsed);
    setHint(nextSlots.every(Boolean) ? "Blend it together" : "Keep building");

    if (nextSlots.every(Boolean)) {
      setIsComplete(true);
      await speakText(word.word);
      recordReadingResult("word-builder", word.id, hadMiss.current);
      setTimeout(onDone, 900);
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-2xl mx-auto px-4">
      <button
        onClick={() => speakText(word.word)}
        className="flex items-center justify-center gap-3 select-none active:scale-95 transition-transform"
        style={{
          minHeight: "72px",
          minWidth: "220px",
          paddingInline: "28px",
          borderRadius: theme.cardRadius,
          backgroundColor: theme.headerButtonBg,
          border: `3px solid ${theme.accent}`,
          color: theme.accent,
          fontSize: "clamp(18px, 4vw, 26px)",
          fontWeight: "bold",
        }}
        aria-label={`Hear the word ${word.word}`}
      >
        <span>Hear</span>
        <span style={{ fontSize: "1.3em" }}>🔊</span>
      </button>

      <div
        className="font-bold text-center"
        style={{ color: theme.text, fontSize: "clamp(56px, 15vw, 96px)", lineHeight: 1 }}
      >
        {word.word}
      </div>

      <div className="flex gap-3 justify-center flex-wrap" aria-label="Word slots">
        {slots.map((slot, index) => (
          <div
            key={`${word.id}-slot-${index}`}
            className="flex items-center justify-center font-bold"
            style={{
              width: tileSize,
              height: tileSize,
              borderRadius: theme.optionRadius,
              border: `4px solid ${slot ? theme.accent : theme.textMuted}`,
              backgroundColor: slot ? theme.surface : "transparent",
              color: theme.text,
              fontSize: "clamp(30px, 8vw, 48px)",
              boxShadow: slot ? `0 6px 20px ${theme.surfaceShadow}` : "none",
            }}
          >
            {slot ?? ""}
          </div>
        ))}
      </div>

      <div
        key={softResetKey}
        className={softResetKey > 0 ? theme.wrongAnim : ""}
        style={{
          color: softResetKey > 0 ? theme.relistenText : theme.textMuted,
          minHeight: "24px",
          fontSize: "clamp(14px, 3vw, 18px)",
          textAlign: "center",
        }}
      >
        {hint}
      </div>

      <div className="flex gap-3 justify-center flex-wrap" aria-label="Sound tiles">
        {word.tilePool.map((tile, index) => {
          const isUsed = used.has(index);
          return (
            <button
              key={`${word.id}-${tile}-${index}`}
              onClick={() => handleTile(tile, index)}
              className="flex items-center justify-center font-bold select-none active:scale-95 transition-transform slide-up"
              style={{
                width: tileSize,
                height: tileSize,
                borderRadius: theme.optionRadius,
                backgroundColor: isUsed ? theme.headerButtonBg : theme.surface,
                color: isUsed ? theme.textMuted : theme.text,
                opacity: isUsed ? 0.45 : 1,
                fontSize: "clamp(28px, 7vw, 44px)",
                boxShadow: `0 5px 18px ${theme.surfaceShadow}`,
              }}
              disabled={isUsed || isComplete}
              aria-label={`Place ${tile}`}
            >
              {tile}
            </button>
          );
        })}
      </div>
    </div>
  );
}
