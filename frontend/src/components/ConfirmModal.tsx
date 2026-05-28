import React from 'react';
import { ConfirmModalProps } from '../types';

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      className="animate-fade-in"
    >
      <div
        style={{
          background: '#111',
          border: '1px solid #2a2a2a',
          borderRadius: '6px',
          width: '100%',
          maxWidth: '400px',
          overflow: 'hidden',
          boxShadow: '0 24px 48px rgba(0,0,0,0.8)',
        }}
        className="animate-scale-in"
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid #1f1f1f',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <i className="fa-solid fa-triangle-exclamation" style={{ color: '#ff5555', fontSize: '13px' }} />
          <h3
            style={{
              fontFamily: 'Syne, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: '15px',
              color: '#f2f2f2',
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h3>
        </div>

        {/* Body */}
        <div style={{ padding: '20px' }}>
          <p
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              color: '#8a8a8a',
              lineHeight: 1.6,
              marginBottom: '20px',
            }}
          >
            {message}
          </p>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '9px 16px',
                background: 'transparent',
                border: '1px solid #2a2a2a',
                color: '#8a8a8a',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                borderRadius: '3px',
                transition: 'color 0.15s ease, border-color 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#5a5a5a'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#8a8a8a'; e.currentTarget.style.borderColor = '#2a2a2a'; }}
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              style={{
                flex: 1,
                padding: '9px 16px',
                background: 'transparent',
                border: '1px solid #4a1515',
                color: '#ff5555',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                borderRadius: '3px',
                transition: 'background 0.15s ease, border-color 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#2a0a0a'; e.currentTarget.style.borderColor = '#ff5555'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#4a1515'; }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
