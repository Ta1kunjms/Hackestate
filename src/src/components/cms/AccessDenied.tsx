import React from 'react';
import { ShieldExclamationIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { Card, Button } from '../ui';
import { getRoleDisplayName } from '../../utils/permissions';

interface AccessDeniedProps {
  feature: string;
  userRole: string;
  requiredRole?: string;
  message?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ 
  feature, 
  userRole, 
  requiredRole, 
  message 
}) => {
  const defaultMessage = requiredRole 
    ? `This feature requires ${getRoleDisplayName(requiredRole as any)} permissions.`
    : `You don't have permission to access ${feature}.`;

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="p-8 max-w-md text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <ShieldExclamationIcon className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Access Denied
        </h3>
        
        <p className="text-gray-600 mb-4">
          {message || defaultMessage}
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <LockClosedIcon className="h-4 w-4" />
            <span>Current Role: {getRoleDisplayName(userRole as any)}</span>
          </div>
        </div>
        
        <Button 
          onClick={() => window.history.back()}
          variant="outlined"
          className="w-full"
        >
          Go Back
        </Button>
      </Card>
    </div>
  );
};

export default AccessDenied; 