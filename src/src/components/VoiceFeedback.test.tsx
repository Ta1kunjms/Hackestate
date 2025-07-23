import React from 'react';
import { render, screen } from '@testing-library/react';
import VoiceFeedback from './VoiceFeedback';

describe('VoiceFeedback', () => {
  it('renders listening state with transcript', () => {
    render(<VoiceFeedback listening={true} error={null} transcript="hello world" />);
    expect(screen.getByText(/Listening/i)).toBeInTheDocument();
    expect(screen.getByText(/hello world/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /mic/i })).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(<VoiceFeedback listening={false} error="Mic error" transcript="" />);
    expect(screen.getByText(/Mic error/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /error/i })).toBeInTheDocument();
  });

  it('renders nothing when idle', () => {
    const { container } = render(<VoiceFeedback listening={false} error={null} transcript="" />);
    expect(container.firstChild).toBeNull();
  });
}); 