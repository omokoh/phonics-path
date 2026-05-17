import { useCallback, useRef } from "react";

// HOW TO ADD / REPLACE RECORDINGS:
// 1. Run: GOOGLE_TTS_API_KEY=<key> node generate-phonemes.js
//    This regenerates all files in public/audio/phonemes/ and public/audio/words/
// 2. Or drop hand-recorded MP3s directly into those folders (same filenames).
// Real MP3s take priority; Web Speech API fires only when a file is missing.

// Web Speech fallback text (used only when MP3s are absent)
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

// Plays a word MP3 from /audio/words/, falling back to TTS if missing.
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
  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAll = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  // Card view  — pass display + example:
  //   phoneme MP3  →  600 ms pause  →  word MP3 (or TTS fallback)
  //   Child hears: "mmmm" [pause] "map"
  //
  // Game view — pass display only:
  //   phoneme MP3 alone — no word hint so the matching test stays fair
  //
  // If the phoneme MP3 is missing, the whole utterance falls back to TTS.
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

  // Returns a Promise that resolves when the success audio finishes playing,
  // so callers can chain a celebration pause before advancing.
  const playSuccess = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      const audio = new Audio("/audio/success.mp3");
      audio.onended = () => resolve();
      audio.play().catch(() => {
        if (!("speechSynthesis" in window)) { resolve(); return; }
        window.speechSynthesis.cancel();
        const u = makeUtterance("Amazing! You did it!");
        u.pitch = 1.4;
        u.onend = () => resolve();
        window.speechSynthesis.speak(u);
      });
    });
  }, []);

  const stop = useCallback(() => clearAll(), [clearAll]);

  return { playPhoneme, playSuccess, stop };
}
