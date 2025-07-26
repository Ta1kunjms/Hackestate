import { UserRole, RolePermissions, RoleName } from '../types/user';

/**
 * Check if user has a specific permission
 * @param userRole - The user's role object
 * @param permission - The permission to check
 * @returns True if user has the permission
 */
export const hasPermission = (userRole: UserRole, permission: keyof RolePermissions): boolean => {
  return userRole.permissions[permission] === true;
};

/**
 * Check if user has any of the specified permissions
 * @param userRole - The user's role object
 * @param permissions - Array of permissions to check
 * @returns True if user has at least one of the permissions
 */
export const hasAnyPermission = (userRole: UserRole, permissions: (keyof RolePermissions)[]): boolean => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

/**
 * Check if user has all of the specified permissions
 * @param userRole - The user's role object
 * @param permissions - Array of permissions to check
 * @returns True if user has all of the permissions
 */
export const hasAllPermissions = (userRole: UserRole, permissions: (keyof RolePermissions)[]): boolean => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

/**
 * Check if user can manage users (admin only)
 * @param userRole - The user's role object
 * @returns True if user can manage users
 */
export const canManageUsers = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'can_manage_users');
};

/**
 * Check if user can approve agents
 * @param userRole - The user's role object
 * @returns True if user can approve agents
 */
export const canApproveAgents = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'can_approve_agents');
};

/**
 * Check if user can approve developers
 * @param userRole - The user's role object
 * @returns True if user can approve developers
 */
export const canApproveDevelopers = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'can_approve_developers');
};

/**
 * Check if user can view analytics
 * @param userRole - The user's role object
 * @returns True if user can view analytics
 */
export const canViewAnalytics = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'can_view_analytics');
};

/**
 * Check if user can manage system settings
 * @param userRole - The user's role object
 * @returns True if user can manage system settings
 */
export const canManageSystem = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'can_manage_system');
};

/**
 * Check if user can create listings
 * @param userRole - The user's role object
 * @returns True if user can create listings
 */
export const canCreateListings = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'can_create_listings');
};

/**
 * Check if user can manage listings
 * @param userRole - The user's role object
 * @returns True if user can manage listings
 */
export const canManageListings = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'can_manage_listings');
};

/**
 * Check if user can contact clients
 * @param userRole - The user's role object
 * @returns True if user can contact clients
 */
export const canContactClients = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'can_contact_clients');
};

/**
 * Check if user can manage inquiries
 * @param userRole - The user's role object
 * @returns True if user can manage inquiries
 */
export const canManageInquiries = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'can_manage_inquiries');
};

/**
 * Check if user can create projects
 * @param userRole - The user's role object
 * @returns True if user can create projects
 */
export const canCreateProjects = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'can_create_projects');
};

/**
 * Check if user can manage projects
 * @param userRole - The user's role object
 * @returns True if user can manage projects
 */
export const canManageProjects = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'can_manage_projects');
};

/**
 * Check if user can manage leads
 * @param userRole - The user's role object
 * @returns True if user can manage leads
 */
export const canManageLeads = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'can_manage_leads');
};

/**
 * Check if user can upload documents
 * @param userRole - The user's role object
 * @returns True if user can upload documents
 */
export const canUploadDocuments = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'can_upload_documents');
};

/**
 * Check if user can list properties
 * @param userRole - The user's role object
 * @returns True if user can list properties
 */
export const canListProperties = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'can_list_properties');
};

/**
 * Check if user can manage properties
 * @param userRole - The user's role object
 * @returns True if user can manage properties
 */
export const canManageProperties = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'can_manage_properties');
};

/**
 * Check if user can review offers
 * @param userRole - The user's role object
 * @returns True if user can review offers
 */
export const canReviewOffers = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'can_review_offers');
};

/**
 * Check if user can upload photos
 * @param userRole - The user's role object
 * @returns True if user can upload photos
 */
export const canUploadPhotos = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'can_upload_photos');
};

/**
 * Check if user can search properties
 * @param userRole - The user's role object
 * @returns True if user can search properties
 */
export const canSearchProperties = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'can_search_properties');
};

/**
 * Check if user can save favorites
 * @param userRole - The user's role object
 * @returns True if user can save favorites
 */
export const canSaveFavorites = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'can_save_favorites');
};

/**
 * Check if user can make offers
 * @param userRole - The user's role object
 * @returns True if user can make offers
 */
export const canMakeOffers = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'can_make_offers');
};

/**
 * Check if user can view listings
 * @param userRole - The user's role object
 * @returns True if user can view listings
 */
export const canViewListings = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'can_view_listings');
};

/**
 * Check if user can contact agents
 * @param userRole - The user's role object
 * @returns True if user can contact agents
 */
export const canContactAgents = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'can_contact_agents');
};

/**
 * Get all permissions for a specific role
 * @param roleName - The role name
 * @returns Array of permission keys that the role has
 */
export const getRolePermissions = (roleName: RoleName): (keyof RolePermissions)[] => {
  const rolePermissions: Record<RoleName, (keyof RolePermissions)[]> = {
    admin: [
      'can_manage_users',
      'can_approve_agents',
      'can_approve_developers',
      'can_view_analytics',
      'can_manage_system'
    ],
    agent: [
      'can_create_listings',
      'can_manage_listings',
      'can_view_analytics',
      'can_contact_clients',
      'can_manage_inquiries'
    ],
    developer: [
      'can_create_projects',
      'can_manage_projects',
      'can_view_analytics',
      'can_manage_leads',
      'can_upload_documents'
    ],
    seller: [
      'can_list_properties',
      'can_manage_properties',
      'can_review_offers',
      'can_view_analytics',
      'can_upload_photos'
    ],
    buyer: [
      'can_search_properties',
      'can_save_favorites',
      'can_make_offers',
      'can_view_listings',
      'can_contact_agents'
    ]
  };

  return rolePermissions[roleName] || [];
};

/**
 * Check if user has admin privileges
 * @param userRole - The user's role object
 * @returns True if user is admin
 */
export const isAdmin = (userRole: UserRole): boolean => {
  return userRole.name === 'admin';
};

/**
 * Check if user has agent privileges
 * @param userRole - The user's role object
 * @returns True if user is agent
 */
export const isAgent = (userRole: UserRole): boolean => {
  return userRole.name === 'agent';
};

/**
 * Check if user has developer privileges
 * @param userRole - The user's role object
 * @returns True if user is developer
 */
export const isDeveloper = (userRole: UserRole): boolean => {
  return userRole.name === 'developer';
};

/**
 * Check if user has seller privileges
 * @param userRole - The user's role object
 * @returns True if user is seller
 */
export const isSeller = (userRole: UserRole): boolean => {
  return userRole.name === 'seller';
};

/**
 * Check if user has buyer privileges
 * @param userRole - The user's role object
 * @returns True if user is buyer
 */
export const isBuyer = (userRole: UserRole): boolean => {
  return userRole.name === 'buyer';
};

/**
 * Check if user has professional privileges (agent or developer)
 * @param userRole - The user's role object
 * @returns True if user is agent or developer
 */
export const isProfessional = (userRole: UserRole): boolean => {
  return isAgent(userRole) || isDeveloper(userRole);
};

/**
 * Check if user has property owner privileges (seller)
 * @param userRole - The user's role object
 * @returns True if user is seller
 */
export const isPropertyOwner = (userRole: UserRole): boolean => {
  return isSeller(userRole);
};

/**
 * Check if user has consumer privileges (buyer)
 * @param userRole - The user's role object
 * @returns True if user is buyer
 */
export const isConsumer = (userRole: UserRole): boolean => {
  return isBuyer(userRole);
};

/**
 * Get permission description for a specific permission
 * @param permission - The permission key
 * @returns Human-readable description of the permission
 */
export const getPermissionDescription = (permission: keyof RolePermissions): string => {
  const descriptions: Record<keyof RolePermissions, string> = {
    // Admin permissions
    can_manage_users: 'Manage user accounts and roles',
    can_approve_agents: 'Approve agent applications',
    can_approve_developers: 'Approve developer applications',
    can_view_analytics: 'View platform analytics and reports',
    can_manage_system: 'Manage system settings and configuration',
    
    // Agent permissions
    can_create_listings: 'Create new property listings',
    can_manage_listings: 'Manage existing property listings',
    can_contact_clients: 'Contact potential clients',
    can_manage_inquiries: 'Manage client inquiries and leads',
    
    // Developer permissions
    can_create_projects: 'Create new development projects',
    can_manage_projects: 'Manage existing development projects',
    can_manage_leads: 'Manage potential buyer leads',
    can_upload_documents: 'Upload project documentation',
    
    // Seller permissions
    can_list_properties: 'List properties for sale',
    can_manage_properties: 'Manage listed properties',
    can_review_offers: 'Review and respond to offers',
    can_upload_photos: 'Upload property photos',
    
    // Buyer permissions
    can_search_properties: 'Search available properties',
    can_save_favorites: 'Save properties to favorites',
    can_make_offers: 'Make offers on properties',
    can_view_listings: 'View property listings',
    can_contact_agents: 'Contact property agents'
  };

  return descriptions[permission] || 'Unknown permission';
}; 