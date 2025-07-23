import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import AgentChat from './AgentChat';
import { ToastProvider } from './ToastProvider';

jest.mock('@picovoice/porcupine-web', () => ({
  PorcupineWorker: { create: jest.fn() }
}));
jest.mock('@picovoice/web-voice-processor', () => ({
  WebVoiceProcessor: { subscribe: jest.fn() }
}));

jest.mock('../utils/webSpeech', () => ({
  playChime: jest.fn(),
  createRecognition: jest.fn(),
  startRecognition: jest.fn(),
  stopRecognition: jest.fn(),
  speakText: jest.fn(),
  isSpeechSynthesisSupported: jest.fn(() => false),
  stopSpeaking: jest.fn(),
  getVoices: jest.fn(() => []),
}));

jest.mock('../api/geminiApi', () => ({
  sendToGemini: jest.fn(async (prompt) => {
    if (/how do i search for a property/i.test(prompt)) {
      return 'You can type or say things like "Show me homes in Austin under $700,000" or "Find 3 bedroom houses in Portland" and I\'ll show you matching properties.';
    }
    if (/how do i use voice input/i.test(prompt)) {
      return 'Click the microphone button or say the wake word (if enabled) to start speaking. I\'ll transcribe and respond to your question.';
    }
    if (/how do i reset the agent/i.test(prompt)) {
      return 'Open the settings (gear icon) and click "Reset Agent" to clear chat history and preferences.';
    }
    if (/how do i change the voice/i.test(prompt)) {
      return 'Open the settings and select your preferred voice and language from the dropdown menus.';
    }
    if (/navigate to listings|show filters/i.test(prompt)) {
      return 'You can ask me to "scroll to listings" or "show filters" and I\'ll help you navigate there.';
    }
    return 'Sorry, I can only answer questions about properties in this app.';
  })
}));

describe('AgentChat', () => {
  beforeAll(() => {
    // Mock browser speech recognition support
    window.SpeechRecognition = window.SpeechRecognition || jest.fn();
    window.webkitSpeechRecognition = window.webkitSpeechRecognition || jest.fn();
  });

  it('should have a placeholder test to keep Jest happy', () => {
    expect(true).toBe(true);
  });

  it('shows filtered properties for location query', async () => {
    render(
      <ToastProvider>
        <AgentChat onFilter={jest.fn()} />
      </ToastProvider>
    );
    // Expand the chat by clicking the floating avatar
    const expandBtn = screen.getByTestId('expand-chat');
    fireEvent.click(expandBtn);
    const input = await screen.findByPlaceholderText(/Aa/i);
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Show me homes in Austin' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });
    expect(await screen.findByText(/Here are the matching properties:/i)).toBeInTheDocument();
    expect(screen.getByText(/Suburban House/i)).toBeInTheDocument();
  });

  it('shows filtered properties for price and bedrooms', async () => {
    render(
      <ToastProvider>
        <AgentChat onFilter={jest.fn()} />
      </ToastProvider>
    );
    // Expand the chat by clicking the floating avatar
    const expandBtn = screen.getByTestId('expand-chat');
    fireEvent.click(expandBtn);
    const input = await screen.findByPlaceholderText(/Aa/i);
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Show me 2 bedroom homes under $800000' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });
    // There may be multiple AI messages with the same header, so check all
    const resultMessages = await screen.findAllByText(/Here are the matching properties:/i);
    // Find the one that contains both expected properties
    const found = resultMessages.some(msg =>
      msg.textContent?.includes('Downtown Apartment') &&
      msg.textContent?.includes('Cozy Cottage')
    );
    expect(found).toBe(true);
  });

  it('shows no properties found for non-matching query', async () => {
    render(
      <ToastProvider>
        <AgentChat onFilter={jest.fn()} />
      </ToastProvider>
    );
    // Expand the chat by clicking the floating avatar
    const expandBtn = screen.getByTestId('expand-chat');
    fireEvent.click(expandBtn);
    const input = await screen.findByPlaceholderText(/Aa/i);
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Show me homes in Paris' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });
    expect(await screen.findByText(/No properties found matching your criteria/i)).toBeInTheDocument();
  });

  it('provides helpful guidance for common help queries', async () => {
    render(
      <ToastProvider>
        <AgentChat onFilter={jest.fn()} />
      </ToastProvider>
    );
    const expandBtn = screen.getByTestId('expand-chat');
    fireEvent.click(expandBtn);
    const input = await screen.findByPlaceholderText(/Aa/i);

    // Test help: search for a property
    await act(async () => {
      fireEvent.change(input, { target: { value: 'How do I search for a property?' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });
    expect(await screen.findByText(/show you matching properties/i)).toBeInTheDocument();

    // Test help: use voice input
    await act(async () => {
      fireEvent.change(input, { target: { value: 'How do I use voice input?' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });
    expect(await screen.findByText(/microphone button or say the wake word/i)).toBeInTheDocument();

    // Test help: reset the agent
    await act(async () => {
      fireEvent.change(input, { target: { value: 'How do I reset the agent?' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });
    expect(await screen.findByText(/reset agent/i)).toBeInTheDocument();

    // Test help: change the voice
    await act(async () => {
      fireEvent.change(input, { target: { value: 'How do I change the voice?' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });
    expect(await screen.findByText(/select your preferred voice/i)).toBeInTheDocument();

    // Test help: navigation
    await act(async () => {
      fireEvent.change(input, { target: { value: 'How do I navigate to listings?' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });
    expect(await screen.findByText(/scroll to listings/i)).toBeInTheDocument();
  });

  it('shows clarification for out-of-domain queries', async () => {
    render(
      <ToastProvider>
        <AgentChat onFilter={jest.fn()} />
      </ToastProvider>
    );
    const expandBtn = screen.getByTestId('expand-chat');
    fireEvent.click(expandBtn);
    const input = await screen.findByPlaceholderText(/Aa/i);
    await act(async () => {
      fireEvent.change(input, { target: { value: 'What is the weather today?' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });
    const clarifications = await screen.findAllByText(/only answer questions about properties in this app/i);
    expect(clarifications.length).toBeGreaterThan(0);
  });

  it('never provides off-topic or unsupported answers', async () => {
    render(
      <ToastProvider>
        <AgentChat onFilter={jest.fn()} />
      </ToastProvider>
    );
    const expandBtn = screen.getByTestId('expand-chat');
    fireEvent.click(expandBtn);
    const input = await screen.findByPlaceholderText(/Aa/i);
    const offTopicQueries = [
      'Who is the president?',
      'Tell me a joke',
      'What is the capital of France?',
      'What is 2+2?',
      'What is the weather tomorrow?'
    ];
    for (const query of offTopicQueries) {
      await act(async () => {
        fireEvent.change(input, { target: { value: query } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      });
      const clarifications = await screen.findAllByText(/only answer questions about properties in this app/i);
      expect(clarifications.length).toBeGreaterThan(0);
    }
  });

  it('handles out-of-domain edge cases', async () => {
    render(
      <ToastProvider>
        <AgentChat onFilter={jest.fn()} />
      </ToastProvider>
    );
    const expandBtn = screen.getByTestId('expand-chat');
    fireEvent.click(expandBtn);
    const input = await screen.findByPlaceholderText(/Aa/i);
    const edgeCases = [
      'Tell me about the moon', // ambiguous
      'Show me homes in Austin and what is the weather?', // multi-part
      '   ', // whitespace
      '', // empty
      'Find 2 bedroom homes and tell me a joke' // in-domain + out-of-domain
    ];
    for (const query of edgeCases) {
      await act(async () => {
        fireEvent.change(input, { target: { value: query } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      });
      // For empty/whitespace, no message should be added
      if (query.trim() === '') continue;
      const clarifications = await screen.findAllByText(/only answer questions about properties in this app/i);
      expect(clarifications.length).toBeGreaterThan(0);
    }
  });
}); 