import React, { useEffect, useState } from 'react';

interface TranscriptPopupProps {
  message: string;
  onClose: () => void;
  visible?: boolean;
}

const TranscriptPopup: React.FC<TranscriptPopupProps> = ({
  message,
  onClose,
  visible = true,
}) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!visible) {
      setFade(true);
      const timer = setTimeout(onClose, 800); // match CSS transition
      return () => clearTimeout(timer);
    } else {
      setFade(false);
    }
  }, [visible, onClose]);

  return (
    <div
      className={`popup-fade${fade ? ' hide' : ''}`}
      style={{
        position: 'fixed',
        bottom: 100,
        right: 40,
        background: '#1976d2',
        color: '#fff',
        borderRadius: 12,
        padding: '18px 28px',
        fontWeight: 500,
        fontSize: 16,
        zIndex: 2000,
        boxShadow: '0 4px 24px rgba(25,118,210,0.18)',
        maxWidth: 340,
        minWidth: 180,
        transition: 'opacity 0.8s',
        opacity: fade ? 0 : 1,
        cursor: 'pointer',
      }}
      onClick={onClose}
    >
      {message}
    </div>
  );
};

export default TranscriptPopup;
