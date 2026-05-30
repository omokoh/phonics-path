import { useEffect, useRef, useState } from "react";
import type { BlendSet } from "../data/blending";
import { useAudio } from "../hooks/useAudio";
import { useTheme } from "../hooks/useTheme";

interface Props {
  blend: BlendSet;
  streak: number;
  onCorrect: (emoji: string, neededReview: boolean) => void;
}

type Phase = "listening" | "ready" | "relisten" | "merged";

function shuffleChoices(word: string, distractors: string[]): string[] {
  const arr = [word, ...distractors];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const GAP_MS = 600;

export function BlendingGame({ blend, streak, onCorrect }: Props) {
  const { playPhoneme, playUrl, playSuccess, stop } = useAudio();
  const { theme } = useTheme();

  const [phase, setPhase]         = useState<Phase>("listening");
  const [isPlaying, setIsPlaying] = useState(false);
  const [litIndex, setLitIndex]   = useState(-1);
  const [merging, setMerging]     = useState(false);
  const [correctWord, setCorrectWord] = useState<string | null>(null);
  const [choices, setChoices]     = useState<string[]>(() => shuffleChoices(blend.word, blend.distractors));
  const [revealKey, setRevealKey] = useState(0);

  const hasWronged = useRef(false);
  const locked     = useRef(false);

  async function runSequence(
    sounds: string[],
    audioFiles: string[],
    alive: () => boolean,
    reshuffle: boolean
  ) {
    if (reshuffle) {
      setChoices(shuffleChoices(blend.word, blend.distractors));
      setRevealKey((k) => k + 1);
    }
    setPhase("listening");
    setIsPlaying(true);
    setLitIndex(-1);
    setMerging(false);

    for (let i = 0; i < sounds.length; i++) {
      if (!alive()) return;
      setLitIndex(i);
      await playPhoneme(audioFiles[i], sounds[i]);
      if (!alive()) return;
      setLitIndex(-1);
      if (i < sounds.length - 1) {
        await new Promise<void>((r) => setTimeout(r, GAP_MS));
      }
    }

    if (!alive()) return;
    await new Promise<void>((r) => setTimeout(r, 300));
    if (!alive()) return;

    await playUrl(`/audio/prompts/blending-prompt.mp3`, "What sound do these make together?");
    if (!alive()) return;

    setIsPlaying(false);
    await new Promise<void>((r) => setTimeout(r, 400));
    if (!alive()) return;

    locked.current = false;
    setPhase("ready");
  }

  useEffect(() => {
    let live = true;
    const alive = () => live;

    const t = setTimeout(() => { runSequence(blend.sounds, blend.audioFiles, alive, false); }, 400);

    return () => { live = false; clearTimeout(t); stop(); };
  }, [blend.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReplay = () => {
    if (isPlaying || phase !== "ready") return;
    runSequence(blend.sounds, blend.audioFiles, () => true, false);
  };

  const handleChoice = (word: string) => {
    if (phase !== "ready" || locked.current) return;
    locked.current = true;

    if (word === blend.word) {
      setCorrectWord(word);
      setMerging(true);
      setTimeout(() => { setMerging(false); setPhase("merged"); }, 420);
      playSuccess(streak).then((emoji) => {
        setTimeout(() => onCorrect(emoji, hasWronged.current), 600);
      });
    } else {
      hasWronged.current = true;
      setPhase("relisten");
      setIsPlaying(true);
      setTimeout(() => {
        runSequence(blend.sounds, blend.audioFiles, () => true, true);
      }, 500);
    }
  };

  const cardSize = "clamp(64px, 18vw, 88px)";

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto px-4">

      {/* Instruction label */}
      <div
        style={{
          fontSize: "clamp(14px, 3vw, 18px)",
          color: theme.textMuted,
          textAlign: "center",
          minHeight: "22px",
        }}
      >
        {phase === "merged"
          ? "You blended it! 🎉"
          : phase === "ready"
            ? "What sound do these make together?"
            : "Listen to each sound…"}
      </div>

      {/* Phoneme cards / merged word — fixed height so layout stays stable */}
      <div
        style={{
          minHeight: "clamp(64px, 18vw, 96px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {phase !== "merged" && (
          <div className="flex gap-4 justify-center">
            {blend.sounds.map((sound, i) => {
              const lit = i === litIndex;
              return (
                <div
                  key={i}
                  className={`
                    flex items-center justify-center rounded-2xl font-bold select-none
                    ${lit ? "dot-lit" : ""}
                    ${merging ? "dot-merging" : ""}
                  `}
                  style={{
                    width: cardSize,
                    height: cardSize,
                    backgroundColor: lit ? theme.accent : theme.surface,
                    color: lit ? theme.accentText : theme.text,
                    boxShadow: lit
                      ? `0 4px 24px ${theme.accentShadow}`
                      : `0 2px 10px ${theme.surfaceShadow}`,
                    fontSize: "clamp(20px, 5vw, 28px)",
                    transition: "background-color 0.15s, color 0.15s, box-shadow 0.15s",
                    animationDelay: merging ? `${i * 45}ms` : "0ms",
                  }}
                >
                  {sound}
                </div>
              );
            })}
          </div>
        )}

        {phase === "merged" && correctWord && (
          <div
            className="word-burst"
            style={{
              fontSize: "clamp(48px, 12vw, 72px)",
              fontWeight: "bold",
              color: theme.text,
              textAlign: "center",
            }}
          >
            {correctWord}
          </div>
        )}
      </div>

      {/* Speaker replay button */}
      <button
        onClick={handleReplay}
        className={`flex items-center justify-center rounded-full select-none ${
          isPlaying
            ? "speaker-pulse"
            : phase === "ready"
              ? "active:scale-95 transition-transform duration-150"
              : ""
        }`}
        style={{
          width: "88px",
          height: "88px",
          backgroundColor: theme.accent,
          fontSize: "38px",
          boxShadow: `0 8px 28px ${theme.accentShadow}`,
          flexShrink: 0,
          cursor: isPlaying || phase !== "ready" ? "default" : "pointer",
        }}
        aria-label={isPlaying ? "Playing sounds" : "Listen again"}
      >
        🔊
      </button>

      {/* Status hint */}
      <div
        style={{
          fontSize: "clamp(13px, 2.5vw, 16px)",
          color: isPlaying ? theme.accent : theme.textMuted,
          minHeight: "20px",
          marginTop: "-10px",
          transition: "color 0.3s",
          textAlign: "center",
        }}
      >
        {isPlaying
          ? "Listening…"
          : phase === "ready"
            ? "Tap the blend!"
            : ""}
      </div>

      {/* Relisten message */}
      {phase === "relisten" && (
        <div
          className="flex flex-col items-center gap-2 rounded-3xl px-8 py-5"
          style={{
            backgroundColor: theme.relistenBg,
            border: `2px solid ${theme.relistenBorder}`,
            minWidth: "240px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "28px" }}>👂</div>
          <div style={{ fontSize: "clamp(15px, 3.2vw, 18px)", color: theme.relistenText }}>
            Listen again — what's the blend?
          </div>
        </div>
      )}

      {/* Text-only choice buttons */}
      {phase === "ready" && (
        <div className="flex gap-3 justify-center">
          {choices.map((word, i) => {
            const isCorrect = word === correctWord;
            return (
              <button
                key={`${revealKey}-${word}`}
                onClick={() => handleChoice(word)}
                className={`flex items-center justify-center font-bold select-none slide-up ${
                  isCorrect ? theme.correctAnim : ""
                }`}
                style={{
                  width: "clamp(90px, 25vw, 112px)",
                  minHeight: "76px",
                  backgroundColor: isCorrect ? theme.correctColor : theme.surface,
                  color: isCorrect ? "#ffffff" : theme.text,
                  borderRadius: "16px",
                  boxShadow: `0 4px 16px ${theme.surfaceShadow}`,
                  fontSize: "clamp(22px, 5.5vw, 30px)",
                  animationDelay: `${i * 100}ms`,
                  transition: "background-color 0.2s",
                  letterSpacing: "0.02em",
                }}
                aria-label={`Choose ${word}`}
              >
                {word}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
