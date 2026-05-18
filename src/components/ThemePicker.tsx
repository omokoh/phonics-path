import { THEME_LIST, type ThemeId } from '../themes';

interface Props {
  currentThemeId: ThemeId;
  onSelect: (id: ThemeId) => void;
}

export function ThemePicker({ currentThemeId, onSelect }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <div
        style={{
          fontSize: '14px',
          color: '#94a3b8',
          fontWeight: 'bold',
          letterSpacing: '0.02em',
        }}
      >
        Choose your theme:
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          maxWidth: '370px',
          width: '100%',
        }}
      >
        {THEME_LIST.map((t) => {
          const isSelected = t.id === currentThemeId;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className="active:scale-95 transition-transform duration-150 select-none"
              style={{
                width: 'clamp(140px, 38vw, 170px)',
                height: '110px',
                background: t.previewGradient,
                borderRadius: '20px',
                border: isSelected ? '3px solid #f59e0b' : '3px solid transparent',
                boxShadow: isSelected
                  ? '0 0 0 3px rgba(245,158,11,0.4)'
                  : '0 4px 16px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
              aria-label={`Select ${t.name} theme`}
              aria-pressed={isSelected}
            >
              <span style={{ fontSize: '36px', lineHeight: 1 }}>{t.emoji}</span>
              <span
                style={{
                  fontSize: '14px',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                }}
              >
                {t.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
