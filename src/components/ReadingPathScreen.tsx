import { useState } from "react";
import { decodableWords } from "../data/decodableWords";
import {
  readReadingPosition,
  readingSummary,
  saveReadingPosition,
  type ReadingPracticeKind,
} from "../data/readingProgress";
import { tinyReaders } from "../data/tinyReaders";
import { useTheme } from "../hooks/useTheme";
import { ProgressDots } from "./ProgressDots";
import { TapToBlendGame } from "./TapToBlendGame";
import { ThemeBg } from "./ThemeBg";
import { TinyReader } from "./TinyReader";
import { WordBuilderGame } from "./WordBuilderGame";

type ReadingMode = "hub" | "builder" | "blend" | "reader" | "summary";

interface Props {
  onBack: () => void;
}

function clampIndex(index: number, length: number): number {
  if (length === 0) return 0;
  return Math.min(Math.max(index, 0), length - 1);
}

function groupLabel(group: string): string {
  if (group === "vc") return "VC";
  if (group === "cv") return "CV";
  if (group === "cvc") return "CVC";
  return "Digraph CVC";
}

export function ReadingPathScreen({ onBack }: Props) {
  const { theme } = useTheme();
  const [mode, setMode] = useState<ReadingMode>("hub");
  const [builderIndex, setBuilderIndex] = useState(() =>
    clampIndex(readReadingPosition("word-builder"), decodableWords.length)
  );
  const [blendIndex, setBlendIndex] = useState(() =>
    clampIndex(readReadingPosition("tap-blend"), decodableWords.length)
  );
  const [readerIndex, setReaderIndex] = useState(() =>
    clampIndex(readReadingPosition("reader"), tinyReaders.length)
  );
  const summary = readingSummary();

  const builderWord = decodableWords[builderIndex];
  const blendWord = decodableWords[blendIndex];
  const reader = tinyReaders[readerIndex];

  function advance(kind: ReadingPracticeKind) {
    if (kind === "word-builder") {
      const next = (builderIndex + 1) % decodableWords.length;
      setBuilderIndex(next);
      saveReadingPosition(kind, next);
      setMode("hub");
      return;
    }
    if (kind === "tap-blend") {
      const next = (blendIndex + 1) % decodableWords.length;
      setBlendIndex(next);
      saveReadingPosition(kind, next);
      setMode("hub");
      return;
    }
    const next = (readerIndex + 1) % tinyReaders.length;
    setReaderIndex(next);
    saveReadingPosition(kind, next);
    setMode("hub");
  }

  const title =
    mode === "builder" ? "Word Builder" :
    mode === "blend" ? "Tap to Blend" :
    mode === "reader" ? "Tiny Reader" :
    mode === "summary" ? "Reading Progress" :
    "Reading Path";

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: theme.bg, position: "relative", touchAction: "manipulation" }}
    >
      <ThemeBg bgEffect={theme.bgEffect} />

      <header
        className="flex items-center justify-between gap-3 px-5 pt-5 pb-2"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={mode === "hub" ? onBack : () => setMode("hub")}
            className="flex items-center justify-center rounded-2xl select-none active:scale-95 transition-transform"
            style={{
              width: "52px",
              height: "52px",
              backgroundColor: theme.headerButtonBg,
              color: theme.accent,
              fontSize: "22px",
              flexShrink: 0,
            }}
            aria-label={mode === "hub" ? "Back to home" : "Back to reading path"}
          >
            ←
          </button>
          <div
            className="font-bold truncate"
            style={{ color: theme.accent, fontSize: "clamp(18px, 4vw, 28px)" }}
          >
            {title}
          </div>
        </div>

        {mode === "builder" && <ProgressDots total={decodableWords.length} completed={builderIndex + 1} />}
        {mode === "blend" && <ProgressDots total={decodableWords.length} completed={blendIndex + 1} />}
        {mode === "reader" && <ProgressDots total={tinyReaders.length} completed={readerIndex + 1} />}
      </header>

      <main
        className="flex-1 flex items-center justify-center px-4 py-5"
        style={{ position: "relative", zIndex: 1 }}
      >
        {mode === "hub" && (
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-5">
            <div
              className="text-center"
              style={{
                color: theme.textMuted,
                fontSize: "clamp(15px, 3.5vw, 20px)",
                lineHeight: 1.35,
              }}
            >
              Build words, tap sounds, and read tiny stories.
            </div>

            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))" }}
            >
              <button
                onClick={() => setMode("builder")}
                className="flex flex-col items-center justify-center gap-3 select-none active:scale-95 transition-transform"
                style={{
                  minHeight: "190px",
                  borderRadius: theme.cardRadius,
                  backgroundColor: theme.accent,
                  color: theme.accentText,
                  boxShadow: `0 10px 34px ${theme.accentShadow}`,
                  padding: "24px",
                }}
              >
                <span style={{ fontSize: "clamp(42px, 9vw, 64px)" }}>🧩</span>
                <span className="font-bold" style={{ fontSize: "clamp(21px, 5vw, 30px)" }}>Build</span>
                <span style={{ fontSize: "clamp(13px, 3vw, 16px)" }}>
                  {builderWord.word} · {groupLabel(builderWord.group)}
                </span>
              </button>

              <button
                onClick={() => setMode("blend")}
                className="flex flex-col items-center justify-center gap-3 select-none active:scale-95 transition-transform"
                style={{
                  minHeight: "190px",
                  borderRadius: theme.cardRadius,
                  backgroundColor: theme.surface,
                  color: theme.text,
                  boxShadow: `0 10px 34px ${theme.surfaceShadow}`,
                  padding: "24px",
                }}
              >
                <span style={{ fontSize: "clamp(42px, 9vw, 64px)" }}>🔊</span>
                <span className="font-bold" style={{ fontSize: "clamp(21px, 5vw, 30px)" }}>Blend</span>
                <span style={{ color: theme.textMuted, fontSize: "clamp(13px, 3vw, 16px)" }}>
                  {blendWord.word} · tap each sound
                </span>
              </button>

              <button
                onClick={() => setMode("reader")}
                className="flex flex-col items-center justify-center gap-3 select-none active:scale-95 transition-transform"
                style={{
                  minHeight: "190px",
                  borderRadius: theme.cardRadius,
                  backgroundColor: theme.headerButtonBg,
                  color: theme.accent,
                  border: `3px solid ${theme.accent}`,
                  boxShadow: `0 10px 34px ${theme.surfaceShadow}`,
                  padding: "24px",
                }}
              >
                <span style={{ fontSize: "clamp(42px, 9vw, 64px)" }}>📚</span>
                <span className="font-bold" style={{ fontSize: "clamp(21px, 5vw, 30px)" }}>Read</span>
                <span style={{ color: theme.textMuted, fontSize: "clamp(13px, 3vw, 16px)" }}>
                  {reader.title}
                </span>
              </button>
            </div>

            <button
              onClick={() => setMode("summary")}
              className="flex items-center justify-between gap-4 font-bold select-none active:scale-95 transition-transform"
              style={{
                minHeight: "82px",
                borderRadius: "18px",
                backgroundColor: theme.headerButtonBg,
                color: theme.text,
                padding: "18px 22px",
                fontSize: "clamp(15px, 3.4vw, 20px)",
              }}
            >
              <span>Parent reading summary</span>
              <span style={{ color: theme.accent }}>{summary.attempts} tries</span>
            </button>
          </div>
        )}

        {mode === "builder" && (
          <WordBuilderGame key={builderWord.id} word={builderWord} onDone={() => advance("word-builder")} />
        )}

        {mode === "blend" && (
          <TapToBlendGame key={blendWord.id} word={blendWord} onDone={() => advance("tap-blend")} />
        )}

        {mode === "reader" && (
          <TinyReader key={reader.id} reader={reader} onDone={() => advance("reader")} />
        )}

        {mode === "summary" && (
          <div
            className="w-full max-w-2xl flex flex-col gap-4"
            style={{ color: theme.text }}
          >
            <div
              style={{
                backgroundColor: theme.surface,
                borderRadius: theme.cardRadius,
                boxShadow: `0 10px 34px ${theme.surfaceShadow}`,
                padding: "28px",
              }}
            >
              <div className="font-bold" style={{ fontSize: "clamp(24px, 5vw, 34px)", color: theme.accent }}>
                Local practice
              </div>
              <div className="grid gap-3 mt-5" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                {[
                  ["Tries", summary.attempts],
                  ["Smooth", summary.successes],
                  ["Review", summary.misses],
                ].map(([label, value]) => (
                  <div key={label} className="text-center" style={{ color: theme.text }}>
                    <div className="font-bold" style={{ fontSize: "clamp(24px, 6vw, 38px)" }}>{value}</div>
                    <div style={{ color: theme.textMuted, fontSize: "clamp(11px, 2.5vw, 14px)" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                backgroundColor: theme.headerButtonBg,
                borderRadius: "18px",
                padding: "22px",
                color: theme.text,
              }}
            >
              <div className="font-bold" style={{ color: theme.accent, fontSize: "clamp(18px, 4vw, 24px)" }}>
                Practice next
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                {summary.needsPractice.length === 0 && (
                  <span style={{ color: theme.textMuted, fontSize: "clamp(14px, 3vw, 18px)" }}>
                    Keep building new words.
                  </span>
                )}
                {summary.needsPractice.map((item) => (
                  <span
                    key={item.key}
                    className="font-bold"
                    style={{
                      minHeight: "48px",
                      borderRadius: "999px",
                      backgroundColor: theme.surface,
                      color: theme.text,
                      padding: "12px 18px",
                      fontSize: "clamp(14px, 3vw, 18px)",
                    }}
                  >
                    {item.id}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
