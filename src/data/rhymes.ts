export interface RhymeSet {
  id: string;
  targetWord: string;
  rhymeWord: string;
  distractors: [string, string];
}

export const rhymes: RhymeSet[] = [
  // Group 1: CVC words
  { id: "cat",   targetWord: "cat",   rhymeWord: "hat",   distractors: ["dog",   "sun"]   },
  { id: "bed",   targetWord: "bed",   rhymeWord: "red",   distractors: ["cat",   "hop"]   },
  { id: "big",   targetWord: "big",   rhymeWord: "pig",   distractors: ["map",   "bed"]   },
  { id: "hop",   targetWord: "hop",   rhymeWord: "top",   distractors: ["hat",   "bug"]   },
  { id: "bug",   targetWord: "bug",   rhymeWord: "mug",   distractors: ["top",   "red"]   },
  { id: "can",   targetWord: "can",   rhymeWord: "fan",   distractors: ["bug",   "pig"]   },
  { id: "net",   targetWord: "net",   rhymeWord: "wet",   distractors: ["can",   "big"]   },
  // Group 2: Digraph and blend words
  { id: "ship",  targetWord: "ship",  rhymeWord: "chip",  distractors: ["cap",   "mud"]   },
  { id: "chop",  targetWord: "chop",  rhymeWord: "shop",  distractors: ["ship",  "bed"]   },
  { id: "flag",  targetWord: "flag",  rhymeWord: "bag",   distractors: ["chop",  "hill"]  },
  { id: "frog",  targetWord: "frog",  rhymeWord: "log",   distractors: ["flag",  "cup"]   },
  { id: "clap",  targetWord: "clap",  rhymeWord: "map",   distractors: ["frog",  "ship"]  },
  // Group 3: Long vowel words
  { id: "cake",  targetWord: "cake",  rhymeWord: "make",  distractors: ["clap",  "book"]  },
  { id: "kite",  targetWord: "kite",  rhymeWord: "bite",  distractors: ["cake",  "run"]   },
  { id: "bone",  targetWord: "bone",  rhymeWord: "cone",  distractors: ["kite",  "bag"]   },
  { id: "rose",  targetWord: "rose",  rhymeWord: "nose",  distractors: ["bone",  "hat"]   },
  { id: "tune",  targetWord: "tune",  rhymeWord: "moon",  distractors: ["rose",  "cake"]  },
  // Group 4: Mixed
  { id: "sing",  targetWord: "sing",  rhymeWord: "ring",  distractors: ["tune",  "flat"]  },
  { id: "ball",  targetWord: "ball",  rhymeWord: "tall",  distractors: ["sing",  "pen"]   },
  { id: "tree",  targetWord: "tree",  rhymeWord: "bee",   distractors: ["ball",  "cup"]   },
  { id: "run",   targetWord: "run",   rhymeWord: "sun",   distractors: ["tree",  "pig"]   },
  { id: "book",  targetWord: "book",  rhymeWord: "cook",  distractors: ["run",   "ball"]  },
  { id: "rain",  targetWord: "rain",  rhymeWord: "train", distractors: ["book",  "sit"]   },
  { id: "play",  targetWord: "play",  rhymeWord: "day",   distractors: ["rain",  "cup"]   },
  { id: "sleep", targetWord: "sleep", rhymeWord: "deep",  distractors: ["play",  "book"]  },
];

// All unique words that need audio files in public/audio/rhymes/
export const ALL_RHYME_WORDS: string[] = [...new Set(
  rhymes.flatMap((r) => [r.targetWord, r.rhymeWord, ...r.distractors])
)].sort();
