import { useCallback, useRef } from "react";

// HOW TO ADD / REPLACE RECORDINGS:
// Drop MP3s directly into public/audio/phonemes/ (same filenames).
// The Read Naturally clips already contain phoneme sound + example word
// in one clip — no separate word playback needed.
// Run generate-phonemes.js only for blends not covered by Read Naturally.

const phonemeToText: Record<string, string> = {
  a: "aah",  e: "eh",   i: "ih",   o: "aww",  u: "uh",
  f: "fff",  l: "lll",  m: "mmm",  n: "nnn",  r: "rrr",
  s: "sss",  v: "vvv",  z: "zzz",  h: "huh",
  b: "buh",  c: "kuh",  d: "duh",  g: "guh",  j: "juh",
  k: "kuh",  p: "puh",  t: "tuh",  w: "wuh",  y: "yuh",
  x: "ks",   qu: "kwuh",
  sh: "shh", ch: "chuh", th_soft: "thuh", th_hard: "thuh", wh: "wuh",
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

const STREAK_INDICES = [6, 7, 8];
let lastSuccessIndex = -1;
let cachedVoice: SpeechSynthesisVoice | null | undefined;
let voiceLoadPromise: Promise<SpeechSynthesisVoice[]> | null = null;

type SpeechProfile = "narration" | "phoneme" | "success";

const preferredVoiceNames = [
  "samantha",
  "ava",
  "zoe",
  "susan",
  "victoria",
  "google us english",
  "google uk english female",
  "microsoft jenny",
  "microsoft aria",
  "microsoft susan",
  "microsoft zira",
  "karen",
  "moira",
  "tessa",
  "fiona",
];

function pickPhrase(streak: number) {
  const pool = streak >= 3 ? STREAK_INDICES : SUCCESS_PHRASES.map((_, i) => i);
  const available = pool.filter((i) => i !== lastSuccessIndex);
  const chosen = available[Math.floor(Math.random() * available.length)];
  lastSuccessIndex = chosen;
  return SUCCESS_PHRASES[chosen];
}

function getSynth(): SpeechSynthesis | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  return window.speechSynthesis;
}

function waitForVoices(synth: SpeechSynthesis): Promise<SpeechSynthesisVoice[]> {
  const voices = synth.getVoices();
  if (voices.length > 0) return Promise.resolve(voices);
  if (voiceLoadPromise) return voiceLoadPromise;

  voiceLoadPromise = new Promise((resolve) => {
    const done = () => {
      synth.removeEventListener("voiceschanged", done);
      resolve(synth.getVoices());
    };
    synth.addEventListener("voiceschanged", done);
    window.setTimeout(done, 700);
  });

  return voiceLoadPromise;
}

function scoreVoice(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase();
  const lang = voice.lang.toLowerCase();
  const preferredIndex = preferredVoiceNames.findIndex((preferred) => name.includes(preferred));
  let score = preferredIndex >= 0 ? 100 - preferredIndex * 4 : 0;

  if (lang === "en-us") score += 28;
  else if (lang.startsWith("en-")) score += 22;
  else if (lang.startsWith("en")) score += 14;

  if (voice.localService) score += 8;
  if (name.includes("natural")) score += 12;
  if (name.includes("premium")) score += 8;
  if (name.includes("compact")) score -= 18;
  if (name.includes("novelty")) score -= 25;

  return score;
}

async function getPreferredVoice(): Promise<SpeechSynthesisVoice | null> {
  if (cachedVoice !== undefined) return cachedVoice;
  const synth = getSynth();
  if (!synth) {
    cachedVoice = null;
    return cachedVoice;
  }

  const voices = await waitForVoices(synth);
  const englishVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith("en"));
  cachedVoice = (englishVoices.length > 0 ? englishVoices : voices)
    .sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] ?? null;
  return cachedVoice;
}

function safetyMs(text: string): number {
  return Math.max(2400, Math.min(12000, text.length * 95 + 1800));
}

async function makeUtterance(text: string, profile: SpeechProfile = "narration"): Promise<SpeechSynthesisUtterance> {
  const u = new SpeechSynthesisUtterance(text);
  u.voice = await getPreferredVoice();
  u.rate = profile === "phoneme" ? 0.72 : profile === "success" ? 0.9 : 0.86;
  u.pitch = profile === "success" ? 1.16 : profile === "phoneme" ? 1.03 : 1.02;
  u.volume = 1;
  return u;
}

function speakFallback(display: string): Promise<void> {
  return new Promise((resolve) => {
    const synth = getSynth();
    if (!synth) { resolve(); return; }
    synth.cancel();
    const sound = phonemeToText[display] ?? display;
    makeUtterance(sound, "phoneme").then((u) => {
      u.onend = () => resolve();
      synth.speak(u);
    });
  });
}

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const clearAll = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    getSynth()?.cancel();
  }, []);

  // Returns a Promise that resolves when the audio clip finishes playing.
  // Resolves after a 5 s safety timeout if the clip is stopped early.
  const playPhoneme = useCallback((audioFile: string, display: string): Promise<void> => {
    clearAll();
    return new Promise((resolve) => {
      const audio = new Audio(`/audio/phonemes/${audioFile}`);
      audioRef.current = audio;
      const safetyTimer = setTimeout(resolve, 5000);
      audio.onended = () => { clearTimeout(safetyTimer); resolve(); };
      audio.play().catch(() => { clearTimeout(safetyTimer); speakFallback(display).then(resolve); });
    });
  }, [clearAll]);

  const playSuccess = useCallback((streak: number = 0): Promise<string> => {
    const phrase = pickPhrase(streak);
    return new Promise((resolve) => {
      const audio = new Audio(`/audio/success/${phrase.file}`);
      audio.onended = () => resolve(phrase.emoji);
      audio.play().catch(async () => {
        const synth = getSynth();
        if (!synth) { resolve(phrase.emoji); return; }
        synth.cancel();
        const u = await makeUtterance(phrase.text, "success");
        u.onend = () => resolve(phrase.emoji);
        synth.speak(u);
      });
    });
  }, []);

  // Plays any audio URL, falls back to TTS on failure.
  const playUrl = useCallback((url: string, fallbackText: string): Promise<void> => {
    clearAll();
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audioRef.current = audio;
      const safetyTimer = setTimeout(resolve, 5000);
      audio.onended = () => { clearTimeout(safetyTimer); resolve(); };
      audio.play().catch(() => {
        clearTimeout(safetyTimer);
        const synth = getSynth();
        if (!synth) { resolve(); return; }
        synth.cancel();
        makeUtterance(fallbackText).then((u) => {
          const t2 = setTimeout(resolve, safetyMs(fallbackText));
          u.onend = () => { clearTimeout(t2); resolve(); };
          u.onerror = () => { clearTimeout(t2); resolve(); };
          synth.speak(u);
        });
      });
    });
  }, [clearAll]);

  // Speaks arbitrary text via TTS (used for rhyme prompts).
  const speakText = useCallback((text: string): Promise<void> => {
    clearAll();
    return new Promise((resolve) => {
      const synth = getSynth();
      if (!synth) { resolve(); return; }
      makeUtterance(text).then((u) => {
        const safetyTimer = setTimeout(resolve, safetyMs(text));
        u.onend  = () => { clearTimeout(safetyTimer); resolve(); };
        u.onerror = () => { clearTimeout(safetyTimer); resolve(); };
        synth.speak(u);
      });
    });
  }, [clearAll]);

  const stop = useCallback(() => clearAll(), [clearAll]);

  return { playPhoneme, playUrl, speakText, playSuccess, stop };
}
