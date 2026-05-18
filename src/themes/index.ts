import { marbleRun } from './marbleRun';
import { raceCar } from './raceCar';
import { space } from './space';
import { princess } from './princess';
import type { Theme, ThemeId } from './types';

export const themes: Record<ThemeId, Theme> = { marbleRun, raceCar, space, princess };
export const THEME_LIST: Theme[] = [marbleRun, raceCar, space, princess];
export const DEFAULT_THEME_ID: ThemeId = 'marbleRun';
export type { Theme, ThemeId };
