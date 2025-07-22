import React from 'react';

type AgentControlsProps = {
  muted: boolean;
  onMuteToggle: () => void;
  onReset: () => void;
};

const AgentControls: React.FC<AgentControlsProps> = ({ muted, onMuteToggle, onReset }) => {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
      <button
        onClick={onMuteToggle}
        aria-label={muted ? 'Unmute agent' : 'Mute agent'}
        tabIndex={0}
        style={{ background: muted ? '#eee' : '#1976d2', color: muted ? '#1976d2' : 'white', border: 'none', borderRadius: 8, padding: '4px 12px', cursor: 'pointer' }}
      >
        {muted ? 'Unmute' : 'Mute'}
      </button>
      <button
        onClick={onReset}
        aria-label="Reset agent memory"
        tabIndex={0}
        style={{ background: '#fff', color: '#1976d2', border: '1px solid #1976d2', borderRadius: 8, padding: '4px 12px', cursor: 'pointer' }}
      >
        Reset
      </button>
      <button
        aria-label="Agent settings (coming soon)"
        tabIndex={0}
        style={{ background: '#f5f5f5', color: '#1976d2', border: '1px solid #1976d2', borderRadius: 8, padding: '4px 12px', cursor: 'pointer' }}
        disabled
      >
        Settings
      </button>
    </div>
  );
};

export default AgentControls; 