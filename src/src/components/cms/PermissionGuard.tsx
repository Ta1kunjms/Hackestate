import React from 'react';
import { UserRole, hasPermission, canPerformAction } from '../../utils/permissions';
import AccessDenied from './AccessDenied';

interface PermissionGuardProps {
  role: UserRole;
  action?: keyof import('../../utils/permissions').RolePermissions;
  resource?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  role,
  action,
  resource,
  children,
  fallback = null,
  showFallback = false
}) => {
  const hasAccess = action 
    ? hasPermission(role, action, resource)
    : true;

  if (!hasAccess) {
    if (showFallback && fallback) {
      return <>{fallback}</>;
    }
    return <AccessDenied feature={resource || 'this feature'} userRole={role} />;
  }

  return <>{children}</>;
};

interface ActionGuardProps {
  role: UserRole;
  action: 'create' | 'edit' | 'delete' | 'approve';
  resource: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

export const ActionGuard: React.FC<ActionGuardProps> = ({
  role,
  action,
  resource,
  children,
  fallback = null,
  showFallback = false
}) => {
  const canPerform = canPerformAction(role, action, resource);

  if (!canPerform) {
    if (showFallback && fallback) {
      return <>{fallback}</>;
    }
    return null; // Don't show access denied for action buttons, just hide them
  }

  return <>{children}</>;
};

export default PermissionGuard; 