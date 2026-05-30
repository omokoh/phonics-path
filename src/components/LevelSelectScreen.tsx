import { useCallback, useRef, useState } from "react";
import { MAX_LEVEL } from "../data/phonemes";
import {
  LEVEL_META,
  getParentUnlocked,
  isLevelComplete,
  isLevelUnlocked,
  parentUnlock,
  readLevelPos,
} from "../data/levelData";
import { useTheme } from "../hooks/useTheme";
import { ThemeBg } from "./ThemeBg";

interface Props {
  currentLevel: number;
  onSelect: (level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8) => void;
  onBack: () => void;
  onReadingPath: () => void;
}

function ProgressBar({
  value,
  max,
  color,
  trackBg,
}: {
  value: number;
  max: number;
  color: string;
  trackBg: string;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div
      style={{
        width: "100%",
        height: "8px",
        backgroundColor: trackBg,
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          backgroundColor: color,
          borderRadius: "4px",
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );
}

export function LevelSelectScreen({ currentLevel, onSelect, onBack, onReadingPath }: Props) {
  const { theme } = useTheme();
  const [parentUnlocked, setParentUnlocked] = useState<Set<number>>(getParentUnlocked);

  // Determine if current theme is light (princess) for progress bar track
  const isLightTheme = theme.bg.startsWith('#f');
  const progressTrackBg = isLightTheme ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)';

  // Long-press timer for parent unlock
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startLongPress = useCallback((level: number) => {
    pressTimer.current = setTimeout(() => {
      parentUnlock(level);
      setParentUnlocked(getParentUnlocked());
    }, 2000);
  }, []);

  const cancelLongPress = useCallback(() => {
    if (pressTimer.current) { clearTimeout(pressTimer.current); pressTimer.current = null; }
  }, []);

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: theme.bg, position: 'relative' }}
    >
      <ThemeBg bgEffect={theme.bgEffect} />

      {/* Header */}
      <header className="flex items-center gap-4 px-6 pt-6 pb-4" style={{ position: 'relative', zIndex: 1 }}>
        <button
          onClick={onBack}
          className="flex items-center justify-center rounded-2xl select-none active:scale-95 transition-transform"
          style={{
            width: "52px",
            height: "52px",
            backgroundColor: theme.headerButtonBg,
            fontSize: "22px",
            color: theme.accent,
          }}
          aria-label="Back to home"
        >
          ←
        </button>
        <div
          className="font-bold"
          style={{ fontSize: "clamp(18px, 4vw, 28px)", color: theme.accent }}
        >
          Choose Level
        </div>
      </header>

      {/* Level cards grid */}
      <main className="flex-1 px-4 pb-8" style={{ position: 'relative', zIndex: 1 }}>
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(min(160px, 45vw), 1fr))",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <button
            onClick={onReadingPath}
            className="flex flex-col items-center justify-between rounded-3xl select-none transition-transform duration-150 active:scale-95"
            style={{
              minHeight: "160px",
              padding: "20px 16px 16px",
              backgroundColor: theme.surface,
              border: `3px solid ${theme.accent}`,
              boxShadow: `0 0 0 4px ${theme.accent}33, 0 6px 24px ${theme.surfaceShadow}`,
              gap: "10px",
            }}
            aria-label="Open decodable reading path"
          >
            <div className="w-full flex justify-between items-start" style={{ minHeight: "24px" }}>
              <div
                className="rounded-full font-bold flex items-center justify-center"
                style={{
                  backgroundColor: theme.accent,
                  color: theme.accentText,
                  fontSize: "12px",
                  minWidth: "58px",
                  height: "28px",
                  paddingInline: "8px",
                }}
              >
                Phase 2
              </div>
              <div style={{ fontSize: "20px" }}>📚</div>
            </div>
            <div
              className="font-bold leading-none"
              style={{ fontSize: "clamp(28px, 7vw, 44px)", color: theme.accent }}
            >
              Read
            </div>
            <div
              className="font-bold text-center leading-tight"
              style={{ fontSize: "clamp(13px, 3vw, 17px)", color: theme.text }}
            >
              Decodable Path
            </div>
            <div style={{ width: "100%", color: theme.textMuted, fontSize: "11px", textAlign: "right" }}>
              words + stories
            </div>
          </button>

          {LEVEL_META.map((meta) => {
            const done        = readLevelPos(meta.level);
            const unlocked    = isLevelUnlocked(meta.level) || parentUnlocked.has(meta.level);
            const complete    = isLevelComplete(meta.level);
            const isCurrent   = meta.level === currentLevel;

            let borderStyle = "3px solid transparent";
            if (complete)  borderStyle = `3px solid #f59e0b`;
            if (isCurrent && !complete) borderStyle = `3px solid ${meta.color}`;

            let boxShadow = `0 4px 16px ${theme.surfaceShadow}`;
            if (isCurrent && !complete) boxShadow = `0 0 0 4px ${meta.color}44, 0 6px 24px ${theme.surfaceShadow}`;
            if (complete) boxShadow = `0 0 0 4px #f59e0b44, 0 6px 24px ${theme.surfaceShadow}`;

            return (
              <button
                key={meta.level}
                onClick={() => unlocked && onSelect(meta.level as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8)}
                onPointerDown={() => !unlocked && startLongPress(meta.level)}
                onPointerUp={cancelLongPress}
                onPointerLeave={cancelLongPress}
                className="flex flex-col items-center justify-between rounded-3xl select-none transition-transform duration-150"
                style={{
                  minHeight: "160px",
                  padding: "20px 16px 16px",
                  backgroundColor: unlocked ? theme.surface : 'transparent',
                  border: borderStyle,
                  boxShadow,
                  opacity: unlocked ? 1 : 0.5,
                  cursor: unlocked ? "pointer" : "default",
                  gap: "10px",
                }}
                aria-label={`Level ${meta.level}: ${meta.label}${!unlocked ? " (locked)" : ""}`}
              >
                {/* Status badge */}
                <div className="w-full flex justify-between items-start" style={{ minHeight: "24px" }}>
                  <div
                    className="rounded-full font-bold flex items-center justify-center"
                    style={{
                      backgroundColor: unlocked ? meta.color : theme.textMuted,
                      color: "#0f172a",
                      fontSize: "12px",
                      minWidth: "28px",
                      height: "28px",
                      paddingInline: "8px",
                    }}
                  >
                    L{meta.level}
                  </div>
                  <div style={{ fontSize: "20px" }}>
                    {!unlocked && "🔒"}
                    {complete && "⭐"}
                  </div>
                </div>

                {/* Icon */}
                <div
                  className="font-bold leading-none"
                  style={{
                    fontSize: "clamp(28px, 7vw, 44px)",
                    color: unlocked ? meta.color : theme.textMuted,
                  }}
                >
                  {meta.icon}
                </div>

                {/* Label */}
                <div
                  className="font-bold text-center leading-tight"
                  style={{
                    fontSize: "clamp(13px, 3vw, 17px)",
                    color: unlocked ? theme.text : theme.textMuted,
                  }}
                >
                  {meta.label}
                </div>

                {/* Progress bar */}
                {unlocked && (
                  <div className="w-full">
                    <ProgressBar value={done} max={meta.total} color={meta.color} trackBg={progressTrackBg} />
                    <div
                      style={{
                        fontSize: "11px",
                        color: theme.textMuted,
                        textAlign: "right",
                        marginTop: "4px",
                      }}
                    >
                      {done}/{meta.total}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* All levels done indicator */}
        {Array.from({ length: MAX_LEVEL }, (_, i) => i + 1).every(isLevelComplete) && (
          <div
            className="flex flex-col items-center gap-3 mt-8"
            style={{ fontSize: "clamp(14px, 3vw, 18px)", color: theme.accent }}
          >
            <div style={{ fontSize: "48px" }}>🏆</div>
            <div className="font-bold">All levels complete!</div>
          </div>
        )}
      </main>
    </div>
  );
}
