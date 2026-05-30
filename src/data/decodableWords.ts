export type DecodableGroup = "vc" | "cv" | "cvc" | "digraph-cvc";

export interface DecodableWord {
  id: string;
  word: string;
  graphemes: string[];
  phonemeIds: string[];
  audioFiles: string[];
  prerequisiteLevel: 1 | 2 | 3 | 4 | 5 | 6;
  group: DecodableGroup;
  difficulty: 1 | 2 | 3 | 4;
  tilePool: string[];
  distractors: string[];
}

function tilePool(graphemes: string[], distractors: string[]): string[] {
  return [...graphemes, ...distractors];
}

export const decodableWords: DecodableWord[] = [
  // VC words
  {
    id: "at", word: "at", graphemes: ["a", "t"], phonemeIds: ["a", "t"],
    audioFiles: ["a.mp3", "t.mp3"], prerequisiteLevel: 1, group: "vc", difficulty: 1,
    tilePool: tilePool(["a", "t"], ["m", "s"]), distractors: ["am", "it"],
  },
  {
    id: "in", word: "in", graphemes: ["i", "n"], phonemeIds: ["i", "n"],
    audioFiles: ["i.mp3", "n.mp3"], prerequisiteLevel: 1, group: "vc", difficulty: 1,
    tilePool: tilePool(["i", "n"], ["a", "t"]), distractors: ["it", "on"],
  },
  {
    id: "on", word: "on", graphemes: ["o", "n"], phonemeIds: ["o", "n"],
    audioFiles: ["o.mp3", "n.mp3"], prerequisiteLevel: 1, group: "vc", difficulty: 1,
    tilePool: tilePool(["o", "n"], ["i", "m"]), distractors: ["in", "up"],
  },
  {
    id: "up", word: "up", graphemes: ["u", "p"], phonemeIds: ["u", "p"],
    audioFiles: ["u.mp3", "p.mp3"], prerequisiteLevel: 2, group: "vc", difficulty: 1,
    tilePool: tilePool(["u", "p"], ["a", "n"]), distractors: ["on", "at"],
  },
  {
    id: "it", word: "it", graphemes: ["i", "t"], phonemeIds: ["i", "t"],
    audioFiles: ["i.mp3", "t.mp3"], prerequisiteLevel: 1, group: "vc", difficulty: 1,
    tilePool: tilePool(["i", "t"], ["a", "p"]), distractors: ["at", "in"],
  },
  {
    id: "am", word: "am", graphemes: ["a", "m"], phonemeIds: ["a", "m"],
    audioFiles: ["a.mp3", "m.mp3"], prerequisiteLevel: 1, group: "vc", difficulty: 1,
    tilePool: tilePool(["a", "m"], ["i", "s"]), distractors: ["at", "in"],
  },
  {
    id: "is", word: "is", graphemes: ["i", "s"], phonemeIds: ["i", "s"],
    audioFiles: ["i.mp3", "s.mp3"], prerequisiteLevel: 1, group: "vc", difficulty: 1,
    tilePool: tilePool(["i", "s"], ["a", "t"]), distractors: ["it", "in"],
  },

  // CV words
  {
    id: "so", word: "so", graphemes: ["s", "o"], phonemeIds: ["s", "o"],
    audioFiles: ["s.mp3", "o.mp3"], prerequisiteLevel: 1, group: "cv", difficulty: 1,
    tilePool: tilePool(["s", "o"], ["m", "a"]), distractors: ["no", "go"],
  },
  {
    id: "no", word: "no", graphemes: ["n", "o"], phonemeIds: ["n", "o"],
    audioFiles: ["n.mp3", "o.mp3"], prerequisiteLevel: 1, group: "cv", difficulty: 1,
    tilePool: tilePool(["n", "o"], ["s", "i"]), distractors: ["so", "go"],
  },
  {
    id: "go", word: "go", graphemes: ["g", "o"], phonemeIds: ["g", "o"],
    audioFiles: ["g.mp3", "o.mp3"], prerequisiteLevel: 2, group: "cv", difficulty: 2,
    tilePool: tilePool(["g", "o"], ["n", "a"]), distractors: ["no", "so"],
  },
  {
    id: "me", word: "me", graphemes: ["m", "e"], phonemeIds: ["m", "e"],
    audioFiles: ["m.mp3", "e.mp3"], prerequisiteLevel: 2, group: "cv", difficulty: 2,
    tilePool: tilePool(["m", "e"], ["h", "a"]), distractors: ["he", "we"],
  },
  {
    id: "he", word: "he", graphemes: ["h", "e"], phonemeIds: ["h", "e"],
    audioFiles: ["h.mp3", "e.mp3"], prerequisiteLevel: 2, group: "cv", difficulty: 2,
    tilePool: tilePool(["h", "e"], ["m", "o"]), distractors: ["me", "we"],
  },

  // CVC words
  {
    id: "cat", word: "cat", graphemes: ["c", "a", "t"], phonemeIds: ["c", "a", "t"],
    audioFiles: ["c.mp3", "a.mp3", "t.mp3"], prerequisiteLevel: 1, group: "cvc", difficulty: 2,
    tilePool: tilePool(["c", "a", "t"], ["m", "s"]), distractors: ["hat", "can"],
  },
  {
    id: "sat", word: "sat", graphemes: ["s", "a", "t"], phonemeIds: ["s", "a", "t"],
    audioFiles: ["s.mp3", "a.mp3", "t.mp3"], prerequisiteLevel: 1, group: "cvc", difficulty: 2,
    tilePool: tilePool(["s", "a", "t"], ["m", "p"]), distractors: ["mat", "sit"],
  },
  {
    id: "sam", word: "Sam", graphemes: ["s", "a", "m"], phonemeIds: ["s", "a", "m"],
    audioFiles: ["s.mp3", "a.mp3", "m.mp3"], prerequisiteLevel: 1, group: "cvc", difficulty: 2,
    tilePool: tilePool(["s", "a", "m"], ["t", "p"]), distractors: ["sat", "mat"],
  },
  {
    id: "mat", word: "mat", graphemes: ["m", "a", "t"], phonemeIds: ["m", "a", "t"],
    audioFiles: ["m.mp3", "a.mp3", "t.mp3"], prerequisiteLevel: 1, group: "cvc", difficulty: 2,
    tilePool: tilePool(["m", "a", "t"], ["s", "p"]), distractors: ["sat", "cat"],
  },
  {
    id: "sit", word: "sit", graphemes: ["s", "i", "t"], phonemeIds: ["s", "i", "t"],
    audioFiles: ["s.mp3", "i.mp3", "t.mp3"], prerequisiteLevel: 1, group: "cvc", difficulty: 2,
    tilePool: tilePool(["s", "i", "t"], ["a", "m"]), distractors: ["sat", "sun"],
  },
  {
    id: "sun", word: "sun", graphemes: ["s", "u", "n"], phonemeIds: ["s", "u", "n"],
    audioFiles: ["s.mp3", "u.mp3", "n.mp3"], prerequisiteLevel: 2, group: "cvc", difficulty: 2,
    tilePool: tilePool(["s", "u", "n"], ["a", "t"]), distractors: ["run", "fun"],
  },
  {
    id: "run", word: "run", graphemes: ["r", "u", "n"], phonemeIds: ["r", "u", "n"],
    audioFiles: ["r.mp3", "u.mp3", "n.mp3"], prerequisiteLevel: 2, group: "cvc", difficulty: 2,
    tilePool: tilePool(["r", "u", "n"], ["s", "a"]), distractors: ["sun", "red"],
  },
  {
    id: "can", word: "can", graphemes: ["c", "a", "n"], phonemeIds: ["c", "a", "n"],
    audioFiles: ["c.mp3", "a.mp3", "n.mp3"], prerequisiteLevel: 1, group: "cvc", difficulty: 2,
    tilePool: tilePool(["c", "a", "n"], ["t", "m"]), distractors: ["cat", "fan"],
  },
  {
    id: "fan", word: "fan", graphemes: ["f", "a", "n"], phonemeIds: ["f", "a", "n"],
    audioFiles: ["f.mp3", "a.mp3", "n.mp3"], prerequisiteLevel: 2, group: "cvc", difficulty: 2,
    tilePool: tilePool(["f", "a", "n"], ["c", "t"]), distractors: ["can", "fun"],
  },
  {
    id: "dog", word: "dog", graphemes: ["d", "o", "g"], phonemeIds: ["d", "o", "g"],
    audioFiles: ["d.mp3", "o.mp3", "g.mp3"], prerequisiteLevel: 2, group: "cvc", difficulty: 3,
    tilePool: tilePool(["d", "o", "g"], ["c", "a"]), distractors: ["cat", "mug"],
  },
  {
    id: "mug", word: "mug", graphemes: ["m", "u", "g"], phonemeIds: ["m", "u", "g"],
    audioFiles: ["m.mp3", "u.mp3", "g.mp3"], prerequisiteLevel: 2, group: "cvc", difficulty: 3,
    tilePool: tilePool(["m", "u", "g"], ["n", "i"]), distractors: ["sun", "dog"],
  },
  {
    id: "red", word: "red", graphemes: ["r", "e", "d"], phonemeIds: ["r", "e", "d"],
    audioFiles: ["r.mp3", "e.mp3", "d.mp3"], prerequisiteLevel: 2, group: "cvc", difficulty: 3,
    tilePool: tilePool(["r", "e", "d"], ["b", "u"]), distractors: ["bed", "run"],
  },
  {
    id: "bed", word: "bed", graphemes: ["b", "e", "d"], phonemeIds: ["b", "e", "d"],
    audioFiles: ["b.mp3", "e.mp3", "d.mp3"], prerequisiteLevel: 2, group: "cvc", difficulty: 3,
    tilePool: tilePool(["b", "e", "d"], ["r", "a"]), distractors: ["red", "big"],
  },
  {
    id: "big", word: "big", graphemes: ["b", "i", "g"], phonemeIds: ["b", "i", "g"],
    audioFiles: ["b.mp3", "i.mp3", "g.mp3"], prerequisiteLevel: 2, group: "cvc", difficulty: 3,
    tilePool: tilePool(["b", "i", "g"], ["p", "e"]), distractors: ["pin", "bed"],
  },
  {
    id: "pin", word: "pin", graphemes: ["p", "i", "n"], phonemeIds: ["p", "i", "n"],
    audioFiles: ["p.mp3", "i.mp3", "n.mp3"], prerequisiteLevel: 1, group: "cvc", difficulty: 2,
    tilePool: tilePool(["p", "i", "n"], ["b", "a"]), distractors: ["big", "sit"],
  },

  // Digraph CVC words
  {
    id: "ship", word: "ship", graphemes: ["sh", "i", "p"], phonemeIds: ["sh", "i", "p"],
    audioFiles: ["sh.mp3", "i.mp3", "p.mp3"], prerequisiteLevel: 5, group: "digraph-cvc", difficulty: 4,
    tilePool: tilePool(["sh", "i", "p"], ["ch", "n"]), distractors: ["chip", "whip"],
  },
  {
    id: "chip", word: "chip", graphemes: ["ch", "i", "p"], phonemeIds: ["ch", "i", "p"],
    audioFiles: ["ch.mp3", "i.mp3", "p.mp3"], prerequisiteLevel: 5, group: "digraph-cvc", difficulty: 4,
    tilePool: tilePool(["ch", "i", "p"], ["sh", "t"]), distractors: ["ship", "chop"],
  },
  {
    id: "shop", word: "shop", graphemes: ["sh", "o", "p"], phonemeIds: ["sh", "o", "p"],
    audioFiles: ["sh.mp3", "o.mp3", "p.mp3"], prerequisiteLevel: 5, group: "digraph-cvc", difficulty: 4,
    tilePool: tilePool(["sh", "o", "p"], ["ch", "i"]), distractors: ["ship", "chop"],
  },
  {
    id: "chop", word: "chop", graphemes: ["ch", "o", "p"], phonemeIds: ["ch", "o", "p"],
    audioFiles: ["ch.mp3", "o.mp3", "p.mp3"], prerequisiteLevel: 5, group: "digraph-cvc", difficulty: 4,
    tilePool: tilePool(["ch", "o", "p"], ["sh", "a"]), distractors: ["shop", "chip"],
  },
  {
    id: "thin", word: "thin", graphemes: ["th", "i", "n"], phonemeIds: ["th_soft", "i", "n"],
    audioFiles: ["th_soft.mp3", "i.mp3", "n.mp3"], prerequisiteLevel: 5, group: "digraph-cvc", difficulty: 4,
    tilePool: tilePool(["th", "i", "n"], ["sh", "p"]), distractors: ["ship", "ring"],
  },
  {
    id: "ring", word: "ring", graphemes: ["r", "i", "ng"], phonemeIds: ["r", "i", "ng"],
    audioFiles: ["r.mp3", "i.mp3", "ng.mp3"], prerequisiteLevel: 5, group: "digraph-cvc", difficulty: 4,
    tilePool: tilePool(["r", "i", "ng"], ["n", "sh"]), distractors: ["thin", "run"],
  },
  {
    id: "whip", word: "whip", graphemes: ["wh", "i", "p"], phonemeIds: ["wh", "i", "p"],
    audioFiles: ["wh.mp3", "i.mp3", "p.mp3"], prerequisiteLevel: 5, group: "digraph-cvc", difficulty: 4,
    tilePool: tilePool(["wh", "i", "p"], ["sh", "n"]), distractors: ["ship", "chip"],
  },
];

export function getDecodableWord(id: string): DecodableWord | undefined {
  return decodableWords.find((word) => word.id === id);
}
