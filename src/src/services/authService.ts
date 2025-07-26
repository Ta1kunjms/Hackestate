import { supabase } from '../lib/supabase';
import { UserRegistrationData, RoleName, RoleApproval } from '../types/user';
import { requiresApproval } from '../utils/authRedirects';

export interface RegistrationResult {
  success: boolean;
  user?: any;
  error?: string;
  requiresApproval?: boolean;
  approvalId?: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

/**
 * Register a new user with role selection
 */
export const registerUser = async (data: UserRegistrationData): Promise<RegistrationResult> => {
  try {
    // Step 1: Create user account in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          role_name: data.role_name
        }
      }
    });

    if (authError) {
      return {
        success: false,
        error: authError.message
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'Failed to create user account'
      };
    }

    // Step 2: Get the role ID for the selected role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('id')
      .eq('name', data.role_name)
      .single();

    if (roleError || !roleData) {
      return {
        success: false,
        error: 'Invalid role selected'
      };
    }

    // Step 3: Update user profile with role and additional info
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone || null,
        role_id: roleData.id
      })
      .eq('id', authData.user.id);

    if (profileError) {
      return {
        success: false,
        error: 'Failed to update user profile'
      };
    }

    // Step 4: If role requires approval, create approval request
    if (requiresApproval(data.role_name)) {
      const { data: approvalData, error: approvalError } = await supabase
        .from('role_approvals')
        .insert({
          user_id: authData.user.id,
          role_name: data.role_name,
          status: 'pending'
        })
        .select()
        .single();

      if (approvalError) {
        console.error('Failed to create approval request:', approvalError);
        // Don't fail the registration, just log the error
      }

      return {
        success: true,
        user: authData.user,
        requiresApproval: true,
        approvalId: approvalData?.id
      };
    }

    return {
      success: true,
      user: authData.user,
      requiresApproval: false
    };

  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during registration'
    };
  }
};

/**
 * Sign in user with email and password
 */
export const signInUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      user: data.user,
      session: data.session
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during sign in'
    };
  }
};

/**
 * Sign out user
 */
export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during sign out'
    };
  }
};

/**
 * Reset password
 */
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during password reset'
    };
  }
};

/**
 * Update password
 */
export const updatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Password update error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during password update'
    };
  }
};

/**
 * Get user profile with role information
 */
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        role:user_roles(*)
      `)
      .eq('id', userId)
      .single();

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      profile: data
    };
  } catch (error) {
    console.error('Get profile error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while fetching profile'
    };
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId: string, updates: {
  first_name?: string;
  last_name?: string;
  phone?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      profile: data
    };
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while updating profile'
    };
  }
};

/**
 * Get user's approval status
 */
export const getUserApprovalStatus = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('role_approvals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      approval: data || null
    };
  } catch (error) {
    console.error('Get approval status error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while fetching approval status'
    };
  }
}; 