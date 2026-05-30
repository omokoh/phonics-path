import { useEffect, useRef, useState } from "react";
import type { RhymeSet } from "../data/rhymes";
import { useAudio } from "../hooks/useAudio";
import { useTheme } from "../hooks/useTheme";

interface Props {
  rhyme: RhymeSet;
  streak: number;
  onCorrect: (emoji: string, neededReview: boolean) => void;
}

type Phase = "listening" | "ready" | "relisten";

interface Choice {
  word: string;
  isRhyme: boolean;
}

function shuffleChoices(rhyme: RhymeSet): Choice[] {
  const arr: Choice[] = [
    { word: rhyme.rhymeWord,       isRhyme: true  },
    { word: rhyme.distractors[0],  isRhyme: false },
    { word: rhyme.distractors[1],  isRhyme: false },
  ];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function RhymeGame({ rhyme, streak, onCorrect }: Props) {
  const { playUrl, speakText, playSuccess, stop } = useAudio();
  const { theme } = useTheme();

  const [phase, setPhase]         = useState<Phase>("listening");
  const [isPlaying, setIsPlaying] = useState(false);
  const [correctWord, setCorrectWord] = useState<string | null>(null);
  const [choices, setChoices]     = useState<Choice[]>(() => shuffleChoices(rhyme));
  const [revealKey, setRevealKey] = useState(0);

  const hasWronged = useRef(false);
  const locked     = useRef(false);

  // Play word → gap → prompt → gap → reveal choices
  async function runSequence(
    targetWord: string,
    alive: () => boolean,
    reshuffle: boolean
  ) {
    if (reshuffle) {
      setChoices(shuffleChoices(rhyme));
      setRevealKey((k) => k + 1);
    }
    setPhase("listening");
    setIsPlaying(true);

    await playUrl(`/audio/rhymes/${targetWord}.mp3`, targetWord);
    if (!alive()) return;

    await new Promise<void>((r) => setTimeout(r, 500));
    if (!alive()) return;

    await speakText(`Which word rhymes with ${targetWord}?`);
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

    const t = setTimeout(() => { runSequence(rhyme.targetWord, alive, false); }, 300);

    return () => { live = false; clearTimeout(t); stop(); };
  }, [rhyme.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReplay = () => {
    if (isPlaying || phase !== "ready") return;
    setIsPlaying(true);
    playUrl(`/audio/rhymes/${rhyme.targetWord}.mp3`, rhyme.targetWord).then(() =>
      setIsPlaying(false)
    );
  };

  const handleChoice = (choice: Choice) => {
    if (phase !== "ready" || locked.current) return;
    locked.current = true;

    if (choice.isRhyme) {
      setCorrectWord(choice.word);
      playSuccess(streak).then((emoji) => {
        setTimeout(() => onCorrect(emoji, hasWronged.current), 1500);
      });
    } else {
      hasWronged.current = true;
      setPhase("relisten");
      setIsPlaying(true);

      // Re-play sequence after a short pause to let the child register the mistake
      setTimeout(() => {
        const alive = () => true;
        runSequence(rhyme.targetWord, alive, true);
      }, 500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto px-4">

      {/* Instruction label */}
      <div
        style={{
          fontSize: "clamp(14px, 3vw, 18px)",
          color: theme.textMuted,
          textAlign: "center",
          minHeight: "24px",
        }}
      >
        {phase === "ready" ? "Which word rhymes with…" : "Listen carefully…"}
      </div>

      {/* Target word */}
      <div
        className="font-bold"
        style={{
          fontSize: "clamp(52px, 13vw, 88px)",
          color: theme.text,
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {rhyme.targetWord}
      </div>

      {/* Speaker button */}
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
          width: "100px",
          height: "100px",
          backgroundColor: theme.accent,
          fontSize: "44px",
          boxShadow: `0 8px 28px ${theme.accentShadow}`,
          flexShrink: 0,
          cursor: isPlaying || phase !== "ready" ? "default" : "pointer",
        }}
        aria-label={isPlaying ? "Playing sound" : "Listen again"}
      >
        🔊
      </button>

      {/* Status hint */}
      <div
        style={{
          fontSize: "clamp(13px, 2.5vw, 16px)",
          color: isPlaying ? theme.accent : theme.textMuted,
          minHeight: "20px",
          transition: "color 0.3s",
          textAlign: "center",
          marginTop: "-8px",
        }}
      >
        {isPlaying ? "Listening…" : phase === "ready" ? "Tap the word that rhymes" : ""}
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
          <div
            style={{
              fontSize: "clamp(16px, 3.5vw, 20px)",
              color: theme.relistenText,
            }}
          >
            Try again — listen carefully!
          </div>
        </div>
      )}

      {/* Word choice buttons */}
      {phase === "ready" && (
        <div className="flex flex-col gap-3 w-full" style={{ maxWidth: "320px" }}>
          {choices.map((choice, i) => {
            const isCorrect = choice.word === correctWord;
            return (
              <button
                key={`${revealKey}-${choice.word}`}
                onClick={() => handleChoice(choice)}
                className={`font-bold select-none slide-up ${isCorrect ? theme.correctAnim : ""}`}
                style={{
                  width: "100%",
                  minHeight: "72px",
                  fontSize: "clamp(22px, 5vw, 30px)",
                  backgroundColor: isCorrect ? theme.correctColor : theme.surface,
                  color: isCorrect ? "#ffffff" : theme.text,
                  border: "3px solid transparent",
                  borderRadius: "16px",
                  boxShadow: `0 4px 16px ${theme.surfaceShadow}`,
                  animationDelay: `${i * 110}ms`,
                  transition: "background-color 0.2s",
                  letterSpacing: "0.01em",
                }}
                aria-label={`Choose ${choice.word}`}
              >
                {choice.word}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
