import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import AgentChat from './AgentChat';
import { ToastProvider } from './ToastProvider';

// Mock the browser speech recognition
Object.defineProperty(window, 'SpeechRecognition', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    abort: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
});

Object.defineProperty(window, 'webkitSpeechRecognition', {
  writable: true,
  value: window.SpeechRecognition,
});

// Mock the geminiApi
jest.mock('../api/geminiApi', () => ({
  sendToGemini: jest.fn(async prompt => {
    if (/how do i search for a property/i.test(prompt)) {
      return "You can ask me about real estate topics and I'll be happy to help you with general information.";
    }
    if (/how do i use voice input/i.test(prompt)) {
      return "Click the microphone button or say the wake word (if enabled) to start speaking. I'll transcribe and respond to your question.";
    }
    if (/how do i reset the agent/i.test(prompt)) {
      return 'Open the settings (gear icon) and click "Reset Agent" to clear chat history and preferences.';
    }
    if (/how do i change the voice/i.test(prompt)) {
      return 'Open the settings and select your preferred voice and language from the dropdown menus.';
    }
    if (/navigate to listings|show filters/i.test(prompt)) {
      return 'I can help you with real estate information and general assistance.';
    }
    return 'Sorry, I can only answer questions about real estate topics and general assistance.';
  }),
}));

describe('AgentChat', () => {
  beforeAll(() => {
    // Mock browser speech recognition support
    window.SpeechRecognition = window.SpeechRecognition || jest.fn();
    window.webkitSpeechRecognition =
      window.webkitSpeechRecognition || jest.fn();
  });

  it('should have a placeholder test to keep Jest happy', () => {
    expect(true).toBe(true);
  });

  it('provides helpful guidance for common help queries', async () => {
    render(
      <ToastProvider>
        <AgentChat />
      </ToastProvider>
    );
    const expandBtn = screen.getByTestId('expand-chat');
    fireEvent.click(expandBtn);
    const input = await screen.findByPlaceholderText(/Aa/i);

    // Test help: search for a property
    await act(async () => {
      fireEvent.change(input, {
        target: { value: 'How do I search for a property?' },
      });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });
    expect(await screen.findByText(/real estate topics/i)).toBeInTheDocument();

    // Test help: use voice input
    await act(async () => {
      fireEvent.change(input, {
        target: { value: 'How do I use voice input?' },
      });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });
    expect(
      await screen.findByText(/microphone button or say the wake word/i)
    ).toBeInTheDocument();

    // Test help: reset the agent
    await act(async () => {
      fireEvent.change(input, {
        target: { value: 'How do I reset the agent?' },
      });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });
    expect(await screen.findByText(/reset agent/i)).toBeInTheDocument();

    // Test help: change the voice
    await act(async () => {
      fireEvent.change(input, {
        target: { value: 'How do I change the voice?' },
      });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });
    expect(
      await screen.findByText(/select your preferred voice/i)
    ).toBeInTheDocument();
  });

  it('shows clarification for out-of-domain queries', async () => {
    render(
      <ToastProvider>
        <AgentChat />
      </ToastProvider>
    );
    const expandBtn = screen.getByTestId('expand-chat');
    fireEvent.click(expandBtn);
    const input = await screen.findByPlaceholderText(/Aa/i);

    await act(async () => {
      fireEvent.change(input, {
        target: { value: 'What is the weather today?' },
      });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });
    expect(
      await screen.findByText(/only answer questions about real estate/i)
    ).toBeInTheDocument();
  });

  it('never provides off-topic or unsupported answers', async () => {
    render(
      <ToastProvider>
        <AgentChat />
      </ToastProvider>
    );
    const expandBtn = screen.getByTestId('expand-chat');
    fireEvent.click(expandBtn);
    const input = await screen.findByPlaceholderText(/Aa/i);

    const offTopicQueries = [
      'What is quantum physics?',
      'How do I cook pasta?',
      'Tell me about space exploration',
      'What is artificial intelligence?',
      'How does cryptocurrency work?',
    ];

    for (const query of offTopicQueries) {
      await act(async () => {
        fireEvent.change(input, { target: { value: query } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      });
      // Should get clarification message for out-of-domain topics
      const clarifications = await screen.findAllByText(
        /only answer questions about real estate/i
      );
      expect(clarifications.length).toBeGreaterThan(0);
    }
  });

  it('handles out-of-domain edge cases', async () => {
    render(
      <ToastProvider>
        <AgentChat />
      </ToastProvider>
    );
    const expandBtn = screen.getByTestId('expand-chat');
    fireEvent.click(expandBtn);
    const input = await screen.findByPlaceholderText(/Aa/i);
    const edgeCases = [
      'Tell me about the moon', // ambiguous
      'What is the weather and also real estate?', // multi-part
      '   ', // whitespace
      '', // empty
      'Real estate and tell me a joke', // in-domain + out-of-domain
    ];
    for (const query of edgeCases) {
      await act(async () => {
        fireEvent.change(input, { target: { value: query } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      });
      // For empty/whitespace, no message should be added
      if (query.trim() === '') continue;
      const clarifications = await screen.findAllByText(
        /only answer questions about real estate/i
      );
      expect(clarifications.length).toBeGreaterThan(0);
    }
  });
});
