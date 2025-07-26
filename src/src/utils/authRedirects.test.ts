import {
  getRoleBasedRedirectUrl,
  getApprovalStatusRedirectUrl,
  requiresApproval,
  getDefaultRole,
  getRoleDisplayName,
  getRoleDescription
} from './authRedirects';
import { RoleName } from '../types/user';

describe('Auth Redirects', () => {
  describe('getRoleBasedRedirectUrl', () => {
    it('should return correct dashboard URLs for each role', () => {
      const testCases: Array<{ role: RoleName; expected: string }> = [
        { role: 'admin', expected: '/admin/dashboard' },
        { role: 'agent', expected: '/agent/dashboard' },
        { role: 'developer', expected: '/developer/dashboard' },
        { role: 'seller', expected: '/seller/dashboard' },
        { role: 'buyer', expected: '/buyer/dashboard' }
      ];

      testCases.forEach(({ role, expected }) => {
        expect(getRoleBasedRedirectUrl(role)).toBe(expected);
      });
    });

    it('should return default dashboard for unknown role', () => {
      expect(getRoleBasedRedirectUrl('buyer' as any)).toBe('/buyer/dashboard');
    });
  });

  describe('getApprovalStatusRedirectUrl', () => {
    it('should return correct URLs for each approval status', () => {
      expect(getApprovalStatusRedirectUrl('pending')).toBe('/auth/approval-pending');
      expect(getApprovalStatusRedirectUrl('approved')).toBe('/auth/approval-approved');
      expect(getApprovalStatusRedirectUrl('rejected')).toBe('/auth/approval-rejected');
    });
  });

  describe('requiresApproval', () => {
    it('should return true for agent and developer roles', () => {
      expect(requiresApproval('agent')).toBe(true);
      expect(requiresApproval('developer')).toBe(true);
    });

    it('should return false for other roles', () => {
      expect(requiresApproval('admin')).toBe(false);
      expect(requiresApproval('seller')).toBe(false);
      expect(requiresApproval('buyer')).toBe(false);
    });
  });

  describe('getDefaultRole', () => {
    it('should return buyer as default role', () => {
      expect(getDefaultRole()).toBe('buyer');
    });
  });

  describe('getRoleDisplayName', () => {
    it('should return correct display names for each role', () => {
      const testCases: Array<{ role: RoleName; expected: string }> = [
        { role: 'admin', expected: 'Administrator' },
        { role: 'agent', expected: 'Real Estate Agent' },
        { role: 'developer', expected: 'Property Developer' },
        { role: 'seller', expected: 'Property Seller' },
        { role: 'buyer', expected: 'Property Buyer' }
      ];

      testCases.forEach(({ role, expected }) => {
        expect(getRoleDisplayName(role)).toBe(expected);
      });
    });

    it('should return role name for unknown role', () => {
      expect(getRoleDisplayName('unknown' as RoleName)).toBe('unknown');
    });
  });

  describe('getRoleDescription', () => {
    it('should return correct descriptions for each role', () => {
      const testCases: Array<{ role: RoleName; expected: string }> = [
        { 
          role: 'admin', 
          expected: 'Full system access with user management capabilities' 
        },
        { 
          role: 'agent', 
          expected: 'Manage property listings and client interactions' 
        },
        { 
          role: 'developer', 
          expected: 'Manage development projects and lead tracking' 
        },
        { 
          role: 'seller', 
          expected: 'List and manage your properties for sale' 
        },
        { 
          role: 'buyer', 
          expected: 'Search properties and save favorites' 
        }
      ];

      testCases.forEach(({ role, expected }) => {
        expect(getRoleDescription(role)).toBe(expected);
      });
    });

    it('should return empty string for unknown role', () => {
      expect(getRoleDescription('unknown' as RoleName)).toBe('');
    });
  });
}); 