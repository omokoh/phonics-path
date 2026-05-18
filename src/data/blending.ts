export interface BlendSet {
  id: string;
  sounds: string[];
  word: string;
  emoji: string;
  audioFiles: string[];
  wordAudioFile: string;
  distractors: { word: string; emoji: string }[];
  group: 1 | 2 | 3 | 4;
}

export const blendings: BlendSet[] = [
  // ── Group 1: 2-sound words ─────────────────────────────────────────────────
  {
    id: "in", sounds: ["i","n"], word: "in", emoji: "📥",
    audioFiles: ["i.mp3","n.mp3"], wordAudioFile: "in.mp3",
    distractors: [{ word: "dog", emoji: "🐶" }, { word: "cup", emoji: "🥤" }],
    group: 1,
  },
  {
    id: "up", sounds: ["u","p"], word: "up", emoji: "⬆️",
    audioFiles: ["u.mp3","p.mp3"], wordAudioFile: "up.mp3",
    distractors: [{ word: "cat", emoji: "🐱" }, { word: "hat", emoji: "🎩" }],
    group: 1,
  },
  {
    id: "at", sounds: ["a","t"], word: "at", emoji: "🎯",
    audioFiles: ["a.mp3","t.mp3"], wordAudioFile: "at.mp3",
    distractors: [{ word: "sun", emoji: "☀️" }, { word: "big", emoji: "🐘" }],
    group: 1,
  },
  {
    id: "it", sounds: ["i","t"], word: "it", emoji: "✨",
    audioFiles: ["i.mp3","t.mp3"], wordAudioFile: "it.mp3",
    distractors: [{ word: "fan", emoji: "🌀" }, { word: "mug", emoji: "☕" }],
    group: 1,
  },
  {
    id: "on", sounds: ["o","n"], word: "on", emoji: "💡",
    audioFiles: ["o.mp3","n.mp3"], wordAudioFile: "on.mp3",
    distractors: [{ word: "bus", emoji: "🚌" }, { word: "red", emoji: "🍎" }],
    group: 1,
  },

  // ── Group 2: 3-sound CVC words ─────────────────────────────────────────────
  {
    id: "cat", sounds: ["c","a","t"], word: "cat", emoji: "🐱",
    audioFiles: ["c.mp3","a.mp3","t.mp3"], wordAudioFile: "cat.mp3",
    distractors: [{ word: "dog", emoji: "🐶" }, { word: "sun", emoji: "☀️" }],
    group: 2,
  },
  {
    id: "dog", sounds: ["d","o","g"], word: "dog", emoji: "🐶",
    audioFiles: ["d.mp3","o.mp3","g.mp3"], wordAudioFile: "dog.mp3",
    distractors: [{ word: "cat", emoji: "🐱" }, { word: "hat", emoji: "🎩" }],
    group: 2,
  },
  {
    id: "sun", sounds: ["s","u","n"], word: "sun", emoji: "☀️",
    audioFiles: ["s.mp3","u.mp3","n.mp3"], wordAudioFile: "sun.mp3",
    distractors: [{ word: "mug", emoji: "☕" }, { word: "pin", emoji: "📌" }],
    group: 2,
  },
  {
    id: "hat", sounds: ["h","a","t"], word: "hat", emoji: "🎩",
    audioFiles: ["h.mp3","a.mp3","t.mp3"], wordAudioFile: "hat.mp3",
    distractors: [{ word: "dog", emoji: "🐶" }, { word: "big", emoji: "🐘" }],
    group: 2,
  },
  {
    id: "big", sounds: ["b","i","g"], word: "big", emoji: "🐘",
    audioFiles: ["b.mp3","i.mp3","g.mp3"], wordAudioFile: "big.mp3",
    distractors: [{ word: "hat", emoji: "🎩" }, { word: "cup", emoji: "🥤" }],
    group: 2,
  },
  {
    id: "red", sounds: ["r","e","d"], word: "red", emoji: "🍎",
    audioFiles: ["r.mp3","e.mp3","d.mp3"], wordAudioFile: "red.mp3",
    distractors: [{ word: "bus", emoji: "🚌" }, { word: "fan", emoji: "🌀" }],
    group: 2,
  },
  {
    id: "mug", sounds: ["m","u","g"], word: "mug", emoji: "☕",
    audioFiles: ["m.mp3","u.mp3","g.mp3"], wordAudioFile: "mug.mp3",
    distractors: [{ word: "sun", emoji: "☀️" }, { word: "pin", emoji: "📌" }],
    group: 2,
  },
  {
    id: "pin", sounds: ["p","i","n"], word: "pin", emoji: "📌",
    audioFiles: ["p.mp3","i.mp3","n.mp3"], wordAudioFile: "pin.mp3",
    distractors: [{ word: "bus", emoji: "🚌" }, { word: "cup", emoji: "🥤" }],
    group: 2,
  },
  {
    id: "bus", sounds: ["b","u","s"], word: "bus", emoji: "🚌",
    audioFiles: ["b.mp3","u.mp3","s.mp3"], wordAudioFile: "bus.mp3",
    distractors: [{ word: "fan", emoji: "🌀" }, { word: "jet", emoji: "✈️" }],
    group: 2,
  },
  {
    id: "fan", sounds: ["f","a","n"], word: "fan", emoji: "🌀",
    audioFiles: ["f.mp3","a.mp3","n.mp3"], wordAudioFile: "fan.mp3",
    distractors: [{ word: "bus", emoji: "🚌" }, { word: "mug", emoji: "☕" }],
    group: 2,
  },
  {
    id: "wet", sounds: ["w","e","t"], word: "wet", emoji: "💧",
    audioFiles: ["w.mp3","e.mp3","t.mp3"], wordAudioFile: "wet.mp3",
    distractors: [{ word: "jet", emoji: "✈️" }, { word: "nap", emoji: "😴" }],
    group: 2,
  },
  {
    id: "jet", sounds: ["j","e","t"], word: "jet", emoji: "✈️",
    audioFiles: ["j.mp3","e.mp3","t.mp3"], wordAudioFile: "jet.mp3",
    distractors: [{ word: "wet", emoji: "💧" }, { word: "hop", emoji: "🐰" }],
    group: 2,
  },
  {
    id: "hop", sounds: ["h","o","p"], word: "hop", emoji: "🐰",
    audioFiles: ["h.mp3","o.mp3","p.mp3"], wordAudioFile: "hop.mp3",
    distractors: [{ word: "nap", emoji: "😴" }, { word: "cup", emoji: "🥤" }],
    group: 2,
  },
  {
    id: "nap", sounds: ["n","a","p"], word: "nap", emoji: "😴",
    audioFiles: ["n.mp3","a.mp3","p.mp3"], wordAudioFile: "nap.mp3",
    distractors: [{ word: "hop", emoji: "🐰" }, { word: "cat", emoji: "🐱" }],
    group: 2,
  },
  {
    id: "cup", sounds: ["c","u","p"], word: "cup", emoji: "🥤",
    audioFiles: ["c.mp3","u.mp3","p.mp3"], wordAudioFile: "cup.mp3",
    distractors: [{ word: "pin", emoji: "📌" }, { word: "nap", emoji: "😴" }],
    group: 2,
  },

  // ── Group 3: 3-sound words with digraphs ───────────────────────────────────
  {
    id: "ship", sounds: ["sh","i","p"], word: "ship", emoji: "⛵",
    audioFiles: ["sh.mp3","i.mp3","p.mp3"], wordAudioFile: "ship.mp3",
    distractors: [{ word: "chip", emoji: "🍟" }, { word: "ring", emoji: "💍" }],
    group: 3,
  },
  {
    id: "chip", sounds: ["ch","i","p"], word: "chip", emoji: "🍟",
    audioFiles: ["ch.mp3","i.mp3","p.mp3"], wordAudioFile: "chip.mp3",
    distractors: [{ word: "ship", emoji: "⛵" }, { word: "ring", emoji: "💍" }],
    group: 3,
  },
  {
    id: "thin", sounds: ["th","i","n"], word: "thin", emoji: "📏",
    audioFiles: ["th_soft.mp3","i.mp3","n.mp3"], wordAudioFile: "thin.mp3",
    distractors: [{ word: "ship", emoji: "⛵" }, { word: "whip", emoji: "🪢" }],
    group: 3,
  },
  {
    id: "whip", sounds: ["wh","i","p"], word: "whip", emoji: "🪢",
    audioFiles: ["wh.mp3","i.mp3","p.mp3"], wordAudioFile: "whip.mp3",
    distractors: [{ word: "ship", emoji: "⛵" }, { word: "chip", emoji: "🍟" }],
    group: 3,
  },
  {
    id: "ring", sounds: ["r","i","ng"], word: "ring", emoji: "💍",
    audioFiles: ["r.mp3","i.mp3","ng.mp3"], wordAudioFile: "ring.mp3",
    distractors: [{ word: "ship", emoji: "⛵" }, { word: "chip", emoji: "🍟" }],
    group: 3,
  },

  // ── Group 4: 4-sound words with consonant blends ────────────────────────────
  {
    id: "flag", sounds: ["fl","a","g"], word: "flag", emoji: "🚩",
    audioFiles: ["fl.mp3","a.mp3","g.mp3"], wordAudioFile: "flag.mp3",
    distractors: [{ word: "frog", emoji: "🐸" }, { word: "clap", emoji: "👏" }],
    group: 4,
  },
  {
    id: "stop", sounds: ["s","t","o","p"], word: "stop", emoji: "🛑",
    audioFiles: ["s.mp3","t.mp3","o.mp3","p.mp3"], wordAudioFile: "stop.mp3",
    distractors: [{ word: "flag", emoji: "🚩" }, { word: "drum", emoji: "🥁" }],
    group: 4,
  },
  {
    id: "frog", sounds: ["fr","o","g"], word: "frog", emoji: "🐸",
    audioFiles: ["fr.mp3","o.mp3","g.mp3"], wordAudioFile: "frog.mp3",
    distractors: [{ word: "flag", emoji: "🚩" }, { word: "grab", emoji: "🤚" }],
    group: 4,
  },
  {
    id: "clap", sounds: ["cl","a","p"], word: "clap", emoji: "👏",
    audioFiles: ["cl.mp3","a.mp3","p.mp3"], wordAudioFile: "clap.mp3",
    distractors: [{ word: "flag", emoji: "🚩" }, { word: "drum", emoji: "🥁" }],
    group: 4,
  },
  {
    id: "drum", sounds: ["dr","u","m"], word: "drum", emoji: "🥁",
    audioFiles: ["dr.mp3","u.mp3","m.mp3"], wordAudioFile: "drum.mp3",
    distractors: [{ word: "clap", emoji: "👏" }, { word: "crab", emoji: "🦀" }],
    group: 4,
  },
  {
    id: "slip", sounds: ["sl","i","p"], word: "slip", emoji: "🧊",
    audioFiles: ["sl.mp3","i.mp3","p.mp3"], wordAudioFile: "slip.mp3",
    distractors: [{ word: "trip", emoji: "🧳" }, { word: "clap", emoji: "👏" }],
    group: 4,
  },
  {
    id: "trip", sounds: ["tr","i","p"], word: "trip", emoji: "🧳",
    audioFiles: ["tr.mp3","i.mp3","p.mp3"], wordAudioFile: "trip.mp3",
    distractors: [{ word: "slip", emoji: "🧊" }, { word: "brag", emoji: "🏆" }],
    group: 4,
  },
  {
    id: "grab", sounds: ["gr","a","b"], word: "grab", emoji: "🤚",
    audioFiles: ["gr.mp3","a.mp3","b.mp3"], wordAudioFile: "grab.mp3",
    distractors: [{ word: "crab", emoji: "🦀" }, { word: "brag", emoji: "🏆" }],
    group: 4,
  },
  {
    id: "brag", sounds: ["br","a","g"], word: "brag", emoji: "🏆",
    audioFiles: ["br.mp3","a.mp3","g.mp3"], wordAudioFile: "brag.mp3",
    distractors: [{ word: "grab", emoji: "🤚" }, { word: "crab", emoji: "🦀" }],
    group: 4,
  },
  {
    id: "crab", sounds: ["cr","a","b"], word: "crab", emoji: "🦀",
    audioFiles: ["cr.mp3","a.mp3","b.mp3"], wordAudioFile: "crab.mp3",
    distractors: [{ word: "brag", emoji: "🏆" }, { word: "drum", emoji: "🥁" }],
    group: 4,
  },
];

// All unique words needed for public/audio/blending/
export const ALL_BLENDING_WORDS: string[] = [...new Set(
  blendings.map((b) => b.word)
)].sort();
