import { UserRole, UserProfile, AuthUser, RolePermissions, RoleName } from './user';

describe('User Types', () => {
  describe('UserRole', () => {
    it('should allow valid role names', () => {
      const validRoles: RoleName[] = ['admin', 'agent', 'developer', 'seller', 'buyer'];
      
      validRoles.forEach(roleName => {
        const role: UserRole = {
          id: '123',
          name: roleName,
          description: 'Test role',
          permissions: {},
          is_active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        };
        
        expect(role.name).toBe(roleName);
      });
    });

    it('should have correct permission structure', () => {
      const adminPermissions: RolePermissions = {
        can_manage_users: true,
        can_approve_agents: true,
        can_approve_developers: true,
        can_view_analytics: true,
        can_manage_system: true
      };

      const role: UserRole = {
        id: '123',
        name: 'admin',
        description: 'Admin role',
        permissions: adminPermissions,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      expect(role.permissions.can_manage_users).toBe(true);
      expect(role.permissions.can_approve_agents).toBe(true);
    });
  });

  describe('UserProfile', () => {
    it('should have required fields', () => {
      const profile: UserProfile = {
        id: '123',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+1234567890',
        role_id: 'role-123',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      expect(profile.id).toBe('123');
      expect(profile.email).toBe('test@example.com');
      expect(profile.role_id).toBe('role-123');
    });

    it('should allow optional role object', () => {
      const profile: UserProfile = {
        id: '123',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+1234567890',
        role_id: 'role-123',
        role: {
          id: 'role-123',
          name: 'buyer',
          description: 'Buyer role',
          permissions: {},
          is_active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      expect(profile.role?.name).toBe('buyer');
    });
  });

  describe('AuthUser', () => {
    it('should have required fields', () => {
      const user: AuthUser = {
        id: '123',
        email: 'test@example.com',
        email_confirmed_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z'
      };

      expect(user.id).toBe('123');
      expect(user.email).toBe('test@example.com');
    });

    it('should allow optional profile', () => {
      const user: AuthUser = {
        id: '123',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
        profile: {
          id: '123',
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
          phone: '+1234567890',
          role_id: 'role-123',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      };

      expect(user.profile?.first_name).toBe('John');
    });
  });
}); 