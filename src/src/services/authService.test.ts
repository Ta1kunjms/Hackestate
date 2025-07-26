import { registerUser, signInUser, signOutUser, resetPassword, updatePassword, getUserProfile, updateUserProfile, getUserApprovalStatus } from './authService';
import { supabase } from '../lib/supabase';
import { UserRegistrationData } from '../types/user';

// Mock Supabase
jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn()
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn()
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn()
          }))
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn()
        }))
      }))
    }))
  }
}));

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost:3000'
  },
  writable: true
});

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    const mockRegistrationData: UserRegistrationData = {
      email: 'test@example.com',
      password: 'StrongPass123!',
      first_name: 'John',
      last_name: 'Doe',
      phone: '+1234567890',
      role_name: 'buyer'
    };

    it('should successfully register a user with buyer role', async () => {
      // Mock successful auth signup
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: {
          user: { id: 'user-123', email: 'test@example.com' }
        },
        error: null
      });

      // Mock role lookup
      const mockFrom = supabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'role-123' },
              error: null
            })
          })
        })
      });

      // Mock profile update
      mockFrom.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            error: null
          })
        })
      });

      const result = await registerUser(mockRegistrationData);

      expect(result.success).toBe(true);
      expect(result.user).toEqual({ id: 'user-123', email: 'test@example.com' });
      expect(result.requiresApproval).toBe(false);
    });

    it('should register agent with approval requirement', async () => {
      const agentData = { ...mockRegistrationData, role_name: 'agent' as const };

      // Mock successful auth signup
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: {
          user: { id: 'user-123', email: 'test@example.com' }
        },
        error: null
      });

      // Mock role lookup
      const mockFrom = supabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'role-456' },
              error: null
            })
          })
        }),
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            error: null
          })
        }),
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'approval-123' },
              error: null
            })
          })
        })
      });

      const result = await registerUser(agentData);

      expect(result.success).toBe(true);
      expect(result.requiresApproval).toBe(true);
      expect(result.approvalId).toBe('approval-123');
    });

    it('should handle auth signup errors', async () => {
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Email already exists' }
      });

      const result = await registerUser(mockRegistrationData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email already exists');
    });

    it('should handle role lookup errors', async () => {
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: {
          user: { id: 'user-123', email: 'test@example.com' }
        },
        error: null
      });

      const mockFrom = supabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Role not found' }
            })
          })
        })
      });

      const result = await registerUser(mockRegistrationData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid role selected');
    });
  });

  describe('signInUser', () => {
    it('should successfully sign in user', async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: {
          user: { id: 'user-123', email: 'test@example.com' },
          session: { access_token: 'token-123' }
        },
        error: null
      });

      const result = await signInUser('test@example.com', 'password123');

      expect(result.success).toBe(true);
      expect(result.user).toEqual({ id: 'user-123', email: 'test@example.com' });
      expect(result.session).toEqual({ access_token: 'token-123' });
    });

    it('should handle sign in errors', async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' }
      });

      const result = await signInUser('test@example.com', 'wrongpassword');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });
  });

  describe('signOutUser', () => {
    it('should successfully sign out user', async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null
      });

      const result = await signOutUser();

      expect(result.success).toBe(true);
    });

    it('should handle sign out errors', async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: { message: 'Sign out failed' }
      });

      const result = await signOutUser();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Sign out failed');
    });
  });

  describe('resetPassword', () => {
    it('should successfully send password reset email', async () => {
      (supabase.auth.resetPasswordForEmail as jest.Mock).mockResolvedValue({
        error: null
      });

      const result = await resetPassword('test@example.com');

      expect(result.success).toBe(true);
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        { redirectTo: 'http://localhost:3000/auth/reset-password' }
      );
    });

    it('should handle password reset errors', async () => {
      (supabase.auth.resetPasswordForEmail as jest.Mock).mockResolvedValue({
        error: { message: 'Email not found' }
      });

      const result = await resetPassword('nonexistent@example.com');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email not found');
    });
  });

  describe('updatePassword', () => {
    it('should successfully update password', async () => {
      (supabase.auth.updateUser as jest.Mock).mockResolvedValue({
        error: null
      });

      const result = await updatePassword('NewPassword123!');

      expect(result.success).toBe(true);
    });

    it('should handle password update errors', async () => {
      (supabase.auth.updateUser as jest.Mock).mockResolvedValue({
        error: { message: 'Password too weak' }
      });

      const result = await updatePassword('weak');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Password too weak');
    });
  });

  describe('getUserProfile', () => {
    it('should successfully get user profile with role', async () => {
      const mockFrom = supabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'user-123',
                first_name: 'John',
                last_name: 'Doe',
                role: {
                  id: 'role-123',
                  name: 'buyer'
                }
              },
              error: null
            })
          })
        })
      });

      const result = await getUserProfile('user-123');

      expect(result.success).toBe(true);
      expect(result.profile).toEqual({
        id: 'user-123',
        first_name: 'John',
        last_name: 'Doe',
        role: {
          id: 'role-123',
          name: 'buyer'
        }
      });
    });

    it('should handle profile fetch errors', async () => {
      const mockFrom = supabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Profile not found' }
            })
          })
        })
      });

      const result = await getUserProfile('user-123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Profile not found');
    });
  });

  describe('updateUserProfile', () => {
    it('should successfully update user profile', async () => {
      const mockFrom = supabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: {
                  id: 'user-123',
                  first_name: 'Jane',
                  last_name: 'Doe'
                },
                error: null
              })
            })
          })
        })
      });

      const result = await updateUserProfile('user-123', {
        first_name: 'Jane'
      });

      expect(result.success).toBe(true);
      expect(result.profile).toEqual({
        id: 'user-123',
        first_name: 'Jane',
        last_name: 'Doe'
      });
    });
  });

  describe('getUserApprovalStatus', () => {
    it('should successfully get approval status', async () => {
      const mockFrom = supabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: {
                    id: 'approval-123',
                    status: 'pending',
                    role_name: 'agent'
                  },
                  error: null
                })
              })
            })
          })
        })
      });

      const result = await getUserApprovalStatus('user-123');

      expect(result.success).toBe(true);
      expect(result.approval).toEqual({
        id: 'approval-123',
        status: 'pending',
        role_name: 'agent'
      });
    });

    it('should handle no approval found', async () => {
      const mockFrom = supabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: null,
                  error: { code: 'PGRST116' }
                })
              })
            })
          })
        })
      });

      const result = await getUserApprovalStatus('user-123');

      expect(result.success).toBe(true);
      expect(result.approval).toBeNull();
    });
  });
}); 