import React from 'react';
import { render, screen } from '@testing-library/react';
import AgentAvatar from './AgentAvatar';

describe('AgentAvatar', () => {
  it('renders the robot SVG', () => {
    render(<AgentAvatar />);
    expect(screen.getByText(/Agent/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });

  it('renders the SVG with correct size', () => {
    render(<AgentAvatar />);
    const svg = screen.getByTestId('agent-avatar-svg');
    expect(svg).toHaveAttribute('width', '48');
    expect(svg).toHaveAttribute('height', '48');
  });
}); 