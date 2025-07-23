import React from 'react';

export type VoiceFeedbackProps = {
  listening: boolean;
  error?: string | null;
  transcript?: string;
};

const VoiceFeedback: React.FC<VoiceFeedbackProps> = ({
  listening,
  error,
  transcript,
}) => {
  if (error) {
    return (
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#fff3f3',
          color: '#d32f2f',
          border: '2px solid #d32f2f',
          borderRadius: 12,
          padding: '10px 24px',
          fontWeight: 600,
          fontSize: 16,
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(211,47,47,0.10)',
        }}
      >
        <span role="img" aria-label="error" style={{ marginRight: 8 }}>
          ❌
        </span>
        {error}
      </div>
    );
  }
  if (listening) {
    return (
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#e3f2fd',
          color: '#1976d2',
          border: '2px solid #1976d2',
          borderRadius: 12,
          padding: '10px 24px',
          fontWeight: 600,
          fontSize: 16,
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(25,118,210,0.10)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span role="img" aria-label="mic">
          🎤
        </span>
        Listening...
        {transcript && (
          <span
            style={{
              fontWeight: 400,
              fontSize: 14,
              marginLeft: 12,
              color: '#1976d2',
            }}
          >
            {transcript}
          </span>
        )}
      </div>
    );
  }
  // Idle: show nothing or a subtle indicator
  return null;
};

export default VoiceFeedback;
