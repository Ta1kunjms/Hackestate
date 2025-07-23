import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
}

export interface AuthContextType {
  // Auth state
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auth state
  const isAuthenticated = !!user;

  // Auth actions
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // TODO: Implement actual login API call
      console.log('Login attempt:', { email, password });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser: AuthUser = {
        id: '1',
        email,
        firstName: email.split('@')[0], // Simple extraction
        lastName: 'User',
        isVerified: true,
      };
      
      setUser(mockUser);
      
      // Redirect to home page
      window.location.href = '/';
      
      // Success announcement (client-side only)
      if (typeof document !== 'undefined') {
        const successAnnouncement = document.createElement('div');
        successAnnouncement.setAttribute('aria-live', 'polite');
        successAnnouncement.className = 'sr-only';
        successAnnouncement.textContent = `Welcome back, ${mockUser.firstName}!`;
        document.body.appendChild(successAnnouncement);
        
        setTimeout(() => {
          document.body.removeChild(successAnnouncement);
        }, 2000);
      }
      
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    
    // Logout announcement (client-side only)
    if (typeof document !== 'undefined') {
      const logoutAnnouncement = document.createElement('div');
      logoutAnnouncement.setAttribute('aria-live', 'polite');
      logoutAnnouncement.className = 'sr-only';
      logoutAnnouncement.textContent = 'You have been logged out successfully.';
      document.body.appendChild(logoutAnnouncement);
      
      setTimeout(() => {
        document.body.removeChild(logoutAnnouncement);
      }, 2000);
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    setIsLoading(true);
    try {
      // TODO: Implement actual registration API call
      console.log('Registration attempt:', userData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, don't auto-login after registration
      // User should verify email first
      
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    // Auth state
    user,
    isLoading,
    isAuthenticated,
    
    // Auth actions
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 