import {
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  speakText,
  stopSpeaking,
  getVoices,
  createRecognition,
} from './webSpeech';

describe('webSpeech utilities', () => {
  describe('isSpeechRecognitionSupported', () => {
    afterEach(() => {
      delete window.SpeechRecognition;
      delete window.webkitSpeechRecognition;
    });
    it('returns true if SpeechRecognition is present', () => {
      window.SpeechRecognition = function() {};
      expect(typeof window.SpeechRecognition).toBe('function');
      expect(isSpeechRecognitionSupported()).toBe(true);
    });
    it('returns true if webkitSpeechRecognition is present', () => {
      window.webkitSpeechRecognition = function() {};
      expect(typeof window.webkitSpeechRecognition).toBe('function');
      expect(isSpeechRecognitionSupported()).toBe(true);
    });
    it('returns false if neither is present', () => {
      expect(isSpeechRecognitionSupported()).toBe(false);
    });
  });

  describe('isSpeechSynthesisSupported', () => {
    it('returns true if speechSynthesis is present', () => {
      (window as any).speechSynthesis = {};
      expect(isSpeechSynthesisSupported()).toBe(true);
      delete (window as any).speechSynthesis;
    });
    it('returns false if speechSynthesis is not present', () => {
      expect(isSpeechSynthesisSupported()).toBe(false);
    });
  });

  describe('speakText and stopSpeaking', () => {
    beforeEach(() => {
      (window as any).speechSynthesis = {
        speak: jest.fn(),
        cancel: jest.fn(),
        getVoices: jest.fn(() => []),
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).SpeechSynthesisUtterance = function (this: any, text: string) {
        this.text = text;
      };
    });
    afterEach(() => {
      delete (window as any).speechSynthesis;
      delete (window as any).SpeechSynthesisUtterance;
    });
    it('calls speechSynthesis.speak with utterance', () => {
      speakText('hello');
      expect(window.speechSynthesis.speak).toHaveBeenCalled();
    });
    it('calls speechSynthesis.cancel on stopSpeaking', () => {
      stopSpeaking();
      expect(window.speechSynthesis.cancel).toHaveBeenCalled();
    });
  });

  describe('getVoices', () => {
    it('returns voices from speechSynthesis', () => {
      (window as any).speechSynthesis = {
        getVoices: jest.fn(() => [{ name: 'Test', lang: 'en-US' }]),
      };
      expect(getVoices()).toEqual([{ name: 'Test', lang: 'en-US' }]);
      delete (window as any).speechSynthesis;
    });
    it('returns [] if not supported', () => {
      expect(getVoices()).toEqual([]);
    });
  });

  describe('createRecognition', () => {
    it('returns null if not supported', () => {
      expect(createRecognition(jest.fn())).toBeNull();
    });
    it('creates a recognition instance if supported', () => {
      (window as any).webkitSpeechRecognition = jest.fn(function () {
        this.start = jest.fn();
        this.stop = jest.fn();
        this.abort = jest.fn();
        this.onresult = null;
        this.onerror = null;
      });
      const rec = createRecognition(jest.fn());
      expect(rec).not.toBeNull();
      delete (window as any).webkitSpeechRecognition;
    });
  });
}); 