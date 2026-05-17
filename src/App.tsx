import { useCallback, useEffect, useMemo, useState } from "react";
import { CompletionScreen } from "./components/CompletionScreen";
import { HomeScreen } from "./components/HomeScreen";
import { LevelCompleteScreen } from "./components/LevelCompleteScreen";
import { LevelSelectScreen } from "./components/LevelSelectScreen";
import { MatchGame } from "./components/MatchGame";
import { PhonicsCard } from "./components/PhonicsCard";
import { ProgressDots } from "./components/ProgressDots";
import { readLevelPos, saveLevelPos } from "./data/levelData";
import { MAX_LEVEL, phonemes } from "./data/phonemes";

const SESSION_SIZE = 5;
const LEVEL_KEY     = "phonics_level";
const LEVEL_POS_KEY = "phonics_level_pos";

type Mode = "home" | "level_select" | "card" | "game" | "session_complete" | "level_complete";

function readInt(key: string, fallback: number): number {
  const n = parseInt(localStorage.getItem(key) ?? "", 10);
  return isNaN(n) ? fallback : n;
}

function save(key: string, value: number) {
  localStorage.setItem(key, String(value));
}

export default function App() {
  const [currentLevel, setCurrentLevel] = useState(() => {
    const n = readInt(LEVEL_KEY, 1);
    return Math.min(Math.max(n, 1), MAX_LEVEL) as 1 | 2 | 3 | 4 | 5 | 6;
  });
  const [levelPos, setLevelPos] = useState(() => Math.max(readLevelPos(currentLevel), 0));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted]       = useState(0);
  const [mode, setMode]                 = useState<Mode>("home");
  const [streak, setStreak]             = useState(0);
  const [successEmoji, setSuccessEmoji] = useState("🌟");

  const levelPhonemes = useMemo(
    () => phonemes.filter((p) => p.level === currentLevel),
    [currentLevel]
  );

  const sessionPhonemes = useMemo(
    () => levelPhonemes.slice(levelPos, levelPos + SESSION_SIZE),
    [levelPhonemes, levelPos]
  );

  const sessionSize    = sessionPhonemes.length;
  const currentPhoneme = sessionPhonemes[currentIndex];

  useEffect(() => {
    const block = (e: TouchEvent) => { if (e.touches.length > 1) e.preventDefault(); };
    document.addEventListener("touchstart", block, { passive: false });
    return () => document.removeEventListener("touchstart", block);
  }, []);

  const handlePlay = useCallback(() => setMode("card"), []);

  const handleChooseLevel = useCallback(() => setMode("level_select"), []);

  const handleSelectLevel = useCallback((level: 1 | 2 | 3 | 4 | 5 | 6) => {
    const pos = readLevelPos(level);
    setCurrentLevel(level);
    setLevelPos(pos);
    setCurrentIndex(0);
    setCompleted(0);
    setStreak(0);
    save(LEVEL_KEY, level);
    save(LEVEL_POS_KEY, pos);
    setMode("card");
  }, []);

  const handleGoHome = useCallback(() => setMode("home"), []);

  const handleCardNext = useCallback(() => setMode("game"), []);

  const handleCorrect = useCallback((emoji: string) => {
    setSuccessEmoji(emoji);
    const newStreak = streak + 1;
    setStreak(newStreak);

    const newCompleted = completed + 1;
    setCompleted(newCompleted);

    if (newCompleted < sessionSize) {
      setCurrentIndex((i) => i + 1);
      setMode("card");
      return;
    }

    const newPos = levelPos + sessionSize;
    setLevelPos(newPos);
    saveLevelPos(currentLevel, newPos);
    save(LEVEL_POS_KEY, newPos);

    if (newPos >= levelPhonemes.length) {
      setMode("level_complete");
    } else {
      setMode("session_complete");
    }
  }, [streak, completed, sessionSize, levelPos, levelPhonemes.length, currentLevel]);

  const handleSessionNext = useCallback(() => {
    setCurrentIndex(0);
    setCompleted(0);
    setMode("card");
  }, []);

  const handleLevelNext = useCallback(() => {
    const nextLevel = currentLevel >= MAX_LEVEL
      ? 1
      : ((currentLevel + 1) as 1 | 2 | 3 | 4 | 5 | 6);

    const nextPos = readLevelPos(nextLevel);
    setCurrentLevel(nextLevel);
    setLevelPos(nextPos);
    setCurrentIndex(0);
    setCompleted(0);
    setStreak(0);
    save(LEVEL_KEY, nextLevel);
    save(LEVEL_POS_KEY, nextPos);
    setMode("card");
  }, [currentLevel]);

  if (mode === "home") {
    return <HomeScreen onPlay={handlePlay} onChooseLevel={handleChooseLevel} />;
  }

  if (mode === "level_select") {
    return (
      <LevelSelectScreen
        currentLevel={currentLevel}
        onSelect={handleSelectLevel}
        onBack={handleGoHome}
      />
    );
  }

  if (mode === "level_complete") {
    return <LevelCompleteScreen level={currentLevel} onNext={handleLevelNext} />;
  }

  if (mode === "session_complete") {
    return (
      <CompletionScreen
        onPlayAgain={handleSessionNext}
        label="Keep Going!"
        emoji={successEmoji}
      />
    );
  }

  const levelColor = ["#f59e0b", "#10b981", "#3b82f6", "#a855f7", "#ec4899", "#ef4444"][currentLevel - 1];

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: "#0f172a", touchAction: "manipulation" }}
    >
      <header className="flex items-center justify-between px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          {/* Home button */}
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center rounded-xl select-none active:scale-95 transition-transform"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#1e293b",
              fontSize: "18px",
            }}
            aria-label="Go to home screen"
          >
            🏠
          </button>
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

        <ProgressDots total={sessionSize} completed={completed} />
      </header>

      <main className="flex-1 flex items-center justify-center py-6">
        {mode === "card" && currentPhoneme && (
          <PhonicsCard phoneme={currentPhoneme} onNext={handleCardNext} />
        )}
        {mode === "game" && currentPhoneme && (
          <MatchGame
            phoneme={currentPhoneme}
            streak={streak}
            onCorrect={handleCorrect}
          />
        )}
      </main>
    </div>
  );
}
