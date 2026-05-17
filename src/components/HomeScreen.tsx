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
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center gap-10 px-6"
      style={{ backgroundColor: "#0f172a" }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center gap-2 select-none">
        <div style={{ fontSize: "clamp(56px, 14vw, 96px)" }}>🔤</div>
        <div
          className="font-bold tracking-wide"
          style={{ fontSize: "clamp(28px, 7vw, 52px)", color: "#f59e0b" }}
        >
          PhonicsPath
        </div>
      </div>

      {/* Two big navigation buttons */}
      <div className="flex gap-6 flex-wrap justify-center w-full max-w-xl">
        {/* Play — primary, full amber */}
        <button
          onClick={onPlay}
          className="flex flex-col items-center justify-center gap-3 rounded-3xl select-none active:scale-95 transition-transform duration-150 flex-1"
          style={{
            backgroundColor: "#f59e0b",
            minHeight: "180px",
            minWidth: "140px",
            maxWidth: "240px",
            fontSize: "clamp(20px, 5vw, 28px)",
            color: "#0f172a",
            fontWeight: "bold",
            boxShadow: "0 10px 40px rgba(245,158,11,0.55)",
          }}
          aria-label="Play — continue from where you left off"
        >
          <span style={{ fontSize: "clamp(44px, 11vw, 72px)" }}>⭐</span>
          <span>Play</span>
        </button>

        {/* Levels — navy with amber border */}
        <button
          onClick={onChooseLevel}
          className="flex flex-col items-center justify-center gap-3 rounded-3xl select-none active:scale-95 transition-transform duration-150 flex-1"
          style={{
            backgroundColor: "#1e293b",
            border: "3px solid #f59e0b",
            minHeight: "180px",
            minWidth: "140px",
            maxWidth: "240px",
            fontSize: "clamp(20px, 5vw, 28px)",
            color: "#f59e0b",
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
