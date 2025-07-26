'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CMSDashboard from '../../src/src/components/cms/CMSDashboard';
import { UserRole } from '../../src/src/components/cms/CMSDashboard';

// Mock user data - in real app this would come from auth context
const mockUsers = {
  agent: {
    id: 'agent-1',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@realestate.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    role: 'Real Estate Agent'
  },
  developer: {
    id: 'dev-1',
    name: 'Maria Santos',
    email: 'maria.santos@developer.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    role: 'Property Developer'
  },
  seller: {
    id: 'seller-1',
    name: 'John Chen',
    email: 'john.chen@seller.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    role: 'Property Seller'
  },
  admin: {
    id: 'admin-1',
    name: 'System Administrator',
    email: 'admin@realestate.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    role: 'Super Admin'
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

  const userInfo = mockUsers[userRole];

  return (
    <CMSDashboard 
      userRole={userRole} 
      userInfo={userInfo}
    />
  );
};

export default CMSPage; 