import React, { useState, useMemo, useRef, useEffect } from 'react';

export type TokenType =
  | 'string' | 'number' | 'boolean' | 'null' | 'undefined'
  | 'object' | 'array' | 'fn' | 'trunc';

export interface Token {
  t: TokenType;
  v?: string;
  name?: string;
  len?: number;
  keys?: string[];
  items?: Token[];
  props?: Record<string, Token>;
}

export interface ConsoleLog {
  type: 'log' | 'error' | 'warn' | 'info';
  args: Token[];
  elapsed: number;
  errorLine?: number;
  timestamp: string;
}

interface ConsoleOutputProps {
  logs: ConsoleLog[];
  isVisible: boolean;
  onToggle: () => void;
  onClear: () => void;
}

const COLOR: Record<string, string> = {
  string:    '#98c379',
  number:    '#61afef',
  boolean:   '#d19a66',
  null:      '#7f848e',
  undefined: '#7f848e',
  fn:        '#c678dd',
  trunc:     '#7f848e',
};

const TYPE_BORDER: Record<string, string> = {
  error: '#ff5555',
  warn:  '#ffb86c',
  info:  '#61afef',
  log:   '#44475a',
};

const TYPE_BG: Record<string, string> = {
  error: 'rgba(255,85,85,0.05)',
  warn:  'rgba(255,184,108,0.05)',
  info:  'rgba(97,175,239,0.05)',
  log:   'transparent',
};

const TYPE_TIMELINE: Record<string, string> = {
  error: 'rgba(255,85,85,0.4)',
  warn:  'rgba(255,184,108,0.4)',
  info:  'rgba(97,175,239,0.4)',
  log:   'rgba(160,160,160,0.25)',
};

const TYPE_ICON: Record<string, string> = {
  error: 'fa-circle-xmark',
  warn:  'fa-triangle-exclamation',
  info:  'fa-circle-info',
  log:   'fa-chevron-right',
};

const TYPE_ICON_COLOR: Record<string, string> = {
  error: '#ff5555',
  warn:  '#ffb86c',
  info:  '#61afef',
  log:   '#5a5a5a',
};

function PrimSpan({ token }: { token: Token }) {
  const color = COLOR[token.t] ?? '#f2f2f2';
  if (token.t === 'string')
    return <span style={{ color }}>&quot;{token.v}&quot;</span>;
  if (token.t === 'fn')
    return <span style={{ color, fontStyle: 'italic' }}>ƒ {token.name}()</span>;
  if (token.t === 'null')
    return <span style={{ color }}>null</span>;
  if (token.t === 'undefined')
    return <span style={{ color }}>undefined</span>;
  if (token.t === 'trunc')
    return <span style={{ color }}>…</span>;
  return <span style={{ color }}>{token.v}</span>;
}

function TokenNode({
  token,
  depth = 0,
  autoExpand = false,
}: {
  token: Token;
  depth?: number;
  autoExpand?: boolean;
}) {
  const [open, setOpen] = useState(autoExpand);

  if (token.t !== 'object' && token.t !== 'array') {
    return <PrimSpan token={token} />;
  }

  const isArray  = token.t === 'array';
  const chevron  = open ? '▾' : '▸';
  const entries  = isArray
    ? (token.items ?? []).map((item, i) => ({ key: String(i), val: item }))
    : (token.keys ?? []).map(k => ({ key: k, val: token.props?.[k] ?? { t: 'undefined' as TokenType } }));

  return (
    <span style={{ display: 'inline' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#8a8a8a', fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px', padding: '0 2px', lineHeight: 1.4,
        }}
      >
        <span style={{ color: '#e8ff47', marginRight: 2 }}>{chevron}</span>
        <span style={{ color: '#9ca3af' }}>{isArray ? '[' : '{'}</span>
        {!open && (
          <span style={{ color: '#7f848e', fontSize: '10px' }}>
            {entries.slice(0, 3).map(({ key, val }, i) => (
              <span key={key}>
                {!isArray && <span style={{ color: '#9ca3af' }}>{key}: </span>}
                {val.t === 'object' || val.t === 'array'
                  ? <span style={{ color: '#7f848e' }}>{val.t === 'array' ? `[…]` : `{…}`}</span>
                  : <PrimSpan token={val} />
                }
                {i < Math.min(entries.length, 3) - 1 && <span style={{ color: '#4a4a5a' }}>, </span>}
              </span>
            ))}
            {entries.length > 3 && <span style={{ color: '#4a4a5a' }}>, …</span>}
          </span>
        )}
        <span style={{ color: '#9ca3af' }}>{isArray ? ']' : '}'}</span>
      </button>

      {open && (
        <div style={{ marginLeft: 16, borderLeft: '1px solid #2a2a2a', paddingLeft: 8 }}>
          {entries.map(({ key, val }) => (
            <div key={key} style={{ lineHeight: '1.7', display: 'flex', alignItems: 'flex-start', gap: 4 }}>
              <span style={{ color: '#9ca3af', fontSize: '11px', flexShrink: 0 }}>
                {isArray
                  ? <span style={{ color: '#7f848e' }}>{key}:</span>
                  : <span>{key}: </span>
                }
              </span>
              <TokenNode token={val} depth={depth + 1} autoExpand={false} />
            </div>
          ))}
        </div>
      )}
    </span>
  );
}

const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  logs, isVisible, onToggle, onClear,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && isVisible) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isVisible]);

  const maxElapsed = useMemo(
    () => Math.max(1, ...logs.map(l => l.elapsed)),
    [logs],
  );

  const errorCount = logs.filter(l => l.type === 'error').length;
  const warnCount  = logs.filter(l => l.type === 'warn').length;

  return (
    <div
      style={{
        width: '100%',
        background: '#111',
        border: '1px solid #2a2a2a',
        borderRadius: '4px',
        overflow: 'hidden',
        marginTop: '16px',
      }}
    >
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 12px', height: '38px',
          background: '#0f0f0f', borderBottom: '1px solid #1f1f1f',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onToggle}
            style={{
              background: 'transparent', border: 'none', color: '#5a5a5a',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', padding: '4px',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f2f2f2')}
            onMouseLeave={e => (e.currentTarget.style.color = '#5a5a5a')}
            title={isVisible ? 'Hide Console' : 'Show Console'}
          >
            <i className={`fa-solid ${isVisible ? 'fa-chevron-down' : 'fa-chevron-up'}`} style={{ fontSize: '10px' }} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#a0a0a0', display: 'inline-block' }} />
            <span style={{
              fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.05em', textTransform: 'uppercase', color: '#f2f2f2',
            }}>
              Console
            </span>

            {logs.length > 0 && (
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{
                  padding: '1px 6px', borderRadius: '10px',
                  background: 'rgba(232,255,71,0.08)', border: '1px solid rgba(232,255,71,0.2)',
                  color: '#e8ff47', fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
                }}>
                  {logs.length}
                </span>
                {errorCount > 0 && (
                  <span style={{
                    padding: '1px 6px', borderRadius: '10px',
                    background: 'rgba(255,85,85,0.1)', border: '1px solid rgba(255,85,85,0.25)',
                    color: '#ff5555', fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
                  }}>
                    {errorCount} err
                  </span>
                )}
                {warnCount > 0 && (
                  <span style={{
                    padding: '1px 6px', borderRadius: '10px',
                    background: 'rgba(255,184,108,0.1)', border: '1px solid rgba(255,184,108,0.25)',
                    color: '#ffb86c', fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
                  }}>
                    {warnCount} warn
                  </span>
                )}
              </div>
            )}
          </div>

          {logs.length > 1 && (
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#3a3a3a',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              <i className="fa-solid fa-clock" style={{ fontSize: '8px' }} />
              {maxElapsed.toFixed(1)}ms span
            </span>
          )}
        </div>

        <button
          onClick={onClear}
          title="Clear Console"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '5px 10px', background: 'transparent',
            border: '1px solid #1f1f1f', borderRadius: '3px',
            color: '#ff5555', fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px', fontWeight: 500, letterSpacing: '0.04em',
            textTransform: 'uppercase', cursor: 'pointer',
            whiteSpace: 'nowrap', transition: 'color 0.15s ease, border-color 0.15s ease, background 0.15s ease',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#ff7777';
            e.currentTarget.style.borderColor = '#4a1515';
            e.currentTarget.style.background = '#1a0505';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#ff5555';
            e.currentTarget.style.borderColor = '#1f1f1f';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <i className="fa-solid fa-trash-can" style={{ fontSize: '10px' }} />
          Clear
        </button>
      </div>

      {isVisible && (
        <div
          ref={scrollRef}
          style={{
            background: '#0d0d0d',
            maxHeight: '18rem',
            overflowY: 'auto',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
          }}
        >
          {logs.length === 0 ? (
            <div style={{ color: '#3a3a3a', textAlign: 'center', padding: '24px 0' }}>
              <i className="fa-solid fa-terminal" style={{ fontSize: '20px', marginBottom: '8px', display: 'block' }} />
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Console empty — run JavaScript to see output
              </p>
            </div>
          ) : (
            <div>
              {logs.map((log, index) => {
                const pct = maxElapsed > 0 ? (log.elapsed / maxElapsed) * 100 : 0;
                return (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      padding: '8px 12px',
                      borderLeft: `2px solid ${TYPE_BORDER[log.type]}`,
                      borderBottom: '1px solid #1a1a1a',
                      background: TYPE_BG[log.type],
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        right: 0, top: 0, bottom: 0,
                        width: `${pct}%`,
                        background: TYPE_TIMELINE[log.type],
                        pointerEvents: 'none',
                        transition: 'width 0.3s ease',
                      }}
                      title={`+${log.elapsed.toFixed(1)}ms from page load`}
                    />

                    <i
                      className={`fa-solid ${TYPE_ICON[log.type]}`}
                      style={{
                        fontSize: '10px',
                        color: TYPE_ICON_COLOR[log.type],
                        marginTop: '3px',
                        flexShrink: 0,
                        position: 'relative',
                        zIndex: 1,
                      }}
                    />

                    <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'flex-start', lineHeight: '1.6' }}>
                        {log.args.map((arg, ai) => (
                          <span key={ai}>
                            <TokenNode token={arg} depth={0} autoExpand={arg.t === 'object' || arg.t === 'array'} />
                          </span>
                        ))}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                        <span style={{ color: '#3a3a3a', fontSize: '10px' }}>{log.timestamp}</span>
                        {log.errorLine != null && (
                          <span style={{
                            color: '#ff5555', fontSize: '9px', fontFamily: 'JetBrains Mono, monospace',
                            background: 'rgba(255,85,85,0.1)', border: '1px solid rgba(255,85,85,0.25)',
                            borderRadius: '3px', padding: '1px 5px',
                          }}>
                            line {log.errorLine}
                          </span>
                        )}
                        <span style={{
                          color: '#2a2a2a', fontSize: '9px',
                          marginLeft: 'auto',
                          fontVariantNumeric: 'tabular-nums',
                        }}>
                          +{log.elapsed.toFixed(1)}ms
                        </span>
                      </div>
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
