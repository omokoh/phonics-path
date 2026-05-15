import { useCallback, useEffect, useMemo, useState } from "react";
import { CompletionScreen } from "./components/CompletionScreen";
import { MatchGame } from "./components/MatchGame";
import { PhonicsCard } from "./components/PhonicsCard";
import { ProgressDots } from "./components/ProgressDots";
import { phonemes } from "./data/phonemes";

const SESSION_SIZE = 5;
const OFFSET_KEY = "phonicsOffset";

type Mode = "card" | "game" | "complete";

function getSessionPhonemes() {
  const raw = localStorage.getItem(OFFSET_KEY);
  const offset = raw !== null ? parseInt(raw, 10) : 0;
  const safeOffset = isNaN(offset) ? 0 : offset % phonemes.length;
  const end = safeOffset + SESSION_SIZE;
  if (end <= phonemes.length) return phonemes.slice(safeOffset, end);
  return [...phonemes.slice(safeOffset), ...phonemes.slice(0, end - phonemes.length)].slice(0, SESSION_SIZE);
}

function advanceOffset() {
  const raw = localStorage.getItem(OFFSET_KEY);
  const offset = raw !== null ? parseInt(raw, 10) : 0;
  const next = (offset + SESSION_SIZE) % phonemes.length;
  localStorage.setItem(OFFSET_KEY, String(next));
}

export default function App() {
  const [sessionPhonemes, setSessionPhonemes] = useState(() => getSessionPhonemes());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [mode, setMode] = useState<Mode>("card");

  const currentPhoneme = useMemo(
    () => sessionPhonemes[currentIndex],
    [sessionPhonemes, currentIndex]
  );

  // Block multi-touch zoom on tablets
  useEffect(() => {
    const block = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    document.addEventListener("touchstart", block, { passive: false });
    return () => document.removeEventListener("touchstart", block);
  }, []);

  const handleCardNext = useCallback(() => setMode("game"), []);

  const handleCorrect = useCallback(() => {
    const newCompleted = completed + 1;
    setCompleted(newCompleted);
    if (newCompleted >= SESSION_SIZE) {
      advanceOffset();
      setMode("complete");
    } else {
      setCurrentIndex((i) => i + 1);
      setMode("card");
    }
  }, [completed]);

  const handlePlayAgain = useCallback(() => {
    setSessionPhonemes(getSessionPhonemes());
    setCurrentIndex(0);
    setCompleted(0);
    setMode("card");
  }, []);

  if (mode === "complete") {
    return <CompletionScreen onPlayAgain={handlePlayAgain} />;
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: "#0f172a", touchAction: "manipulation" }}
    >
      <header className="flex items-center justify-between px-6 pt-6 pb-2">
        <div
          className="font-bold tracking-wide"
          style={{ fontSize: "clamp(18px, 4vw, 26px)", color: "#f59e0b" }}
        >
          PhonicsPath
        </div>
        <ProgressDots total={SESSION_SIZE} completed={completed} />
      </header>

      <main className="flex-1 flex items-center justify-center py-6">
        {mode === "card" && (
          <PhonicsCard phoneme={currentPhoneme} onNext={handleCardNext} />
        )}
        {mode === "game" && (
          <MatchGame phoneme={currentPhoneme} onCorrect={handleCorrect} />
        )}
      </main>
    </div>
  );
}
