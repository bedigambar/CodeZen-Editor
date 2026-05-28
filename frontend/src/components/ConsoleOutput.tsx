import React from 'react';

interface ConsoleLog {
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: string;
}

interface ConsoleOutputProps {
  logs: ConsoleLog[];
  isVisible: boolean;
  onToggle: () => void;
  onClear: () => void;
}

const ConsoleOutput: React.FC<ConsoleOutputProps> = ({ logs, isVisible, onToggle, onClear }) => {
  const getIconAndColor = (type: string) => {
    switch (type) {
      case 'error':
        return { icon: 'fa-circle-xmark', color: 'text-red-400', bg: 'bg-red-500/5', border: 'border-red-950' };
      case 'warn':
        return { icon: 'fa-triangle-exclamation', color: 'text-yellow-400', bg: 'bg-yellow-500/5', border: 'border-yellow-950' };
      case 'info':
        return { icon: 'fa-circle-info', color: 'text-blue-400', bg: 'bg-blue-500/5', border: 'border-blue-950' };
      default:
        return { icon: 'fa-circle-check', color: 'text-green-400', bg: 'bg-green-500/5', border: 'border-green-950' };
    }
  };

  return (
    <div
      style={{
        width: '100%',
        background: '#111',
        border: '1px solid #2a2a2a',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      {/* Console Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          height: '38px',
          background: '#0f0f0f',
          borderBottom: '1px solid #1f1f1f',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onToggle}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#5a5a5a',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#f2f2f2')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#5a5a5a')}
            title={isVisible ? 'Hide Console' : 'Show Console'}
          >
            <i className={`fa-solid ${isVisible ? 'fa-chevron-down' : 'fa-chevron-up'}`} style={{ fontSize: '10px' }}></i>
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#a0a0a0', display: 'inline-block', flexShrink: 0 }} />
            <span
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#f2f2f2',
              }}
            >
              Console
            </span>
            {logs.length > 0 && (
              <span
                style={{
                  padding: '1px 6px',
                  background: 'rgba(232, 255, 71, 0.08)',
                  border: '1px solid rgba(232, 255, 71, 0.2)',
                  color: '#e8ff47',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '9px',
                  fontWeight: 500,
                  borderRadius: '10px',
                }}
              >
                {logs.length}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onClear}
          title="Clear Console"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 10px',
            background: 'transparent',
            border: '1px solid #1f1f1f',
            borderRadius: '3px',
            color: '#ff5555',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'color 0.15s ease, border-color 0.15s ease, background 0.15s ease',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ff7777';
            e.currentTarget.style.borderColor = '#4a1515';
            e.currentTarget.style.background = '#1a0505';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#ff5555';
            e.currentTarget.style.borderColor = '#1f1f1f';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <i className="fa-solid fa-trash-can" style={{ fontSize: '10px' }}></i>
          Clear
        </button>
      </div>

      {/* Console Content */}
      {isVisible && (
        <div
          style={{
            background: '#0d0d0d',
            padding: '12px',
            maxHeight: '12rem',
            overflowY: 'auto',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
          }}
        >
          {logs.length === 0 ? (
            <div style={{ color: '#3a3a3a', textAlign: 'center', padding: '16px 0' }}>
              <i className="fa-solid fa-inbox" style={{ fontSize: '20px', marginBottom: '8px', display: 'block' }}></i>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Console is empty. Run your JavaScript code to see output.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {logs.map((log, index) => {
                const { icon, color, bg, border } = getIconAndColor(log.type);
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-2 p-2 rounded ${bg} border-l-2 ${border}`}
                  >
                    <i className={`fa-solid ${icon} ${color} mt-0.5`} style={{ fontSize: '11px' }}></i>
                    <div className="flex-1">
                      <p className="text-gray-300 break-all leading-relaxed">{log.message}</p>
                      <p className="text-gray-600 text-[10px] mt-0.5">{log.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsoleOutput;
