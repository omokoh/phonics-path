export interface LevelMeta {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  icon: string;
  label: string;
  color: string;
  total: number;
}

export const LEVEL_META: LevelMeta[] = [
  { level: 1, icon: "A",  label: "First Sounds", color: "#f59e0b", total: 10 },
  { level: 2, icon: "B",  label: "More Sounds",   color: "#10b981", total: 10 },
  { level: 3, icon: "Z",  label: "Last Sounds",   color: "#3b82f6", total: 6  },
  { level: 4, icon: "BL", label: "Blends",        color: "#a855f7", total: 12 },
  { level: 5, icon: "SH", label: "Digraphs",      color: "#ec4899", total: 7  },
  { level: 6, icon: "AI", label: "Vowel Teams",   color: "#ef4444", total: 6  },
];

// Per-level position key
export const levelPosKey = (level: number) => `phonics_pos_${level}`;

export function readLevelPos(level: number): number {
  const n = parseInt(localStorage.getItem(levelPosKey(level)) ?? "", 10);
  return isNaN(n) ? 0 : Math.max(0, n);
}

export function saveLevelPos(level: number, pos: number) {
  localStorage.setItem(levelPosKey(level), String(pos));
}

// Level N+1 unlocks when level N reaches 80% completion
export const UNLOCK_THRESHOLD = 0.8;

export function isLevelUnlocked(level: number): boolean {
  if (level <= 1) return true;
  const prev = LEVEL_META[level - 2];
  return readLevelPos(level - 1) / prev.total >= UNLOCK_THRESHOLD;
}

export function isLevelComplete(level: number): boolean {
  const meta = LEVEL_META[level - 1];
  return readLevelPos(level) >= meta.total;
}

// Parent override — long-press unlocks a level regardless of progress
const PARENT_KEY = "phonics_parent_unlocked";

export function getParentUnlocked(): Set<number> {
  try {
    const raw = localStorage.getItem(PARENT_KEY);
    return raw ? new Set(JSON.parse(raw) as number[]) : new Set();
  } catch {
    return new Set();
  }
}

export function parentUnlock(level: number) {
  const s = getParentUnlocked();
  s.add(level);
  localStorage.setItem(PARENT_KEY, JSON.stringify([...s]));
}
