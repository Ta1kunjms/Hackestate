// Minimal type declarations for Web Speech API (if not present)
// Remove if your environment already provides these types

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
  interface SpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    continuous: boolean;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: any) => void) | null;
  }
  interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: {
      [index: number]: {
        0: { transcript: string };
        isFinal: boolean;
      };
    };
  }
}

// Web Speech API utilities for SpeechRecognition

export type SpeechRecognitionResultHandler = (
  transcript: string,
  isFinal: boolean
) => void;
export type SpeechRecognitionErrorHandler = (error: string) => void;

export function isSpeechRecognitionSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    (typeof (window as any).SpeechRecognition === 'function' ||
      typeof (window as any).webkitSpeechRecognition === 'function')
  );
}

export function createRecognition(
  onResult: SpeechRecognitionResultHandler,
  onError?: SpeechRecognitionErrorHandler,
  lang: string = 'en-US'
): SpeechRecognition | null {
  if (!isSpeechRecognitionSupported()) return null;
  const SpeechRecognitionClass =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognitionClass();
  recognition.lang = lang;
  recognition.interimResults = true;
  recognition.continuous = false;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const results = Array.from(event.results as any);
    for (let i = event.resultIndex; i < results.length; ++i) {
      const result = results[i] as {
        0: { transcript: string };
        isFinal: boolean;
      };
      const transcript = result[0].transcript;
      const isFinal = result.isFinal;
      onResult(transcript, isFinal);
    }
  };

  recognition.onerror = (event: any) => {
    if (onError) onError(event.error);
  };

  return recognition;
}

export function startRecognition(recognition: SpeechRecognition) {
  if (recognition) recognition.start();
}

export function stopRecognition(recognition: SpeechRecognition) {
  if (recognition) recognition.stop();
}

export function abortRecognition(recognition: SpeechRecognition) {
  if (recognition) recognition.abort();
}

// Speech Synthesis utilities

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speakText(
  text: string,
  voice?: SpeechSynthesisVoice,
  lang: string = 'en-US'
) {
  if (!isSpeechSynthesisSupported()) return;
  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}

export function getVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSynthesisSupported()) return [];
  return window.speechSynthesis.getVoices();
}

// Audio feedback (chimes) using Web Audio API
export function playChime(type: 'start' | 'stop' | 'command' | 'error') {
  if (typeof window === 'undefined' || !window.AudioContext) return;
  const ctx = new window.AudioContext();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  // Pick frequency based on type
  switch (type) {
    case 'start':
      o.frequency.value = 880;
      break; // A5
    case 'stop':
      o.frequency.value = 440;
      break; // A4
    case 'command':
      o.frequency.value = 660;
      break; // E5
    case 'error':
      o.frequency.value = 220;
      break; // A3
    default:
      o.frequency.value = 440;
  }
  g.gain.value = 0.18;
  o.connect(g);
  g.connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + 0.18);
  o.onended = () => ctx.close();
}
