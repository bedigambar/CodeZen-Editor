import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface PaletteCommand {
  id: string;
  label: string;
  description?: string;
  icon: string;
  shortcut?: string;
  action: () => void;
  category?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: PaletteCommand[];
}

/** Lightweight fuzzy match — returns true if all chars of `query` appear in order in `str` */
function fuzzyMatch(str: string, query: string): boolean {
  if (!query) return true;
  const s = str.toLowerCase();
  const q = query.toLowerCase();
  let si = 0;
  for (let qi = 0; qi < q.length; qi++) {
    si = s.indexOf(q[qi], si);
    if (si === -1) return false;
    si++;
  }
  return true;
}

/** Score: higher = better match. Prefer prefix matches. */
function fuzzyScore(str: string, query: string): number {
  if (!query) return 0;
  const s = str.toLowerCase();
  const q = query.toLowerCase();
  if (s.startsWith(q)) return 100;
  if (s.includes(q)) return 50;
  return 10;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, commands }) => {
  const [query, setQuery]       = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef                = useRef<HTMLInputElement>(null);
  const listRef                 = useRef<HTMLDivElement>(null);

  const filtered = commands
    .filter(c => fuzzyMatch(`${c.label} ${c.description ?? ''} ${c.category ?? ''}`, query))
    .sort((a, b) => fuzzyScore(`${b.label} ${b.description ?? ''}`, query) - fuzzyScore(`${a.label} ${a.description ?? ''}`, query));

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [isOpen]);

  // Clamp selected index
  useEffect(() => {
    setSelected(s => Math.min(s, Math.max(filtered.length - 1, 0)));
  }, [filtered.length]);

  // Scroll selected item into view
  useEffect(() => {
    const item = listRef.current?.children[selected] as HTMLElement | undefined;
    item?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  const execute = useCallback((cmd: PaletteCommand) => {
    cmd.action();
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === 'Enter' && filtered[selected]) { e.preventDefault(); execute(filtered[selected]); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, filtered, selected, execute, onClose]);

  if (!isOpen) return null;

  const categories = Array.from(new Set(filtered.map(c => c.category ?? 'Actions')));

  return (
    <div className="cmd-backdrop" onClick={onClose}>
      <div className="cmd-panel" onClick={e => e.stopPropagation()}>
        {/* Search input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '0 16px', borderBottom: '1px solid #1f1f1f',
        }}>
          <i className="fa-solid fa-magnifying-glass" style={{ color: '#3a3a3a', fontSize: '13px', flexShrink: 0 }} />
          <input
            ref={inputRef}
            className="cmd-input"
            placeholder="Type a command..."
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
            color: '#3a3a3a', background: '#1a1a1a', border: '1px solid #2a2a2a',
            borderRadius: '3px', padding: '2px 6px', flexShrink: 0,
          }}>Esc</kbd>
        </div>

        {/* Results */}
        <div ref={listRef} style={{ maxHeight: '380px', overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{
              padding: '32px 16px', textAlign: 'center',
              fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#3a3a3a',
            }}>
              <i className="fa-solid fa-ghost" style={{ fontSize: '20px', marginBottom: '10px', display: 'block' }} />
              No commands match "{query}"
            </div>
          ) : (
            (() => {
              let itemIndex = 0;
              return categories.map(cat => {
                const catItems = filtered.filter(c => (c.category ?? 'Actions') === cat);
                return (
                  <div key={cat}>
                    <div style={{
                      padding: '8px 16px 4px',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '9px', letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: '#3a3a3a',
                      borderTop: cat !== categories[0] ? '1px solid #1a1a1a' : 'none',
                    }}>
                      {cat}
                    </div>
                    {catItems.map(cmd => {
                      const idx = itemIndex++;
                      const isSelected = idx === selected;
                      return (
                        <div
                          key={cmd.id}
                          className={`cmd-result-item${isSelected ? ' selected' : ''}`}
                          onClick={() => execute(cmd)}
                          onMouseEnter={() => setSelected(idx)}
                        >
                          <div style={{
                            width: 28, height: 28, flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: isSelected ? 'rgba(232,255,71,0.08)' : '#1a1a1a',
                            border: `1px solid ${isSelected ? 'rgba(232,255,71,0.2)' : '#2a2a2a'}`,
                            borderRadius: '4px',
                            transition: 'background 0.15s ease',
                          }}>
                            <i className={`fa-solid ${cmd.icon}`} style={{
                              fontSize: '11px',
                              color: isSelected ? '#e8ff47' : '#5a5a5a',
                              transition: 'color 0.15s ease',
                            }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontFamily: 'JetBrains Mono, monospace', fontSize: '12px',
                              color: isSelected ? '#f2f2f2' : '#a0a0a0',
                              fontWeight: isSelected ? 600 : 400,
                              transition: 'color 0.1s ease',
                            }}>
                              {cmd.label}
                            </div>
                            {cmd.description && (
                              <div style={{
                                fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
                                color: '#3a3a3a', marginTop: '1px',
                              }}>
                                {cmd.description}
                              </div>
                            )}
                          </div>
                          {cmd.shortcut && (
                            <kbd style={{
                              fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
                              color: '#5a5a5a', background: '#1a1a1a',
                              border: '1px solid #2a2a2a', borderRadius: '3px',
                              padding: '2px 7px', whiteSpace: 'nowrap', flexShrink: 0,
                            }}>
                              {cmd.shortcut}
                            </kbd>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              });
            })()
          )}
        </div>

        {/* Footer hint */}
        <div style={{
          padding: '8px 16px', borderTop: '1px solid #1a1a1a',
          display: 'flex', gap: '16px', alignItems: 'center',
        }}>
          {[
            { keys: ['↑', '↓'], label: 'navigate' },
            { keys: ['↵'], label: 'select' },
            { keys: ['Esc'], label: 'close' },
          ].map(({ keys, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {keys.map(k => (
                <kbd key={k} style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
                  color: '#3a3a3a', background: '#1a1a1a', border: '1px solid #2a2a2a',
                  borderRadius: '3px', padding: '1px 5px',
                }}>{k}</kbd>
              ))}
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#2a2a2a', marginLeft: '2px' }}>
                {label}
              </span>
            </div>
          ))}
          {filtered.length > 0 && (
            <span style={{
              marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px', color: '#2a2a2a',
            }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
