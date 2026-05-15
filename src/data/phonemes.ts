export interface Phoneme {
  id: string;
  display: string;
  audioFile: string;
  example: string;
  distractors: string[];
}

export const phonemes: Phoneme[] = [
  // --- Tier 1: Single consonants and short vowels ---
  { id: "m",  display: "m",  audioFile: "m.mp3",  example: "map",   distractors: ["s", "t"] },
  { id: "s",  display: "s",  audioFile: "s.mp3",  example: "sun",   distractors: ["m", "p"] },
  { id: "a",  display: "a",  audioFile: "a.mp3",  example: "ant",   distractors: ["o", "i"] },
  { id: "t",  display: "t",  audioFile: "t.mp3",  example: "top",   distractors: ["s", "n"] },
  { id: "p",  display: "p",  audioFile: "p.mp3",  example: "pet",   distractors: ["b", "m"] },
  { id: "i",  display: "i",  audioFile: "i.mp3",  example: "ink",   distractors: ["a", "e"] },
  { id: "n",  display: "n",  audioFile: "n.mp3",  example: "net",   distractors: ["m", "t"] },
  { id: "o",  display: "o",  audioFile: "o.mp3",  example: "ox",    distractors: ["a", "u"] },
  { id: "b",  display: "b",  audioFile: "b.mp3",  example: "bat",   distractors: ["p", "d"] },
  { id: "c",  display: "c",  audioFile: "c.mp3",  example: "cat",   distractors: ["k", "g"] },

  // --- Tier 2: More single consonants and short vowels ---
  { id: "d",  display: "d",  audioFile: "d.mp3",  example: "dog",   distractors: ["b", "t"] },
  { id: "e",  display: "e",  audioFile: "e.mp3",  example: "egg",   distractors: ["a", "i"] },
  { id: "f",  display: "f",  audioFile: "f.mp3",  example: "fan",   distractors: ["v", "s"] },
  { id: "g",  display: "g",  audioFile: "g.mp3",  example: "gap",   distractors: ["c", "k"] },
  { id: "h",  display: "h",  audioFile: "h.mp3",  example: "hat",   distractors: ["n", "m"] },
  { id: "j",  display: "j",  audioFile: "j.mp3",  example: "jam",   distractors: ["g", "y"] },
  { id: "k",  display: "k",  audioFile: "k.mp3",  example: "kit",   distractors: ["c", "g"] },
  { id: "l",  display: "l",  audioFile: "l.mp3",  example: "leg",   distractors: ["r", "n"] },
  { id: "r",  display: "r",  audioFile: "r.mp3",  example: "red",   distractors: ["l", "w"] },
  { id: "u",  display: "u",  audioFile: "u.mp3",  example: "up",    distractors: ["a", "o"] },

  // --- Tier 3: Remaining single consonants ---
  { id: "v",  display: "v",  audioFile: "v.mp3",  example: "van",   distractors: ["f", "b"] },
  { id: "w",  display: "w",  audioFile: "w.mp3",  example: "wet",   distractors: ["r", "v"] },
  { id: "x",  display: "x",  audioFile: "x.mp3",  example: "fox",   distractors: ["s", "z"] },
  { id: "y",  display: "y",  audioFile: "y.mp3",  example: "yak",   distractors: ["j", "w"] },
  { id: "z",  display: "z",  audioFile: "z.mp3",  example: "zip",   distractors: ["s", "x"] },
  { id: "qu", display: "qu", audioFile: "qu.mp3", example: "queen", distractors: ["k", "w"] },

  // --- Tier 4: Consonant blends ---
  { id: "bl", display: "bl", audioFile: "bl.mp3", example: "blue",  distractors: ["br", "fl"] },
  { id: "cl", display: "cl", audioFile: "cl.mp3", example: "clap",  distractors: ["bl", "pl"] },
  { id: "fl", display: "fl", audioFile: "fl.mp3", example: "flag",  distractors: ["cl", "sl"] },
  { id: "pl", display: "pl", audioFile: "pl.mp3", example: "play",  distractors: ["cl", "bl"] },
  { id: "sl", display: "sl", audioFile: "sl.mp3", example: "sled",  distractors: ["fl", "pl"] },
  { id: "br", display: "br", audioFile: "br.mp3", example: "brag",  distractors: ["cr", "bl"] },
  { id: "cr", display: "cr", audioFile: "cr.mp3", example: "crab",  distractors: ["br", "dr"] },
  { id: "dr", display: "dr", audioFile: "dr.mp3", example: "drum",  distractors: ["cr", "gr"] },
  { id: "fr", display: "fr", audioFile: "fr.mp3", example: "frog",  distractors: ["br", "gr"] },
  { id: "gr", display: "gr", audioFile: "gr.mp3", example: "grip",  distractors: ["dr", "fr"] },
  { id: "pr", display: "pr", audioFile: "pr.mp3", example: "pram",  distractors: ["br", "gr"] },
  { id: "tr", display: "tr", audioFile: "tr.mp3", example: "trip",  distractors: ["dr", "cr"] },

  // --- Tier 5: Digraphs ---
  { id: "sh", display: "sh", audioFile: "sh.mp3", example: "ship",  distractors: ["ch", "th"] },
  { id: "ch", display: "ch", audioFile: "ch.mp3", example: "chip",  distractors: ["sh", "wh"] },
  { id: "th", display: "th", audioFile: "th.mp3", example: "this",  distractors: ["sh", "wh"] },
  { id: "wh", display: "wh", audioFile: "wh.mp3", example: "when",  distractors: ["th", "ch"] },
  { id: "ph", display: "ph", audioFile: "ph.mp3", example: "phone", distractors: ["f",  "wh"] },
  { id: "ck", display: "ck", audioFile: "ck.mp3", example: "duck",  distractors: ["k",  "ch"] },
  { id: "ng", display: "ng", audioFile: "ng.mp3", example: "ring",  distractors: ["n",  "nk"] },

  // --- Tier 6: Long vowels and vowel teams ---
  { id: "ai", display: "ai", audioFile: "ai.mp3", example: "rain",  distractors: ["ay", "ee"] },
  { id: "ay", display: "ay", audioFile: "ay.mp3", example: "day",   distractors: ["ai", "oa"] },
  { id: "ea", display: "ea", audioFile: "ea.mp3", example: "eat",   distractors: ["ee", "ai"] },
  { id: "ee", display: "ee", audioFile: "ee.mp3", example: "feet",  distractors: ["ea", "ie"] },
  { id: "oa", display: "oa", audioFile: "oa.mp3", example: "boat",  distractors: ["ow", "ay"] },
  { id: "ow", display: "ow", audioFile: "ow.mp3", example: "snow",  distractors: ["oa", "oe"] },
];
