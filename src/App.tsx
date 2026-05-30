import { useCallback, useEffect, useMemo, useState } from "react";
import { CompletionScreen } from "./components/CompletionScreen";
import { GrandCelebrationScreen } from "./components/GrandCelebrationScreen";
import { HomeScreen } from "./components/HomeScreen";
import { LevelCompleteScreen } from "./components/LevelCompleteScreen";
import { LevelSelectScreen } from "./components/LevelSelectScreen";
import { MatchGame } from "./components/MatchGame";
import { PhonicsCard } from "./components/PhonicsCard";
import { ProgressDots } from "./components/ProgressDots";
import { ReadingPathScreen } from "./components/ReadingPathScreen";
import { BlendingGame } from "./components/BlendingGame";
import { RhymeGame } from "./components/RhymeGame";
import { ThemeBg } from "./components/ThemeBg";
import { LEVEL_META, levelPosKey, readLevelPos, saveLevelPos } from "./data/levelData";
import { MAX_LEVEL, phonemes, type Phoneme } from "./data/phonemes";
import { blendings, type BlendSet } from "./data/blending";
import { rhymes, type RhymeSet } from "./data/rhymes";
import { useTheme } from "./hooks/useTheme";

const SESSION_SIZE   = 5;
const LEVEL_KEY      = "phonics_level";
const LEVEL_POS_KEY  = "phonics_level_pos";

type Level = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type Mode =
  | "home" | "level_select"
  | "reading_path"
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

const LEVEL_COLORS = ["#f59e0b","#10b981","#3b82f6","#a855f7","#ec4899","#ef4444","#0d9488","#4f46e5"];

export default function App() {
  const { theme } = useTheme();

  const [currentLevel, setCurrentLevel] = useState<Level>(() => {
    const n = readInt(LEVEL_KEY, 1);
    return Math.min(Math.max(n, 1), MAX_LEVEL) as Level;
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

  const isRhymeLevel    = currentLevel === 7;
  const isBlendingLevel = currentLevel === 8;

  // L1–6 phoneme data
  const levelPhonemes = useMemo(
    () => phonemes.filter((p) => p.level === (currentLevel as 1 | 2 | 3 | 4 | 5 | 6)),
    [currentLevel]
  );
  const sessionPhonemes = useMemo(
    () => levelPhonemes.slice(levelPos, levelPos + SESSION_SIZE),
    [levelPhonemes, levelPos]
  );
  const activePhonemes  = reviewPhonemes ?? sessionPhonemes;
  const sessionSize     = activePhonemes.length;
  const currentPhoneme  = activePhonemes[currentIndex];

  // L7 rhyme data
  const sessionRhymes = useMemo(
    () => rhymes.slice(levelPos, levelPos + SESSION_SIZE),
    [levelPos]
  );
  const currentRhyme: RhymeSet | undefined = isRhymeLevel ? sessionRhymes[currentIndex] : undefined;

  // L8 blending data
  const sessionBlendings = useMemo(
    () => blendings.slice(levelPos, levelPos + SESSION_SIZE),
    [levelPos]
  );
  const currentBlending: BlendSet | undefined = isBlendingLevel ? sessionBlendings[currentIndex] : undefined;

  // Progress dot display
  const displaySize      = isRhymeLevel ? sessionRhymes.length
                         : isBlendingLevel ? sessionBlendings.length
                         : sessionSize;
  const displayCompleted = completed;

  useEffect(() => {
    const block = (e: TouchEvent) => { if (e.touches.length > 1) e.preventDefault(); };
    document.addEventListener("touchstart", block, { passive: false });
    return () => document.removeEventListener("touchstart", block);
  }, []);

  const completionMode: Mode = currentLevel >= MAX_LEVEL ? "grand_complete" : "level_complete";
  const activeMode: Mode =
    (isRhymeLevel && mode === "card" && sessionRhymes.length === 0) ||
    (isBlendingLevel && mode === "card" && sessionBlendings.length === 0) ||
    (!isRhymeLevel && !isBlendingLevel && (mode === "card" || mode === "game") && !isReview && sessionPhonemes.length === 0)
      ? completionMode
      : mode;

  // ── Navigation handlers ──────────────────────────────────────────────

  const handlePlay         = useCallback(() => setMode("card"), []);
  const handleChooseLevel  = useCallback(() => setMode("level_select"), []);
  const handleReadingPath  = useCallback(() => setMode("reading_path"), []);
  const handleGoHome       = useCallback(() => setMode("home"), []);
  const handleCardNext     = useCallback(() => setMode("game"), []);

  const handleSelectLevel = useCallback((level: Level) => {
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

  // Handler for L1–6 phoneme match game
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

    const newPos = levelPos + sessionSize;
    setLevelPos(newPos);
    saveLevelPos(currentLevel, newPos);
    save(LEVEL_POS_KEY, newPos);

    if (newPos >= levelPhonemes.length) {
      setMode(currentLevel >= MAX_LEVEL ? "grand_complete" : "level_complete");
      return;
    }

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

  // Shared handler for L7 (rhyme) and L8 (blending) — no review round
  const handleRhymeCorrect = useCallback((emoji: string) => {
    setSuccessEmoji(emoji);
    setStreak((s) => s + 1);

    const newCompleted = completed + 1;
    setCompleted(newCompleted);

    if (newCompleted < sessionRhymes.length) {
      setCurrentIndex((i) => i + 1);
      setMode("card");
      return;
    }

    const newPos = levelPos + sessionRhymes.length;
    setLevelPos(newPos);
    saveLevelPos(7, newPos);
    save(LEVEL_POS_KEY, newPos);

    setMode(newPos >= rhymes.length ? completionMode : "session_complete");
  }, [completed, completionMode, levelPos, sessionRhymes.length]);

  const handleBlendingCorrect = useCallback((emoji: string) => {
    setSuccessEmoji(emoji);
    setStreak((s) => s + 1);

    const newCompleted = completed + 1;
    setCompleted(newCompleted);

    if (newCompleted < sessionBlendings.length) {
      setCurrentIndex((i) => i + 1);
      setMode("card");
      return;
    }

    const newPos = levelPos + sessionBlendings.length;
    setLevelPos(newPos);
    saveLevelPos(8, newPos);
    save(LEVEL_POS_KEY, newPos);

    setMode(newPos >= blendings.length ? completionMode : "session_complete");
  }, [completed, completionMode, levelPos, sessionBlendings.length]);

  const handleSessionNext = useCallback(() => {
    setCurrentIndex(0);
    setCompleted(0);
    setNeedsReviewIds([]);
    setReviewPhonemes(null);
    setIsReview(false);
    setMode("card");
  }, []);

  const handleLevelNext = useCallback(() => {
    const next = (currentLevel >= MAX_LEVEL ? 1 : currentLevel + 1) as Level;
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

  if (activeMode === "home") {
    return <HomeScreen onPlay={handlePlay} onChooseLevel={handleChooseLevel} onReadingPath={handleReadingPath} />;
  }

  if (activeMode === "level_select") {
    return (
      <LevelSelectScreen
        currentLevel={currentLevel}
        onSelect={handleSelectLevel}
        onBack={handleGoHome}
        onReadingPath={handleReadingPath}
      />
    );
  }

  if (activeMode === "reading_path") {
    return <ReadingPathScreen onBack={handleGoHome} />;
  }

  if (activeMode === "grand_complete") {
    return (
      <GrandCelebrationScreen
        onReset={handleGrandReset}
        onChooseLevel={handleGrandChooseLevel}
      />
    );
  }

  if (activeMode === "level_complete") {
    return <LevelCompleteScreen level={currentLevel} onNext={handleLevelNext} />;
  }

  if (activeMode === "session_complete") {
    return (
      <CompletionScreen
        onPlayAgain={handleSessionNext}
        label="Keep Going!"
        emoji={successEmoji}
      />
    );
  }

  const levelColor = LEVEL_COLORS[currentLevel - 1] ?? "#4f46e5";

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

        <ProgressDots total={displaySize} completed={displayCompleted} />
      </header>

      <main className="flex-1 flex items-center justify-center py-6" style={{ position: "relative", zIndex: 1 }}>
        {activeMode === "card" && isRhymeLevel && currentRhyme && (
          <RhymeGame key={currentRhyme.id} rhyme={currentRhyme} streak={streak} onCorrect={handleRhymeCorrect} />
        )}
        {activeMode === "card" && isBlendingLevel && currentBlending && (
          <BlendingGame key={currentBlending.id} blend={currentBlending} streak={streak} onCorrect={handleBlendingCorrect} />
        )}
        {activeMode === "card" && !isRhymeLevel && !isBlendingLevel && currentPhoneme && (
          <PhonicsCard phoneme={currentPhoneme} onNext={handleCardNext} />
        )}
        {activeMode === "game" && currentPhoneme && (
          <MatchGame key={currentPhoneme.id} phoneme={currentPhoneme} streak={streak} onCorrect={handleCorrect} />
        )}
      </main>
    </div>
  );
}
