export type StoryBookType = "original_decodable" | "open_book";
export type StoryImage = {
  kind: "emoji";
  emoji: string;
  background: string;
  label: string;
};

export interface StoryPhrase {
  id: string;
  text: string;
  words: string[];
  startMs?: number;
  endMs?: number;
}

export interface VocabularyHelp {
  word: string;
  definition: string;
  cue?: string;
}

export interface StoryPage {
  id: string;
  image: StoryImage;
  text: string;
  phrases: StoryPhrase[];
  audio?: string;
  vocabulary?: VocabularyHelp[];
}

export interface ComprehensionQuestion {
  id: string;
  question: string;
  choices: string[];
  answer: string;
}

export interface StoryBook {
  id: string;
  title: string;
  type: StoryBookType;
  source: string;
  sourceUrl?: string;
  license: string;
  attribution: string;
  skillGroup: string;
  prerequisitePhonemes: string[];
  prerequisiteWords: string[];
  coverImage: StoryImage;
  pages: StoryPage[];
  questions: ComprehensionQuestion[];
}

function phrase(id: string, text: string): StoryPhrase {
  return {
    id,
    text,
    words: text.replace(/[.?!]/g, "").split(" "),
  };
}

export const originalStoryBooks: StoryBook[] = [
  {
    id: "sam-and-the-mat",
    title: "Sam and the Mat",
    type: "original_decodable",
    source: "PhonicsPath original",
    license: "Original app content",
    attribution: "Written for PhonicsPath",
    skillGroup: "Early CVC",
    prerequisitePhonemes: ["s", "a", "m", "t", "c", "n"],
    prerequisiteWords: ["sam", "sat", "mat", "cat", "can"],
    coverImage: { kind: "emoji", emoji: "🧒", background: "#f59e0b", label: "Sam with a mat" },
    pages: [
      {
        id: "sam-mat-1",
        image: { kind: "emoji", emoji: "🧒", background: "#fbbf24", label: "Sam" },
        text: "Sam sat.",
        phrases: [phrase("sam-mat-1a", "Sam sat.")],
        vocabulary: [{ word: "sat", definition: "sat means rested on a seat or spot.", cue: "Sam sits down." }],
      },
      {
        id: "sam-mat-2",
        image: { kind: "emoji", emoji: "🟧", background: "#fb923c", label: "A mat" },
        text: "Sam sat on a mat.",
        phrases: [phrase("sam-mat-2a", "Sam sat"), phrase("sam-mat-2b", "on a mat.")],
        vocabulary: [{ word: "mat", definition: "a mat is a soft flat spot on the floor." }],
      },
      {
        id: "sam-mat-3",
        image: { kind: "emoji", emoji: "🐱", background: "#f472b6", label: "A cat" },
        text: "A cat sat.",
        phrases: [phrase("sam-mat-3a", "A cat"), phrase("sam-mat-3b", "sat.")],
        vocabulary: [{ word: "cat", definition: "a cat is a small pet that can purr." }],
      },
      {
        id: "sam-mat-4",
        image: { kind: "emoji", emoji: "😴", background: "#a78bfa", label: "A nap" },
        text: "Sam can nap.",
        phrases: [phrase("sam-mat-4a", "Sam can"), phrase("sam-mat-4b", "nap.")],
        vocabulary: [{ word: "nap", definition: "a nap is a short sleep." }],
      },
    ],
    questions: [
      { id: "sam-mat-q1", question: "Who sat on the mat?", choices: ["Sam", "dog", "ship"], answer: "Sam" },
      { id: "sam-mat-q2", question: "What sat too?", choices: ["cat", "mug", "ring"], answer: "cat" },
    ],
  },
  {
    id: "run-in-the-sun",
    title: "Run in the Sun",
    type: "original_decodable",
    source: "PhonicsPath original",
    license: "Original app content",
    attribution: "Written for PhonicsPath",
    skillGroup: "CVC practice",
    prerequisitePhonemes: ["r", "u", "n", "s", "i"],
    prerequisiteWords: ["run", "sun", "in", "up", "is"],
    coverImage: { kind: "emoji", emoji: "☀️", background: "#facc15", label: "Sun" },
    pages: [
      {
        id: "sun-run-1",
        image: { kind: "emoji", emoji: "🏃", background: "#34d399", label: "Run" },
        text: "Run in the sun.",
        phrases: [phrase("sun-run-1a", "Run in"), phrase("sun-run-1b", "the sun.")],
        vocabulary: [{ word: "sun", definition: "the sun gives light and warmth." }],
      },
      {
        id: "sun-run-2",
        image: { kind: "emoji", emoji: "⬆️", background: "#60a5fa", label: "Up" },
        text: "The sun is up.",
        phrases: [phrase("sun-run-2a", "The sun"), phrase("sun-run-2b", "is up.")],
      },
      {
        id: "sun-run-3",
        image: { kind: "emoji", emoji: "🧢", background: "#f97316", label: "Cap" },
        text: "Run, Sam, run.",
        phrases: [phrase("sun-run-3a", "Run, Sam,"), phrase("sun-run-3b", "run.")],
      },
    ],
    questions: [
      { id: "sun-run-q1", question: "Where did Sam run?", choices: ["in the sun", "in a ship", "in a bed"], answer: "in the sun" },
      { id: "sun-run-q2", question: "What is up?", choices: ["sun", "cat", "mug"], answer: "sun" },
    ],
  },
  {
    id: "the-red-mug",
    title: "The Red Mug",
    type: "original_decodable",
    source: "PhonicsPath original",
    license: "Original app content",
    attribution: "Written for PhonicsPath",
    skillGroup: "Short vowels",
    prerequisitePhonemes: ["m", "u", "g", "r", "e", "d"],
    prerequisiteWords: ["mug", "red", "bed", "big"],
    coverImage: { kind: "emoji", emoji: "☕", background: "#ef4444", label: "A red mug" },
    pages: [
      {
        id: "red-mug-1",
        image: { kind: "emoji", emoji: "☕", background: "#ef4444", label: "Mug" },
        text: "A red mug.",
        phrases: [phrase("red-mug-1a", "A red"), phrase("red-mug-1b", "mug.")],
        vocabulary: [{ word: "mug", definition: "a mug is a cup with a handle." }],
      },
      {
        id: "red-mug-2",
        image: { kind: "emoji", emoji: "🛏️", background: "#38bdf8", label: "Bed" },
        text: "The mug is on a bed.",
        phrases: [phrase("red-mug-2a", "The mug"), phrase("red-mug-2b", "is on a bed.")],
      },
      {
        id: "red-mug-3",
        image: { kind: "emoji", emoji: "🙌", background: "#22c55e", label: "Big" },
        text: "The red mug is big.",
        phrases: [phrase("red-mug-3a", "The red mug"), phrase("red-mug-3b", "is big.")],
      },
    ],
    questions: [
      { id: "red-mug-q1", question: "What color is the mug?", choices: ["red", "blue", "green"], answer: "red" },
      { id: "red-mug-q2", question: "Where is the mug?", choices: ["on a bed", "on a ship", "in the sun"], answer: "on a bed" },
    ],
  },
  {
    id: "ship-at-the-shop",
    title: "Ship at the Shop",
    type: "original_decodable",
    source: "PhonicsPath original",
    license: "Original app content",
    attribution: "Written for PhonicsPath",
    skillGroup: "Digraph CVC",
    prerequisitePhonemes: ["sh", "ch", "i", "o", "p"],
    prerequisiteWords: ["ship", "shop", "chip", "chop"],
    coverImage: { kind: "emoji", emoji: "⛵", background: "#38bdf8", label: "Ship" },
    pages: [
      {
        id: "ship-shop-1",
        image: { kind: "emoji", emoji: "⛵", background: "#0ea5e9", label: "Ship" },
        text: "A ship can go.",
        phrases: [phrase("ship-shop-1a", "A ship"), phrase("ship-shop-1b", "can go.")],
        vocabulary: [{ word: "ship", definition: "a ship is a big boat." }],
      },
      {
        id: "ship-shop-2",
        image: { kind: "emoji", emoji: "🏪", background: "#14b8a6", label: "Shop" },
        text: "Chip is at the shop.",
        phrases: [phrase("ship-shop-2a", "Chip is"), phrase("ship-shop-2b", "at the shop.")],
        vocabulary: [{ word: "shop", definition: "a shop is a place to get things." }],
      },
      {
        id: "ship-shop-3",
        image: { kind: "emoji", emoji: "🔪", background: "#f97316", label: "Chop" },
        text: "Chip can chop.",
        phrases: [phrase("ship-shop-3a", "Chip can"), phrase("ship-shop-3b", "chop.")],
      },
      {
        id: "ship-shop-4",
        image: { kind: "emoji", emoji: "🎉", background: "#8b5cf6", label: "Happy ending" },
        text: "The ship is fun.",
        phrases: [phrase("ship-shop-4a", "The ship"), phrase("ship-shop-4b", "is fun.")],
      },
    ],
    questions: [
      { id: "ship-shop-q1", question: "Where is Chip?", choices: ["at the shop", "on a bed", "in a mug"], answer: "at the shop" },
      { id: "ship-shop-q2", question: "What can Chip do?", choices: ["chop", "nap", "ring"], answer: "chop" },
    ],
  },
  {
    id: "ring-and-king",
    title: "The Ring",
    type: "original_decodable",
    source: "PhonicsPath original",
    license: "Original app content",
    attribution: "Written for PhonicsPath",
    skillGroup: "ng and mixed review",
    prerequisitePhonemes: ["r", "i", "ng", "th", "sh"],
    prerequisiteWords: ["ring", "thin", "ship", "run"],
    coverImage: { kind: "emoji", emoji: "💍", background: "#a855f7", label: "Ring" },
    pages: [
      {
        id: "ring-1",
        image: { kind: "emoji", emoji: "💍", background: "#c084fc", label: "Ring" },
        text: "A ring is in a box.",
        phrases: [phrase("ring-1a", "A ring"), phrase("ring-1b", "is in a box.")],
        vocabulary: [{ word: "ring", definition: "a ring is a small round band." }],
      },
      {
        id: "ring-2",
        image: { kind: "emoji", emoji: "🤏", background: "#f472b6", label: "Thin" },
        text: "The ring is thin.",
        phrases: [phrase("ring-2a", "The ring"), phrase("ring-2b", "is thin.")],
        vocabulary: [{ word: "thin", definition: "thin means not wide or thick." }],
      },
      {
        id: "ring-3",
        image: { kind: "emoji", emoji: "⛵", background: "#60a5fa", label: "Ship" },
        text: "The ring is on a ship.",
        phrases: [phrase("ring-3a", "The ring"), phrase("ring-3b", "is on a ship.")],
      },
    ],
    questions: [
      { id: "ring-q1", question: "What is in the box?", choices: ["ring", "mug", "cat"], answer: "ring" },
      { id: "ring-q2", question: "Where is the ring at the end?", choices: ["on a ship", "on a mat", "in the sun"], answer: "on a ship" },
    ],
  },
];

export const openBookShelf: StoryBook[] = [
  {
    id: "bookdash-placeholder-hair",
    title: "Book Dash candidate: Hair",
    type: "open_book",
    source: "Book Dash source files",
    sourceUrl: "https://bookdash.org/book-source-files/",
    license: "CC BY 4.0 metadata placeholder",
    attribution: "Attribution required before assets are embedded",
    skillGroup: "Listening, vocabulary, comprehension",
    prerequisitePhonemes: [],
    prerequisiteWords: [],
    coverImage: { kind: "emoji", emoji: "📘", background: "#2563eb", label: "Open book placeholder" },
    pages: [],
    questions: [],
  },
  {
    id: "bookdash-placeholder-animals",
    title: "Book Dash candidate: Animals",
    type: "open_book",
    source: "Book Dash source files",
    sourceUrl: "https://bookdash.org/book-source-files/",
    license: "CC BY 4.0 metadata placeholder",
    attribution: "Attribution required before assets are embedded",
    skillGroup: "Picture-book listening",
    prerequisitePhonemes: [],
    prerequisiteWords: [],
    coverImage: { kind: "emoji", emoji: "📗", background: "#16a34a", label: "Open book placeholder" },
    pages: [],
    questions: [],
  },
  {
    id: "global-library-placeholder",
    title: "Global Digital Library candidate",
    type: "open_book",
    source: "Global Digital Library",
    sourceUrl: "https://content.digitallibrary.io/",
    license: "Check individual Creative Commons license before embedding",
    attribution: "Attribution required before assets are embedded",
    skillGroup: "Future open shelf",
    prerequisitePhonemes: [],
    prerequisiteWords: [],
    coverImage: { kind: "emoji", emoji: "📙", background: "#f97316", label: "Open book placeholder" },
    pages: [],
    questions: [],
  },
];

export const storyBooks = [...originalStoryBooks, ...openBookShelf];
