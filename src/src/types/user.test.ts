import { UserRole, UserProfile, AuthUser, RolePermissions, RoleName, RoleApproval } from './user';

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

  describe('RoleApproval', () => {
    it('should have required fields', () => {
      const approval: RoleApproval = {
        id: '123',
        user_id: 'user-123',
        role_name: 'agent',
        status: 'pending',
        submitted_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      expect(approval.id).toBe('123');
      expect(approval.user_id).toBe('user-123');
      expect(approval.role_name).toBe('agent');
      expect(approval.status).toBe('pending');
    });

    it('should allow valid role names for approval', () => {
      const validApprovalRoles: RoleApproval['role_name'][] = ['agent', 'developer'];
      
      validApprovalRoles.forEach(roleName => {
        const approval: RoleApproval = {
          id: '123',
          user_id: 'user-123',
          role_name: roleName,
          status: 'pending',
          submitted_at: '2024-01-01T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        };
        
        expect(approval.role_name).toBe(roleName);
      });
    });

    it('should allow valid status values', () => {
      const validStatuses: RoleApproval['status'][] = ['pending', 'approved', 'rejected'];
      
      validStatuses.forEach(status => {
        const approval: RoleApproval = {
          id: '123',
          user_id: 'user-123',
          role_name: 'agent',
          status: status,
          submitted_at: '2024-01-01T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        };
        
        expect(approval.status).toBe(status);
      });
    });

    it('should allow optional fields', () => {
      const approval: RoleApproval = {
        id: '123',
        user_id: 'user-123',
        role_name: 'developer',
        status: 'rejected',
        submitted_at: '2024-01-01T00:00:00Z',
        reviewed_at: '2024-01-02T00:00:00Z',
        reviewed_by: 'admin-123',
        rejection_reason: 'Insufficient documentation',
        documentation_url: 'https://example.com/docs',
        additional_notes: 'Please provide more details about your experience',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z'
      };

      expect(approval.rejection_reason).toBe('Insufficient documentation');
      expect(approval.additional_notes).toBe('Please provide more details about your experience');
    });
  });
}); 