import { useCallback, useRef } from "react";

// HOW TO ADD REAL RECORDINGS:
// 1. Record each phoneme sound clearly (keep under 2 seconds).
// 2. Export as MP3, 44 kHz, stereo, ~128 kbps.
// 3. Name the file exactly as listed in phonemes.ts (e.g. "sh.mp3").
// 4. Drop files into /public/audio/phonemes/
// 5. Drop success chime into /public/audio/success.mp3
// Real recordings take priority; Web Speech API fires only when an MP3 is missing.

// Text passed to SpeechSynthesisUtterance for each phoneme.
// Rules:
//   - Elongate fricatives/nasals/liquids with repeated chars: "sss", "mmm", "fff"
//   - Stops get a minimal schwa: "buh", "duh"
//   - Digraphs use letter combos TTS engines voice as the blend, not as letters
//   - Blends get a schwa to make them pronounceable: "bluh", "bruh"
const phonemeToText: Record<string, string> = {
  // Short vowels
  a: "aah",  e: "eh",   i: "ih",   o: "aww",  u: "uh",
  // Consonants — fricatives/nasals/liquids elongated
  f: "fff",  l: "lll",  m: "mmm",  n: "nnn",  r: "rrr",
  s: "sss",  v: "vvv",  z: "zzz",  h: "hhh",
  // Consonants — stops (minimal schwa)
  b: "buh",  c: "kuh",  d: "duh",  g: "guh",  j: "juh",
  k: "kuh",  p: "puh",  t: "tuh",  w: "wuh",  y: "yuh",
  x: "ks",   qu: "kwuh",
  // Digraphs — spelled so TTS voices them as blends, not letter names
  sh: "shh",  ch: "chh",  th: "thh",  wh: "wuh",
  ph: "fff",  ck: "kuh",  ng: "nng",
  // Consonant blends
  bl: "bluh", cl: "kluh", fl: "fluh", pl: "pluh", sl: "sluh",
  br: "bruh", cr: "kruh", dr: "druh", fr: "fruh", gr: "gruh",
  pr: "pruh", tr: "truh",
  // Vowel teams (long vowel sounds)
  ai: "ayy",  ay: "ayy",  ea: "ee",   ee: "ee",
  oa: "oh",   ow: "oh",
};

function makeUtterance(text: string): SpeechSynthesisUtterance {
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.82;
  u.pitch = 1.1;
  u.volume = 1;
  return u;
}

// Card view: say the phoneme sound, then queue the example word.
// Game view: say the phoneme sound only (no example — keeps the test fair).
function speakPhoneme(displayText: string, example?: string): void {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const sound = phonemeToText[displayText] ?? displayText;
  window.speechSynthesis.speak(makeUtterance(sound));
  if (example) {
    // Queued after the first utterance — browser inserts a natural pause
    window.speechSynthesis.speak(makeUtterance(example));
  }
}

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pass example only from the card view, not from the game.
  const playPhoneme = useCallback((audioFile: string, display: string, example?: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const audio = new Audio(`/audio/phonemes/${audioFile}`);
    audioRef.current = audio;
    audio.play().catch(() => {
      speakPhoneme(display, example);
    });
  }, []);

  const playSuccess = useCallback(() => {
    const audio = new Audio("/audio/success.mp3");
    audio.play().catch(() => {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const u = makeUtterance("Great job!");
      u.pitch = 1.4;
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
