import { RoleName } from '../types/user';

/**
 * Get the appropriate redirect URL based on user role
 * @param role - The user's role
 * @returns The dashboard URL for the user's role
 */
export const getRoleBasedRedirectUrl = (role: RoleName): string => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'agent':
      return '/agent/dashboard';
    case 'developer':
      return '/developer/dashboard';
    case 'seller':
      return '/seller/dashboard';
    case 'buyer':
      return '/buyer/dashboard';
    default:
      return '/dashboard';
  }
};

/**
 * Get the appropriate redirect URL for approval status
 * @param status - The approval status
 * @returns The appropriate redirect URL
 */
export const getApprovalStatusRedirectUrl = (status: 'pending' | 'approved' | 'rejected'): string => {
  switch (status) {
    case 'pending':
      return '/auth/approval-pending';
    case 'approved':
      return '/auth/approval-approved';
    case 'rejected':
      return '/auth/approval-rejected';
    default:
      return '/dashboard';
  }
};

/**
 * Check if a role requires approval
 * @param role - The role to check
 * @returns True if the role requires approval
 */
export const requiresApproval = (role: RoleName): boolean => {
  return role === 'agent' || role === 'developer';
};

/**
 * Get the default role for new users
 * @returns The default role (buyer)
 */
export const getDefaultRole = (): RoleName => {
  return 'buyer';
};

/**
 * Get role display name
 * @param role - The role name
 * @returns The display name for the role
 */
export const getRoleDisplayName = (role: RoleName): string => {
  const roleNames: Record<RoleName, string> = {
    admin: 'Administrator',
    agent: 'Real Estate Agent',
    developer: 'Property Developer',
    seller: 'Property Seller',
    buyer: 'Property Buyer'
  };
  
  return roleNames[role] || role;
};

/**
 * Get role description
 * @param role - The role name
 * @returns The description for the role
 */
export const getRoleDescription = (role: RoleName): string => {
  const roleDescriptions: Record<RoleName, string> = {
    admin: 'Full system access with user management capabilities',
    agent: 'Manage property listings and client interactions',
    developer: 'Manage development projects and lead tracking',
    seller: 'List and manage your properties for sale',
    buyer: 'Search properties and save favorites'
  };
  
  return roleDescriptions[role] || '';
}; 