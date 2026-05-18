export type ThemeId = 'marbleRun' | 'raceCar' | 'space' | 'princess';

export interface Theme {
  id: ThemeId;
  name: string;
  emoji: string;
  previewGradient: string;

  bg: string;
  headerButtonBg: string;
  surface: string;
  surfaceShadow: string;
  accent: string;
  accentShadow: string;
  accentText: string;
  text: string;
  textMuted: string;
  correctColor: string;
  relistenBg: string;
  relistenBorder: string;
  relistenText: string;

  // '50%' = circle (forces square dimensions in components)
  optionRadius: string;
  cardRadius: string;

  // CSS animation class names defined in index.css
  wrongAnim: string;
  correctAnim: string;

  // Background particle effect type
  bgEffect: 'none' | 'stars' | 'sparkles';
}
