import { ThemeBg } from './ThemeBg';
import { ThemePicker } from './ThemePicker';
import { useTheme } from '../hooks/useTheme';

function GridIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="currentColor" aria-hidden>
      <rect x="0"  y="0"  width="12" height="12" rx="2" />
      <rect x="18" y="0"  width="12" height="12" rx="2" />
      <rect x="0"  y="18" width="12" height="12" rx="2" />
      <rect x="18" y="18" width="12" height="12" rx="2" />
    </svg>
  );
}

interface Props {
  onPlay: () => void;
  onChooseLevel: () => void;
}

export function HomeScreen({ onPlay, onChooseLevel }: Props) {
  const { theme, setThemeId } = useTheme();

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center gap-10 px-6"
      style={{ backgroundColor: theme.bg, position: 'relative' }}
    >
      <ThemeBg bgEffect={theme.bgEffect} />

      {/* Logo */}
      <div className="flex flex-col items-center gap-2 select-none" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: "clamp(56px, 14vw, 96px)" }}>🔤</div>
        <div
          className="font-bold tracking-wide"
          style={{ fontSize: "clamp(28px, 7vw, 52px)", color: theme.accent }}
        >
          PhonicsPath
        </div>
      </div>

      {/* Theme picker */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <ThemePicker currentThemeId={theme.id} onSelect={setThemeId} />
      </div>

      {/* Two big navigation buttons */}
      <div className="flex gap-6 flex-wrap justify-center w-full max-w-xl" style={{ position: 'relative', zIndex: 1 }}>
        {/* Play — primary, full accent */}
        <button
          onClick={onPlay}
          className="flex flex-col items-center justify-center gap-3 rounded-3xl select-none active:scale-95 transition-transform duration-150 flex-1"
          style={{
            backgroundColor: theme.accent,
            minHeight: "180px",
            minWidth: "140px",
            maxWidth: "240px",
            fontSize: "clamp(20px, 5vw, 28px)",
            color: theme.accentText,
            fontWeight: "bold",
            boxShadow: `0 10px 40px ${theme.accentShadow}`,
          }}
          aria-label="Play — continue from where you left off"
        >
          <span style={{ fontSize: "clamp(44px, 11vw, 72px)" }}>⭐</span>
          <span>Play</span>
        </button>

        {/* Levels — secondary with accent border */}
        <button
          onClick={onChooseLevel}
          className="flex flex-col items-center justify-center gap-3 rounded-3xl select-none active:scale-95 transition-transform duration-150 flex-1"
          style={{
            backgroundColor: theme.headerButtonBg,
            border: `3px solid ${theme.accent}`,
            minHeight: "180px",
            minWidth: "140px",
            maxWidth: "240px",
            fontSize: "clamp(20px, 5vw, 28px)",
            color: theme.accent,
            fontWeight: "bold",
            boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
          }}
          aria-label="Choose a level"
        >
          <span style={{ fontSize: "clamp(36px, 9vw, 56px)" }}>
            <GridIcon />
          </span>
          <span>Levels</span>
        </button>
      </div>
    </div>
  );
}
