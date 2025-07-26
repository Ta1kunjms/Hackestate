import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserRegistration from './UserRegistration';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock Material Tailwind components
jest.mock('@material-tailwind/react', () => ({
  Typography: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Input: ({ 
    id, 
    name, 
    value, 
    onChange, 
    placeholder, 
    required, 
    type,
    ...props 
  }: any) => (
    <input
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      type={type}
      {...props}
    />
  ),
  Button: ({ 
    children, 
    onClick, 
    type, 
    disabled, 
    loading,
    ...props 
  }: any) => (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}));

// Mock auth redirects utility
jest.mock('../../utils/authRedirects', () => ({
  getRoleDisplayName: (role: string) => {
    const names: Record<string, string> = {
      buyer: 'Property Buyer',
      seller: 'Property Seller',
      agent: 'Real Estate Agent',
      developer: 'Property Developer'
    };
    return names[role] || role;
  },
  getRoleDescription: (role: string) => {
    const descriptions: Record<string, string> = {
      buyer: 'Search properties and save favorites',
      seller: 'List and manage your properties for sale',
      agent: 'Manage property listings and client interactions',
      developer: 'Manage development projects and lead tracking'
    };
    return descriptions[role] || '';
  },
  requiresApproval: (role: string) => role === 'agent' || role === 'developer',
  getDefaultRole: () => 'buyer'
}));

describe('UserRegistration', () => {
  beforeEach(() => {
    // Mock console.log to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders registration form with all fields', () => {
    render(<UserRegistration />);
    
    expect(screen.getByText('Create Your Account')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/)).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Select Your Role/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/ })).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    render(<UserRegistration />);
    
    const submitButton = screen.getByRole('button', { name: /Create Account/ });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Email is required/)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/)).toBeInTheDocument();
      expect(screen.getByText(/First name is required/)).toBeInTheDocument();
      expect(screen.getByText(/Last name is required/)).toBeInTheDocument();
      expect(screen.getByText(/Please select a role/)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<UserRegistration />);
    
    const emailInput = screen.getByLabelText(/Email Address/);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const submitButton = screen.getByRole('button', { name: /Create Account/ });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/)).toBeInTheDocument();
    });
  });

  it('validates password strength', async () => {
    render(<UserRegistration />);
    
    const passwordInput = screen.getByLabelText(/Password/);
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    
    const submitButton = screen.getByRole('button', { name: /Create Account/ });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 8 characters long/)).toBeInTheDocument();
    });
  });

  it('validates password confirmation', async () => {
    render(<UserRegistration />);
    
    const passwordInput = screen.getByLabelText(/Password/);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    
    fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPass123!' } });
    
    const submitButton = screen.getByRole('button', { name: /Create Account/ });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/)).toBeInTheDocument();
    });
  });

  it('shows role description when role is selected', () => {
    render(<UserRegistration />);
    
    const roleSelect = screen.getByLabelText(/Select Your Role/);
    fireEvent.change(roleSelect, { target: { value: 'buyer' } });
    
    expect(screen.getByText('Property Buyer')).toBeInTheDocument();
    expect(screen.getByText('Search properties and save favorites')).toBeInTheDocument();
  });

  it('shows approval warning for agent and developer roles', () => {
    render(<UserRegistration />);
    
    const roleSelect = screen.getByLabelText(/Select Your Role/);
    fireEvent.change(roleSelect, { target: { value: 'agent' } });
    
    expect(screen.getByText(/This role requires approval before access is granted/)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    render(<UserRegistration />);
    
    // Fill in all required fields
    fireEvent.change(screen.getByLabelText(/Email Address/), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText(/Password/), { 
      target: { value: 'StrongPass123!' } 
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/), { 
      target: { value: 'StrongPass123!' } 
    });
    fireEvent.change(screen.getByLabelText(/First Name/), { 
      target: { value: 'John' } 
    });
    fireEvent.change(screen.getByLabelText(/Last Name/), { 
      target: { value: 'Doe' } 
    });
    fireEvent.change(screen.getByLabelText(/Select Your Role/), { 
      target: { value: 'buyer' } 
    });
    
    const submitButton = screen.getByRole('button', { name: /Create Account/ });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Registration Successful!')).toBeInTheDocument();
    });
  });

  it('shows approval pending message for agent/developer registration', async () => {
    render(<UserRegistration />);
    
    // Fill in all required fields
    fireEvent.change(screen.getByLabelText(/Email Address/), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText(/Password/), { 
      target: { value: 'StrongPass123!' } 
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/), { 
      target: { value: 'StrongPass123!' } 
    });
    fireEvent.change(screen.getByLabelText(/First Name/), { 
      target: { value: 'John' } 
    });
    fireEvent.change(screen.getByLabelText(/Last Name/), { 
      target: { value: 'Doe' } 
    });
    fireEvent.change(screen.getByLabelText(/Select Your Role/), { 
      target: { value: 'agent' } 
    });
    
    const submitButton = screen.getByRole('button', { name: /Create Account/ });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Your application is now under review/)).toBeInTheDocument();
      expect(screen.getByText(/This role requires approval before access is granted/)).toBeInTheDocument();
    });
  });

  it('clears errors when user starts typing', async () => {
    render(<UserRegistration />);
    
    const submitButton = screen.getByRole('button', { name: /Create Account/ });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Email is required/)).toBeInTheDocument();
    });
    
    const emailInput = screen.getByLabelText(/Email Address/);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    await waitFor(() => {
      expect(screen.queryByText(/Email is required/)).not.toBeInTheDocument();
    });
  });
}); 