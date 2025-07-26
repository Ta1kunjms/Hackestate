import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canManageUsers,
  canApproveAgents,
  canViewAnalytics,
  canCreateListings,
  canSearchProperties,
  getRolePermissions,
  isAdmin,
  isAgent,
  isBuyer,
  isProfessional,
  getPermissionDescription
} from './rolePermissions';
import { UserRole, RoleName } from '../types/user';

describe('rolePermissions', () => {
  const mockAdminRole: UserRole = {
    id: 'role-1',
    name: 'admin',
    description: 'System administrator',
    permissions: {
      can_manage_users: true,
      can_approve_agents: true,
      can_approve_developers: true,
      can_view_analytics: true,
      can_manage_system: true
    },
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  const mockAgentRole: UserRole = {
    id: 'role-2',
    name: 'agent',
    description: 'Real estate agent',
    permissions: {
      can_create_listings: true,
      can_manage_listings: true,
      can_view_analytics: true,
      can_contact_clients: true,
      can_manage_inquiries: true
    },
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  const mockBuyerRole: UserRole = {
    id: 'role-3',
    name: 'buyer',
    description: 'Property buyer',
    permissions: {
      can_search_properties: true,
      can_save_favorites: true,
      can_make_offers: true,
      can_view_listings: true,
      can_contact_agents: true
    },
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  describe('hasPermission', () => {
    it('should return true when user has the permission', () => {
      expect(hasPermission(mockAdminRole, 'can_manage_users')).toBe(true);
      expect(hasPermission(mockAgentRole, 'can_create_listings')).toBe(true);
      expect(hasPermission(mockBuyerRole, 'can_search_properties')).toBe(true);
    });

    it('should return false when user does not have the permission', () => {
      expect(hasPermission(mockBuyerRole, 'can_manage_users')).toBe(false);
      expect(hasPermission(mockAgentRole, 'can_search_properties')).toBe(false);
      expect(hasPermission(mockAdminRole, 'can_make_offers')).toBe(false);
    });

    it('should return false for undefined permissions', () => {
      expect(hasPermission(mockAdminRole, 'can_manage_users')).toBe(true);
      expect(hasPermission(mockAdminRole, 'can_do_something_else' as any)).toBe(false);
    });
  });

  describe('hasAnyPermission', () => {
    it('should return true when user has at least one of the permissions', () => {
      expect(hasAnyPermission(mockAdminRole, ['can_manage_users', 'can_search_properties'])).toBe(true);
      expect(hasAnyPermission(mockAgentRole, ['can_create_listings', 'can_manage_users'])).toBe(true);
      expect(hasAnyPermission(mockBuyerRole, ['can_search_properties', 'can_manage_users'])).toBe(true);
    });

    it('should return false when user has none of the permissions', () => {
      expect(hasAnyPermission(mockBuyerRole, ['can_manage_users', 'can_approve_agents'])).toBe(false);
      expect(hasAnyPermission(mockAgentRole, ['can_search_properties', 'can_make_offers'])).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    it('should return true when user has all of the permissions', () => {
      expect(hasAllPermissions(mockAdminRole, ['can_manage_users', 'can_view_analytics'])).toBe(true);
      expect(hasAllPermissions(mockAgentRole, ['can_create_listings', 'can_view_analytics'])).toBe(true);
      expect(hasAllPermissions(mockBuyerRole, ['can_search_properties', 'can_view_listings'])).toBe(true);
    });

    it('should return false when user is missing any of the permissions', () => {
      expect(hasAllPermissions(mockBuyerRole, ['can_search_properties', 'can_manage_users'])).toBe(false);
      expect(hasAllPermissions(mockAgentRole, ['can_create_listings', 'can_search_properties'])).toBe(false);
    });
  });

  describe('specific permission functions', () => {
    it('should correctly check admin permissions', () => {
      expect(canManageUsers(mockAdminRole)).toBe(true);
      expect(canApproveAgents(mockAdminRole)).toBe(true);
      expect(canViewAnalytics(mockAdminRole)).toBe(true);
    });

    it('should correctly check agent permissions', () => {
      expect(canCreateListings(mockAgentRole)).toBe(true);
      expect(canViewAnalytics(mockAgentRole)).toBe(true);
      expect(canManageUsers(mockAgentRole)).toBe(false);
    });

    it('should correctly check buyer permissions', () => {
      expect(canSearchProperties(mockBuyerRole)).toBe(true);
      expect(canViewAnalytics(mockBuyerRole)).toBe(false);
      expect(canCreateListings(mockBuyerRole)).toBe(false);
    });
  });

  describe('getRolePermissions', () => {
    it('should return correct permissions for admin role', () => {
      const permissions = getRolePermissions('admin');
      expect(permissions).toContain('can_manage_users');
      expect(permissions).toContain('can_approve_agents');
      expect(permissions).toContain('can_approve_developers');
      expect(permissions).toContain('can_view_analytics');
      expect(permissions).toContain('can_manage_system');
    });

    it('should return correct permissions for agent role', () => {
      const permissions = getRolePermissions('agent');
      expect(permissions).toContain('can_create_listings');
      expect(permissions).toContain('can_manage_listings');
      expect(permissions).toContain('can_view_analytics');
      expect(permissions).toContain('can_contact_clients');
      expect(permissions).toContain('can_manage_inquiries');
    });

    it('should return correct permissions for buyer role', () => {
      const permissions = getRolePermissions('buyer');
      expect(permissions).toContain('can_search_properties');
      expect(permissions).toContain('can_save_favorites');
      expect(permissions).toContain('can_make_offers');
      expect(permissions).toContain('can_view_listings');
      expect(permissions).toContain('can_contact_agents');
    });

    it('should return empty array for unknown role', () => {
      const permissions = getRolePermissions('unknown' as RoleName);
      expect(permissions).toEqual([]);
    });
  });

  describe('role checking functions', () => {
    it('should correctly identify admin role', () => {
      expect(isAdmin(mockAdminRole)).toBe(true);
      expect(isAdmin(mockAgentRole)).toBe(false);
      expect(isAdmin(mockBuyerRole)).toBe(false);
    });

    it('should correctly identify agent role', () => {
      expect(isAgent(mockAgentRole)).toBe(true);
      expect(isAgent(mockAdminRole)).toBe(false);
      expect(isAgent(mockBuyerRole)).toBe(false);
    });

    it('should correctly identify buyer role', () => {
      expect(isBuyer(mockBuyerRole)).toBe(true);
      expect(isBuyer(mockAdminRole)).toBe(false);
      expect(isBuyer(mockAgentRole)).toBe(false);
    });

    it('should correctly identify professional roles', () => {
      expect(isProfessional(mockAgentRole)).toBe(true);
      expect(isProfessional(mockAdminRole)).toBe(false);
      expect(isProfessional(mockBuyerRole)).toBe(false);
    });
  });

  describe('getPermissionDescription', () => {
    it('should return correct descriptions for admin permissions', () => {
      expect(getPermissionDescription('can_manage_users')).toBe('Manage user accounts and roles');
      expect(getPermissionDescription('can_approve_agents')).toBe('Approve agent applications');
      expect(getPermissionDescription('can_view_analytics')).toBe('View platform analytics and reports');
    });

    it('should return correct descriptions for agent permissions', () => {
      expect(getPermissionDescription('can_create_listings')).toBe('Create new property listings');
      expect(getPermissionDescription('can_manage_listings')).toBe('Manage existing property listings');
      expect(getPermissionDescription('can_contact_clients')).toBe('Contact potential clients');
    });

    it('should return correct descriptions for buyer permissions', () => {
      expect(getPermissionDescription('can_search_properties')).toBe('Search available properties');
      expect(getPermissionDescription('can_save_favorites')).toBe('Save properties to favorites');
      expect(getPermissionDescription('can_make_offers')).toBe('Make offers on properties');
    });

    it('should return unknown for invalid permissions', () => {
      expect(getPermissionDescription('invalid_permission' as any)).toBe('Unknown permission');
    });
  });

  describe('edge cases', () => {
    it('should handle roles with no permissions', () => {
      const emptyRole: UserRole = {
        id: 'role-empty',
        name: 'buyer',
        description: 'Empty role',
        permissions: {},
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      expect(hasPermission(emptyRole, 'can_search_properties')).toBe(false);
      expect(hasAnyPermission(emptyRole, ['can_search_properties', 'can_make_offers'])).toBe(false);
      expect(hasAllPermissions(emptyRole, ['can_search_properties'])).toBe(false);
    });

    it('should handle roles with partial permissions', () => {
      const partialRole: UserRole = {
        id: 'role-partial',
        name: 'agent',
        description: 'Partial role',
        permissions: {
          can_create_listings: true,
          can_view_analytics: false
        },
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      expect(hasPermission(partialRole, 'can_create_listings')).toBe(true);
      expect(hasPermission(partialRole, 'can_view_analytics')).toBe(false);
      expect(hasAnyPermission(partialRole, ['can_create_listings', 'can_view_analytics'])).toBe(true);
      expect(hasAllPermissions(partialRole, ['can_create_listings', 'can_view_analytics'])).toBe(false);
    });
  });
}); 