'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSupabaseAuth, AuthUser } from '../hooks/useSupabaseAuth';
import { UserRole } from '../types/user';
import { supabase } from '../lib/supabase';

// Types
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  roleName?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: UserRole | null;
  isAdmin: boolean;
  hasPermission: (permission: string) => boolean;
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

  // Helper functions for role-based access
  const userRole = user?.role || null;
  const isAdmin = userRole?.name === 'admin';
  
  const hasPermission = (permission: string): boolean => {
    if (!userRole) return false;
    return userRole.permissions[permission as keyof typeof userRole.permissions] === true;
  };

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
      console.log('Starting registration for:', userData.email);
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone || '',
          },
        },
      });

      if (error) {
        console.error('Supabase auth signup error:', error);
        throw error;
      }

      console.log('Auth signup successful:', data);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
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
    userRole,
    isAdmin,
    hasPermission,
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