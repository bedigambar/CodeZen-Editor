import React from 'react';

export type DeviceMode = 'mobile' | 'tablet' | 'desktop' | 'fullwidth';

interface ResponsivePreviewProps {
  deviceMode: DeviceMode;
  onDeviceModeChange: (mode: DeviceMode) => void;
  output: string;
}

const deviceSizes = {
  mobile: { width: 375, height: 600, icon: 'fa-mobile-screen' },
  tablet: { width: 768, height: 900, icon: 'fa-tablet-screen-button' },
  desktop: { width: 1200, height: 750, icon: 'fa-desktop' },
  fullwidth: { width: '100%', height: 500, icon: 'fa-expand' },
};

const ResponsivePreview: React.FC<ResponsivePreviewProps> = ({
  deviceMode,
  onDeviceModeChange,
  output,
}) => {
  const currentDevice = deviceSizes[deviceMode];

  const devBtnStyle = (active: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    background: active ? 'rgba(232, 255, 71, 0.08)' : 'transparent',
    border: `1px solid ${active ? 'rgba(232, 255, 71, 0.3)' : '#1f1f1f'}`,
    borderRadius: '3px',
    color: active ? '#e8ff47' : '#8a8a8a',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '10px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    cursor: 'pointer',
    transition: 'color 0.15s ease, border-color 0.15s ease, background 0.15s ease',
  });

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
      {/* Header */}
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
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d9aa', display: 'inline-block', flexShrink: 0 }} />
          <span
            style={{
              fontFamily: 'Syne, system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: '#f2f2f2',
            }}
          >
            Live Preview
          </span>
        </div>

        {/* Device select buttons */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {(Object.keys(deviceSizes) as DeviceMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onDeviceModeChange(mode)}
              style={devBtnStyle(deviceMode === mode)}
              onMouseEnter={(e) => {
                if (deviceMode !== mode) {
                  e.currentTarget.style.color = '#f2f2f2';
                  e.currentTarget.style.borderColor = '#3a3a3a';
                }
              }}
              onMouseLeave={(e) => {
                if (deviceMode !== mode) {
                  e.currentTarget.style.color = '#8a8a8a';
                  e.currentTarget.style.borderColor = '#1f1f1f';
                }
              }}
              title={mode.charAt(0).toUpperCase() + mode.slice(1)}
            >
              <i className={`fa-solid ${deviceSizes[mode].icon}`} style={{ fontSize: '10px' }} />
              <span className="hidden md:inline">{mode}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Frame wrapper */}
      <div
        style={{
          background: '#0d0d0d',
          padding: deviceMode !== 'fullwidth' ? '24px' : '0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          minHeight: '500px',
          overflowX: 'auto',
        }}
      >
        <div
          style={{
            width: deviceMode !== 'fullwidth' ? `${currentDevice.width}px` : '100%',
            maxWidth: deviceMode !== 'fullwidth' ? 'none' : '100%',
            background: '#111',
            border: deviceMode !== 'fullwidth' ? '1px solid #2a2a2a' : 'none',
            borderRadius: deviceMode !== 'fullwidth' ? '6px' : '0',
            overflow: 'hidden',
            boxShadow: deviceMode !== 'fullwidth' ? '0 12px 32px rgba(0,0,0,0.5)' : 'none',
            transition: 'width 0.25s ease, height 0.25s ease',
          }}
        >
          {deviceMode !== 'fullwidth' && (
            <div
              style={{
                background: '#0f0f0f',
                borderBottom: '1px solid #1f1f1f',
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', gap: '5px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
              </div>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  color: '#8a8a8a',
                }}
              >
                {currentDevice.width} × {currentDevice.height}
              </span>
            </div>
          )}
          <iframe
            srcDoc={output}
            title="output"
            sandbox="allow-scripts"
            className="w-full"
            style={{
              height: deviceMode !== 'fullwidth' ? `${currentDevice.height}px` : '500px',
              border: 'none',
              display: 'block',
              background: '#18181b',
              transition: 'height 0.25s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ResponsivePreview;
