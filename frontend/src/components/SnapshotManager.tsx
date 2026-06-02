import React, { useState, useRef, useCallback, useEffect } from 'react';

export interface Snapshot {
  id: string;
  name: string;
  timestamp: string;
  html: string;
  css: string;
  js: string;
  output: string;
}

interface SnapshotManagerProps {
  isOpen: boolean;
  onClose: () => void;
  snapshots: Snapshot[];
  onSave: (snapshots: Snapshot[]) => void;
  currentOutput: string;
  currentHtml: string;
  currentCss: string;
  currentJs: string;
  onTakeSnapshot: (name: string) => void;
}

/* ─── Diff Viewer ─────────────────────────────────────────────────────────── */
interface DiffViewerProps {
  snapshotA: Snapshot;
  snapshotB: Snapshot;
  onBack: () => void;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ snapshotA, snapshotB, onBack }) => {
  const [splitPct, setSplitPct]   = useState(50);
  const [dragging, setDragging]   = useState(false);
  const containerRef              = useRef<HTMLDivElement>(null);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitPct(Math.min(Math.max(pct, 15), 85));
    };
    const up = () => setDragging(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, [dragging]);

  const headerStyle: React.CSSProperties = {
    padding: '0 16px',
    height: '42px',
    background: '#0f0f0f',
    borderBottom: '1px solid #1f1f1f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '11px',
    color: '#8a8a8a',
    letterSpacing: '0.04em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  return (
    <div className="snapshot-diff-view">
      {/* Top bar */}
      <div style={{
        height: '48px', background: '#0a0a0a', borderBottom: '1px solid #1f1f1f',
        display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px', flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'transparent', border: '1px solid #2a2a2a', color: '#8a8a8a',
            fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', textTransform: 'uppercase',
            letterSpacing: '0.06em', padding: '5px 12px', borderRadius: '3px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            transition: 'color 0.15s ease, border-color 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#4a4a4a'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#8a8a8a'; e.currentTarget.style.borderColor = '#2a2a2a'; }}
        >
          <i className="fa-solid fa-arrow-left" style={{ fontSize: '10px' }} />
          Back
        </button>
        <div style={{
          fontFamily: 'Syne, system-ui, sans-serif', fontSize: '13px',
          fontWeight: 700, color: '#f2f2f2', letterSpacing: '-0.01em',
        }}>
          Snapshot Diff
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '4px',
          fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#5a5a5a',
        }}>
          <span style={{
            background: 'rgba(232,255,71,0.08)', border: '1px solid rgba(232,255,71,0.2)',
            color: '#e8ff47', padding: '2px 8px', borderRadius: '10px',
          }}>{snapshotA.name}</span>
          <i className="fa-solid fa-arrows-left-right" />
          <span style={{
            background: 'rgba(0,217,170,0.08)', border: '1px solid rgba(0,217,170,0.2)',
            color: '#00d9aa', padding: '2px 8px', borderRadius: '10px',
          }}>{snapshotB.name}</span>
        </div>
        <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3a3a3a' }}>
          Drag the divider to compare
        </div>
      </div>

      {/* Split view */}
      <div ref={containerRef} style={{ flex: 1, display: 'flex', overflow: 'hidden', cursor: dragging ? 'col-resize' : 'default' }}>
        {/* Left panel */}
        <div className="diff-panel" style={{ width: `${splitPct}%` }}>
          <div style={headerStyle}>
            <span style={labelStyle}>
              <span style={{ color: '#e8ff47', marginRight: '8px' }}>A</span>
              {snapshotA.name}
            </span>
            <span style={{ ...labelStyle, fontSize: '10px', color: '#3a3a3a', flexShrink: 0 }}>
              {snapshotA.timestamp}
            </span>
          </div>
          <iframe
            className="diff-iframe"
            srcDoc={snapshotA.output}
            title={`Snapshot A: ${snapshotA.name}`}
            sandbox="allow-scripts"
          />
        </div>

        {/* Splitter */}
        <div
          className={`diff-splitter${dragging ? ' dragging' : ''}`}
          onMouseDown={onMouseDown}
        >
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '20px', height: '40px',
            background: dragging ? '#e8ff47' : '#2a2a2a',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s ease',
          }}>
            <i className="fa-solid fa-grip-lines-vertical" style={{
              fontSize: '8px', color: dragging ? '#0d0d0d' : '#5a5a5a',
              transition: 'color 0.15s ease',
            }} />
          </div>
        </div>

        {/* Right panel */}
        <div className="diff-panel" style={{ flex: 1 }}>
          <div style={headerStyle}>
            <span style={labelStyle}>
              <span style={{ color: '#00d9aa', marginRight: '8px' }}>B</span>
              {snapshotB.name}
            </span>
            <span style={{ ...labelStyle, fontSize: '10px', color: '#3a3a3a', flexShrink: 0 }}>
              {snapshotB.timestamp}
            </span>
          </div>
          <iframe
            className="diff-iframe"
            srcDoc={snapshotB.output}
            title={`Snapshot B: ${snapshotB.name}`}
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  );
};

/* ─── Snapshot Thumbnail ─────────────────────────────────────────────────── */
const SnapshotThumb: React.FC<{ output: string }> = ({ output }) => (
  <div className="snapshot-thumbnail">
    <iframe srcDoc={output} title="preview" sandbox="allow-scripts" />
  </div>
);

/* ─── Main SnapshotManager ───────────────────────────────────────────────── */
const SnapshotManager: React.FC<SnapshotManagerProps> = ({
  isOpen,
  onClose,
  snapshots,
  onSave,
  currentOutput,
  currentHtml,
  currentCss,
  currentJs,
  onTakeSnapshot,
}) => {
  const [newName, setNewName]           = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [compareA, setCompareA]         = useState<Snapshot | null>(null);
  const [compareB, setCompareB]         = useState<Snapshot | null>(null);
  const [diffView, setDiffView]         = useState(false);
  const nameInputRef                    = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showNameInput) setTimeout(() => nameInputRef.current?.focus(), 50);
  }, [showNameInput]);

  const handleTake = () => {
    const name = newName.trim() || `Snapshot ${snapshots.length + 1}`;
    onTakeSnapshot(name);
    setNewName('');
    setShowNameInput(false);
  };

  const handleDelete = (id: string) => {
    const updated = snapshots.filter(s => s.id !== id);
    onSave(updated);
    if (compareA?.id === id) setCompareA(null);
    if (compareB?.id === id) setCompareB(null);
  };

  const handleSelectCompare = (snap: Snapshot) => {
    if (!compareA) { setCompareA(snap); return; }
    if (compareA.id === snap.id) { setCompareA(null); return; }
    if (!compareB) { setCompareB(snap); return; }
    if (compareB.id === snap.id) { setCompareB(null); return; }
    setCompareB(snap);
  };

  const openDiff = () => {
    if (compareA && compareB) setDiffView(true);
  };

  const closeDiff = () => setDiffView(false);

  if (!isOpen) return null;

  if (diffView && compareA && compareB) {
    return <DiffViewer snapshotA={compareA} snapshotB={compareB} onBack={closeDiff} />;
  }

  const isSelectedForCompare = (id: string) => compareA?.id === id || compareB?.id === id;
  const compareLabel = (id: string) => compareA?.id === id ? 'A' : compareB?.id === id ? 'B' : null;

  const btnBase: React.CSSProperties = {
    background: 'transparent', border: '1px solid #2a2a2a', color: '#8a8a8a',
    fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', textTransform: 'uppercase',
    letterSpacing: '0.06em', padding: '4px 10px', borderRadius: '3px', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    transition: 'color 0.15s ease, border-color 0.15s ease',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 149, background: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
      />

      <div className="snapshot-drawer">
        {/* Header */}
        <div style={{
          height: '52px', borderBottom: '1px solid #1f1f1f',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-camera" style={{ color: '#e8ff47', fontSize: '13px' }} />
            <span style={{
              fontFamily: 'Syne, system-ui, sans-serif', fontSize: '14px',
              fontWeight: 700, color: '#f2f2f2', letterSpacing: '-0.01em',
            }}>
              Snapshots
            </span>
            {snapshots.length > 0 && (
              <span style={{
                padding: '1px 7px', background: 'rgba(232,255,71,0.08)',
                border: '1px solid rgba(232,255,71,0.2)', color: '#e8ff47',
                fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
                borderRadius: '10px',
              }}>
                {snapshots.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#5a5a5a', cursor: 'pointer', padding: '4px', fontSize: '13px', transition: 'color 0.15s ease' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f2f2f2')}
            onMouseLeave={e => (e.currentTarget.style.color = '#5a5a5a')}
          >
            <i className="fa-solid fa-times" />
          </button>
        </div>

        {/* Compare bar */}
        {(compareA || compareB) && (
          <div style={{
            padding: '10px 16px', background: '#111', borderBottom: '1px solid #1f1f1f',
            display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#3a3a3a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                Comparing
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                {compareA && (
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#e8ff47', background: 'rgba(232,255,71,0.08)', border: '1px solid rgba(232,255,71,0.2)', padding: '2px 7px', borderRadius: '10px' }}>
                    A: {compareA.name}
                  </span>
                )}
                {compareA && compareB && <i className="fa-solid fa-arrows-left-right" style={{ color: '#3a3a3a', fontSize: '9px' }} />}
                {compareB && (
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#00d9aa', background: 'rgba(0,217,170,0.08)', border: '1px solid rgba(0,217,170,0.2)', padding: '2px 7px', borderRadius: '10px' }}>
                    B: {compareB.name}
                  </span>
                )}
                {!compareB && (
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3a3a3a' }}>
                    — select B
                  </span>
                )}
              </div>
            </div>
            {compareA && compareB && (
              <button
                onClick={openDiff}
                style={{
                  ...btnBase,
                  background: 'rgba(232,255,71,0.08)',
                  border: '1px solid rgba(232,255,71,0.3)',
                  color: '#e8ff47',
                  fontWeight: 600,
                  flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,255,71,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,255,71,0.08)'; }}
              >
                <i className="fa-solid fa-code-compare" style={{ fontSize: '10px' }} />
                View Diff
              </button>
            )}
          </div>
        )}

        {/* Take snapshot */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a1a', flexShrink: 0 }}>
          {showNameInput ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                ref={nameInputRef}
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleTake(); if (e.key === 'Escape') setShowNameInput(false); }}
                placeholder="Snapshot name..."
                style={{
                  flex: 1, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '3px',
                  color: '#f2f2f2', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px',
                  padding: '7px 10px', outline: 'none',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#e8ff47')}
                onBlur={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
              />
              <button
                onClick={handleTake}
                style={{
                  ...btnBase, background: '#e8ff47', border: '1px solid #e8ff47',
                  color: '#0d0d0d', fontWeight: 700, flexShrink: 0,
                }}
              >
                Save
              </button>
              <button
                onClick={() => setShowNameInput(false)}
                style={{ ...btnBase, flexShrink: 0 }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowNameInput(true)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', padding: '9px', background: 'rgba(232,255,71,0.04)',
                border: '1px dashed rgba(232,255,71,0.2)', borderRadius: '4px',
                color: '#e8ff47', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
                fontWeight: 600, cursor: 'pointer', letterSpacing: '0.04em',
                transition: 'background 0.15s ease, border-color 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,255,71,0.08)'; e.currentTarget.style.borderColor = 'rgba(232,255,71,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,255,71,0.04)'; e.currentTarget.style.borderColor = 'rgba(232,255,71,0.2)'; }}
            >
              <i className="fa-solid fa-camera" style={{ fontSize: '11px' }} />
              Take Snapshot
            </button>
          )}
        </div>

        {/* Snapshot list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {snapshots.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#2a2a2a' }}>
              <i className="fa-solid fa-film" style={{ fontSize: '28px', marginBottom: '12px', display: 'block' }} />
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                No snapshots yet
              </p>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', marginTop: '6px', color: '#1f1f1f' }}>
                Take one to start comparing
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {snapshots.map((snap) => {
                const selected = isSelectedForCompare(snap.id);
                const label = compareLabel(snap.id);
                return (
                  <div
                    key={snap.id}
                    style={{
                      background: selected ? 'rgba(232,255,71,0.03)' : '#111',
                      border: `1px solid ${selected ? (label === 'A' ? 'rgba(232,255,71,0.3)' : 'rgba(0,217,170,0.3)') : '#1f1f1f'}`,
                      borderRadius: '5px',
                      overflow: 'hidden',
                      transition: 'border-color 0.15s ease',
                    }}
                  >
                    <SnapshotThumb output={snap.output} />
                    <div style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                          {label && (
                            <span style={{
                              width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                              background: label === 'A' ? '#e8ff47' : '#00d9aa',
                              color: '#0d0d0d', fontFamily: 'JetBrains Mono, monospace',
                              fontSize: '9px', fontWeight: 700,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              {label}
                            </span>
                          )}
                          <span style={{
                            fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
                            color: '#f2f2f2', fontWeight: 600,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {snap.name}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDelete(snap.id)}
                          style={{
                            background: 'transparent', border: 'none', color: '#3a3a3a',
                            cursor: 'pointer', padding: '3px 5px', fontSize: '11px',
                            transition: 'color 0.15s ease', flexShrink: 0,
                          }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#ff5555')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#3a3a3a')}
                          title="Delete snapshot"
                        >
                          <i className="fa-solid fa-trash-can" />
                        </button>
                      </div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3a3a3a', marginBottom: '8px' }}>
                        {snap.timestamp}
                      </div>
                      <button
                        onClick={() => handleSelectCompare(snap)}
                        style={{
                          width: '100%',
                          ...btnBase,
                          justifyContent: 'center',
                          background: selected ? (label === 'A' ? 'rgba(232,255,71,0.08)' : 'rgba(0,217,170,0.08)') : 'transparent',
                          border: `1px solid ${selected ? (label === 'A' ? 'rgba(232,255,71,0.3)' : 'rgba(0,217,170,0.3)') : '#2a2a2a'}`,
                          color: selected ? (label === 'A' ? '#e8ff47' : '#00d9aa') : '#5a5a5a',
                        }}
                        onMouseEnter={e => { if (!selected) { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#4a4a4a'; } }}
                        onMouseLeave={e => { if (!selected) { e.currentTarget.style.color = '#5a5a5a'; e.currentTarget.style.borderColor = '#2a2a2a'; } }}
                      >
                        <i className={`fa-solid ${selected ? 'fa-circle-check' : 'fa-code-compare'}`} style={{ fontSize: '10px' }} />
                        {selected ? `Selected as ${label}` : 'Select for Compare'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div style={{
          padding: '10px 16px', borderTop: '1px solid #1a1a1a', flexShrink: 0,
          fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#2a2a2a',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <i className="fa-solid fa-circle-info" style={{ fontSize: '10px' }} />
          Select two snapshots, then click View Diff to compare side-by-side.
        </div>
      </div>
    </>
  );
};

export default SnapshotManager;
