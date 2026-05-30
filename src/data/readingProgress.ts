export type ReadingPracticeKind = "word-builder" | "tap-blend" | "reader";

export interface ReadingItemStats {
  attempts: number;
  successes: number;
  misses: number;
  lastSeen: string;
}

export type ReadingStats = Record<string, ReadingItemStats>;

const STATS_KEY = "phonicspath_reading_stats";
const POSITION_PREFIX = "phonicspath_reading_pos_";

function today(): string {
  return new Date().toISOString();
}

function statsKey(kind: ReadingPracticeKind, id: string): string {
  return `${kind}:${id}`;
}

export function readReadingStats(): ReadingStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? JSON.parse(raw) as ReadingStats : {};
  } catch {
    return {};
  }
}

function saveReadingStats(stats: ReadingStats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function recordReadingResult(kind: ReadingPracticeKind, id: string, missed: boolean) {
  const stats = readReadingStats();
  const key = statsKey(kind, id);
  const current = stats[key] ?? { attempts: 0, successes: 0, misses: 0, lastSeen: today() };
  stats[key] = {
    attempts: current.attempts + 1,
    successes: current.successes + (missed ? 0 : 1),
    misses: current.misses + (missed ? 1 : 0),
    lastSeen: today(),
  };
  saveReadingStats(stats);
}

export function readReadingPosition(kind: ReadingPracticeKind): number {
  const n = parseInt(localStorage.getItem(`${POSITION_PREFIX}${kind}`) ?? "", 10);
  return isNaN(n) ? 0 : Math.max(0, n);
}

export function saveReadingPosition(kind: ReadingPracticeKind, position: number) {
  localStorage.setItem(`${POSITION_PREFIX}${kind}`, String(Math.max(0, position)));
}

export function getNeedsPractice(kind?: ReadingPracticeKind): Array<{ key: string; id: string; stats: ReadingItemStats }> {
  return Object.entries(readReadingStats())
    .filter(([key, stats]) => (!kind || key.startsWith(`${kind}:`)) && stats.misses > 0)
    .map(([key, stats]) => ({ key, id: key.split(":").slice(1).join(":"), stats }))
    .sort((a, b) => b.stats.misses - a.stats.misses || a.id.localeCompare(b.id));
}

export function readingSummary() {
  const stats = readReadingStats();
  const entries = Object.entries(stats);
  const attempts = entries.reduce((sum, [, item]) => sum + item.attempts, 0);
  const misses = entries.reduce((sum, [, item]) => sum + item.misses, 0);
  const successes = entries.reduce((sum, [, item]) => sum + item.successes, 0);
  const needsPractice = getNeedsPractice().slice(0, 5);
  return { attempts, misses, successes, needsPractice };
}
