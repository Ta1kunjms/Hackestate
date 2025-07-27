'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CMSDashboard from '../../src/src/components/cms/CMSDashboard';
import { UserRole } from '../../src/src/utils/permissions';

// User data - in real app this would come from auth context
const users = {
  agent: {
    id: '',
    name: '',
    email: '',
    avatar: '',
    role: ''
  },
  developer: {
    id: '',
    name: '',
    email: '',
    avatar: '',
    role: ''
  },
  seller: {
    id: '',
    name: '',
    email: '',
    avatar: '',
    role: ''
  },
  admin: {
    id: '',
    name: '',
    email: '',
    avatar: '',
    role: ''
  }
};

const CMSPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userRole, setUserRole] = useState<UserRole>('agent');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get role from URL params or default to agent
    const roleParam = searchParams.get('role') as UserRole;
    if (roleParam && ['agent', 'developer', 'seller', 'admin'].includes(roleParam)) {
      setUserRole(roleParam);
    }
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading CMS Dashboard...</p>
        </div>
      </div>
    );
  }

  const userInfo = users[userRole];

  return (
    <CMSDashboard 
      userRole={userRole} 
      userInfo={userInfo}
    />
  );
};

export default CMSPage; 