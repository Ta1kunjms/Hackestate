import React, { useState, useEffect, useRef } from 'react';
import AgentAvatar from './AgentAvatar';
import { sendToGemini } from '../api/geminiApi';
import {
  savePreferences,
  loadPreferences,
  saveChatHistory,
  loadChatHistory,
  resetMemory,
  UserPreferences,
} from '../utils/agentMemory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVolumeMute,
  faVolumeUp,
  faCog,
  faMicrophone,
  faTimes,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import AgentControls from './AgentControls';
import {
  createRecognition,
  startRecognition,
  stopRecognition,
  SpeechRecognitionResultHandler,
  speakText,
  isSpeechSynthesisSupported,
  stopSpeaking,
  getVoices,
  playChime,
} from '../utils/webSpeech';
import { useToast } from './ToastProvider';
import { startWakeWord } from '../utils/wakeWord';
import VoiceFeedback from './VoiceFeedback';

// You will set your Gemini API key in an environment variable (see api/geminiApi.ts for details)

type AgentChatProps = {
  onFilter?: (criteria: { location?: string; maxPrice?: number }) => void;
  onScrollTo?: (section: 'listings' | 'filters') => void;
};

const AgentChat: React.FC<AgentChatProps> = ({ onFilter, onScrollTo }) => {
  const [messages, setMessages] = useState<
    { from: 'user' | 'ai'; text: string }[]
  >([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [prefs, setPrefs] = useState<UserPreferences>({});
  const [muted, setMuted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechTimeout, setSpeechTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const lastSentRef = useRef('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const [popup, setPopup] = useState<{ user: string; ai: string } | null>(null);
  const [popupVisible, setPopupVisible] = useState(true);
  const popupTimeout = useRef<NodeJS.Timeout | null>(null);
  const [inputFocused, setInputFocused] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [lang, setLang] = useState('en-US');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const wakeWordDetectorRef = useRef<any | null>(null); // Changed type to any for porcupine instance
  const [continuousListening, setContinuousListening] = useState(false);
  const [wakeWordEnabled, setWakeWordEnabled] = useState(() => {
    // Try to load from prefs, default true
    return typeof window !== 'undefined' && window.localStorage
      ? JSON.parse(window.localStorage.getItem('wakeWordEnabled') || 'true')
      : true;
  });
  // Timeout for auto-stop (ms)
  const AUTO_STOP_TIMEOUT = 10000;
  const autoStopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [autoSendTimeout, setAutoSendTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [autoSendCountdown, setAutoSendCountdown] = useState<number>(0);
  const autoSendIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isInCountdownRef = useRef<boolean>(false);
  const { showToast } = useToast();

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

  useEffect(() => {
    if (!listening) {
      setTranscript('');
      if (recognitionRef.current) stopRecognition(recognitionRef.current);
      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current);
        autoStopTimeoutRef.current = null;
      }
      if (speechTimeout) {
        clearTimeout(speechTimeout);
        setSpeechTimeout(null);
      }
      lastSentRef.current = '';
      // playChime('stop'); // Removed beep
      return;
    }
    setSpeechError(null);
    // playChime('start'); // Removed repetitive beep
    lastSentRef.current = '';
    const handleResult: SpeechRecognitionResultHandler = (text, isFinal) => {
      setTranscript(text); // Show live transcript
      if (isFinal) {
        const trimmed = text.trim();
        if (trimmed) {
          // If there's already text in input and an auto-send countdown, append to it
          setInput(prevInput => {
            const existingText = prevInput.trim();
            if (existingText && autoSendCountdown > 0) {
              // Append new speech to existing text
              return existingText + ' ' + trimmed;
            } else {
              // First speech input or no countdown active
              return trimmed;
            }
          });

          // Clear any existing auto-send timeout and restart the 4-second timer
          if (autoSendTimeout) {
            clearTimeout(autoSendTimeout);
            setAutoSendTimeout(null);
          }
          if (autoSendIntervalRef.current) {
            clearInterval(autoSendIntervalRef.current);
            autoSendIntervalRef.current = null;
          }

          // Start 4-second countdown
          setAutoSendCountdown(4);
          isInCountdownRef.current = true;
          autoSendIntervalRef.current = setInterval(() => {
            setAutoSendCountdown(prev => {
              if (prev <= 1) {
                if (autoSendIntervalRef.current) {
                  clearInterval(autoSendIntervalRef.current);
                  autoSendIntervalRef.current = null;
                }
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          const timeout = setTimeout(() => {
            // Use current input value (might have been appended to)
            const currentInput = inputRef.current?.value || input;
            handleSend(currentInput);
            setAutoSendTimeout(null);
            setAutoSendCountdown(0);
            setListening(false); // Stop listening after auto-send
            isInCountdownRef.current = false;
            if (autoSendIntervalRef.current) {
              clearInterval(autoSendIntervalRef.current);
              autoSendIntervalRef.current = null;
            }
          }, 4000);
          setAutoSendTimeout(timeout);
        }
        setTranscript('');
        setListening(false); // Stop current recognition
        // playChime('command'); // Removed annoying beep

        // Restart listening after a brief pause to continue capturing speech during countdown
        setTimeout(() => {
          // Check if we just started a countdown
          if (isInCountdownRef.current) {
            setListening(true); // This will trigger the useEffect to restart recognition
          }
        }, 300);
      }
      // No need for timers or interim result handling!
    };
    recognitionRef.current = createRecognition(handleResult, err => {
      // Handle mic permission denied, browser interruption, or other errors
      let userMsg = err || 'Speech recognition error';
      if (err === 'not-allowed' || err === 'denied') {
        userMsg = 'Microphone access denied. Please allow mic permissions.';
      } else if (err === 'no-speech') {
        userMsg = 'No speech detected. Try again.';
      } else if (err === 'aborted') {
        userMsg = 'Speech recognition was interrupted.';
      }
      setSpeechError(userMsg);
      setListening(false);
      setContinuousListening(false);
      playChime('error');
      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current);
        autoStopTimeoutRef.current = null;
      }
      if (speechTimeout) {
        clearTimeout(speechTimeout);
        setSpeechTimeout(null);
      }
    });
    if (recognitionRef.current) startRecognition(recognitionRef.current);
    else setSpeechError('Speech recognition not supported in this browser.');
    // Start auto-stop timer
    autoStopTimeoutRef.current = setTimeout(
      () => setListening(false),
      AUTO_STOP_TIMEOUT
    );
    return () => {
      if (recognitionRef.current) stopRecognition(recognitionRef.current);
      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current);
        autoStopTimeoutRef.current = null;
      }
      if (speechTimeout) {
        clearTimeout(speechTimeout);
        setSpeechTimeout(null);
      }
    };
  }, [listening, continuousListening]);

  useEffect(() => {
    if (!isSpeechSynthesisSupported()) return;
    const updateVoices = () => {
      const v = getVoices();
      setVoices(v);
      if (!voice && v.length > 0) setVoice(v[0]);
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (!speechEnabled || muted) return;
    if (!isSpeechSynthesisSupported()) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.from === 'ai') {
      speakText(lastMsg.text, voice || undefined, lang);
    }
    return () => {
      stopSpeaking();
    };
  }, [messages, speechEnabled, muted, voice, lang]);

  useEffect(() => {
    if (!speechEnabled || muted || !wakeWordEnabled) return;
    let porcupine: any;
    startWakeWord(() => setListening(true)).then(instance => {
      porcupine = instance;
    });
    return () => {
      if (porcupine) porcupine.terminate();
    };
  }, [speechEnabled, muted, wakeWordEnabled]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(
        'wakeWordEnabled',
        JSON.stringify(wakeWordEnabled)
      );
    }
  }, [wakeWordEnabled]);

  useEffect(() => {
    return () => {
      if (autoSendTimeout) clearTimeout(autoSendTimeout);
      if (autoSendIntervalRef.current) {
        clearInterval(autoSendIntervalRef.current);
        autoSendIntervalRef.current = null;
      }
    };
  }, [autoSendTimeout]);

  // Helper to parse user queries for property search/filter intent
  function parseSearchCriteria(text: string) {
    // Patterns for location, price, bedrooms, bathrooms
    const locationMatch = text.match(/in ([a-zA-Z ]+)/i);
    const priceMatch =
      text.match(/under \$?(\d+[\d,]*)/i) ||
      text.match(/below \$?(\d+[\d,]*)/i);
    const bedroomsMatch =
      text.match(/(\d+)\s*bed(room)?s?/i) ||
      text.match(/with (\d+)\s*bed(room)?s?/i);
    const bathroomsMatch =
      text.match(/(\d+)\s*bath(room)?s?/i) ||
      text.match(/with (\d+)\s*bath(room)?s?/i);

    const criteria: {
      location?: string;
      maxPrice?: number;
      bedrooms?: number;
      bathrooms?: number;
    } = {};
    if (locationMatch) {
      criteria.location = locationMatch[1].trim();
    }
    if (priceMatch) {
      criteria.maxPrice = parseInt(priceMatch[1].replace(/,/g, ''), 10);
    }
    if (bedroomsMatch) {
      criteria.bedrooms = parseInt(bedroomsMatch[1], 10);
    }
    if (bathroomsMatch) {
      criteria.bathrooms = parseInt(bathroomsMatch[1], 10);
    }
    return criteria;
  }

  const handleSend = async (message?: string) => {
    const textToSend = (message !== undefined ? message : input).trim();
    if (!textToSend) return;

    // Clear auto-send timeout if user sends manually
    if (autoSendTimeout) {
      clearTimeout(autoSendTimeout);
      setAutoSendTimeout(null);
      setAutoSendCountdown(0);
      isInCountdownRef.current = false;
    }
    if (autoSendIntervalRef.current) {
      clearInterval(autoSendIntervalRef.current);
      autoSendIntervalRef.current = null;
    }

    const userMsg = { from: 'user' as const, text: textToSend };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setLoading(true);

    // Enhanced parsing for filtering (optional callback)
    const criteria = parseSearchCriteria(textToSend);
    if (Object.keys(criteria).length > 0 && onFilter) {
      // Save preferences for location and budget if present
      if (criteria.location)
        setPrefs(p => ({ ...p, location: criteria.location }));
      if (criteria.maxPrice)
        setPrefs(p => ({ ...p, budget: criteria.maxPrice }));

      // Call the optional filter callback
      onFilter(criteria);
    }

    // DOM action parsing (unchanged)
    if (/scroll to listings|show listings/i.test(textToSend)) {
      onScrollTo && onScrollTo('listings');
    } else if (/scroll to filters|show filters/i.test(textToSend)) {
      onScrollTo && onScrollTo('filters');
    }

    const aiText = await sendToGemini(textToSend);
    setMessages(msgs => [...msgs, { from: 'ai', text: aiText }]);
    // Removed toast - user can see the message in chat
    setLoading(false);
  };

  const handleReset = () => {
    resetMemory();
    setPrefs({});
    setMessages([]);
    setShowSettings(false);
  };
  const handleMuteToggle = () => setMuted(m => !m);
  const handleListenToggle = () => setListening(l => !l);

  const isSpeechRecognitionSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  if (!isClient) return null;

  // Add a user-friendly error message for unsupported speech recognition
  if (!isSpeechRecognitionSupported) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1000,
          background: '#fff',
          border: '2px solid #1976d2',
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.18)',
          padding: 32,
          color: '#1976d2',
          fontWeight: 600,
          fontSize: 18,
        }}
      >
        <div>
          Sorry, your browser does not support speech recognition.
          <br />
          Please use Chrome, Edge, or another supported browser.
          <br />
          <br />
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 16,
              padding: '8px 18px',
              borderRadius: 8,
              border: '1.5px solid #1976d2',
              background: '#1976d2',
              color: '#fff',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  // Floating icon (avatar or mic) when collapsed
  if (!expanded && !animating) {
    return (
      <>
        <div
          data-testid="expand-chat"
          style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 1000,
            cursor: 'pointer',
          }}
          onClick={() => setExpanded(true)}
        >
          <div
            style={{
              borderRadius: '50%',
              width: 64,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              background: 'transparent',
            }}
          >
            <AgentAvatar />
            {listening && (
              <FontAwesomeIcon
                icon={faMicrophone}
                spin
                style={{
                  color: '#fff',
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  fontSize: 24,
                }}
              />
            )}
          </div>
        </div>
      </>
    );
  }

  // Animate chat open/close
  return (
    <div
      ref={chatRef}
      style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 1000,
        background: 'transparent',
        padding: 0,
        margin: 0,
        boxShadow: listening ? '0 0 0 4px #43a04755' : undefined,
        borderRadius: 24,
        transition: 'box-shadow 0.2s',
      }}
    >
      {/* <VoiceFeedback listening={listening} error={speechError} transcript={transcript} /> */}
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
          transition:
            'transform 0.2s cubic-bezier(.4,1.6,.6,1), opacity 0.2s cubic-bezier(.4,1.6,.6,1)',
          transform: expanded ? 'scale(1)' : 'scale(0.85)',
          opacity: expanded ? 1 : 0,
          pointerEvents: expanded ? 'auto' : 'none',
        }}
      >
        {/* Header: 10% */}
        <div
          style={{
            flex: '0 0 10%',
            minHeight: 48,
            maxHeight: 56,
            background: '#1976d2',
            color: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            position: 'relative',
            justifyContent: 'center',
            padding: 0,
            width: '100%',
          }}
        >
          {/* Centered, overflowing avatar */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: -24,
              transform: 'translateX(-50%)',
              zIndex: 3,
              background: 'transparent',
              animation: 'agent-float 2.2s ease-in-out infinite alternate',
            }}
          >
            <AgentAvatar />
          </div>
          {/* Agent name, centered */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              justifyContent: 'flex-start',
              minWidth: 0,
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: 18,
                background: 'transparent',
                color: 'white',
                letterSpacing: 0.5,
                userSelect: 'none',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 120,
                marginTop: 12,
                textAlign: 'left',
                marginLeft: 20,
              }}
            >
              AI Agent
            </span>
          </div>
          {/* Settings and close */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              marginRight: 16,
              zIndex: 2,
            }}
          >
            <button
              aria-label="Agent settings"
              tabIndex={0}
              style={{
                background: 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 18,
                transition: 'color 0.2s',
              }}
              onClick={() => setShowSettings(s => !s)}
              onMouseOver={e => (e.currentTarget.style.color = '#90caf9')}
              onMouseOut={e => (e.currentTarget.style.color = '#fff')}
              onFocus={e => (e.currentTarget.style.color = '#90caf9')}
              onBlur={e => (e.currentTarget.style.color = '#fff')}
            >
              <FontAwesomeIcon icon={faCog} />
            </button>
            <button
              onClick={() => setExpanded(false)}
              aria-label="Close chat"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: 20,
                cursor: 'pointer',
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            {showSettings && (
              <div
                style={{
                  position: 'absolute',
                  top: 36,
                  right: 0,
                  background: 'rgba(25,118,210,0.95)',
                  color: '#fff',
                  border: '1.5px solid #1976d2',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px rgba(25,118,210,0.18)',
                  zIndex: 10,
                  minWidth: 220,
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  gap: 8,
                }}
              >
                {/* Voice settings moved here */}
                {isSpeechSynthesisSupported() && voices.length > 0 && (
                  <>
                    <select
                      value={lang}
                      onChange={e => setLang(e.target.value)}
                      style={{
                        fontSize: 13,
                        color: '#fff',
                        background: 'rgba(0,0,0,0.25)',
                        borderRadius: 4,
                        border: '1px solid #fff',
                        marginLeft: 4,
                        marginTop: 8,
                        marginBottom: 4,
                        padding: '4px 8px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                      }}
                      disabled={muted}
                    >
                      {Array.from(new Set(voices.map(v => v.lang))).map(l => (
                        <option
                          key={l}
                          value={l}
                          style={{ color: '#222', background: '#fff' }}
                        >
                          {l}
                        </option>
                      ))}
                    </select>
                    <select
                      value={voice ? voice.name : ''}
                      onChange={e =>
                        setVoice(
                          voices.find(v => v.name === e.target.value) || null
                        )
                      }
                      style={{
                        fontSize: 13,
                        color: '#fff',
                        background: 'rgba(0,0,0,0.25)',
                        borderRadius: 4,
                        border: '1px solid #fff',
                        marginLeft: 4,
                        marginBottom: 8,
                        padding: '4px 8px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                      }}
                      disabled={muted}
                    >
                      {voices
                        .filter(v => v.lang === lang)
                        .map(v => (
                          <option
                            key={v.name}
                            value={v.name}
                            style={{ color: '#222', background: '#fff' }}
                          >
                            {v.name}
                          </option>
                        ))}
                    </select>
                  </>
                )}
                {(!isSpeechRecognitionSupported || speechError) && (
                  <div
                    style={{
                      color: '#ffd600',
                      background: '#222',
                      border: '1.5px solid #ffd600',
                      borderRadius: 8,
                      padding: '8px 12px',
                      margin: '8px 0',
                      fontWeight: 500,
                      fontSize: 13,
                    }}
                  >
                    Advanced voice features are unavailable in this browser or
                    due to an error.
                    <br />
                    You can still use the manual mic button below to send voice
                    commands.
                  </div>
                )}
                <button
                  onClick={handleReset}
                  aria-label="Reset agent memory"
                  tabIndex={0}
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 0',
                    cursor: 'pointer',
                    width: '100%',
                    fontWeight: 600,
                    fontSize: 15,
                    marginBottom: 2,
                    transition: 'background 0.15s',
                  }}
                  onMouseOver={e =>
                    (e.currentTarget.style.background =
                      'rgba(255,255,255,0.22)')
                  }
                  onMouseOut={e =>
                    (e.currentTarget.style.background =
                      'rgba(255,255,255,0.12)')
                  }
                >
                  Reset Agent
                </button>
                <button
                  type="button"
                  onClick={() => setWakeWordEnabled((w: boolean) => !w)}
                  style={{
                    margin: 4,
                    padding: 8,
                    borderRadius: 6,
                    border: '1.5px solid #fff',
                    background: wakeWordEnabled
                      ? '#1976d2'
                      : 'rgba(255,255,255,0.12)',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: 14,
                    transition: 'background 0.15s',
                  }}
                  title="Enable or disable wake word activation (say 'Porcupine' to activate hands-free)"
                >
                  {wakeWordEnabled ? 'Wake Word: ON' : 'Wake Word: OFF'}
                </button>
                <div
                  style={{
                    color: '#cfd8dc',
                    fontSize: 12,
                    margin: '0 0 8px 4px',
                    maxWidth: 200,
                  }}
                >
                  Hands-free activation by saying the wake word (default:
                  "Porcupine").
                </div>
                <button
                  type="button"
                  onClick={() => setContinuousListening(cl => !cl)}
                  style={{
                    margin: 4,
                    padding: 8,
                    borderRadius: 6,
                    border: '1.5px solid #fff',
                    background: continuousListening
                      ? '#1976d2'
                      : 'rgba(255,255,255,0.12)',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: 14,
                    transition: 'background 0.15s',
                  }}
                  title="Keep mic open after each command for rapid-fire conversations"
                >
                  {continuousListening
                    ? 'Continuous Listening: ON'
                    : 'Continuous Listening: OFF'}
                </button>
                <div
                  style={{
                    color: '#cfd8dc',
                    fontSize: 12,
                    margin: '0 0 8px 4px',
                    maxWidth: 200,
                  }}
                >
                  When enabled, the mic stays open after each command until you
                  say "stop listening" or timeout.
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Chat history: 80% */}
        <div
          style={{
            flex: '1 1 80%',
            minHeight: 0,
            padding: '1rem',
            overflowY: 'auto',
            background: '#fff',
            maxHeight: '100%',
            position: 'relative',
          }}
        >
          {messages.length === 0 && (
            <div style={{ marginBottom: '1rem', color: '#888' }}>
              [Chat messages will appear here]
            </div>
          )}
          {speechError && (
            <div
              style={{
                color: '#d32f2f',
                background: '#fff3f3',
                border: '1.5px solid #d32f2f',
                borderRadius: 8,
                padding: '8px 12px',
                margin: '8px 0',
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              {speechError}
            </div>
          )}
          {muted && (
            <div style={{ color: '#ffa726', fontSize: 13, marginBottom: 8 }}>
              Agent is muted. Voice responses are disabled.
            </div>
          )}
          {/* Removed listening indicator */}
          {/* Removed auto-sending countdown display */}
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                marginBottom: 8,
                textAlign: msg.from === 'user' ? 'right' : 'left',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  background: msg.from === 'user' ? '#e3f2fd' : '#f5f5f5',
                  color: '#222',
                  borderRadius: 12,
                  padding: '6px 12px',
                  maxWidth: 220,
                  wordBreak: 'break-word',
                }}
              >
                {msg.text}
              </span>
            </div>
          ))}
          {loading && (
            <div style={{ color: '#1976d2', fontStyle: 'italic' }}>
              AI is typing...
            </div>
          )}
        </div>
        {/* Input/buttons: 10% */}
        <form
          style={{
            flex: '0 0 10%',
            minHeight: 56,
            maxHeight: 56,
            padding: '0.5rem 1rem',
            borderTop: '1px solid #eee',
            display: 'flex',
            alignItems: 'center',
            background: 'white',
            gap: 0,
          }}
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
        >
          <button
            type="button"
            onClick={handleListenToggle}
            aria-label={
              listening ? 'Stop voice recognition' : 'Start voice recognition'
            }
            aria-pressed={listening}
            tabIndex={0}
            style={{
              background: listening ? '#43a047' : '#eee',
              color: listening ? 'white' : '#1976d2',
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
            onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) =>
              (e.currentTarget.style.color = '#1565c0')
            }
            onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) =>
              (e.currentTarget.style.color = '#1976d2')
            }
            onFocus={(e: React.FocusEvent<HTMLButtonElement>) =>
              (e.currentTarget.style.color = '#1565c0')
            }
            onBlur={(e: React.FocusEvent<HTMLButtonElement>) =>
              (e.currentTarget.style.color = '#1976d2')
            }
          >
            <FontAwesomeIcon
              icon={faMicrophone}
              spin={listening}
              style={{ fontSize: 13 }}
            />
          </button>
          <button
            onClick={handleMuteToggle}
            aria-label={muted ? 'Unmute agent' : 'Mute agent'}
            tabIndex={0}
            style={{
              background: 'transparent',
              color: '#1976d2',
              border: 'none',
              borderRadius: '50%',
              width: 24,
              height: 24,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 8,
              transition: 'color 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.color = '#1565c0')}
            onMouseOut={e => (e.currentTarget.style.color = '#1976d2')}
            onFocus={e => (e.currentTarget.style.color = '#1565c0')}
            onBlur={e => (e.currentTarget.style.color = '#1976d2')}
          >
            <FontAwesomeIcon
              icon={muted ? faVolumeMute : faVolumeUp}
              style={{ fontSize: 13 }}
            />
          </button>
          <textarea
            ref={inputRef}
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
              if (autoSendTimeout) {
                clearTimeout(autoSendTimeout);
                setAutoSendTimeout(null);
                setAutoSendCountdown(0);
                isInCountdownRef.current = false;
              }
              if (autoSendIntervalRef.current) {
                clearInterval(autoSendIntervalRef.current);
                autoSendIntervalRef.current = null;
              }
              // auto-grow
              e.target.style.height = '24px'; // Reset height before calculating scrollHeight
              e.target.style.height =
                Math.min(e.target.scrollHeight, 40) + 'px';
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
            style={{
              background: 'transparent',
              color: '#1976d2',
              border: 'none',
              borderRadius: 8,
              padding: '0.5rem 1.1rem',
              cursor: 'pointer',
              minWidth: 32,
              height: 32,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s',
            }}
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
