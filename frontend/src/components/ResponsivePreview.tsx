import React, { useState, useEffect } from 'react';

export type DeviceMode = 'mobile' | 'tablet' | 'desktop' | 'fullwidth' | 'compare';

interface ResponsivePreviewProps {
  deviceMode: DeviceMode;
  onDeviceModeChange: (mode: DeviceMode) => void;
  output: string;
}

export interface CustomDevice {
  id: string;
  name: string;
  width: number;
  height: number;
}

const STORAGE_KEY = 'codezen_custom_devices';

// showOnMobile: compare mode requires side-by-side space — hide on small screens
const BASE_DEVICES: Array<{ id: DeviceMode; label: string; icon: string; width: number; height: number; mobileHide?: boolean }> = [
  { id: 'mobile',    label: 'Mobile',    icon: 'fa-mobile-screen',          width: 375,  height: 600  },
  { id: 'tablet',    label: 'Tablet',    icon: 'fa-tablet-screen-button',   width: 768,  height: 900  },
  { id: 'desktop',   label: 'Desktop',   icon: 'fa-desktop',                width: 1200, height: 750  },
  { id: 'fullwidth', label: 'Full',      icon: 'fa-expand',                 width: 0,    height: 500  },
  { id: 'compare',   label: 'Compare',   icon: 'fa-table-columns',          width: 0,    height: 500, mobileHide: true },
];

const COMPARE_DEVICES = [
  { id: 'mobile',  label: 'Mobile',  width: 375,  height: 600 },
  { id: 'tablet',  label: 'Tablet',  width: 768,  height: 700 },
  { id: 'desktop', label: 'Desktop', width: 1200, height: 700 },
];

const ResponsivePreview: React.FC<ResponsivePreviewProps> = ({
  deviceMode,
  onDeviceModeChange,
  output,
}) => {
  const [customDevices, setCustomDevices] = useState<CustomDevice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // orientation: per-device id → true means flipped (landscape for portrait devices, portrait for landscape)
  const [flipped, setFlipped]     = useState<Record<string, boolean>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDev, setNewDev]       = useState({ name: '', width: '', height: '' });
  const [addError, setAddError]   = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customDevices));
  }, [customDevices]);

  const saveCustomDevice = () => {
    setAddError('');
    const w = parseInt(newDev.width, 10);
    const h = parseInt(newDev.height, 10);
    if (!newDev.name.trim()) { setAddError('Name required'); return; }
    if (!w || w < 100 || w > 4000) { setAddError('Width: 100–4000px'); return; }
    if (!h || h < 100 || h > 4000) { setAddError('Height: 100–4000px'); return; }
    const device: CustomDevice = { id: `custom_${Date.now()}`, name: newDev.name.trim(), width: w, height: h };
    setCustomDevices(prev => [...prev, device]);
    setNewDev({ name: '', width: '', height: '' });
    setShowAddForm(false);
  };

  const deleteCustomDevice = (id: string) => {
    setCustomDevices(prev => prev.filter(d => d.id !== id));
  };

  const toggleFlip = (id: string) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getDeviceDims = (id: string, baseW: number, baseH: number) => {
    const f = flipped[id];
    return f ? { w: baseH, h: baseW } : { w: baseW, h: baseH };
  };

  const devBtnStyle = (active: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
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
    whiteSpace: 'nowrap',
  });

  const smallBtn: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: '#5a5a5a',
    cursor: 'pointer',
    padding: '2px 5px',
    fontSize: '10px',
    transition: 'color 0.15s ease',
  };

  const inputStyle: React.CSSProperties = {
    background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '3px',
    color: '#f2f2f2', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
    padding: '5px 8px', outline: 'none', width: '100%',
  };

  /* ── Compare Mode ─────────────────────────────────────────────────────── */
  if (deviceMode === 'compare') {
    return (
      <div style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: '4px', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 12px', height: '38px', background: '#0f0f0f', borderBottom: '1px solid #1f1f1f',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#e8ff47', display: 'inline-block' }} />
            <span style={{ fontFamily: 'Syne, system-ui, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#f2f2f2' }}>
              Device Comparison
            </span>
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {BASE_DEVICES.map(dev => (
              <button
                key={dev.id}
                onClick={() => onDeviceModeChange(dev.id)}
                style={devBtnStyle(deviceMode === dev.id)}
                className={dev.mobileHide ? 'hidden md:inline-flex' : undefined}
                onMouseEnter={e => { if (deviceMode !== dev.id) { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#3a3a3a'; } }}
                onMouseLeave={e => { if (deviceMode !== dev.id) { e.currentTarget.style.color = '#8a8a8a'; e.currentTarget.style.borderColor = '#1f1f1f'; } }}
              >
                <i className={`fa-solid ${dev.icon}`} style={{ fontSize: '10px' }} />
                <span className="hidden md:inline">{dev.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Three-up row */}
        <div className="device-compare-row">
          {COMPARE_DEVICES.map(dev => {
            const { w, h } = getDeviceDims(dev.id, dev.width, dev.height);
            return (
              <div key={dev.id} className="device-compare-frame" style={{ width: `${w}px` }}>
                {/* Chrome bar */}
                <div style={{
                  background: '#0f0f0f', borderBottom: '1px solid #1f1f1f',
                  padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#8a8a8a', fontWeight: 600 }}>
                    {dev.label}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#3a3a3a' }}>
                      {w}×{h}
                    </span>
                    <button
                      onClick={() => toggleFlip(dev.id)}
                      style={smallBtn}
                      title="Toggle orientation"
                      onMouseEnter={e => (e.currentTarget.style.color = '#e8ff47')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#5a5a5a')}
                    >
                      <i className="fa-solid fa-rotate" />
                    </button>
                  </div>
                </div>
                <iframe
                  srcDoc={output}
                  title={`${dev.label} preview`}
                  sandbox="allow-scripts"
                  style={{ width: `${w}px`, height: `${h}px`, border: 'none', display: 'block' }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── Regular (single device) Mode ─────────────────────────────────────── */
  const activeBase = BASE_DEVICES.find(d => d.id === deviceMode);
  const activeCustom = customDevices.find(d => d.id === deviceMode);

  let previewWidth: number | string = '100%';
  let previewHeight = 500;

  if (activeBase && deviceMode !== 'fullwidth') {
    const { w, h } = getDeviceDims(deviceMode, activeBase.width, activeBase.height);
    previewWidth = w;
    previewHeight = h;
  } else if (activeCustom) {
    const { w, h } = getDeviceDims(deviceMode, activeCustom.width, activeCustom.height);
    previewWidth = w;
    previewHeight = h;
  }

  const isFramed = deviceMode !== 'fullwidth';

  return (
    <div style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: '4px', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 12px', height: '38px', background: '#0f0f0f', borderBottom: '1px solid #1f1f1f',
        gap: '8px', flexWrap: 'nowrap', overflowX: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d9aa', display: 'inline-block' }} />
          <span style={{ fontFamily: 'Syne, system-ui, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#f2f2f2' }}>
            Live Preview
          </span>
        </div>

        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'nowrap', overflowX: 'auto' }}>
          {/* Base device buttons */}
          {BASE_DEVICES.filter(dev => !dev.mobileHide).map(dev => (
            <button
              key={dev.id}
              onClick={() => onDeviceModeChange(dev.id)}
              style={devBtnStyle(deviceMode === dev.id)}
              onMouseEnter={e => { if (deviceMode !== dev.id) { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#3a3a3a'; } }}
              onMouseLeave={e => { if (deviceMode !== dev.id) { e.currentTarget.style.color = '#8a8a8a'; e.currentTarget.style.borderColor = '#1f1f1f'; } }}
              title={dev.label}
            >
              <i className={`fa-solid ${dev.icon}`} style={{ fontSize: '10px' }} />
              <span className="hidden md:inline">{dev.label}</span>
            </button>
          ))}

          {/* Compare — desktop/tablet only */}
          <button
            className="hidden md:inline-flex"
            onClick={() => onDeviceModeChange('compare')}
            style={devBtnStyle((deviceMode as string) === 'compare')}
            onMouseEnter={e => { if ((deviceMode as string) !== 'compare') { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#3a3a3a'; } }}
            onMouseLeave={e => { if ((deviceMode as string) !== 'compare') { e.currentTarget.style.color = '#8a8a8a'; e.currentTarget.style.borderColor = '#1f1f1f'; } }}
            title="Compare all device sizes"
          >
            <i className="fa-solid fa-table-columns" style={{ fontSize: '10px' }} />
            <span className="hidden md:inline">Compare</span>
          </button>


          {/* Custom device buttons */}
          {customDevices.map(dev => (
            <div key={dev.id} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <button
                onClick={() => onDeviceModeChange(dev.id as DeviceMode)}
                style={devBtnStyle(deviceMode === dev.id)}
                onMouseEnter={e => { if (deviceMode !== dev.id) { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#3a3a3a'; } }}
                onMouseLeave={e => { if (deviceMode !== dev.id) { e.currentTarget.style.color = '#8a8a8a'; e.currentTarget.style.borderColor = '#1f1f1f'; } }}
                title={`${dev.name} (${dev.width}×${dev.height})`}
              >
                <i className="fa-solid fa-display" style={{ fontSize: '10px' }} />
                <span className="hidden lg:inline">{dev.name}</span>
              </button>
              <button
                onClick={() => deleteCustomDevice(dev.id)}
                style={{ ...smallBtn, fontSize: '9px' }}
                title={`Remove ${dev.name}`}
                onMouseEnter={e => (e.currentTarget.style.color = '#ff5555')}
                onMouseLeave={e => (e.currentTarget.style.color = '#5a5a5a')}
              >
                <i className="fa-solid fa-times" />
              </button>
            </div>
          ))}

          {/* Add custom device button */}
          <button
            onClick={() => { setShowAddForm(v => !v); setAddError(''); }}
            style={devBtnStyle(showAddForm)}
            onMouseEnter={e => { if (!showAddForm) { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#3a3a3a'; } }}
            onMouseLeave={e => { if (!showAddForm) { e.currentTarget.style.color = '#8a8a8a'; e.currentTarget.style.borderColor = '#1f1f1f'; } }}
            title="Add custom device"
          >
            <i className="fa-solid fa-plus" style={{ fontSize: '9px' }} />
            <span className="hidden md:inline">Custom</span>
          </button>

          {/* Orientation toggle — always visible; disabled for fullwidth */}
          <button
            onClick={() => deviceMode !== 'fullwidth' && toggleFlip(deviceMode)}
            style={{
              ...devBtnStyle(!!flipped[deviceMode]),
              opacity: deviceMode === 'fullwidth' ? 0.3 : 1,
              cursor: deviceMode === 'fullwidth' ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => { if (deviceMode !== 'fullwidth' && !flipped[deviceMode]) { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#3a3a3a'; } }}
            onMouseLeave={e => { if (deviceMode !== 'fullwidth' && !flipped[deviceMode]) { e.currentTarget.style.color = '#8a8a8a'; e.currentTarget.style.borderColor = '#1f1f1f'; } }}
            title={deviceMode === 'fullwidth' ? 'Select a device first to rotate' : 'Toggle orientation'}
            disabled={deviceMode === 'fullwidth'}
          >
            <i className="fa-solid fa-rotate" style={{ fontSize: '10px' }} />
            <span className="hidden md:inline">Rotate</span>
          </button>

        </div>
      </div>

      {/* Add custom device form — grid layout for consistent alignment */}
      {showAddForm && (
        <div style={{
          padding: '12px 16px', background: '#0d0d0d', borderBottom: '1px solid #1f1f1f',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto auto', gap: '8px', alignItems: 'end' }}>
            <div>
              <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a5a5a', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Name</label>
              <input
                style={inputStyle}
                placeholder='e.g. Client Laptop'
                value={newDev.name}
                onChange={e => setNewDev(p => ({ ...p, name: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && saveCustomDevice()}
                onFocus={e => (e.currentTarget.style.borderColor = '#e8ff47')}
                onBlur={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
              />
            </div>
            <div>
              <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a5a5a', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Width px</label>
              <input
                style={inputStyle}
                placeholder='1366'
                type="number"
                value={newDev.width}
                onChange={e => setNewDev(p => ({ ...p, width: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && saveCustomDevice()}
                onFocus={e => (e.currentTarget.style.borderColor = '#e8ff47')}
                onBlur={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
              />
            </div>
            <div>
              <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a5a5a', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Height px</label>
              <input
                style={inputStyle}
                placeholder='768'
                type="number"
                value={newDev.height}
                onChange={e => setNewDev(p => ({ ...p, height: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && saveCustomDevice()}
                onFocus={e => (e.currentTarget.style.borderColor = '#e8ff47')}
                onBlur={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
              />
            </div>
            <button
              onClick={saveCustomDevice}
              style={{
                background: '#e8ff47', border: '1px solid #e8ff47', color: '#0d0d0d',
                fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 700,
                padding: '7px 14px', borderRadius: '3px', cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap',
              }}
            >
              Save
            </button>
            <button
              onClick={() => { setShowAddForm(false); setAddError(''); }}
              style={{
                background: 'transparent', border: '1px solid #2a2a2a', color: '#5a5a5a',
                fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
                padding: '7px 10px', borderRadius: '3px', cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap',
              }}
            >
              Cancel
            </button>
          </div>
          {addError && (
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#ff5555', marginTop: '8px' }}>
              <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '5px' }} />{addError}
            </div>
          )}
        </div>
      )}

      {/* Preview area */}
      <div style={{
        background: '#0d0d0d',
        padding: isFramed ? '24px' : '0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '500px',
        overflowX: 'auto',
      }}>
        <div style={{
          width: isFramed ? `${previewWidth}px` : '100%',
          maxWidth: isFramed ? 'none' : '100%',
          background: '#111',
          border: isFramed ? '1px solid #2a2a2a' : 'none',
          borderRadius: isFramed ? '6px' : '0',
          overflow: 'hidden',
          boxShadow: isFramed ? '0 12px 32px rgba(0,0,0,0.5)' : 'none',
          transition: 'width 0.25s ease',
        }}>
          {isFramed && (
            <div style={{
              background: '#0f0f0f', borderBottom: '1px solid #1f1f1f',
              padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', gap: '5px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
              </div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#8a8a8a' }}>
                {previewWidth} × {previewHeight}
                {flipped[deviceMode] ? ' (landscape)' : ''}
              </span>
            </div>
          )}
          <iframe
            srcDoc={output}
            title="output"
            sandbox="allow-scripts"
            className="w-full"
            style={{
              height: isFramed ? `${previewHeight}px` : '500px',
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
