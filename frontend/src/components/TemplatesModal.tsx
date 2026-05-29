import React from 'react';
import { Template, templates } from '../data/templates';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

const TemplatesModal: React.FC<TemplatesModalProps> = ({ isOpen, onClose, onSelectTemplate }) => {
  if (!isOpen) return null;

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
          maxWidth: '860px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
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
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-layer-group" style={{ color: '#e8ff47', fontSize: '13px' }} />
            <h2
              style={{
                fontFamily: 'Syne, system-ui, sans-serif',
                fontWeight: 700,
                fontSize: '15px',
                color: '#f2f2f2',
                letterSpacing: '-0.01em',
              }}
            >
              Code Templates
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

        <div style={{ padding: '10px 20px', borderBottom: '1px solid #1a1a1a', flexShrink: 0 }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#8a8a8a' }}>
            Select a template (your current code will be replaced).
          </p>
        </div>

        <div
          style={{
            padding: '16px 20px 20px',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '8px',
          }}
        >
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              style={{
                background: '#0f0f0f',
                border: '1px solid #1f1f1f',
                borderRadius: '4px',
                padding: '14px',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease, background 0.15s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#e8ff47';
                (e.currentTarget as HTMLDivElement).style.background = '#141400';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#1f1f1f';
                (e.currentTarget as HTMLDivElement).style.background = '#0f0f0f';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                <h3
                  style={{
                    fontFamily: 'Syne, system-ui, sans-serif',
                    fontWeight: 700,
                    fontSize: '13px',
                    color: '#f2f2f2',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.3,
                  }}
                >
                  {template.name}
                </h3>
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '9px',
                    color: '#8a8a8a',
                    background: '#1a1a1a',
                    border: '1px solid #2a2a2a',
                    borderRadius: '2px',
                    padding: '2px 6px',
                    whiteSpace: 'nowrap',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    flexShrink: 0,
                  }}
                >
                  {template.category}
                </span>
              </div>

              <p
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px',
                  color: '#8a8a8a',
                  lineHeight: 1.5,
                  marginBottom: '10px',
                }}
              >
                {template.description}
              </p>

              <div style={{ display: 'flex', gap: '4px' }}>
                {template.html && (
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#e34c26', background: 'rgba(227,76,38,0.1)', border: '1px solid rgba(227,76,38,0.2)', borderRadius: '2px', padding: '2px 6px' }}>
                    HTML
                  </span>
                )}
                {template.css && (
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#264de4', background: 'rgba(38,77,228,0.1)', border: '1px solid rgba(38,77,228,0.2)', borderRadius: '2px', padding: '2px 6px' }}>
                    CSS
                  </span>
                )}
                {template.js && (
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#c8a600', background: 'rgba(247,223,30,0.08)', border: '1px solid rgba(247,223,30,0.15)', borderRadius: '2px', padding: '2px 6px' }}>
                    JS
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplatesModal;
