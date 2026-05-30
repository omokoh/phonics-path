import type { DecodableWord } from "./decodableWords";

export interface ReaderWord {
  text: string;
  wordId?: string;
  heart?: boolean;
}

export interface ReaderPage {
  id: string;
  words: ReaderWord[];
}

export interface TinyReader {
  id: string;
  title: string;
  prerequisiteLevel: 1 | 2 | 3 | 4 | 5 | 6;
  focusWords: DecodableWord["id"][];
  pages: ReaderPage[];
}

export const tinyReaders: TinyReader[] = [
  {
    id: "sam-sat",
    title: "Sam Sat",
    prerequisiteLevel: 1,
    focusWords: ["sam", "sat", "mat", "can", "sit", "on"],
    pages: [
      {
        id: "sam-sat-1",
        words: [
          { text: "Sam", wordId: "sam" },
          { text: "sat", wordId: "sat" },
        ],
      },
      {
        id: "sam-sat-2",
        words: [
          { text: "Sam", wordId: "sam" },
          { text: "sat", wordId: "sat" },
          { text: "on", wordId: "on" },
          { text: "a", wordId: "at" },
          { text: "mat", wordId: "mat" },
        ],
      },
      {
        id: "sam-sat-3",
        words: [
          { text: "Sam", wordId: "sam" },
          { text: "can", wordId: "can" },
          { text: "sit", wordId: "sit" },
        ],
      },
    ],
  },
  {
    id: "sun-run",
    title: "Run in the Sun",
    prerequisiteLevel: 2,
    focusWords: ["run", "sun", "up", "in", "is"],
    pages: [
      {
        id: "sun-run-1",
        words: [
          { text: "Run", wordId: "run" },
          { text: "in", wordId: "in" },
          { text: "sun", wordId: "sun" },
        ],
      },
      {
        id: "sun-run-2",
        words: [
          { text: "Run", wordId: "run" },
          { text: "up", wordId: "up" },
        ],
      },
      {
        id: "sun-run-3",
        words: [
          { text: "Sun", wordId: "sun" },
          { text: "is", wordId: "is" },
          { text: "up", wordId: "up" },
        ],
      },
    ],
  },
  {
    id: "ship-shop",
    title: "Ship Shop",
    prerequisiteLevel: 5,
    focusWords: ["ship", "shop", "chip", "chop", "thin"],
    pages: [
      {
        id: "ship-shop-1",
        words: [
          { text: "Ship", wordId: "ship" },
          { text: "can", wordId: "can" },
          { text: "go", wordId: "go" },
        ],
      },
      {
        id: "ship-shop-2",
        words: [
          { text: "Chip", wordId: "chip" },
          { text: "can", wordId: "can" },
          { text: "shop", wordId: "shop" },
        ],
      },
      {
        id: "ship-shop-3",
        words: [
          { text: "Chip", wordId: "chip" },
          { text: "can", wordId: "can" },
          { text: "chop", wordId: "chop" },
        ],
      },
    ],
  },
];
