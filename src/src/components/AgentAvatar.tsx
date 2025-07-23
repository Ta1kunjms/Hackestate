import React from 'react';

const AgentAvatar: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 0,
        position: 'relative',
        zIndex: 10,
        top: -8,
      }}
    >
      {/* Simple SVG robot avatar */}
      <svg
        role="img"
        aria-label="Agent Avatar"
        height="64"
        width="64"
        viewBox="0 0 200 200"
        style={{
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          borderRadius: '50%',
          background: 'white',
          border: '4px solid #fff',
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: '#6EC1E4', stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: '#3A8DFF', stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="url(#grad1)"
          stroke="#ffffff"
          strokeWidth={5}
        />

        {/* Robot face */}
        <rect
          x="50"
          y="60"
          rx={15}
          ry={15}
          width="100"
          height="80"
          fill="#ffffff"
        />

        {/* Eyes */}
        <circle cx="75" cy="95" r="8" fill="#3A8DFF" />
        <circle cx="125" cy="95" r="8" fill="#3A8DFF" />

        {/* Mouth */}
        <path
          d="M 75 120 Q 100 135, 125 120"
          stroke="#3A8DFF"
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
        />

        {/* Antenna */}
        <line
          x1="100"
          y1="30"
          x2="100"
          y2="60"
          stroke="#ffffff"
          strokeWidth={5}
        />
        <circle cx="100" cy="30" r="7" fill="#ffffff" />
      </svg>
    </div>
  );
};

export default AgentAvatar;
