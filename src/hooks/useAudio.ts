import { useCallback, useRef } from "react";

// HOW TO ADD REAL RECORDINGS:
// 1. Record each phoneme sound clearly (keep under 2 seconds).
// 2. Export as MP3, 44 kHz, stereo, ~128 kbps.
// 3. Name the file exactly as listed in phonemes.ts (e.g. "sh.mp3").
// 4. Drop files into /public/audio/phonemes/
// 5. Drop success chime into /public/audio/success.mp3
// Real recordings will take priority; Web Speech API is the fallback only.

const phonemeToText: Record<string, string> = {
  a: "ah",  e: "eh",  i: "ih",  o: "oh",  u: "uh",
  b: "buh", c: "kuh", d: "duh", f: "fuh", g: "guh",
  h: "huh", j: "juh", k: "kuh", l: "luh", m: "muh",
  n: "nuh", p: "puh", qu: "kwuh", r: "ruh", s: "suh",
  t: "tuh", v: "vuh", w: "wuh", x: "ks",  y: "yuh",
  z: "zuh", sh: "sh", ch: "ch", th: "th", wh: "wh",
  ph: "fuh", ck: "k", ng: "ng", bl: "bl", cl: "kl",
  fl: "fl", pl: "pl", sl: "sl", br: "br", cr: "kr",
  dr: "dr", fr: "fr", gr: "gr", pr: "pr", tr: "tr",
  ai: "ay", ay: "ay", ea: "ee", ee: "ee", oa: "oh",
  ow: "oh",
};

function speakPhoneme(displayText: string): void {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const text = phonemeToText[displayText] ?? displayText;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.7;
  utterance.pitch = 1.1;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playPhoneme = useCallback((audioFile: string, display: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const audio = new Audio(`/audio/phonemes/${audioFile}`);
    audioRef.current = audio;
    audio.play().catch(() => {
      // MP3 not found — fall back to Web Speech API
      speakPhoneme(display);
    });
  }, []);

  const playSuccess = useCallback(() => {
    const audio = new Audio("/audio/success.mp3");
    audio.play().catch(() => {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance("Great job!");
      u.pitch = 1.4;
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    });
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  return { playPhoneme, playSuccess, stop };
}
