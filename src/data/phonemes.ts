export interface Phoneme {
  id: string;
  display: string;
  audioFile: string;
  example: string;
  distractors: string[];
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

// 51 entries covering all 44 English phoneme SOUNDS.
// example words match the Read Naturally human-recorded audio clips.
// Levels follow synthetic phonics progression: simple consonants + short vowels →
// remaining singles → blends → digraphs → long vowels / vowel teams.

export const phonemes: Phoneme[] = [
  // ── Level 1: Core consonants + short vowels ────────────────────────────────
  { id: "m",  display: "m",  audioFile: "m.mp3",  example: "mug",      distractors: ["s", "t"],        level: 1 },
  { id: "s",  display: "s",  audioFile: "s.mp3",  example: "sit",      distractors: ["m", "p"],        level: 1 },
  { id: "a",  display: "a",  audioFile: "a.mp3",  example: "apple",    distractors: ["o", "i"],        level: 1 },
  { id: "t",  display: "t",  audioFile: "t.mp3",  example: "tuck",     distractors: ["s", "n"],        level: 1 },
  { id: "p",  display: "p",  audioFile: "p.mp3",  example: "pick",     distractors: ["b", "m"],        level: 1 },
  { id: "i",  display: "i",  audioFile: "i.mp3",  example: "igloo",    distractors: ["a", "e"],        level: 1 },
  { id: "n",  display: "n",  audioFile: "n.mp3",  example: "nap",      distractors: ["m", "t"],        level: 1 },
  { id: "o",  display: "o",  audioFile: "o.mp3",  example: "octopus",  distractors: ["a", "u"],        level: 1 },
  { id: "b",  display: "b",  audioFile: "b.mp3",  example: "bat",      distractors: ["p", "d"],        level: 1 },
  { id: "c",  display: "c",  audioFile: "c.mp3",  example: "cut",      distractors: ["k", "g"],        level: 1 },

  // ── Level 2: More consonants + short vowels ───────────────────────────────
  { id: "d",  display: "d",  audioFile: "d.mp3",  example: "dip",      distractors: ["b", "t"],        level: 2 },
  { id: "e",  display: "e",  audioFile: "e.mp3",  example: "elephant", distractors: ["a", "i"],        level: 2 },
  { id: "f",  display: "f",  audioFile: "f.mp3",  example: "fun",      distractors: ["v", "s"],        level: 2 },
  { id: "g",  display: "g",  audioFile: "g.mp3",  example: "get",      distractors: ["c", "k"],        level: 2 },
  { id: "h",  display: "h",  audioFile: "h.mp3",  example: "hat",      distractors: ["n", "m"],        level: 2 },
  { id: "j",  display: "j",  audioFile: "j.mp3",  example: "jog",      distractors: ["g", "y"],        level: 2 },
  { id: "k",  display: "k",  audioFile: "k.mp3",  example: "kit",      distractors: ["c", "g"],        level: 2 },
  { id: "l",  display: "l",  audioFile: "l.mp3",  example: "lip",      distractors: ["r", "n"],        level: 2 },
  { id: "r",  display: "r",  audioFile: "r.mp3",  example: "rid",      distractors: ["l", "w"],        level: 2 },
  { id: "u",  display: "u",  audioFile: "u.mp3",  example: "up",       distractors: ["a", "o"],        level: 2 },

  // ── Level 3: Remaining consonants ─────────────────────────────────────────
  { id: "v",  display: "v",  audioFile: "v.mp3",  example: "van",      distractors: ["f", "b"],        level: 3 },
  { id: "w",  display: "w",  audioFile: "w.mp3",  example: "will",     distractors: ["r", "v"],        level: 3 },
  { id: "x",  display: "x",  audioFile: "x.mp3",  example: "mix",      distractors: ["s", "z"],        level: 3 },
  { id: "y",  display: "y",  audioFile: "y.mp3",  example: "yes",      distractors: ["j", "w"],        level: 3 },
  { id: "z",  display: "z",  audioFile: "z.mp3",  example: "zip",      distractors: ["s", "x"],        level: 3 },
  { id: "qu", display: "qu", audioFile: "qu.mp3", example: "quest",    distractors: ["k", "w"],        level: 3 },

  // ── Level 4: Consonant blends ──────────────────────────────────────────────
  { id: "bl", display: "bl", audioFile: "bl.mp3", example: "blue",     distractors: ["br", "fl"],      level: 4 },
  { id: "cl", display: "cl", audioFile: "cl.mp3", example: "clap",     distractors: ["bl", "pl"],      level: 4 },
  { id: "fl", display: "fl", audioFile: "fl.mp3", example: "flag",     distractors: ["cl", "sl"],      level: 4 },
  { id: "pl", display: "pl", audioFile: "pl.mp3", example: "play",     distractors: ["cl", "bl"],      level: 4 },
  { id: "sl", display: "sl", audioFile: "sl.mp3", example: "sled",     distractors: ["fl", "pl"],      level: 4 },
  { id: "br", display: "br", audioFile: "br.mp3", example: "brag",     distractors: ["cr", "bl"],      level: 4 },
  { id: "cr", display: "cr", audioFile: "cr.mp3", example: "crab",     distractors: ["br", "dr"],      level: 4 },
  { id: "dr", display: "dr", audioFile: "dr.mp3", example: "drum",     distractors: ["cr", "gr"],      level: 4 },
  { id: "fr", display: "fr", audioFile: "fr.mp3", example: "frog",     distractors: ["br", "gr"],      level: 4 },
  { id: "gr", display: "gr", audioFile: "gr.mp3", example: "grip",     distractors: ["dr", "fr"],      level: 4 },
  { id: "pr", display: "pr", audioFile: "pr.mp3", example: "pram",     distractors: ["br", "gr"],      level: 4 },
  { id: "tr", display: "tr", audioFile: "tr.mp3", example: "trip",     distractors: ["dr", "cr"],      level: 4 },

  // ── Level 5: Digraphs ──────────────────────────────────────────────────────
  { id: "sh",      display: "sh", audioFile: "sh.mp3",      example: "ship",  distractors: ["ch", "th"],      level: 5 },
  { id: "ch",      display: "ch", audioFile: "ch.mp3",      example: "chick", distractors: ["sh", "wh"],      level: 5 },
  { id: "th_soft", display: "th", audioFile: "th_soft.mp3", example: "thin",  distractors: ["f",  "sh"],      level: 5 },
  { id: "th_hard", display: "th", audioFile: "th_hard.mp3", example: "the",   distractors: ["sh", "wh"],      level: 5 },
  { id: "wh",      display: "wh", audioFile: "wh.mp3",      example: "whip",  distractors: ["th_hard", "ch"], level: 5 },
  { id: "ph",      display: "ph", audioFile: "ph.mp3",      example: "fun",   distractors: ["f",  "wh"],      level: 5 },
  { id: "ck",      display: "ck", audioFile: "ck.mp3",      example: "cut",   distractors: ["k",  "ch"],      level: 5 },
  { id: "ng",      display: "ng", audioFile: "ng.mp3",      example: "ring",  distractors: ["n",  "m"],       level: 5 },

  // ── Level 6: Long vowels + vowel teams ────────────────────────────────────
  { id: "ai", display: "ai", audioFile: "ai.mp3", example: "cake",  distractors: ["ay", "ee"],      level: 6 },
  { id: "ay", display: "ay", audioFile: "ay.mp3", example: "cake",  distractors: ["ai", "oa"],      level: 6 },
  { id: "ea", display: "ea", audioFile: "ea.mp3", example: "team",  distractors: ["ee", "ai"],      level: 6 },
  { id: "ee", display: "ee", audioFile: "ee.mp3", example: "team",  distractors: ["ea", "ai"],      level: 6 },
  { id: "oa", display: "oa", audioFile: "oa.mp3", example: "rope",  distractors: ["ow", "ay"],      level: 6 },
  { id: "ow", display: "ow", audioFile: "ow.mp3", example: "rope",  distractors: ["oa", "ay"],      level: 6 },
];

export const MAX_LEVEL = 6;
