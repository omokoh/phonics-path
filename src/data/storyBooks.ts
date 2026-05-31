export type StoryBookType = "original_decodable" | "open_book";
export type StoryImage =
  | {
      kind: "emoji";
      emoji: string;
      background: string;
      label: string;
    }
  | {
      kind: "asset";
      src: string;
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

function assetImage(bookId: string, file: string, label: string, background = "#dbeafe"): StoryImage {
  return {
    kind: "asset",
    src: `/open-books/${bookId}/${file}`,
    background,
    label,
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
    id: "whose-button-is-this",
    title: "Whose Button Is This?",
    type: "open_book",
    source: "Book Dash",
    sourceUrl: "https://bookdash.github.io/bookdash-books/whose-button-is-this/en/",
    license: "Creative Commons Attribution 4.0 International (CC BY 4.0)",
    attribution: "Whose button is this? by Paul Kennedy, James Woolley, and Louise Gale. Published by Book Dash under CC BY 4.0.",
    skillGroup: "Open picture book",
    prerequisitePhonemes: [],
    prerequisiteWords: [],
    coverImage: assetImage("whose-button-is-this", "cover.jpg", "Tinny Tim with a blue button", "#bfdbfe"),
    pages: [
      {
        id: "button-1",
        image: assetImage("whose-button-is-this", "01.jpg", "Tinny Tim sees a blue button", "#bfdbfe"),
        text: "Tinny Tim was sitting on the road when a button bounced his way.",
        phrases: [
          phrase("button-1a", "Tinny Tim was sitting on the road"),
          phrase("button-1b", "when a button bounced his way."),
        ],
        vocabulary: [{ word: "button", definition: "a button is a small round part that can fasten clothes or decorate something." }],
      },
      {
        id: "button-2",
        image: assetImage("whose-button-is-this", "02.jpg", "Tinny Tim carries the button", "#d9f99d"),
        text: "I wonder where this comes from. He wanted to find out.",
        phrases: [phrase("button-2a", "I wonder where this comes from."), phrase("button-2b", "He wanted to find out.")],
        vocabulary: [{ word: "wonder", definition: "wonder means to think about a question." }],
      },
      {
        id: "button-3",
        image: assetImage("whose-button-is-this", "03.jpg", "Tinny Tim near a red shoe", "#fecaca"),
        text: "It was busy on the side of the road. Woah! He nearly got squashed.",
        phrases: [
          phrase("button-3a", "It was busy on the side of the road."),
          phrase("button-3b", "Woah!"),
          phrase("button-3c", "He nearly got squashed."),
        ],
        vocabulary: [{ word: "squashed", definition: "squashed means pressed flat or squeezed." }],
      },
      {
        id: "button-4",
        image: assetImage("whose-button-is-this", "04.jpg", "Tinny Tim swings on a shoelace", "#fde68a"),
        text: "He made a lucky escape. It is scary out here, he said.",
        phrases: [phrase("button-4a", "He made a lucky escape."), phrase("button-4b", "It is scary out here, he said.")],
        vocabulary: [{ word: "escape", definition: "escape means to get away from something." }],
      },
      {
        id: "button-5",
        image: assetImage("whose-button-is-this", "05.jpg", "Tinny Tim asks a traffic light", "#bbf7d0"),
        text: "Hey there, is this yours?",
        phrases: [phrase("button-5a", "Hey there,"), phrase("button-5b", "is this yours?")],
      },
      {
        id: "button-6",
        image: assetImage("whose-button-is-this", "06.jpg", "The green man turns red", "#fecdd3"),
        text: "The green man said nothing. He just turned red.",
        phrases: [phrase("button-6a", "The green man said nothing."), phrase("button-6b", "He just turned red.")],
      },
      {
        id: "button-7",
        image: assetImage("whose-button-is-this", "07.jpg", "Tinny Tim sees a dog", "#bfdbfe"),
        text: "Tinny Tim carried on looking. Whose button is this?",
        phrases: [phrase("button-7a", "Tinny Tim carried on looking."), phrase("button-7b", "Whose button is this?")],
      },
      {
        id: "button-8",
        image: assetImage("whose-button-is-this", "08.jpg", "A dog licks Tinny Tim", "#fde68a"),
        text: "Woah! At least he is friendly.",
        phrases: [phrase("button-8a", "Woah!"), phrase("button-8b", "At least he is friendly.")],
        vocabulary: [{ word: "friendly", definition: "friendly means kind and warm." }],
      },
      {
        id: "button-9",
        image: assetImage("whose-button-is-this", "09.jpg", "Tinny Tim waits at a crossing", "#e9d5ff"),
        text: "I have got to get to the other side. I am sure that is where this comes from.",
        phrases: [
          phrase("button-9a", "I have got to get to the other side."),
          phrase("button-9b", "I am sure that is where this comes from."),
        ],
      },
      {
        id: "button-10",
        image: assetImage("whose-button-is-this", "10.jpg", "A car splashes Tinny Tim", "#bae6fd"),
        text: "Splash! That was close. He waited for the cars to pass.",
        phrases: [phrase("button-10a", "Splash!"), phrase("button-10b", "That was close."), phrase("button-10c", "He waited for the cars to pass.")],
      },
      {
        id: "button-11",
        image: assetImage("whose-button-is-this", "11.jpg", "Tinny Tim holds up the button", "#fed7aa"),
        text: "Maybe this was who he was looking for. Hello, who are you?",
        phrases: [phrase("button-11a", "Maybe this was who he was looking for."), phrase("button-11b", "Hello, who are you?")],
      },
      {
        id: "button-12",
        image: assetImage("whose-button-is-this", "12.jpg", "Ruby Rags is missing a button eye", "#fbcfe8"),
        text: "I am Ruby Rags. I think this is yours, he said.",
        phrases: [phrase("button-12a", "I am Ruby Rags."), phrase("button-12b", "I think this is yours, he said.")],
      },
      {
        id: "button-13",
        image: assetImage("whose-button-is-this", "13.jpg", "Ruby Rags and Tinny Tim sit together", "#c7d2fe"),
        text: "Thank you, little robot. Can we be friends?",
        phrases: [phrase("button-13a", "Thank you, little robot."), phrase("button-13b", "Can we be friends?")],
        vocabulary: [{ word: "robot", definition: "a robot is a machine that can move or do jobs." }],
      },
    ],
    questions: [],
  },
  {
    id: "why-is-nita-upside-down",
    title: "Why Is Nita Upside Down?",
    type: "open_book",
    source: "Book Dash",
    sourceUrl: "https://bookdash.github.io/bookdash-books/why-is-nita-upside-down/en/",
    license: "Creative Commons Attribution 4.0 International (CC BY 4.0)",
    attribution: "Why is Nita upside down? by Emma Hearne, Roxana Bouwer, and Sarah Bouwer. Published by Book Dash under CC BY 4.0.",
    skillGroup: "Open picture book",
    prerequisitePhonemes: [],
    prerequisiteWords: [],
    coverImage: assetImage("why-is-nita-upside-down", "cover.jpg", "Nita upside down on a play frame", "#fde68a"),
    pages: [
      {
        id: "nita-1",
        image: assetImage("why-is-nita-upside-down", "01.jpg", "Nita hangs upside down", "#fde68a"),
        text: "Nita is hanging upside down. The trees, the grass, and everything look the wrong way round.",
        phrases: [
          phrase("nita-1a", "Nita is hanging upside down."),
          phrase("nita-1b", "The trees, the grass, and everything look the wrong way round."),
        ],
        vocabulary: [{ word: "upside", definition: "upside down means the top is where the bottom usually is." }],
      },
      {
        id: "nita-2",
        image: assetImage("why-is-nita-upside-down", "02.jpg", "Navi walks by and waves", "#bfdbfe"),
        text: "Little Navi is walking by. He asks why Nita is upside down again.",
        phrases: [phrase("nita-2a", "Little Navi is walking by."), phrase("nita-2b", "He asks why Nita is upside down again.")],
      },
      {
        id: "nita-3",
        image: assetImage("why-is-nita-upside-down", "03.jpg", "Nita talks shyly", "#fbcfe8"),
        text: "It is hard to talk, Nita says. I am not the same. I do not fit in.",
        phrases: [
          phrase("nita-3a", "It is hard to talk, Nita says."),
          phrase("nita-3b", "I am not the same."),
          phrase("nita-3c", "I do not fit in."),
        ],
        vocabulary: [{ word: "same", definition: "same means alike." }],
      },
      {
        id: "nita-4",
        image: assetImage("why-is-nita-upside-down", "04.jpg", "Navi and Nita climb to a lookout", "#bbf7d0"),
        text: "Navi takes her by the hand. From up high, they can see a lot.",
        phrases: [phrase("nita-4a", "Navi takes her by the hand."), phrase("nita-4b", "From up high, they can see a lot.")],
      },
      {
        id: "nita-5",
        image: assetImage("why-is-nita-upside-down", "05.jpg", "Children play in many ways", "#ddd6fe"),
        text: "They see children playing here and there.",
        phrases: [phrase("nita-5a", "They see children playing here and there.")],
      },
      {
        id: "nita-6",
        image: assetImage("why-is-nita-upside-down", "06.jpg", "Abe and Chi play", "#fecaca"),
        text: "Those kids are not the same at all. Abe is round. Chi is freckled.",
        phrases: [
          phrase("nita-6a", "Those kids are not the same at all."),
          phrase("nita-6b", "Abe is round."),
          phrase("nita-6c", "Chi is freckled."),
        ],
        vocabulary: [{ word: "freckled", definition: "freckled means having small spots on the skin." }],
      },
      {
        id: "nita-7",
        image: assetImage("why-is-nita-upside-down", "07.jpg", "Lala stands tall", "#bae6fd"),
        text: "Lala is extra tall.",
        phrases: [phrase("nita-7a", "Lala is extra tall.")],
      },
      {
        id: "nita-8",
        image: assetImage("why-is-nita-upside-down", "08.jpg", "Two children enjoy different activities", "#d9f99d"),
        text: "Bambam is wild and free. Lulu is reading quietly.",
        phrases: [phrase("nita-8a", "Bambam is wild and free."), phrase("nita-8b", "Lulu is reading quietly.")],
      },
      {
        id: "nita-9",
        image: assetImage("why-is-nita-upside-down", "09.jpg", "Freya swings with big hair", "#fed7aa"),
        text: "Look at Freya's crazy hair.",
        phrases: [phrase("nita-9a", "Look at Freya's crazy hair.")],
      },
      {
        id: "nita-10",
        image: assetImage("why-is-nita-upside-down", "10.jpg", "Sid wears glasses", "#c7d2fe"),
        text: "And Sid wears glasses everywhere.",
        phrases: [phrase("nita-10a", "And Sid wears glasses everywhere.")],
        vocabulary: [{ word: "glasses", definition: "glasses help some people see clearly." }],
      },
      {
        id: "nita-11",
        image: assetImage("why-is-nita-upside-down", "11.jpg", "Navi and Nita sit on a branch", "#fef3c7"),
        text: "And you are you. You are not alone. To play, we cannot all be the same.",
        phrases: [
          phrase("nita-11a", "And you are you."),
          phrase("nita-11b", "You are not alone."),
          phrase("nita-11c", "To play, we cannot all be the same."),
        ],
        vocabulary: [{ word: "alone", definition: "alone means by yourself." }],
      },
      {
        id: "nita-12",
        image: assetImage("why-is-nita-upside-down", "12.jpg", "Nita smiles and plays", "#bbf7d0"),
        text: "Nita feels the right way round. Now she plays with everyone.",
        phrases: [phrase("nita-12a", "Nita feels the right way round."), phrase("nita-12b", "Now she plays with everyone.")],
      },
    ],
    questions: [],
  },
];

export const storyBooks = [...originalStoryBooks, ...openBookShelf];
