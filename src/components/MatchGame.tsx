import { useEffect, useMemo, useRef, useState } from "react";
import type { Phoneme } from "../data/phonemes";
import { useAudio } from "../hooks/useAudio";

interface Props {
  phoneme: Phoneme;
  onCorrect: () => void;
}

type ChoiceState = "idle" | "correct" | "wrong";

export function MatchGame({ phoneme, onCorrect }: Props) {
  const { playPhoneme, playSuccess, stop } = useAudio();
  const [states, setStates] = useState<Record<string, ChoiceState>>({});
  const [locked, setLocked] = useState(false);
  const hasPlayed = useRef(false);

  const choices = useMemo(() => {
    const all = [phoneme.display, ...phoneme.distractors];
    // Fisher-Yates shuffle
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return all;
  }, [phoneme]);

  useEffect(() => {
    hasPlayed.current = false;
    setStates({});
    setLocked(false);
  }, [phoneme.id]);

  useEffect(() => {
    if (!hasPlayed.current) {
      hasPlayed.current = true;
      const t = setTimeout(() => playPhoneme(phoneme.audioFile, phoneme.display), 300);
      return () => clearTimeout(t);
    }
    return () => stop();
  }, [phoneme, playPhoneme, stop]);

  const handleChoice = (choice: string) => {
    if (locked) return;

    if (choice === phoneme.display) {
      setStates({ [choice]: "correct" });
      setLocked(true);
      playSuccess().then(() => setTimeout(onCorrect, 1500));
    } else {
      setStates((prev) => ({ ...prev, [choice]: "wrong" }));
      setTimeout(() => {
        setStates((prev) => ({ ...prev, [choice]: "idle" }));
      }, 600);
    }
  };

  const replayAudio = () => playPhoneme(phoneme.audioFile, phoneme.display);

  const getBorderColor = (choice: string) => {
    const state = states[choice] ?? "idle";
    if (state === "correct") return "#10b981";
    if (state === "wrong") return "transparent";
    return "transparent";
  };

  const getBg = (choice: string) => {
    const state = states[choice] ?? "idle";
    if (state === "correct") return "#10b981";
    return "#fefce8";
  };

  const getTextColor = (choice: string) => {
    const state = states[choice] ?? "idle";
    if (state === "correct") return "#fff";
    return "#0f172a";
  };

  const getAnimClass = (choice: string) => {
    const state = states[choice] ?? "idle";
    if (state === "wrong") return "shake";
    if (state === "correct") return "correct-flash";
    return "";
  };

  return (
    <div className="flex flex-col items-center justify-center gap-10 w-full max-w-lg mx-auto px-4">
      {/* Replay button */}
      <button
        onClick={replayAudio}
        className="flex items-center justify-center rounded-full select-none active:scale-95 transition-transform duration-150"
        style={{
          width: "120px",
          height: "120px",
          backgroundColor: "#f59e0b",
          fontSize: "52px",
          boxShadow: "0 8px 28px rgba(245,158,11,0.45)",
        }}
        aria-label="Replay the sound"
      >
        🔊
      </button>

      {/* Instruction hint — icon only, no text needed */}
      <div style={{ fontSize: "32px", opacity: 0.6 }}>👇</div>

      {/* Choice buttons */}
      <div className="flex gap-6 justify-center flex-wrap">
        {choices.map((choice) => (
          <button
            key={choice}
            onClick={() => handleChoice(choice)}
            className={`flex items-center justify-center rounded-2xl font-bold select-none transition-colors duration-200 ${getAnimClass(choice)}`}
            style={{
              minWidth: "100px",
              minHeight: "100px",
              width: "clamp(100px, 22vw, 150px)",
              height: "clamp(100px, 22vw, 150px)",
              fontSize: "clamp(32px, 8vw, 52px)",
              backgroundColor: getBg(choice),
              color: getTextColor(choice),
              border: `4px solid ${getBorderColor(choice)}`,
              boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
            }}
            aria-label={`Choose ${choice}`}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
