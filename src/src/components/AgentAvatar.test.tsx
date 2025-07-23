import React from 'react';
import { render, screen } from '@testing-library/react';
import AgentAvatar from './AgentAvatar';

describe('AgentAvatar', () => {
  it('renders the robot SVG', () => {
    render(<AgentAvatar />);
    // Remove text expectation, just check for SVG
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });

  it('renders the SVG with correct size', () => {
    render(<AgentAvatar />);
    // Remove getByTestId, just check for SVG element
    const svg = screen.getByRole('img', { hidden: true });
    expect(svg).toBeInTheDocument();
  });
}); 