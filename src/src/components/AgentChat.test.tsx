import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AgentChat from './AgentChat';

describe('AgentChat', () => {
  it('calls onFilter with location when user types a location command', async () => {
    const onFilter = jest.fn();
    render(<AgentChat onFilter={onFilter} />);
    fireEvent.change(screen.getByPlaceholderText(/type a message/i), { target: { value: 'Show me properties in Austin' } });
    fireEvent.click(screen.getByText(/send/i));
    await waitFor(() => expect(onFilter).toHaveBeenCalledWith(expect.objectContaining({ location: 'Austin' })));
  });

  it('calls onFilter with maxPrice when user types a price command', async () => {
    const onFilter = jest.fn();
    render(<AgentChat onFilter={onFilter} />);
    fireEvent.change(screen.getByPlaceholderText(/type a message/i), { target: { value: 'Show me properties under $700,000' } });
    fireEvent.click(screen.getByText(/send/i));
    await waitFor(() => expect(onFilter).toHaveBeenCalledWith(expect.objectContaining({ maxPrice: 700000 })));
  });

  it('calls onScrollTo with listings when user types a scroll command', async () => {
    const onScrollTo = jest.fn();
    render(<AgentChat onFilter={jest.fn()} onScrollTo={onScrollTo} />);
    fireEvent.change(screen.getByPlaceholderText(/type a message/i), { target: { value: 'Scroll to listings' } });
    fireEvent.click(screen.getByText(/send/i));
    await waitFor(() => expect(onScrollTo).toHaveBeenCalledWith('listings'));
  });

  it('calls onScrollTo with filters when user types a scroll command', async () => {
    const onScrollTo = jest.fn();
    render(<AgentChat onFilter={jest.fn()} onScrollTo={onScrollTo} />);
    fireEvent.change(screen.getByPlaceholderText(/type a message/i), { target: { value: 'Show filters' } });
    fireEvent.click(screen.getByText(/send/i));
    await waitFor(() => expect(onScrollTo).toHaveBeenCalledWith('filters'));
  });

  it('shows a message if voice input is not supported', () => {
    const win = window as any;
    const origSpeech = win.SpeechRecognition;
    delete win.SpeechRecognition;
    render(<AgentChat onFilter={jest.fn()} />);
    expect(screen.getByText(/voice input is not supported/i)).toBeInTheDocument();
    if (origSpeech) win.SpeechRecognition = origSpeech;
  });

  it('shows a message if agent is muted', () => {
    // Render with mute state
    const { rerender } = render(<AgentChat onFilter={jest.fn()} />);
    // Simulate mute by clicking mute button
    fireEvent.click(screen.getByRole('button', { name: /mute/i }));
    expect(screen.getByText(/agent is muted/i)).toBeInTheDocument();
    // Unmute
    fireEvent.click(screen.getByRole('button', { name: /unmute/i }));
    expect(screen.queryByText(/agent is muted/i)).not.toBeInTheDocument();
  });
}); 