import { useCallback, useEffect, useMemo, useState } from "react";
import { CompletionScreen } from "./components/CompletionScreen";
import { LevelCompleteScreen } from "./components/LevelCompleteScreen";
import { MatchGame } from "./components/MatchGame";
import { PhonicsCard } from "./components/PhonicsCard";
import { ProgressDots } from "./components/ProgressDots";
import { MAX_LEVEL, phonemes } from "./data/phonemes";

const SESSION_SIZE = 5;
const LEVEL_KEY     = "phonics_level";
const LEVEL_POS_KEY = "phonics_level_pos";

type Mode = "card" | "game" | "session_complete" | "level_complete";

function readInt(key: string, fallback: number): number {
  const n = parseInt(localStorage.getItem(key) ?? "", 10);
  return isNaN(n) ? fallback : n;
}

function save(key: string, value: number) {
  localStorage.setItem(key, String(value));
}

export default function App() {
  // Persist level (1–6) and position within that level across sessions
  const [currentLevel, setCurrentLevel] = useState(() => {
    const n = readInt(LEVEL_KEY, 1);
    return Math.min(Math.max(n, 1), MAX_LEVEL) as 1 | 2 | 3 | 4 | 5 | 6;
  });
  const [levelPos, setLevelPos] = useState(() => Math.max(readInt(LEVEL_POS_KEY, 0), 0));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted]       = useState(0);
  const [mode, setMode]                 = useState<Mode>("card");

  // All phonemes for the active level, in definition order
  const levelPhonemes = useMemo(
    () => phonemes.filter((p) => p.level === currentLevel),
    [currentLevel]
  );

  // Current session: up to SESSION_SIZE phonemes starting at levelPos
  const sessionPhonemes = useMemo(
    () => levelPhonemes.slice(levelPos, levelPos + SESSION_SIZE),
    [levelPhonemes, levelPos]
  );

  const sessionSize     = sessionPhonemes.length;
  const currentPhoneme  = sessionPhonemes[currentIndex];

  // Block multi-touch zoom on tablets
  useEffect(() => {
    const block = (e: TouchEvent) => { if (e.touches.length > 1) e.preventDefault(); };
    document.addEventListener("touchstart", block, { passive: false });
    return () => document.removeEventListener("touchstart", block);
  }, []);

  const handleCardNext = useCallback(() => setMode("game"), []);

  const handleCorrect = useCallback(() => {
    const newCompleted = completed + 1;
    setCompleted(newCompleted);

    if (newCompleted < sessionSize) {
      // More phonemes left in this session
      setCurrentIndex((i) => i + 1);
      setMode("card");
      return;
    }

    // Session finished — advance position within level
    const newPos = levelPos + sessionSize;
    setLevelPos(newPos);
    save(LEVEL_POS_KEY, newPos);

    if (newPos >= levelPhonemes.length) {
      // All phonemes in this level are done
      setMode("level_complete");
    } else {
      // More phonemes remain in the level — show mid-level celebration
      setMode("session_complete");
    }
  }, [completed, sessionSize, levelPos, levelPhonemes.length]);

  // "Keep Going!" — start the next session within the same level
  const handleSessionNext = useCallback(() => {
    setCurrentIndex(0);
    setCompleted(0);
    setMode("card");
  }, []);

  // "Next Level!" / "Start Over!" — advance to next level (or wrap back to 1)
  const handleLevelNext = useCallback(() => {
    const nextLevel = currentLevel >= MAX_LEVEL
      ? 1
      : ((currentLevel + 1) as 1 | 2 | 3 | 4 | 5 | 6);

    setCurrentLevel(nextLevel);
    setLevelPos(0);
    setCurrentIndex(0);
    setCompleted(0);
    save(LEVEL_KEY, nextLevel);
    save(LEVEL_POS_KEY, 0);
    setMode("card");
  }, [currentLevel]);

  if (mode === "level_complete") {
    return <LevelCompleteScreen level={currentLevel} onNext={handleLevelNext} />;
  }

  if (mode === "session_complete") {
    return <CompletionScreen onPlayAgain={handleSessionNext} label="Keep Going!" />;
  }

  const levelColor = ["#f59e0b", "#10b981", "#3b82f6", "#a855f7", "#ec4899", "#ef4444"][currentLevel - 1];

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: "#0f172a", touchAction: "manipulation" }}
    >
      <header className="flex items-center justify-between px-6 pt-6 pb-2">
        {/* App name + level badge */}
        <div className="flex items-center gap-3">
          <div
            className="font-bold tracking-wide"
            style={{ fontSize: "clamp(16px, 3.5vw, 24px)", color: "#f59e0b" }}
          >
            PhonicsPath
          </div>
          <div
            className="rounded-full font-bold flex items-center justify-center"
            style={{
              backgroundColor: levelColor,
              color: "#0f172a",
              fontSize: "clamp(11px, 2.5vw, 15px)",
              minWidth: "32px",
              height: "32px",
              paddingInline: "10px",
            }}
            aria-label={`Level ${currentLevel}`}
          >
            L{currentLevel}
          </div>
        </div>

        {/* Session progress dots */}
        <ProgressDots total={sessionSize} completed={completed} />
      </header>

      <main className="flex-1 flex items-center justify-center py-6">
        {mode === "card" && currentPhoneme && (
          <PhonicsCard phoneme={currentPhoneme} onNext={handleCardNext} />
        )}
        {mode === "game" && currentPhoneme && (
          <MatchGame phoneme={currentPhoneme} onCorrect={handleCorrect} />
        )}
      </main>
    </div>
  );
}
