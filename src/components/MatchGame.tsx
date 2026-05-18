import { useEffect, useRef, useState } from "react";
import type { Phoneme } from "../data/phonemes";
import { useAudio } from "../hooks/useAudio";
import { useTheme } from "../hooks/useTheme";

interface Props {
  phoneme: Phoneme;
  streak: number;
  onCorrect: (emoji: string, neededReview: boolean) => void;
}

// listening → audio plays, no options shown
// ready     → options slide in, child can tap
// relisten  → wrong tap: options gone, audio replays, then back to ready
type Phase = "listening" | "ready" | "relisten";

function shuffle(phoneme: Phoneme): string[] {
  const all = [phoneme.display, ...phoneme.distractors];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all;
}

export function MatchGame({ phoneme, streak, onCorrect }: Props) {
  const { playPhoneme, playSuccess, stop } = useAudio();
  const { theme } = useTheme();

  const [phase, setPhase]       = useState<Phase>("listening");
  const [isPlaying, setIsPlaying] = useState(false);
  const [choices, setChoices]   = useState<string[]>([]);
  const [correctId, setCorrectId] = useState<string | null>(null);

  // increments each time options are (re)revealed — forces slide-up re-run
  const [revealKey, setRevealKey] = useState(0);

  const hasWronged = useRef(false);
  const locked     = useRef(false);

  const isCircularOption = theme.optionRadius === '50%';
  const optionSize = 'clamp(100px, 22vw, 148px)';

  // On new phoneme: reset, play audio, then reveal options after 500 ms gap
  useEffect(() => {
    let cancelled = false;
    hasWronged.current = false;
    locked.current     = false;
    setPhase("listening");
    setCorrectId(null);
    setChoices(shuffle(phoneme));
    setRevealKey(0);
    setIsPlaying(false);

    const t = setTimeout(() => {
      if (cancelled) return;
      setIsPlaying(true);
      playPhoneme(phoneme.audioFile, phoneme.display).then(() => {
        if (cancelled) return;
        setIsPlaying(false);
        setTimeout(() => { if (!cancelled) setPhase("ready"); }, 500);
      });
    }, 300);

    return () => { cancelled = true; clearTimeout(t); stop(); };
  }, [phoneme.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Replay — only active when options are visible and nothing is playing
  const handleReplay = () => {
    if (isPlaying || phase !== "ready") return;
    setIsPlaying(true);
    playPhoneme(phoneme.audioFile, phoneme.display).then(() => setIsPlaying(false));
  };

  const handleChoice = (choice: string) => {
    if (phase !== "ready" || locked.current) return;
    locked.current = true;

    if (choice === phoneme.display) {
      setCorrectId(choice);
      playSuccess(streak).then((emoji) => {
        setTimeout(() => onCorrect(emoji, hasWronged.current), 1500);
      });
    } else {
      hasWronged.current = true;
      setPhase("relisten");
      setIsPlaying(true);

      setTimeout(() => {
        playPhoneme(phoneme.audioFile, phoneme.display).then(() => {
          setIsPlaying(false);
          setChoices(shuffle(phoneme));
          setRevealKey((k) => k + 1);
          locked.current = false;
          setTimeout(() => setPhase("ready"), 500);
        });
      }, 400);
    }
  };

  const getBg = (choice: string) => (choice === correctId ? theme.correctColor : theme.surface);
  const getColor = (choice: string) => (choice === correctId ? "#fff" : theme.text);

  const getOptionAnim = (choice: string) => {
    if (choice === correctId) return theme.correctAnim;
    return "";
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full max-w-lg mx-auto px-4">

      {/* ── Speaker button ────────────────────────────────────────────── */}
      <button
        onClick={handleReplay}
        className={`flex items-center justify-center rounded-full select-none ${
          isPlaying ? "speaker-pulse" : "active:scale-95 transition-transform duration-150"
        }`}
        style={{
          width: "140px",
          height: "140px",
          backgroundColor: theme.accent,
          fontSize: "62px",
          boxShadow: `0 8px 28px ${theme.accentShadow}`,
          flexShrink: 0,
          cursor: isPlaying || phase !== "ready" ? "default" : "pointer",
        }}
        aria-label={isPlaying ? "Playing sound" : "Listen again"}
      >
        🔊
      </button>

      <div
        style={{
          fontSize: "clamp(13px, 2.5vw, 16px)",
          color: isPlaying ? theme.accent : theme.textMuted,
          marginTop: "-4px",
          minHeight: "20px",
          transition: "color 0.3s",
          textAlign: "center",
        }}
      >
        {isPlaying ? "Listening…" : phase === "ready" ? "Listen again" : ""}
      </div>

      {/* ── Listening phase ───────────────────────────────────────────── */}
      {phase === "listening" && !correctId && (
        <div
          style={{
            fontSize: "clamp(18px, 4vw, 24px)",
            color: theme.textMuted,
            textAlign: "center",
            padding: "20px 0",
          }}
        >
          Hear the sound first…
        </div>
      )}

      {/* ── Re-listen phase ───────────────────────────────────────────── */}
      {phase === "relisten" && (
        <div
          className="flex flex-col items-center gap-3 rounded-3xl px-8 py-6"
          style={{
            backgroundColor: theme.relistenBg,
            border: `2px solid ${theme.relistenBorder}`,
            minWidth: "260px",
          }}
        >
          <div style={{ fontSize: "38px" }}>👂</div>
          <div
            style={{
              fontSize: "clamp(18px, 4vw, 22px)",
              color: theme.relistenText,
              textAlign: "center",
            }}
          >
            Try again — listen carefully!
          </div>
        </div>
      )}

      {/* ── Options (only when ready) ─────────────────────────────────── */}
      {phase === "ready" && (
        <div className="flex gap-5 justify-center flex-wrap">
          {choices.map((choice, i) => (
            <button
              key={`${revealKey}-${choice}`}
              onClick={() => handleChoice(choice)}
              className={`flex items-center justify-center font-bold select-none slide-up ${getOptionAnim(choice)}`}
              style={{
                width: optionSize,
                height: isCircularOption ? optionSize : undefined,
                minWidth: isCircularOption ? undefined : '100px',
                minHeight: isCircularOption ? undefined : '100px',
                aspectRatio: isCircularOption ? '1' : undefined,
                fontSize: "clamp(32px, 8vw, 52px)",
                backgroundColor: getBg(choice),
                color: getColor(choice),
                border: "4px solid transparent",
                borderRadius: theme.optionRadius,
                boxShadow: `0 6px 20px ${theme.surfaceShadow}`,
                animationDelay: `${i * 110}ms`,
                transition: "background-color 0.2s",
              }}
              aria-label={`Choose ${choice}`}
            >
              {choice}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
