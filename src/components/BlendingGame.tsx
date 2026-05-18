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

interface Choice {
  word: string;
  emoji: string;
  isTarget: boolean;
}

function shuffleChoices(blend: BlendSet): Choice[] {
  const arr: Choice[] = [
    { word: blend.word,                  emoji: blend.emoji,                  isTarget: true  },
    { word: blend.distractors[0].word,   emoji: blend.distractors[0].emoji,   isTarget: false },
    { word: blend.distractors[1].word,   emoji: blend.distractors[1].emoji,   isTarget: false },
  ];
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
  const [litCount, setLitCount]   = useState(0);
  const [allGlow, setAllGlow]     = useState(false);
  const [merging, setMerging]     = useState(false);
  const [correctWord, setCorrectWord] = useState<string | null>(null);
  const [choices, setChoices]     = useState<Choice[]>(() => shuffleChoices(blend));
  const [revealKey, setRevealKey] = useState(0);

  const hasWronged = useRef(false);
  const locked     = useRef(false);

  // Plays every phoneme sequentially, lights each dot, then plays the prompt.
  async function runSequence(
    sounds: string[],
    audioFiles: string[],
    alive: () => boolean,
    reshuffle: boolean
  ) {
    if (reshuffle) {
      setChoices(shuffleChoices(blend));
      setRevealKey((k) => k + 1);
    }
    setPhase("listening");
    setIsPlaying(true);
    setLitCount(0);
    setAllGlow(false);

    for (let i = 0; i < sounds.length; i++) {
      if (!alive()) return;
      await playPhoneme(audioFiles[i], sounds[i]);
      if (!alive()) return;
      setLitCount(i + 1);
      if (i < sounds.length - 1) {
        await new Promise<void>((r) => setTimeout(r, GAP_MS));
      }
    }

    if (!alive()) return;
    // All dots lit — brief glow before prompt
    setAllGlow(true);
    await new Promise<void>((r) => setTimeout(r, 400));
    if (!alive()) return;
    setAllGlow(false);

    await playUrl(`/audio/prompts/blending-prompt.mp3`, "What word do those sounds make?");
    if (!alive()) return;

    setIsPlaying(false);
    await new Promise<void>((r) => setTimeout(r, 500));
    if (!alive()) return;

    locked.current = false;
    setPhase("ready");
  }

  useEffect(() => {
    let live = true;
    const alive = () => live;

    hasWronged.current = false;
    locked.current = false;
    setPhase("listening");
    setIsPlaying(false);
    setLitCount(0);
    setAllGlow(false);
    setMerging(false);
    setCorrectWord(null);
    setChoices(shuffleChoices(blend));
    setRevealKey(0);

    const t = setTimeout(() => { runSequence(blend.sounds, blend.audioFiles, alive, false); }, 400);

    return () => { live = false; clearTimeout(t); stop(); };
  }, [blend.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReplay = () => {
    if (isPlaying || phase !== "ready") return;
    let live = true;
    const alive = () => live;
    runSequence(blend.sounds, blend.audioFiles, alive, false);
  };

  const handleChoice = (choice: Choice) => {
    if (phase !== "ready" || locked.current) return;
    locked.current = true;

    if (choice.isTarget) {
      setCorrectWord(choice.word);
      setMerging(true);

      // After dot merge animation: show merged word
      setTimeout(() => { setMerging(false); setPhase("merged"); }, 420);

      // Success audio plays concurrently with merge animation
      playSuccess(streak).then((emoji) => {
        setTimeout(() => onCorrect(emoji, hasWronged.current), 600);
      });
    } else {
      hasWronged.current = true;
      setPhase("relisten");
      setIsPlaying(true);

      setTimeout(() => {
        let live = true;
        const alive = () => live;
        runSequence(blend.sounds, blend.audioFiles, alive, true);
      }, 500);
    }
  };

  const dotBaseSize = "clamp(50px, 13vw, 62px)";
  const isLit = (i: number) => i < litCount;

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
        {phase === "ready"
          ? "What word do those sounds make?"
          : phase === "merged"
            ? "You blended it! 🎉"
            : "Listen to each sound…"}
      </div>

      {/* Sound dots / merged word area — fixed height so layout doesn't jump */}
      <div
        style={{
          minHeight: "clamp(62px, 16vw, 78px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          width: "100%",
        }}
      >
        {/* Dots row — hidden after merge */}
        {phase !== "merged" && (
          <div className="flex gap-3 justify-center">
            {blend.sounds.map((sound, i) => {
              const lit = isLit(i);
              return (
                <div
                  key={i}
                  className={`
                    flex items-center justify-center rounded-full font-bold select-none
                    ${lit && allGlow ? "dot-pulse-all" : ""}
                    ${lit && !allGlow ? "dot-lit" : ""}
                    ${merging ? "dot-merging" : ""}
                  `}
                  style={{
                    width: dotBaseSize,
                    height: dotBaseSize,
                    backgroundColor: lit ? theme.accent : theme.surface,
                    color: lit ? theme.accentText : theme.textMuted,
                    boxShadow: lit
                      ? `0 4px 18px ${theme.accentShadow}`
                      : `0 2px 8px ${theme.surfaceShadow}`,
                    fontSize: "clamp(14px, 3.5vw, 20px)",
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

        {/* Merged word — appears after dots animate away */}
        {phase === "merged" && correctWord && (
          <div
            className="word-burst flex items-center gap-3"
            style={{ fontSize: "clamp(36px, 9vw, 54px)", fontWeight: "bold", color: theme.text }}
          >
            <span>{correctWord}</span>
            <span style={{ fontSize: "clamp(32px, 8vw, 48px)" }}>{blend.emoji}</span>
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
          width: "96px",
          height: "96px",
          backgroundColor: theme.accent,
          fontSize: "42px",
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
          marginTop: "-8px",
          transition: "color 0.3s",
          textAlign: "center",
        }}
      >
        {isPlaying
          ? "Listening…"
          : phase === "ready"
            ? "Tap the word!"
            : ""}
      </div>

      {/* Relisten message */}
      {phase === "relisten" && (
        <div
          className="flex flex-col items-center gap-2 rounded-3xl px-8 py-5"
          style={{
            backgroundColor: theme.relistenBg,
            border: `2px solid ${theme.relistenBorder}`,
            minWidth: "260px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "32px" }}>👂</div>
          <div style={{ fontSize: "clamp(16px, 3.5vw, 20px)", color: theme.relistenText }}>
            Listen again — what's the word?
          </div>
        </div>
      )}

      {/* Word + emoji choice cards */}
      {phase === "ready" && (
        <div className="flex gap-3 justify-center">
          {choices.map((choice, i) => {
            const isCorrect = choice.word === correctWord;
            return (
              <button
                key={`${revealKey}-${choice.word}`}
                onClick={() => handleChoice(choice)}
                className={`flex flex-col items-center justify-center gap-2 font-bold select-none slide-up ${
                  isCorrect ? theme.correctAnim : ""
                }`}
                style={{
                  width: "clamp(96px, 27vw, 118px)",
                  minHeight: "108px",
                  backgroundColor: isCorrect ? theme.correctColor : theme.surface,
                  color: isCorrect ? "#ffffff" : theme.text,
                  borderRadius: "16px",
                  boxShadow: `0 4px 16px ${theme.surfaceShadow}`,
                  animationDelay: `${i * 100}ms`,
                  transition: "background-color 0.2s",
                  paddingInline: "8px",
                }}
                aria-label={`Choose ${choice.word}`}
              >
                <span style={{ fontSize: "clamp(28px, 7vw, 38px)" }}>{choice.emoji}</span>
                <span style={{ fontSize: "clamp(15px, 3.8vw, 20px)" }}>{choice.word}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
