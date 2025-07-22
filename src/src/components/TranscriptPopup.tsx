import React, { useEffect } from 'react';

type TranscriptPopupProps = {
  message: string;
  onClose: () => void;
  duration?: number; // ms
};

const TranscriptPopup: React.FC<TranscriptPopupProps> = ({ message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        bottom: 110,
        right: 32,
        zIndex: 1100,
        background: 'white',
        border: '1px solid #1976d2',
        borderRadius: 12,
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        minWidth: 220,
        maxWidth: 320,
        padding: '12px 16px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        color: '#1976d2',
        fontWeight: 500,
        fontSize: 15,
      }}
      aria-live="polite"
      role="status"
      title="Click to dismiss"
    >
      <span>{message}</span>
    </div>
  );
};

export default TranscriptPopup; 