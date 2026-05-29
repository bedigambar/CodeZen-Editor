import React from 'react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'F11',          description: 'Toggle fullscreen mode' },
    { key: 'Esc',          description: 'Exit fullscreen mode' },
    { key: '? / Ctrl + /', description: 'Open this shortcuts panel' },
  ];

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      className="animate-fade-in"
      onClick={onClose}
    >
      <div
        style={{
          background: '#111',
          border: '1px solid #2a2a2a',
          borderRadius: '6px',
          width: '100%',
          maxWidth: '480px',
          overflow: 'hidden',
          boxShadow: '0 24px 48px rgba(0,0,0,0.8)',
        }}
        className="animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderBottom: '1px solid #1f1f1f',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-keyboard" style={{ color: '#e8ff47', fontSize: '13px' }} />
            <h2
              style={{
                fontFamily: 'Syne, system-ui, sans-serif',
                fontWeight: 700,
                fontSize: '15px',
                color: '#f2f2f2',
                letterSpacing: '-0.01em',
              }}
            >
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#8a8a8a',
              cursor: 'pointer',
              padding: '4px 6px',
              fontSize: '13px',
              borderRadius: '3px',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#f2f2f2')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#8a8a8a')}
          >
            <i className="fa-solid fa-times" />
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          <p
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              color: '#8a8a8a',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Available shortcuts
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {shortcuts.map((s, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: '#0f0f0f',
                  border: '1px solid #1f1f1f',
                  borderRadius: '4px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '12px',
                    color: '#a0a0a0',
                  }}
                >
                  {s.description}
                </span>
                <kbd
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '11px',
                    color: '#e8ff47',
                    background: '#1a1a00',
                    border: '1px solid #3a3a00',
                    borderRadius: '3px',
                    padding: '3px 8px',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    marginLeft: '12px',
                  }}
                >
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '16px',
              padding: '10px 14px',
              background: '#0f0f0f',
              border: '1px solid #1f1f1f',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <i className="fa-solid fa-circle-info" style={{ color: '#8a8a8a', fontSize: '11px', flexShrink: 0 }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#8a8a8a' }}>
              Press <kbd style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '2px', padding: '1px 5px', color: '#8a8a8a' }}>?</kbd> anytime to open this panel
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
