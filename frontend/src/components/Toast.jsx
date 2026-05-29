import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function Toast({ message, type = 'warn', duration = 3500, onClose, actionText, onAction, autoClose = true }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    const show = setTimeout(() => setVisible(true), 10);
    
    let hide;
    if (autoClose) {
      hide = setTimeout(() => {
        setVisible(false);
      }, duration);
    }
    
    return () => { clearTimeout(show); if (hide) clearTimeout(hide); };
  }, [message, duration, onClose, autoClose]);

  if (!message) return null;

  const colors = {
    error: { bg: 'rgba(255,80,80,0.12)', border: 'rgba(255,80,80,0.35)', text: '#ff7070', actionBg: 'rgba(255,80,80,0.2)' },
    warn:  { bg: 'rgba(255,190,61,0.12)', border: 'rgba(255,190,61,0.35)', text: '#ffb93d', actionBg: 'rgba(255,190,61,0.2)' },
    info:  { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.35)', text: '#a78bfa', actionBg: 'rgba(139,92,246,0.2)' },
    success: { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.35)', text: '#10b981', actionBg: 'rgba(16, 185, 129, 0.2)' },
  };
  const c = colors[type] ?? colors.warn;

  const handleManualClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '1.75rem',
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? '0' : '1rem'})`,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.25s ease, transform 0.25s ease',
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        padding: '0.65rem 1.25rem',
        borderRadius: '0.6rem',
        fontSize: '0.85rem',
        fontFamily: 'var(--font-display)',
        fontWeight: 500,
        backdropFilter: 'blur(12px)',
        zIndex: 9999,
        maxWidth: '90vw',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}
    >
      <div style={{ flex: 1 }}>{message}</div>
      
      {actionText && onAction && (
        <button
          onClick={onAction}
          style={{
            background: c.actionBg,
            border: `1px solid ${c.border}`,
            color: c.text,
            padding: '0.2rem 0.6rem',
            borderRadius: '0.4rem',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 'auto'
          }}
        >
          {actionText}
        </button>
      )}

      <button 
        onClick={handleManualClose}
        style={{
          background: 'none',
          border: 'none',
          color: c.text,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.2rem',
          opacity: 0.8
        }}
        aria-label="Close notification"
      >
        <X size={15} />
      </button>
    </div>
  );
}
