import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmailVerification from './EmailVerification';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    query: {}
  })
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock Material Tailwind components
jest.mock('@material-tailwind/react', () => ({
  Typography: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Button: ({ 
    children, 
    onClick, 
    color,
    variant,
    size,
    fullWidth,
    ...props 
  }: any) => (
    <button
      onClick={onClick}
      data-color={color}
      data-variant={variant}
      data-size={size}
      data-fullwidth={fullWidth}
      {...props}
    >
      {children}
    </button>
  )
}));

// Mock Supabase
const mockSupabase = {
  auth: {
    getSession: jest.fn(),
    getUser: jest.fn(),
    resend: jest.fn()
  }
};

jest.mock('../../lib/supabase', () => ({
  supabase: mockSupabase
}));

// Mock authService
const mockGetUserProfile = jest.fn();
jest.mock('../../services/authService', () => ({
  getUserProfile: mockGetUserProfile
}));

// Mock auth redirects utility
jest.mock('../../utils/authRedirects', () => ({
  getRoleBasedRedirectUrl: (role: string) => `/${role}/dashboard`
}));

describe('EmailVerification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.error to avoid noise in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows loading state initially', () => {
    render(<EmailVerification />);
    
    expect(screen.getByText('Verifying Email')).toBeInTheDocument();
    expect(screen.getByText('Please wait while we verify your email address...')).toBeInTheDocument();
  });

  it('shows success state when email is verified', async () => {
    // Mock successful session
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
      error: null
    });

    // Mock confirmed user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { 
        user: { 
          id: 'user-123', 
          email: 'test@example.com',
          email_confirmed_at: '2024-01-01T00:00:00Z'
        } 
      },
      error: null
    });

    // Mock successful profile fetch
    mockGetUserProfile.mockResolvedValue({
      success: true,
      profile: {
        id: 'user-123',
        first_name: 'John',
        last_name: 'Doe',
        role: { name: 'buyer' }
      }
    });

    render(<EmailVerification />);

    await waitFor(() => {
      expect(screen.getByText('Email Verified!')).toBeInTheDocument();
      expect(screen.getByText('Your email has been successfully verified. Welcome to the platform!')).toBeInTheDocument();
    });
  });

  it('shows error state when no session found', async () => {
    // Mock no session
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });

    render(<EmailVerification />);

    await waitFor(() => {
      expect(screen.getByText('Verification Failed')).toBeInTheDocument();
      expect(screen.getByText('No active session found. Please try logging in again.')).toBeInTheDocument();
    });
  });

  it('shows error state when email not confirmed', async () => {
    // Mock successful session
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
      error: null
    });

    // Mock unconfirmed user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { 
        user: { 
          id: 'user-123', 
          email: 'test@example.com',
          email_confirmed_at: null
        } 
      },
      error: null
    });

    render(<EmailVerification />);

    await waitFor(() => {
      expect(screen.getByText('Verification Failed')).toBeInTheDocument();
      expect(screen.getByText('Email not yet confirmed. Please check your email and click the verification link.')).toBeInTheDocument();
    });
  });

  it('shows error state when user not found', async () => {
    // Mock successful session
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
      error: null
    });

    // Mock no user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null
    });

    render(<EmailVerification />);

    await waitFor(() => {
      expect(screen.getByText('Verification Failed')).toBeInTheDocument();
      expect(screen.getByText('User not found. Please try logging in again.')).toBeInTheDocument();
    });
  });

  it('shows error state when profile fetch fails', async () => {
    // Mock successful session
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
      error: null
    });

    // Mock confirmed user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { 
        user: { 
          id: 'user-123', 
          email: 'test@example.com',
          email_confirmed_at: '2024-01-01T00:00:00Z'
        } 
      },
      error: null
    });

    // Mock failed profile fetch
    mockGetUserProfile.mockResolvedValue({
      success: false,
      error: 'Failed to get user profile'
    });

    render(<EmailVerification />);

    await waitFor(() => {
      expect(screen.getByText('Verification Failed')).toBeInTheDocument();
      expect(screen.getByText('Failed to get user profile')).toBeInTheDocument();
    });
  });

  it('handles resend verification email', async () => {
    // Mock successful session
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
      error: null
    });

    // Mock confirmed user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { 
        user: { 
          id: 'user-123', 
          email: 'test@example.com',
          email_confirmed_at: '2024-01-01T00:00:00Z'
        } 
      },
      error: null
    });

    // Mock successful profile fetch
    mockGetUserProfile.mockResolvedValue({
      success: true,
      profile: {
        id: 'user-123',
        first_name: 'John',
        last_name: 'Doe',
        role: { name: 'buyer' }
      }
    });

    render(<EmailVerification />);

    await waitFor(() => {
      expect(screen.getByText('Email Verified!')).toBeInTheDocument();
    });

    // Mock successful resend
    mockSupabase.auth.resend.mockResolvedValue({
      error: null
    });

    // Mock window.alert
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

    // Click resend button (this would be in error state, but we can test the function)
    const resendButton = screen.getByText('Resend Verification Email');
    fireEvent.click(resendButton);

    await waitFor(() => {
      expect(mockSupabase.auth.resend).toHaveBeenCalledWith({
        type: 'signup',
        email: 'test@example.com'
      });
    });

    mockAlert.mockRestore();
  });

  it('handles manual redirect to dashboard', async () => {
    // Mock successful session
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
      error: null
    });

    // Mock confirmed user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { 
        user: { 
          id: 'user-123', 
          email: 'test@example.com',
          email_confirmed_at: '2024-01-01T00:00:00Z'
        } 
      },
      error: null
    });

    // Mock successful profile fetch
    mockGetUserProfile.mockResolvedValue({
      success: true,
      profile: {
        id: 'user-123',
        first_name: 'John',
        last_name: 'Doe',
        role: { name: 'buyer' }
      }
    });

    render(<EmailVerification />);

    await waitFor(() => {
      expect(screen.getByText('Email Verified!')).toBeInTheDocument();
    });

    const continueButton = screen.getByText('Continue to Dashboard');
    fireEvent.click(continueButton);

    expect(mockPush).toHaveBeenCalledWith('/buyer/dashboard');
  });

  it('shows user profile information on success', async () => {
    // Mock successful session
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
      error: null
    });

    // Mock confirmed user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { 
        user: { 
          id: 'user-123', 
          email: 'test@example.com',
          email_confirmed_at: '2024-01-01T00:00:00Z'
        } 
      },
      error: null
    });

    // Mock successful profile fetch
    mockGetUserProfile.mockResolvedValue({
      success: true,
      profile: {
        id: 'user-123',
        first_name: 'John',
        last_name: 'Doe',
        role: { name: 'agent' }
      }
    });

    render(<EmailVerification />);

    await waitFor(() => {
      expect(screen.getByText('Email Verified!')).toBeInTheDocument();
      expect(screen.getByText('Role: agent')).toBeInTheDocument();
      expect(screen.getByText('Name: John Doe')).toBeInTheDocument();
    });
  });

  it('auto-redirects after 3 seconds on success', async () => {
    jest.useFakeTimers();

    // Mock successful session
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
      error: null
    });

    // Mock confirmed user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { 
        user: { 
          id: 'user-123', 
          email: 'test@example.com',
          email_confirmed_at: '2024-01-01T00:00:00Z'
        } 
      },
      error: null
    });

    // Mock successful profile fetch
    mockGetUserProfile.mockResolvedValue({
      success: true,
      profile: {
        id: 'user-123',
        first_name: 'John',
        last_name: 'Doe',
        role: { name: 'seller' }
      }
    });

    render(<EmailVerification />);

    await waitFor(() => {
      expect(screen.getByText('Email Verified!')).toBeInTheDocument();
    });

    // Fast-forward time by 3 seconds
    jest.advanceTimersByTime(3000);

    expect(mockPush).toHaveBeenCalledWith('/seller/dashboard');

    jest.useRealTimers();
  });
}); 