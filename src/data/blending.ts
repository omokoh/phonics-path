export interface BlendSet {
  id: string;
  sounds: string[];
  word: string;
  audioFiles: string[];   // individual phoneme MP3s from public/audio/phonemes/
  distractors: string[];  // text-only; 2 wrong choices
  group: 1 | 2 | 3 | 4;
}

export const blendings: BlendSet[] = [
  // ── Group 1: vowel + consonant (VC) ───────────────────────────────────────
  {
    id: "on", sounds: ["o","n"], word: "on",
    audioFiles: ["o.mp3","n.mp3"],
    distractors: ["up","at"], group: 1,
  },
  {
    id: "up", sounds: ["u","p"], word: "up",
    audioFiles: ["u.mp3","p.mp3"],
    distractors: ["in","at"], group: 1,
  },
  {
    id: "at", sounds: ["a","t"], word: "at",
    audioFiles: ["a.mp3","t.mp3"],
    distractors: ["on","it"], group: 1,
  },
  {
    id: "in", sounds: ["i","n"], word: "in",
    audioFiles: ["i.mp3","n.mp3"],
    distractors: ["up","am"], group: 1,
  },
  {
    id: "it", sounds: ["i","t"], word: "it",
    audioFiles: ["i.mp3","t.mp3"],
    distractors: ["at","if"], group: 1,
  },
  {
    id: "am", sounds: ["a","m"], word: "am",
    audioFiles: ["a.mp3","m.mp3"],
    distractors: ["in","on"], group: 1,
  },
  {
    id: "if", sounds: ["i","f"], word: "if",
    audioFiles: ["i.mp3","f.mp3"],
    distractors: ["it","up"], group: 1,
  },

  // ── Group 2: consonant + vowel (CV) ───────────────────────────────────────
  {
    id: "so", sounds: ["s","o"], word: "so",
    audioFiles: ["s.mp3","o.mp3"],
    distractors: ["no","go"], group: 2,
  },
  {
    id: "no", sounds: ["n","o"], word: "no",
    audioFiles: ["n.mp3","o.mp3"],
    distractors: ["so","me"], group: 2,
  },
  {
    id: "go", sounds: ["g","o"], word: "go",
    audioFiles: ["g.mp3","o.mp3"],
    distractors: ["no","we"], group: 2,
  },
  {
    id: "me", sounds: ["m","e"], word: "me",
    audioFiles: ["m.mp3","e.mp3"],
    distractors: ["he","be"], group: 2,
  },
  {
    id: "he", sounds: ["h","e"], word: "he",
    audioFiles: ["h.mp3","e.mp3"],
    distractors: ["me","we"], group: 2,
  },
  {
    id: "we", sounds: ["w","e"], word: "we",
    audioFiles: ["w.mp3","e.mp3"],
    distractors: ["he","be"], group: 2,
  },
  {
    id: "be", sounds: ["b","e"], word: "be",
    audioFiles: ["b.mp3","e.mp3"],
    distractors: ["me","so"], group: 2,
  },

  // ── Group 3: consonant + vowel + consonant (CVC) ──────────────────────────
  {
    id: "cat", sounds: ["c","a","t"], word: "cat",
    audioFiles: ["c.mp3","a.mp3","t.mp3"],
    distractors: ["dog","hat"], group: 3,
  },
  {
    id: "dog", sounds: ["d","o","g"], word: "dog",
    audioFiles: ["d.mp3","o.mp3","g.mp3"],
    distractors: ["cat","big"], group: 3,
  },
  {
    id: "sun", sounds: ["s","u","n"], word: "sun",
    audioFiles: ["s.mp3","u.mp3","n.mp3"],
    distractors: ["mug","bus"], group: 3,
  },
  {
    id: "hat", sounds: ["h","a","t"], word: "hat",
    audioFiles: ["h.mp3","a.mp3","t.mp3"],
    distractors: ["cat","fan"], group: 3,
  },
  {
    id: "big", sounds: ["b","i","g"], word: "big",
    audioFiles: ["b.mp3","i.mp3","g.mp3"],
    distractors: ["pin","red"], group: 3,
  },
  {
    id: "red", sounds: ["r","e","d"], word: "red",
    audioFiles: ["r.mp3","e.mp3","d.mp3"],
    distractors: ["fan","bus"], group: 3,
  },
  {
    id: "mug", sounds: ["m","u","g"], word: "mug",
    audioFiles: ["m.mp3","u.mp3","g.mp3"],
    distractors: ["sun","pin"], group: 3,
  },
  {
    id: "pin", sounds: ["p","i","n"], word: "pin",
    audioFiles: ["p.mp3","i.mp3","n.mp3"],
    distractors: ["big","mug"], group: 3,
  },
  {
    id: "bus", sounds: ["b","u","s"], word: "bus",
    audioFiles: ["b.mp3","u.mp3","s.mp3"],
    distractors: ["mug","fan"], group: 3,
  },
  {
    id: "fan", sounds: ["f","a","n"], word: "fan",
    audioFiles: ["f.mp3","a.mp3","n.mp3"],
    distractors: ["hat","bus"], group: 3,
  },

  // ── Group 4: digraph + vowel + consonant ──────────────────────────────────
  {
    id: "ship", sounds: ["sh","i","p"], word: "ship",
    audioFiles: ["sh.mp3","i.mp3","p.mp3"],
    distractors: ["chip","whip"], group: 4,
  },
  {
    id: "chip", sounds: ["ch","i","p"], word: "chip",
    audioFiles: ["ch.mp3","i.mp3","p.mp3"],
    distractors: ["ship","thin"], group: 4,
  },
  {
    id: "thin", sounds: ["th","i","n"], word: "thin",
    audioFiles: ["th_soft.mp3","i.mp3","n.mp3"],
    distractors: ["ring","whip"], group: 4,
  },
  {
    id: "ring", sounds: ["r","i","ng"], word: "ring",
    audioFiles: ["r.mp3","i.mp3","ng.mp3"],
    distractors: ["thin","ship"], group: 4,
  },
  {
    id: "whip", sounds: ["wh","i","p"], word: "whip",
    audioFiles: ["wh.mp3","i.mp3","p.mp3"],
    distractors: ["ship","chip"], group: 4,
  },
];
