export interface StoryBookStats {
  opens: number;
  completions: number;
  rereads: number;
  replays: number;
  comprehensionAttempts: number;
  helpTaps: Record<string, number>;
  lastOpened?: string;
}

export type StoryStats = Record<string, StoryBookStats>;

const STORY_STATS_KEY = "phonicspath_story_stats";

function now(): string {
  return new Date().toISOString();
}

function emptyStats(): StoryBookStats {
  return {
    opens: 0,
    completions: 0,
    rereads: 0,
    replays: 0,
    comprehensionAttempts: 0,
    helpTaps: {},
  };
}

export function readStoryStats(): StoryStats {
  try {
    const raw = localStorage.getItem(STORY_STATS_KEY);
    return raw ? JSON.parse(raw) as StoryStats : {};
  } catch {
    return {};
  }
}

function saveStoryStats(stats: StoryStats) {
  localStorage.setItem(STORY_STATS_KEY, JSON.stringify(stats));
}

function updateBook(bookId: string, updater: (stats: StoryBookStats) => StoryBookStats) {
  const all = readStoryStats();
  all[bookId] = updater(all[bookId] ?? emptyStats());
  saveStoryStats(all);
}

export function recordBookOpened(bookId: string) {
  updateBook(bookId, (stats) => ({
    ...stats,
    opens: stats.opens + 1,
    lastOpened: now(),
  }));
}

export function recordBookCompleted(bookId: string) {
  updateBook(bookId, (stats) => ({
    ...stats,
    completions: stats.completions + 1,
    rereads: stats.completions > 0 ? stats.rereads + 1 : stats.rereads,
    lastOpened: now(),
  }));
}

export function recordPageReplay(bookId: string) {
  updateBook(bookId, (stats) => ({
    ...stats,
    replays: stats.replays + 1,
    lastOpened: now(),
  }));
}

export function recordStoryHelp(bookId: string, word: string) {
  const normalized = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!normalized) return;
  updateBook(bookId, (stats) => ({
    ...stats,
    helpTaps: {
      ...stats.helpTaps,
      [normalized]: (stats.helpTaps[normalized] ?? 0) + 1,
    },
    lastOpened: now(),
  }));
}

export function recordComprehensionAttempt(bookId: string) {
  updateBook(bookId, (stats) => ({
    ...stats,
    comprehensionAttempts: stats.comprehensionAttempts + 1,
    lastOpened: now(),
  }));
}

export function storySummary() {
  const stats = readStoryStats();
  const entries = Object.entries(stats);
  const booksOpened = entries.reduce((sum, [, item]) => sum + item.opens, 0);
  const booksCompleted = entries.reduce((sum, [, item]) => sum + item.completions, 0);
  const rereads = entries.reduce((sum, [, item]) => sum + item.rereads, 0);
  const replays = entries.reduce((sum, [, item]) => sum + item.replays, 0);
  const comprehensionAttempts = entries.reduce((sum, [, item]) => sum + item.comprehensionAttempts, 0);
  const helpWords = entries
    .flatMap(([bookId, item]) =>
      Object.entries(item.helpTaps).map(([word, count]) => ({ bookId, word, count }))
    )
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, 6);

  return { booksOpened, booksCompleted, rereads, replays, comprehensionAttempts, helpWords };
}
