import { useCallback, useRef } from "react";

// HOW TO ADD / REPLACE RECORDINGS:
// 1. Run: GOOGLE_TTS_API_KEY=<key> node generate-phonemes.js
//    This regenerates all files in public/audio/phonemes/ and public/audio/words/
// 2. Or drop hand-recorded MP3s directly into those folders (same filenames).
// Real MP3s take priority; Web Speech API fires only when a file is missing.

const phonemeToText: Record<string, string> = {
  a: "aah",  e: "eh",   i: "ih",   o: "aww",  u: "uh",
  f: "fff",  l: "lll",  m: "mmm",  n: "nnn",  r: "rrr",
  s: "sss",  v: "vvv",  z: "zzz",  h: "huh",
  b: "buh",  c: "kuh",  d: "duh",  g: "guh",  j: "juh",
  k: "kuh",  p: "puh",  t: "tuh",  w: "wuh",  y: "yuh",
  x: "ks",   qu: "kwuh",
  sh: "shh", ch: "chuh", th: "thuh", wh: "wuh",
  ph: "fff", ck: "kuh",  ng: "nng",
  bl: "bluh", cl: "cluh", fl: "fluh", pl: "pluh", sl: "sluh",
  br: "bruh", cr: "cruh", dr: "druh", fr: "fruh", gr: "gruh",
  pr: "pruh", tr: "truh",
  ai: "ayy",  ay: "ayy",  ea: "ee",  ee: "ee",
  oa: "oh",   ow: "oh",
};

export const SUCCESS_PHRASES = [
  { file: "success_1.mp3",  emoji: "🌟", text: "Amazing! You did it!"       },
  { file: "success_2.mp3",  emoji: "⭐", text: "Fantastic! Keep going!"     },
  { file: "success_3.mp3",  emoji: "🎉", text: "Yes! You got it!"           },
  { file: "success_4.mp3",  emoji: "🏆", text: "Woohoo! Great job!"         },
  { file: "success_5.mp3",  emoji: "🎊", text: "Super! You're a star!"      },
  { file: "success_6.mp3",  emoji: "🌈", text: "Brilliant! Well done!"      },
  { file: "success_7.mp3",  emoji: "🚀", text: "Awesome! You're so smart!"  },
  { file: "success_8.mp3",  emoji: "💫", text: "Perfect! You nailed it!"    },
  { file: "success_9.mp3",  emoji: "🎯", text: "Incredible! Keep it up!"    },
  { file: "success_10.mp3", emoji: "👑", text: "Great work! You're amazing!" },
];

// Indices that play for 3-in-a-row streak
const STREAK_INDICES = [6, 7, 8];

// Module-level so it persists across re-renders without being in hook state
let lastSuccessIndex = -1;

function pickPhrase(streak: number) {
  const pool = streak >= 3 ? STREAK_INDICES : SUCCESS_PHRASES.map((_, i) => i);
  const available = pool.filter((i) => i !== lastSuccessIndex);
  const chosen = available[Math.floor(Math.random() * available.length)];
  lastSuccessIndex = chosen;
  return SUCCESS_PHRASES[chosen];
}

function makeUtterance(text: string): SpeechSynthesisUtterance {
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.82;
  u.pitch = 1.1;
  u.volume = 1;
  return u;
}

function speakFallback(display: string, example?: string): void {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const sound = phonemeToText[display] ?? display;
  const text  = example ? `${sound} ${example}` : sound;
  window.speechSynthesis.speak(makeUtterance(text));
}

function playWordAudio(id: string, example: string): void {
  const audio = new Audio(`/audio/words/${id}.mp3`);
  audio.play().catch(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(makeUtterance(example));
    }
  });
}

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAll = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const playPhoneme = useCallback((audioFile: string, display: string, example?: string) => {
    clearAll();

    const phonemeId = audioFile.replace(".mp3", "");
    const audio = new Audio(`/audio/phonemes/${audioFile}`);
    audioRef.current = audio;

    if (example) {
      audio.onended = () => {
        timerRef.current = setTimeout(() => playWordAudio(phonemeId, example), 600);
      };
    }

    audio.play().catch(() => speakFallback(display, example));
  }, [clearAll]);

  // Returns a Promise that resolves with the chosen emoji when audio finishes.
  const playSuccess = useCallback((streak: number = 0): Promise<string> => {
    const phrase = pickPhrase(streak);
    return new Promise((resolve) => {
      const audio = new Audio(`/audio/success/${phrase.file}`);
      audio.onended = () => resolve(phrase.emoji);
      audio.play().catch(() => {
        if (!("speechSynthesis" in window)) { resolve(phrase.emoji); return; }
        window.speechSynthesis.cancel();
        const u = makeUtterance(phrase.text);
        u.pitch = 1.4;
        u.onend = () => resolve(phrase.emoji);
        window.speechSynthesis.speak(u);
      });
    });
  }, []);

  const stop = useCallback(() => clearAll(), [clearAll]);

  return { playPhoneme, playSuccess, stop };
}
