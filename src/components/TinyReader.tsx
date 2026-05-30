import { useMemo, useState } from "react";
import { getDecodableWord } from "../data/decodableWords";
import { recordReadingResult } from "../data/readingProgress";
import type { TinyReader as TinyReaderData } from "../data/tinyReaders";
import { useAudio } from "../hooks/useAudio";
import { useTheme } from "../hooks/useTheme";

interface Props {
  reader: TinyReaderData;
  onDone: () => void;
}

type ReaderMode = "read-to-me" | "i-read";

export function TinyReader({ reader, onDone }: Props) {
  const { theme } = useTheme();
  const { playPhoneme, speakText } = useAudio();
  const [pageIndex, setPageIndex] = useState(0);
  const [mode, setMode] = useState<ReaderMode>("read-to-me");
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [isReading, setIsReading] = useState(false);
  const page = reader.pages[pageIndex];
  const isLastPage = pageIndex === reader.pages.length - 1;

  const pageText = useMemo(() => {
    const sentence = page.words.map((word) => word.text).join(" ");
    return `${sentence}.`;
  }, [page.words]);

  async function readPage() {
    if (isReading) return;
    setIsReading(true);
    for (let i = 0; i < page.words.length; i++) {
      setHighlightIndex(i);
      await speakText(page.words[i].text);
    }
    setHighlightIndex(null);
    setIsReading(false);
  }

  async function helpWord(wordId?: string, fallback?: string) {
    if (!wordId) {
      await speakText(fallback ?? "");
      return;
    }
    const word = getDecodableWord(wordId);
    if (!word) {
      await speakText(fallback ?? wordId);
      return;
    }
    recordReadingResult("tap-blend", word.id, true);
    for (let i = 0; i < word.graphemes.length; i++) {
      await playPhoneme(word.audioFiles[i], word.graphemes[i]);
    }
    await speakText(word.word);
  }

  function goNext() {
    if (!isLastPage) {
      setPageIndex((index) => index + 1);
      setHighlightIndex(null);
      return;
    }
    recordReadingResult("reader", reader.id, false);
    onDone();
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-3xl mx-auto px-4">
      <div className="flex gap-3 justify-center flex-wrap" role="tablist" aria-label="Reader mode">
        {[
          ["read-to-me", "Read to me"],
          ["i-read", "I read"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setMode(id as ReaderMode)}
            className="font-bold active:scale-95 transition-transform"
            style={{
              minHeight: "56px",
              paddingInline: "20px",
              borderRadius: "16px",
              backgroundColor: mode === id ? theme.accent : theme.headerButtonBg,
              color: mode === id ? theme.accentText : theme.accent,
              border: `2px solid ${theme.accent}`,
              fontSize: "clamp(14px, 3vw, 18px)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        className="w-full"
        style={{
          backgroundColor: theme.surface,
          borderRadius: theme.cardRadius,
          boxShadow: `0 10px 34px ${theme.surfaceShadow}`,
          padding: "clamp(24px, 6vw, 44px)",
          minHeight: "clamp(260px, 48vh, 420px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "28px",
        }}
      >
        <div
          className="font-bold text-center"
          style={{ color: theme.textMuted, fontSize: "clamp(16px, 3vw, 22px)" }}
        >
          {reader.title} · Page {pageIndex + 1}
        </div>

        <div
          className="flex flex-wrap justify-center gap-x-3 gap-y-5"
          style={{ lineHeight: 1.25 }}
          aria-label={pageText}
        >
          {page.words.map((word, index) => {
            const highlighted = highlightIndex === index;
            return (
              <button
                key={`${page.id}-${word.text}-${index}`}
                onClick={() => helpWord(word.wordId, word.text)}
                className="font-bold active:scale-95 transition-transform"
                style={{
                  minHeight: "64px",
                  paddingInline: "12px",
                  borderRadius: "14px",
                  backgroundColor: highlighted ? theme.accent : "transparent",
                  color: highlighted ? theme.accentText : theme.text,
                  fontSize: "clamp(34px, 8vw, 58px)",
                  boxShadow: highlighted ? `0 6px 20px ${theme.accentShadow}` : "none",
                }}
                aria-label={`Hear ${word.text}`}
              >
                {word.text}
              </button>
            );
          })}
          <span
            aria-hidden
            style={{ color: theme.text, fontSize: "clamp(34px, 8vw, 58px)", fontWeight: 700 }}
          >
            .
          </span>
        </div>
      </div>

      {mode === "read-to-me" && (
        <button
          onClick={readPage}
          className="flex items-center justify-center gap-3 font-bold active:scale-95 transition-transform"
          style={{
            minHeight: "76px",
            minWidth: "220px",
            paddingInline: "30px",
            borderRadius: theme.cardRadius,
            backgroundColor: theme.accent,
            color: theme.accentText,
            fontSize: "clamp(18px, 4vw, 26px)",
            boxShadow: `0 8px 28px ${theme.accentShadow}`,
          }}
        >
          <span>{isReading ? "Reading" : "Read"}</span>
          <span>🔊</span>
        </button>
      )}

      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={() => setPageIndex((index) => Math.max(0, index - 1))}
          className="font-bold active:scale-95 transition-transform"
          disabled={pageIndex === 0}
          style={{
            minHeight: "64px",
            minWidth: "120px",
            borderRadius: "16px",
            backgroundColor: theme.headerButtonBg,
            color: pageIndex === 0 ? theme.textMuted : theme.accent,
            fontSize: "clamp(16px, 3.5vw, 22px)",
            opacity: pageIndex === 0 ? 0.5 : 1,
          }}
        >
          Back
        </button>
        <button
          onClick={goNext}
          className="font-bold active:scale-95 transition-transform"
          style={{
            minHeight: "64px",
            minWidth: "140px",
            borderRadius: "16px",
            backgroundColor: theme.accent,
            color: theme.accentText,
            fontSize: "clamp(16px, 3.5vw, 22px)",
          }}
        >
          {isLastPage ? "Done" : "Next"}
        </button>
      </div>
    </div>
  );
}
