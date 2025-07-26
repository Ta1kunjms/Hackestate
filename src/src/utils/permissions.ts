export type UserRole = 'agent' | 'developer' | 'seller' | 'admin';

export interface Permission {
  resource: string;
  actions: string[];
  conditions?: Record<string, any>;
}

export interface RolePermissions {
  canView: string[];
  canCreate: string[];
  canEdit: string[];
  canDelete: string[];
  canApprove: string[];
  canManageUsers: boolean;
  canViewAnalytics: boolean;
  canManageSettings: boolean;
  canUploadMedia: boolean;
  canViewAllProperties: boolean;
  canViewAllUsers: boolean;
  canViewFinancialData: boolean;
  canManageEvents: boolean;
  canManageContent: boolean;
}

export const PERMISSIONS: Record<UserRole, RolePermissions> = {
  agent: {
    canView: ['properties', 'inquiries', 'performance', 'media', 'settings'],
    canCreate: ['properties', 'media'],
    canEdit: ['properties', 'media'],
    canDelete: ['properties', 'media'],
    canApprove: [],
    canManageUsers: false,
    canViewAnalytics: true,
    canManageSettings: true,
    canUploadMedia: true,
    canViewAllProperties: false, // Only their own properties
    canViewAllUsers: false,
    canViewFinancialData: false,
    canManageEvents: false,
    canManageContent: false,
  },
  developer: {
    canView: ['projects', 'units', 'sales', 'marketing', 'media', 'settings'],
    canCreate: ['projects', 'units', 'marketing', 'media'],
    canEdit: ['projects', 'units', 'marketing', 'media'],
    canDelete: ['projects', 'units', 'marketing', 'media'],
    canApprove: ['units'],
    canManageUsers: false,
    canViewAnalytics: true,
    canManageSettings: true,
    canUploadMedia: true,
    canViewAllProperties: true, // All properties in their projects
    canViewAllUsers: false,
    canViewFinancialData: true,
    canManageEvents: true,
    canManageContent: true,
  },
  seller: {
    canView: ['properties', 'inquiries', 'performance', 'media', 'settings'],
    canCreate: ['properties', 'media'],
    canEdit: ['properties', 'media'],
    canDelete: ['properties', 'media'],
    canApprove: [],
    canManageUsers: false,
    canViewAnalytics: true,
    canManageSettings: true,
    canUploadMedia: true,
    canViewAllProperties: false, // Only their own properties
    canViewAllUsers: false,
    canViewFinancialData: false,
    canManageEvents: false,
    canManageContent: false,
  },
  admin: {
    canView: ['overview', 'properties', 'users', 'agents', 'events', 'content', 'media', 'settings'],
    canCreate: ['properties', 'users', 'agents', 'events', 'content', 'media'],
    canEdit: ['properties', 'users', 'agents', 'events', 'content', 'media'],
    canDelete: ['properties', 'users', 'agents', 'events', 'content', 'media'],
    canApprove: ['properties', 'users', 'agents', 'events', 'content'],
    canManageUsers: true,
    canViewAnalytics: true,
    canManageSettings: true,
    canUploadMedia: true,
    canViewAllProperties: true,
    canViewAllUsers: true,
    canViewFinancialData: true,
    canManageEvents: true,
    canManageContent: true,
  },
};

export const hasPermission = (role: UserRole, action: keyof RolePermissions, resource?: string): boolean => {
  const permissions = PERMISSIONS[role];
  
  if (!permissions) {
    return false;
  }

  switch (action) {
    case 'canView':
      return resource ? permissions.canView.includes(resource) : true;
    case 'canCreate':
      return resource ? permissions.canCreate.includes(resource) : false;
    case 'canEdit':
      return resource ? permissions.canEdit.includes(resource) : false;
    case 'canDelete':
      return resource ? permissions.canDelete.includes(resource) : false;
    case 'canApprove':
      return resource ? permissions.canApprove.includes(resource) : false;
    case 'canManageUsers':
      return permissions.canManageUsers;
    case 'canViewAnalytics':
      return permissions.canViewAnalytics;
    case 'canManageSettings':
      return permissions.canManageSettings;
    case 'canUploadMedia':
      return permissions.canUploadMedia;
    case 'canViewAllProperties':
      return permissions.canViewAllProperties;
    case 'canViewAllUsers':
      return permissions.canViewAllUsers;
    case 'canViewFinancialData':
      return permissions.canViewFinancialData;
    case 'canManageEvents':
      return permissions.canManageEvents;
    case 'canManageContent':
      return permissions.canManageContent;
    default:
      return false;
  }
};

export const getAccessibleTabs = (role: UserRole): string[] => {
  return PERMISSIONS[role]?.canView || [];
};

export const canPerformAction = (role: UserRole, action: 'create' | 'edit' | 'delete' | 'approve', resource: string): boolean => {
  const permissions = PERMISSIONS[role];
  
  if (!permissions) {
    return false;
  }

  switch (action) {
    case 'create':
      return permissions.canCreate.includes(resource);
    case 'edit':
      return permissions.canEdit.includes(resource);
    case 'delete':
      return permissions.canDelete.includes(resource);
    case 'approve':
      return permissions.canApprove.includes(resource);
    default:
      return false;
  }
};

export const getRoleDisplayName = (role: UserRole): string => {
  const displayNames = {
    agent: 'Real Estate Agent',
    developer: 'Property Developer',
    seller: 'Property Seller',
    admin: 'System Administrator',
  };
  return displayNames[role] || role;
};

export const getRoleColor = (role: UserRole): string => {
  const colors = {
    agent: 'blue',
    developer: 'green',
    seller: 'purple',
    admin: 'red',
  };
  return colors[role] || 'gray';
}; 