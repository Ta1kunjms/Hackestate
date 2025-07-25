'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSupabaseAuth, AuthUser } from '../hooks/useSupabaseAuth';

// Types
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword: resetPasswordSupabase
  } = useSupabaseAuth();

  const login = async (email: string, password: string): Promise<void> => {
    try {
      await signIn(email, password);
      
      // Success announcement (client-side only)
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const successAnnouncement = document.createElement('div');
        successAnnouncement.setAttribute('aria-live', 'polite');
        successAnnouncement.className = 'sr-only';
        successAnnouncement.textContent = `Welcome back, ${user?.firstName || 'User'}!`;
        document.body.appendChild(successAnnouncement);
        
        setTimeout(() => {
          if (document.body.contains(successAnnouncement)) {
            document.body.removeChild(successAnnouncement);
          }
        }, 2000);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed. Please check your credentials and try again.');
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      await signUp(userData.email, userData.password, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone
      });

      // Success announcement (client-side only)
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const successAnnouncement = document.createElement('div');
        successAnnouncement.setAttribute('aria-live', 'polite');
        successAnnouncement.className = 'sr-only';
        successAnnouncement.textContent = 'Registration successful! Please check your email for verification instructions.';
        document.body.appendChild(successAnnouncement);
        
        setTimeout(() => {
          if (document.body.contains(successAnnouncement)) {
            document.body.removeChild(successAnnouncement);
          }
        }, 2000);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut();
      
      // Logout announcement (client-side only)
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const logoutAnnouncement = document.createElement('div');
        logoutAnnouncement.setAttribute('aria-live', 'polite');
        logoutAnnouncement.className = 'sr-only';
        logoutAnnouncement.textContent = 'You have been logged out successfully.';
        document.body.appendChild(logoutAnnouncement);
        
        setTimeout(() => {
          if (document.body.contains(logoutAnnouncement)) {
            document.body.removeChild(logoutAnnouncement);
          }
        }, 2000);
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message || 'Logout failed. Please try again.');
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await resetPasswordSupabase(email);
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw new Error(error.message || 'Failed to send reset email. Please try again.');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !!session,
    isLoading: loading,
    login,
    register,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 