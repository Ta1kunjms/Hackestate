import React, { useState, useEffect, useRef } from 'react';
import AgentAvatar from './AgentAvatar';
import { sendToGemini } from '../api/geminiApi';
import { Property } from '../data/mockProperties';
import {
  savePreferences,
  loadPreferences,
  saveChatHistory,
  loadChatHistory,
  resetMemory,
  UserPreferences,
} from '../utils/agentMemory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeMute, faVolumeUp, faCog, faMicrophone, faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

// You will set your Gemini API key in an environment variable (see api/geminiApi.ts for details)

type AgentChatProps = {
  onFilter: (criteria: { location?: string; maxPrice?: number }) => void;
  onScrollTo?: (section: 'listings' | 'filters') => void;
};

const AgentChat: React.FC<AgentChatProps> = ({ onFilter, onScrollTo }) => {
  const [messages, setMessages] = useState<{ from: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [prefs, setPrefs] = useState<UserPreferences>({});
  const [muted, setMuted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [listening, setListening] = useState(false); // Placeholder for voice
  const chatRef = useRef<HTMLDivElement>(null);
  const [popup, setPopup] = useState<{ user: string; ai: string } | null>(null);
  const popupTimeout = useRef<NodeJS.Timeout | null>(null);
  const [inputFocused, setInputFocused] = useState(false);

  useEffect(() => {
    setMessages(loadChatHistory());
    setPrefs(loadPreferences());
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) saveChatHistory(messages);
  }, [messages, isClient]);

  useEffect(() => {
    if (isClient) savePreferences(prefs);
  }, [prefs, isClient]);

  // Animate open/close
  useEffect(() => {
    if (expanded) setAnimating(true);
    else if (animating) {
      // Wait for animation to finish before fully hiding
      const timeout = setTimeout(() => setAnimating(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [expanded]);

  // Close chat when clicking outside
  useEffect(() => {
    if (!expanded) return;
    function handleClick(e: MouseEvent) {
      if (chatRef.current && !chatRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [expanded]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user' as const, text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);

    // Simple command parsing for filtering
    const locationMatch = input.match(/in ([a-zA-Z ]+)/i);
    const priceMatch = input.match(/under \$?(\d+[\d,]*)/i);
    const criteria: { location?: string; maxPrice?: number } = {};
    if (locationMatch) {
      criteria.location = locationMatch[1].trim();
      setPrefs((p) => ({ ...p, location: criteria.location }));
    }
    if (priceMatch) {
      criteria.maxPrice = parseInt(priceMatch[1].replace(/,/g, ''), 10);
      setPrefs((p) => ({ ...p, budget: criteria.maxPrice }));
    }
    if (criteria.location || criteria.maxPrice) {
      onFilter(criteria);
    }

    // DOM action parsing
    if (/scroll to listings|show listings/i.test(input)) {
      onScrollTo && onScrollTo('listings');
    } else if (/scroll to filters|show filters/i.test(input)) {
      onScrollTo && onScrollTo('filters');
    }

    const aiText = await sendToGemini(input);
    setMessages((msgs) => [...msgs, { from: 'ai', text: aiText }]);
    // If chat is collapsed, show popup with last user and AI message
    if (!expanded) {
      setPopup({ user: input, ai: aiText });
      if (popupTimeout.current) clearTimeout(popupTimeout.current);
      popupTimeout.current = setTimeout(() => setPopup(null), 5000);
    }
    setLoading(false);
  };

  const handleReset = () => {
    resetMemory();
    setPrefs({});
    setMessages([]);
    setShowSettings(false);
  };
  const handleMuteToggle = () => setMuted((m) => !m);

  const isSpeechRecognitionSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  if (!isClient) return null;

  // Floating icon (avatar or mic) when collapsed
  if (!expanded && !animating) {
    return (
      <>
        {popup && (
          <div
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
            }}
            onClick={() => { setExpanded(true); setPopup(null); }}
          >
            <div style={{ color: '#1976d2', fontWeight: 500, textAlign: 'right', fontSize: 14 }}>{popup.user}</div>
            <div style={{ color: '#333', background: '#f5f5f5', borderRadius: 8, padding: '8px 12px', fontSize: 14 }}>{popup.ai}</div>
          </div>
        )}
        <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000, cursor: 'pointer' }} onClick={() => setExpanded(true)}>
          <div style={{ borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', background: 'transparent' }}>
            <AgentAvatar />
            {listening && (
              <FontAwesomeIcon icon={faMicrophone} spin style={{ color: '#fff', position: 'absolute', bottom: 8, right: 8, fontSize: 24 }} />
            )}
          </div>
        </div>
      </>
    );
  }

  // Animate chat open/close
  return (
    <div ref={chatRef} style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000, background: 'transparent', padding: 0, margin: 0 }}>
      <div
        style={{
          width: 340,
          height: 480,
          background: '#fff',
          border: '2px solid #1976d2',
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.18)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'transform 0.2s cubic-bezier(.4,1.6,.6,1), opacity 0.2s cubic-bezier(.4,1.6,.6,1)',
          transform: expanded ? 'scale(1)' : 'scale(0.85)',
          opacity: expanded ? 1 : 0,
          pointerEvents: expanded ? 'auto' : 'none',
        }}
      >
        {/* Header: 10% */}
        <div style={{ flex: '0 0 10%', minHeight: 48, maxHeight: 56, background: '#1976d2', color: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative', justifyContent: 'center', padding: 0, width: '100%' }}>
          {/* Centered, overflowing avatar */}
          <div style={{ position: 'absolute', left: '50%', top: -24, transform: 'translateX(-50%)', zIndex: 3, background: 'transparent' }}>
            <AgentAvatar />
          </div>
          {/* Agent name, centered */}
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-start', minWidth: 0 }}>
            <span style={{ fontWeight: 700, fontSize: 18, background: 'transparent', color: 'white', letterSpacing: 0.5, userSelect: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120, marginTop: 12, textAlign: 'left', marginLeft: 20 }}>AI Agent</span>
          </div>
          {/* Settings and close */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginRight: 16, zIndex: 2 }}>
            <button
              aria-label="Agent settings"
              tabIndex={0}
              style={{ background: 'transparent', color: '#fff', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 18, transition: 'color 0.2s' }}
              onClick={() => setShowSettings((s) => !s)}
              onMouseOver={e => (e.currentTarget.style.color = '#90caf9')}
              onMouseOut={e => (e.currentTarget.style.color = '#fff')}
              onFocus={e => (e.currentTarget.style.color = '#90caf9')}
              onBlur={e => (e.currentTarget.style.color = '#fff')}
            >
              <FontAwesomeIcon icon={faCog} />
            </button>
            <button onClick={() => setExpanded(false)} aria-label="Close chat" style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            {showSettings && (
              <div style={{ position: 'absolute', top: 36, right: 0, background: 'rgba(25,118,210,0.95)', color: '#fff', border: '1.5px solid #1976d2', borderRadius: 8, boxShadow: '0 2px 8px rgba(25,118,210,0.18)', zIndex: 10, minWidth: 120, padding: 8, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                <button
                  onClick={handleReset}
                  aria-label="Reset agent memory"
                  tabIndex={0}
                  style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 0', cursor: 'pointer', width: '100%', fontWeight: 600, fontSize: 15, marginBottom: 2, transition: 'background 0.15s' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
                  onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                >
                  Reset
                </button>
              </div>
            )}
          </div>
          {/* Removed mic and speaker buttons from header */}
          {prefs.location && <div style={{ fontSize: 12, color: '#fff', marginTop: 2 }}>Pref: {prefs.location}{prefs.budget ? `, ≤ $${prefs.budget.toLocaleString()}` : ''}</div>}
        </div>
        {/* Chat history: 80% */}
        <div style={{ flex: '1 1 80%', minHeight: 0, padding: '1rem', overflowY: 'auto', background: '#fff', maxHeight: '100%' }}>
          {messages.length === 0 && (
            <div style={{ marginBottom: '1rem', color: '#888' }}>[Chat messages will appear here]</div>
          )}
          {!isSpeechRecognitionSupported && (
            <div style={{ color: '#d32f2f', fontSize: 13, marginBottom: 8 }}>
              Voice input is not supported in your browser. You can still use text chat.
            </div>
          )}
          {muted && (
            <div style={{ color: '#ffa726', fontSize: 13, marginBottom: 8 }}>
              Agent is muted. Voice responses are disabled.
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: 8, textAlign: msg.from === 'user' ? 'right' : 'left' }}>
              <span style={{
                display: 'inline-block',
                background: msg.from === 'user' ? '#e3f2fd' : '#f5f5f5',
                color: '#222',
                borderRadius: 12,
                padding: '6px 12px',
                maxWidth: 220,
                wordBreak: 'break-word',
              }}>{msg.text}</span>
            </div>
          ))}
          {loading && <div style={{ color: '#1976d2', fontStyle: 'italic' }}>AI is typing...</div>}
        </div>
        {/* Input/buttons: 10% */}
        <form
          style={{ flex: '0 0 10%', minHeight: 56, maxHeight: 56, padding: '0.5rem 1rem', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', background: 'white', gap: 0 }}
          onSubmit={e => { e.preventDefault(); handleSend(); }}
        >
          {!inputFocused && (
            <>
              <button
                type="button"
                onClick={() => setListening(l => !l)}
                style={{
                  background: 'transparent',
                  color: listening ? '#1976d2' : '#1976d2',
                  border: 'none',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 4,
                  boxShadow: listening ? '0 0 0 2px #90caf9' : undefined,
                  transition: 'color 0.2s',
                }}
                title={listening ? 'Stop Listening' : 'Start Listening'}
                aria-pressed={listening}
                onMouseOver={e => (e.currentTarget.style.color = '#1565c0')}
                onMouseOut={e => (e.currentTarget.style.color = '#1976d2')}
                onFocus={e => (e.currentTarget.style.color = '#1565c0')}
                onBlur={e => (e.currentTarget.style.color = '#1976d2')}
              >
                <FontAwesomeIcon icon={faMicrophone} spin={listening} style={{ fontSize: 13 }} />
              </button>
              <button
                onClick={handleMuteToggle}
                aria-label={muted ? 'Unmute agent' : 'Mute agent'}
                tabIndex={0}
                style={{ background: 'transparent', color: '#1976d2', border: 'none', borderRadius: '50%', width: 24, height: 24, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 8, transition: 'color 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.color = '#1565c0')}
                onMouseOut={e => (e.currentTarget.style.color = '#1976d2')}
                onFocus={e => (e.currentTarget.style.color = '#1565c0')}
                onBlur={e => (e.currentTarget.style.color = '#1976d2')}
              >
                <FontAwesomeIcon icon={muted ? faVolumeMute : faVolumeUp} style={{ fontSize: 13 }} />
              </button>
            </>
          )}
          <textarea
            placeholder="Aa"
            style={{
              flex: 1,
              minHeight: 24,
              maxHeight: 40,
              padding: '0.2rem 0.5rem',
              border: '1.5px solid #b0b8c1',
              borderRadius: 8,
              outline: 'none',
              background: '#fff',
              minWidth: 0,
              color: '#222',
              fontSize: 14,
              fontWeight: 500,
              marginRight: inputFocused ? 0 : 10,
              transition: 'border 0.2s',
              boxShadow: '0 1px 2px rgba(25,118,210,0.04)',
              resize: 'none',
              overflowY: 'auto',
              lineHeight: '24px',
              display: 'block',
              scrollbarWidth: 'thin',
              verticalAlign: 'middle',
            }}
            value={input}
            onChange={e => {
              setInput(e.target.value);
              // auto-grow
              e.target.style.height = '24px'; // Reset height before calculating scrollHeight
              e.target.style.height = Math.min(e.target.scrollHeight, 40) + 'px';
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            disabled={loading}
            autoComplete="off"
            spellCheck={true}
            autoFocus
            rows={1}
          />
          <style>{`
            textarea::placeholder {
              color: #b0b8c1;
              opacity: 1;
              font-weight: 400;
              font-size: 14px;
              transition: color 0.2s;
              line-height: 24px;
              vertical-align: middle;
            }
            textarea:focus::placeholder,
            textarea:hover::placeholder {
              color: #b0b8c1;
            }
            textarea:focus {
              border: 1.5px solid #1976d2 !important;
              background: #fff;
            }
            textarea {
              scrollbar-width: thin;
            }
          `}</style>
          <button
            type="submit"
            style={{ background: 'transparent', color: '#1976d2', border: 'none', borderRadius: 8, padding: '0.5rem 1.1rem', cursor: 'pointer', minWidth: 32, height: 32, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s' }}
            disabled={loading || !input.trim()}
            aria-label="Send message"
            title="Send"
            onMouseOver={e => (e.currentTarget.style.color = '#1565c0')}
            onMouseOut={e => (e.currentTarget.style.color = '#1976d2')}
            onFocus={e => (e.currentTarget.style.color = '#1565c0')}
            onBlur={e => (e.currentTarget.style.color = '#1976d2')}
          >
            <FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: 13 }} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgentChat; 