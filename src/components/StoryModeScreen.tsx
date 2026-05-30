import { useEffect, useRef, useState } from "react";
import { openBookShelf, originalStoryBooks, type StoryBook, type StoryImage } from "../data/storyBooks";
import {
  recordBookCompleted,
  recordBookOpened,
  recordComprehensionAttempt,
  recordPageReplay,
  recordStoryHelp,
  storySummary,
} from "../data/storyProgress";
import { useAudio } from "../hooks/useAudio";
import { useTheme } from "../hooks/useTheme";
import { ThemeBg } from "./ThemeBg";

type StoryView = "shelf" | "reader" | "questions" | "insights" | "open-info";
type StoryMode = "read-to-me" | "i-read" | "echo-read";

interface Props {
  onBack: () => void;
}

function phraseMs(text: string): number {
  return Math.max(900, Math.min(2600, text.length * 95));
}

function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/[^a-z]/g, "");
}

function Illustration({ image, large = false }: { image: StoryImage; large?: boolean }) {
  return (
    <div
      role="img"
      aria-label={image.label}
      className="flex items-center justify-center"
      style={{
        width: "100%",
        minHeight: large ? "clamp(180px, 34vh, 320px)" : "138px",
        borderRadius: large ? "24px" : "18px",
        background: `linear-gradient(135deg, ${image.background}, rgba(255,255,255,0.28))`,
        fontSize: large ? "clamp(84px, 20vw, 150px)" : "64px",
        boxShadow: "inset 0 -18px 50px rgba(0,0,0,0.12)",
      }}
    >
      {image.emoji}
    </div>
  );
}

export function StoryModeScreen({ onBack }: Props) {
  const { theme } = useTheme();
  const { speakText, stop } = useAudio();
  const [view, setView] = useState<StoryView>("shelf");
  const [selectedBook, setSelectedBook] = useState<StoryBook | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [mode, setMode] = useState<StoryMode>("read-to-me");
  const [activePhrase, setActivePhrase] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [echoIndex, setEchoIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answered, setAnswered] = useState<string | null>(null);
  const cancelRead = useRef(false);

  const page = selectedBook?.pages[pageIndex];
  const currentQuestion = selectedBook?.questions[questionIndex];
  const summary = storySummary();

  useEffect(() => () => stop(), [stop]);

  function openBook(book: StoryBook) {
    recordBookOpened(book.id);
    setSelectedBook(book);
    if (book.pages.length === 0) {
      setView("open-info");
      return;
    }
    setPageIndex(0);
    setMode("read-to-me");
    setActivePhrase(null);
    setEchoIndex(0);
    setQuestionIndex(0);
    setAnswered(null);
    setView("reader");
  }

  function back() {
    cancelRead.current = true;
    stop();
    setIsPlaying(false);
    setActivePhrase(null);
    if (view === "shelf") {
      onBack();
      return;
    }
    setView("shelf");
  }

  async function playPage(replay = false) {
    if (!selectedBook || !page || isPlaying) return;
    if (replay) recordPageReplay(selectedBook.id);
    cancelRead.current = false;
    setIsPlaying(true);

    for (let i = 0; i < page.phrases.length; i++) {
      if (cancelRead.current) break;
      setActivePhrase(i);
      await speakText(page.phrases[i].text);
      if (cancelRead.current) break;
      await new Promise<void>((resolve) => setTimeout(resolve, phraseMs(page.phrases[i].text) * 0.18));
    }

    setActivePhrase(null);
    setIsPlaying(false);
  }

  function pausePage() {
    cancelRead.current = true;
    stop();
    setIsPlaying(false);
    setActivePhrase(null);
  }

  async function tapWord(word: string) {
    if (!selectedBook || !page) return;
    const clean = normalizeWord(word);
    const help = page.vocabulary?.find((item) => normalizeWord(item.word) === clean);
    recordStoryHelp(selectedBook.id, clean || word);
    await speakText(help ? `${word}. ${help.definition}` : word);
  }

  async function echoRead() {
    if (!page || isPlaying) return;
    const phrase = page.phrases[echoIndex];
    setIsPlaying(true);
    setActivePhrase(echoIndex);
    await speakText(phrase.text);
    setIsPlaying(false);
  }

  function echoContinue() {
    if (!page) return;
    const next = echoIndex + 1;
    setActivePhrase(null);
    setEchoIndex(next >= page.phrases.length ? 0 : next);
  }

  function goPage(direction: 1 | -1) {
    if (!selectedBook) return;
    cancelRead.current = true;
    stop();
    setIsPlaying(false);
    setActivePhrase(null);
    setEchoIndex(0);
    setPageIndex((index) => Math.min(Math.max(index + direction, 0), selectedBook.pages.length - 1));
  }

  function finishBook() {
    if (!selectedBook) return;
    recordBookCompleted(selectedBook.id);
    if (selectedBook.questions.length > 0 && selectedBook.type === "original_decodable") {
      setQuestionIndex(0);
      setAnswered(null);
      setView("questions");
      return;
    }
    setView("shelf");
  }

  function answerQuestion(choice: string) {
    if (!selectedBook || !currentQuestion) return;
    recordComprehensionAttempt(selectedBook.id);
    setAnswered(choice);
  }

  function nextQuestion() {
    if (!selectedBook) return;
    if (questionIndex < selectedBook.questions.length - 1) {
      setQuestionIndex((index) => index + 1);
      setAnswered(null);
      return;
    }
    setView("shelf");
  }

  const title =
    view === "reader" && selectedBook ? selectedBook.title :
    view === "open-info" && selectedBook ? selectedBook.title :
    view === "questions" ? "Story Questions" :
    view === "insights" ? "Story Insights" :
    "Story Mode";

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: theme.bg, position: "relative", touchAction: "manipulation" }}
    >
      <ThemeBg bgEffect={theme.bgEffect} />

      <header className="flex items-center justify-between gap-3 px-5 pt-5 pb-2" style={{ position: "relative", zIndex: 1 }}>
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={back}
            className="flex items-center justify-center rounded-2xl select-none active:scale-95 transition-transform"
            style={{
              width: "52px",
              height: "52px",
              backgroundColor: theme.headerButtonBg,
              color: theme.accent,
              fontSize: "22px",
              flexShrink: 0,
            }}
            aria-label="Back"
          >
            ←
          </button>
          <div className="font-bold truncate" style={{ color: theme.accent, fontSize: "clamp(18px, 4vw, 28px)" }}>
            {title}
          </div>
        </div>
        {view === "shelf" && (
          <button
            onClick={() => setView("insights")}
            className="font-bold active:scale-95 transition-transform"
            style={{
              minHeight: "48px",
              paddingInline: "16px",
              borderRadius: "14px",
              backgroundColor: theme.headerButtonBg,
              color: theme.accent,
              fontSize: "clamp(12px, 2.8vw, 16px)",
            }}
          >
            Parent
          </button>
        )}
      </header>

      <main className="flex-1 px-4 py-5" style={{ position: "relative", zIndex: 1 }}>
        {view === "shelf" && (
          <div className="w-full max-w-5xl mx-auto flex flex-col gap-7">
            <section>
              <div className="font-bold mb-3" style={{ color: theme.accent, fontSize: "clamp(21px, 4.8vw, 30px)" }}>
                PhonicsPath Books
              </div>
              <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(190px, 100%), 1fr))" }}>
                {originalStoryBooks.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => openBook(book)}
                    className="flex flex-col gap-3 text-left active:scale-95 transition-transform"
                    style={{
                      backgroundColor: theme.surface,
                      color: theme.text,
                      borderRadius: theme.cardRadius,
                      padding: "16px",
                      minHeight: "260px",
                      boxShadow: `0 8px 28px ${theme.surfaceShadow}`,
                    }}
                  >
                    <Illustration image={book.coverImage} />
                    <div className="font-bold" style={{ fontSize: "clamp(17px, 4vw, 22px)" }}>{book.title}</div>
                    <div style={{ color: theme.textMuted, fontSize: "clamp(12px, 2.8vw, 15px)" }}>{book.skillGroup}</div>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="font-bold mb-3" style={{ color: theme.accent, fontSize: "clamp(19px, 4.2vw, 26px)" }}>
                Open Books Shelf
              </div>
              <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))" }}>
                {openBookShelf.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => openBook(book)}
                    className="text-left active:scale-95 transition-transform"
                    style={{
                      backgroundColor: theme.headerButtonBg,
                      color: theme.text,
                      borderRadius: "18px",
                      padding: "16px",
                      border: `2px solid ${theme.accent}`,
                    }}
                  >
                    <Illustration image={book.coverImage} />
                    <div className="font-bold mt-3" style={{ color: theme.accent, fontSize: "clamp(16px, 3.6vw, 20px)" }}>
                      {book.title}
                    </div>
                    <div style={{ color: theme.textMuted, fontSize: "clamp(12px, 2.8vw, 15px)", lineHeight: 1.4 }}>
                      {book.source}<br />
                      {book.license}<br />
                      {book.attribution}<br />
                      Tap for source details
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {view === "open-info" && selectedBook && (
          <div className="w-full max-w-2xl mx-auto flex flex-col gap-5" style={{ color: theme.text }}>
            <Illustration image={selectedBook.coverImage} large />
            <div
              style={{
                backgroundColor: theme.surface,
                borderRadius: theme.cardRadius,
                boxShadow: `0 8px 28px ${theme.surfaceShadow}`,
                padding: "clamp(24px, 6vw, 36px)",
              }}
            >
              <div className="font-bold" style={{ color: theme.accent, fontSize: "clamp(24px, 6vw, 38px)", lineHeight: 1.15 }}>
                {selectedBook.title}
              </div>
              <div style={{ marginTop: "16px", color: theme.text, fontSize: "clamp(16px, 3.8vw, 22px)", lineHeight: 1.45 }}>
                This open-book slot is ready for licensed picture-book files. No external book pages are embedded yet.
              </div>
              <div
                style={{
                  marginTop: "20px",
                  backgroundColor: theme.headerButtonBg,
                  borderRadius: "16px",
                  padding: "18px",
                  color: theme.textMuted,
                  fontSize: "clamp(13px, 3vw, 17px)",
                  lineHeight: 1.45,
                }}
              >
                <strong style={{ color: theme.accent }}>Source:</strong> {selectedBook.source}<br />
                <strong style={{ color: theme.accent }}>License:</strong> {selectedBook.license}<br />
                <strong style={{ color: theme.accent }}>Attribution:</strong> {selectedBook.attribution}
              </div>
              {selectedBook.sourceUrl && (
                <a
                  href={selectedBook.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold flex items-center justify-center active:scale-95 transition-transform"
                  style={{
                    marginTop: "20px",
                    minHeight: "76px",
                    borderRadius: "18px",
                    backgroundColor: theme.accent,
                    color: theme.accentText,
                    fontSize: "clamp(18px, 4vw, 26px)",
                    textDecoration: "none",
                  }}
                  aria-label={`Open source page for ${selectedBook.title}`}
                >
                  Open source page
                </a>
              )}
            </div>
            <button
              onClick={() => setView("shelf")}
              className="font-bold active:scale-95 transition-transform"
              style={{
                minHeight: "76px",
                minWidth: "220px",
                alignSelf: "center",
                borderRadius: "18px",
                backgroundColor: theme.accent,
                color: theme.accentText,
                fontSize: "clamp(18px, 4vw, 26px)",
              }}
            >
              Back to shelf
            </button>
          </div>
        )}

        {view === "reader" && selectedBook && page && (
          <div className="w-full max-w-5xl mx-auto grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))" }}>
            <Illustration image={page.image} large />

            <div className="flex flex-col gap-4">
              <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Story reading mode">
                {[
                  ["read-to-me", "Read to me"],
                  ["i-read", "I read"],
                  ["echo-read", "Echo read"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => { setMode(id as StoryMode); setActivePhrase(null); setEchoIndex(0); }}
                    className="font-bold active:scale-95 transition-transform"
                    style={{
                      minHeight: "52px",
                      paddingInline: "14px",
                      borderRadius: "14px",
                      backgroundColor: mode === id ? theme.accent : theme.headerButtonBg,
                      color: mode === id ? theme.accentText : theme.accent,
                      fontSize: "clamp(12px, 2.7vw, 16px)",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div
                style={{
                  backgroundColor: theme.surface,
                  color: theme.text,
                  borderRadius: theme.cardRadius,
                  boxShadow: `0 8px 28px ${theme.surfaceShadow}`,
                  padding: "clamp(22px, 5vw, 34px)",
                  minHeight: "250px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-4" style={{ lineHeight: 1.35 }}>
                  {page.phrases.map((phraseItem, phraseIndex) => (
                    <span
                      key={phraseItem.id}
                      style={{
                        borderRadius: "16px",
                        backgroundColor: activePhrase === phraseIndex ? theme.accent : "transparent",
                        color: activePhrase === phraseIndex ? theme.accentText : theme.text,
                        padding: "6px 10px",
                        boxShadow: activePhrase === phraseIndex ? `0 6px 18px ${theme.accentShadow}` : "none",
                      }}
                    >
                      {phraseItem.words.map((word, wordIndex) => (
                        <button
                          key={`${phraseItem.id}-${word}-${wordIndex}`}
                          onClick={() => tapWord(word)}
                          className="font-bold active:scale-95 transition-transform"
                          style={{
                            minHeight: "54px",
                            paddingInline: "3px",
                            backgroundColor: "transparent",
                            color: "inherit",
                            fontSize: "clamp(29px, 7vw, 52px)",
                          }}
                        >
                          {word}{wordIndex < phraseItem.words.length - 1 ? "\u00a0" : ""}
                        </button>
                      ))}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-center flex-wrap">
                {mode === "read-to-me" && (
                  <>
                    <button
                      onClick={() => isPlaying ? pausePage() : playPage(false)}
                      className="font-bold active:scale-95 transition-transform"
                      style={{
                        minHeight: "68px",
                        minWidth: "132px",
                        borderRadius: "18px",
                        backgroundColor: theme.accent,
                        color: theme.accentText,
                        fontSize: "clamp(16px, 3.6vw, 22px)",
                      }}
                    >
                      {isPlaying ? "Pause" : "Play"}
                    </button>
                    <button
                      onClick={() => playPage(true)}
                      className="font-bold active:scale-95 transition-transform"
                      style={{
                        minHeight: "68px",
                        minWidth: "132px",
                        borderRadius: "18px",
                        backgroundColor: theme.headerButtonBg,
                        color: theme.accent,
                        fontSize: "clamp(16px, 3.6vw, 22px)",
                      }}
                    >
                      Replay
                    </button>
                  </>
                )}

                {mode === "echo-read" && (
                  <>
                    <button
                      onClick={echoRead}
                      className="font-bold active:scale-95 transition-transform"
                      style={{
                        minHeight: "68px",
                        minWidth: "150px",
                        borderRadius: "18px",
                        backgroundColor: theme.accent,
                        color: theme.accentText,
                        fontSize: "clamp(16px, 3.6vw, 22px)",
                      }}
                    >
                      Hear
                    </button>
                    <button
                      onClick={echoContinue}
                      className="font-bold active:scale-95 transition-transform"
                      style={{
                        minHeight: "68px",
                        minWidth: "150px",
                        borderRadius: "18px",
                        backgroundColor: theme.headerButtonBg,
                        color: theme.accent,
                        fontSize: "clamp(16px, 3.6vw, 22px)",
                      }}
                    >
                      I read it
                    </button>
                  </>
                )}
              </div>

              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  onClick={() => goPage(-1)}
                  disabled={pageIndex === 0}
                  className="font-bold active:scale-95 transition-transform"
                  style={{
                    minHeight: "62px",
                    minWidth: "112px",
                    borderRadius: "16px",
                    backgroundColor: theme.headerButtonBg,
                    color: pageIndex === 0 ? theme.textMuted : theme.accent,
                    opacity: pageIndex === 0 ? 0.5 : 1,
                    fontSize: "clamp(15px, 3.3vw, 20px)",
                  }}
                >
                  Back
                </button>
                <button
                  onClick={() => pageIndex === selectedBook.pages.length - 1 ? finishBook() : goPage(1)}
                  className="font-bold active:scale-95 transition-transform"
                  style={{
                    minHeight: "62px",
                    minWidth: "128px",
                    borderRadius: "16px",
                    backgroundColor: theme.accent,
                    color: theme.accentText,
                    fontSize: "clamp(15px, 3.3vw, 20px)",
                  }}
                >
                  {pageIndex === selectedBook.pages.length - 1 ? "Done" : "Next"}
                </button>
              </div>
            </div>
          </div>
        )}

        {view === "questions" && selectedBook && currentQuestion && (
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-5">
            <div
              className="font-bold text-center"
              style={{ color: theme.text, fontSize: "clamp(26px, 6vw, 42px)", lineHeight: 1.25 }}
            >
              {currentQuestion.question}
            </div>
            <div className="grid gap-3 w-full" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(180px, 100%), 1fr))" }}>
              {currentQuestion.choices.map((choice) => (
                <button
                  key={choice}
                  onClick={() => answerQuestion(choice)}
                  className="font-bold active:scale-95 transition-transform"
                  style={{
                    minHeight: "92px",
                    borderRadius: theme.cardRadius,
                    backgroundColor: answered === choice ? theme.accent : theme.surface,
                    color: answered === choice ? theme.accentText : theme.text,
                    boxShadow: `0 6px 22px ${theme.surfaceShadow}`,
                    fontSize: "clamp(19px, 4.5vw, 28px)",
                    paddingInline: "18px",
                  }}
                >
                  {choice}
                </button>
              ))}
            </div>
            {answered && (
              <button
                onClick={nextQuestion}
                className="font-bold active:scale-95 transition-transform"
                style={{
                  minHeight: "76px",
                  minWidth: "200px",
                  borderRadius: "18px",
                  backgroundColor: theme.accent,
                  color: theme.accentText,
                  fontSize: "clamp(18px, 4vw, 26px)",
                }}
              >
                Keep reading
              </button>
            )}
          </div>
        )}

        {view === "insights" && (
          <div className="w-full max-w-2xl mx-auto flex flex-col gap-4" style={{ color: theme.text }}>
            <div
              style={{
                backgroundColor: theme.surface,
                borderRadius: theme.cardRadius,
                boxShadow: `0 8px 28px ${theme.surfaceShadow}`,
                padding: "28px",
              }}
            >
              <div className="font-bold" style={{ color: theme.accent, fontSize: "clamp(24px, 5vw, 34px)" }}>
                Local story activity
              </div>
              <div className="grid gap-3 mt-5" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                {[
                  ["Opened", summary.booksOpened],
                  ["Done", summary.booksCompleted],
                  ["Reread", summary.rereads],
                  ["Replay", summary.replays],
                  ["Answers", summary.comprehensionAttempts],
                  ["Help", summary.helpWords.reduce((sum, item) => sum + item.count, 0)],
                ].map(([label, value]) => (
                  <div key={label} className="text-center">
                    <div className="font-bold" style={{ fontSize: "clamp(22px, 5vw, 34px)" }}>{value}</div>
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
              }}
            >
              <div className="font-bold" style={{ color: theme.accent, fontSize: "clamp(18px, 4vw, 24px)" }}>
                Help taps
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                {summary.helpWords.length === 0 && (
                  <span style={{ color: theme.textMuted, fontSize: "clamp(14px, 3vw, 18px)" }}>
                    Read a story to begin.
                  </span>
                )}
                {summary.helpWords.map((item) => (
                  <span
                    key={`${item.bookId}-${item.word}`}
                    className="font-bold"
                    style={{
                      borderRadius: "999px",
                      backgroundColor: theme.surface,
                      color: theme.text,
                      padding: "12px 18px",
                      fontSize: "clamp(14px, 3vw, 18px)",
                    }}
                  >
                    {item.word} · {item.count}
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
