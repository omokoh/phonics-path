import { useCallback, useEffect, useMemo, useState } from "react";
import { CompletionScreen } from "./components/CompletionScreen";
import { GrandCelebrationScreen } from "./components/GrandCelebrationScreen";
import { HomeScreen } from "./components/HomeScreen";
import { LevelCompleteScreen } from "./components/LevelCompleteScreen";
import { LevelSelectScreen } from "./components/LevelSelectScreen";
import { MatchGame } from "./components/MatchGame";
import { PhonicsCard } from "./components/PhonicsCard";
import { ProgressDots } from "./components/ProgressDots";
import { ThemeBg } from "./components/ThemeBg";
import { LEVEL_META, levelPosKey, readLevelPos, saveLevelPos } from "./data/levelData";
import { MAX_LEVEL, phonemes, type Phoneme } from "./data/phonemes";
import { useTheme } from "./hooks/useTheme";

const SESSION_SIZE   = 5;
const LEVEL_KEY      = "phonics_level";
const LEVEL_POS_KEY  = "phonics_level_pos";

type Mode =
  | "home" | "level_select"
  | "card" | "game"
  | "session_complete" | "level_complete" | "grand_complete";

function readInt(key: string, fallback: number): number {
  const n = parseInt(localStorage.getItem(key) ?? "", 10);
  return isNaN(n) ? fallback : n;
}

function save(key: string, value: number) {
  localStorage.setItem(key, String(value));
}

// If a level's saved position is at or beyond its total, restart it from 0.
function effectivePos(level: number): number {
  const meta = LEVEL_META[level - 1];
  const raw  = readLevelPos(level);
  if (raw >= meta.total) { saveLevelPos(level, 0); return 0; }
  return raw;
}

export default function App() {
  const { theme } = useTheme();

  const [currentLevel, setCurrentLevel] = useState(() => {
    const n = readInt(LEVEL_KEY, 1);
    return Math.min(Math.max(n, 1), MAX_LEVEL) as 1 | 2 | 3 | 4 | 5 | 6;
  });
  const [levelPos, setLevelPos]         = useState(() => effectivePos(currentLevel));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted]       = useState(0);
  const [mode, setMode]                 = useState<Mode>("home");
  const [streak, setStreak]             = useState(0);
  const [successEmoji, setSuccessEmoji] = useState("🌟");

  // Review session: phonemes the child got wrong at least once this session
  const [needsReviewIds, setNeedsReviewIds] = useState<string[]>([]);
  const [reviewPhonemes, setReviewPhonemes] = useState<Phoneme[] | null>(null);
  const [isReview, setIsReview]             = useState(false);

  const levelPhonemes = useMemo(
    () => phonemes.filter((p) => p.level === currentLevel),
    [currentLevel]
  );

  const sessionPhonemes = useMemo(
    () => levelPhonemes.slice(levelPos, levelPos + SESSION_SIZE),
    [levelPhonemes, levelPos]
  );

  const activePhonemes = reviewPhonemes ?? sessionPhonemes;
  const sessionSize    = activePhonemes.length;
  const currentPhoneme = activePhonemes[currentIndex];

  useEffect(() => {
    const block = (e: TouchEvent) => { if (e.touches.length > 1) e.preventDefault(); };
    document.addEventListener("touchstart", block, { passive: false });
    return () => document.removeEventListener("touchstart", block);
  }, []);

  // Safety net: if card/game mode ends up with no phoneme to show,
  // route to grand_complete (level 6) or level_complete (levels 1–5).
  useEffect(() => {
    if ((mode === "card" || mode === "game") && !isReview && sessionPhonemes.length === 0) {
      setMode(currentLevel >= MAX_LEVEL ? "grand_complete" : "level_complete");
    }
  }, [mode, isReview, sessionPhonemes.length, currentLevel]);

  // ── Navigation handlers ──────────────────────────────────────────────

  const handlePlay         = useCallback(() => setMode("card"), []);
  const handleChooseLevel  = useCallback(() => setMode("level_select"), []);
  const handleGoHome       = useCallback(() => setMode("home"), []);
  const handleCardNext     = useCallback(() => setMode("game"), []);

  const handleSelectLevel  = useCallback((level: 1 | 2 | 3 | 4 | 5 | 6) => {
    const pos = effectivePos(level);
    setCurrentLevel(level);
    setLevelPos(pos);
    setCurrentIndex(0);
    setCompleted(0);
    setStreak(0);
    setNeedsReviewIds([]);
    setReviewPhonemes(null);
    setIsReview(false);
    save(LEVEL_KEY, level);
    save(LEVEL_POS_KEY, pos);
    setMode("card");
  }, []);

  const handleCorrect = useCallback((emoji: string, neededReview: boolean) => {
    setSuccessEmoji(emoji);
    setStreak((s) => s + 1);

    const newCompleted = completed + 1;
    setCompleted(newCompleted);

    // ── Review round ────────────────────────────────────────────────
    if (isReview) {
      if (newCompleted < (reviewPhonemes?.length ?? 0)) {
        setCurrentIndex((i) => i + 1);
        setMode("card");
        return;
      }
      setReviewPhonemes(null);
      setNeedsReviewIds([]);
      setIsReview(false);
      setMode("session_complete");
      return;
    }

    // ── Normal round ────────────────────────────────────────────────
    const updatedReviewIds = neededReview
      ? [...needsReviewIds, currentPhoneme.id]
      : needsReviewIds;
    if (neededReview) setNeedsReviewIds(updatedReviewIds);

    if (newCompleted < sessionSize) {
      setCurrentIndex((i) => i + 1);
      setMode("card");
      return;
    }

    // Session complete — advance level position
    const newPos = levelPos + sessionSize;
    setLevelPos(newPos);
    saveLevelPos(currentLevel, newPos);
    save(LEVEL_POS_KEY, newPos);

    // Level fully done?
    if (newPos >= levelPhonemes.length) {
      setMode(currentLevel >= MAX_LEVEL ? "grand_complete" : "level_complete");
      return;
    }

    // Review round before session_complete?
    if (updatedReviewIds.length > 0) {
      const reviewList = phonemes.filter((p) => updatedReviewIds.includes(p.id));
      setReviewPhonemes(reviewList);
      setIsReview(true);
      setCurrentIndex(0);
      setCompleted(0);
      setNeedsReviewIds([]);
      setMode("card");
      return;
    }

    setMode("session_complete");
  }, [
    completed, isReview, reviewPhonemes, needsReviewIds,
    currentPhoneme, sessionSize, levelPos, levelPhonemes.length, currentLevel,
  ]);

  const handleSessionNext = useCallback(() => {
    setCurrentIndex(0);
    setCompleted(0);
    setNeedsReviewIds([]);
    setReviewPhonemes(null);
    setIsReview(false);
    setMode("card");
  }, []);

  const handleLevelNext = useCallback(() => {
    const next = currentLevel >= MAX_LEVEL
      ? 1
      : ((currentLevel + 1) as 1 | 2 | 3 | 4 | 5 | 6);
    const pos = effectivePos(next);
    setCurrentLevel(next);
    setLevelPos(pos);
    setCurrentIndex(0);
    setCompleted(0);
    setStreak(0);
    setNeedsReviewIds([]);
    setReviewPhonemes(null);
    setIsReview(false);
    save(LEVEL_KEY, next);
    save(LEVEL_POS_KEY, pos);
    setMode("card");
  }, [currentLevel]);

  // Grand celebration: wipe all progress, go home
  const handleGrandReset = useCallback(() => {
    for (let l = 1; l <= MAX_LEVEL; l++) localStorage.removeItem(levelPosKey(l));
    localStorage.removeItem(LEVEL_KEY);
    localStorage.removeItem(LEVEL_POS_KEY);
    localStorage.removeItem("phonics_parent_unlocked");

    setCurrentLevel(1);
    setLevelPos(0);
    setCurrentIndex(0);
    setCompleted(0);
    setStreak(0);
    setNeedsReviewIds([]);
    setReviewPhonemes(null);
    setIsReview(false);
    setSuccessEmoji("🌟");
    setMode("home");
  }, []);

  const handleGrandChooseLevel = useCallback(() => setMode("level_select"), []);

  // ── Screen routing ───────────────────────────────────────────────────

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

  if (mode === "grand_complete") {
    return (
      <GrandCelebrationScreen
        onReset={handleGrandReset}
        onChooseLevel={handleGrandChooseLevel}
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

  const levelColor = ["#f59e0b","#10b981","#3b82f6","#a855f7","#ec4899","#ef4444"][currentLevel - 1];

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: theme.bg, touchAction: "manipulation", position: "relative" }}
    >
      <ThemeBg bgEffect={theme.bgEffect} />

      <header className="flex items-center justify-between px-6 pt-6 pb-2" style={{ position: "relative", zIndex: 1 }}>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center rounded-xl select-none active:scale-95 transition-transform"
            style={{ width: "40px", height: "40px", backgroundColor: theme.headerButtonBg, fontSize: "18px" }}
            aria-label="Go to home screen"
          >
            🏠
          </button>
          <div
            className="font-bold tracking-wide"
            style={{ fontSize: "clamp(16px, 3.5vw, 24px)", color: theme.accent }}
          >
            PhonicsPath
          </div>
          <div
            className="rounded-full font-bold flex items-center justify-center"
            style={{
              backgroundColor: isReview ? "#f59e0b" : levelColor,
              color: "#0f172a",
              fontSize: "clamp(10px, 2.2vw, 14px)",
              minWidth: "36px",
              height: "32px",
              paddingInline: "10px",
            }}
            aria-label={isReview ? "Review round" : `Level ${currentLevel}`}
          >
            {isReview ? "Review" : `L${currentLevel}`}
          </div>
        </div>

        <ProgressDots total={sessionSize} completed={completed} />
      </header>

      <main className="flex-1 flex items-center justify-center py-6" style={{ position: "relative", zIndex: 1 }}>
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
