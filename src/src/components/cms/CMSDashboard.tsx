import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  BuildingOfficeIcon,
  UsersIcon,
  UserGroupIcon,
  CalendarIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  DocumentIcon,
  VideoCameraIcon,
  BellIcon,
  ClockIcon,
  CurrencyDollarIcon,
  HomeIcon,
  HeartIcon,
  EnvelopeIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '../layout/DashboardLayout';
import { Button, Card, Input, Modal, Select } from '../ui';
import PropertiesManager from './PropertiesManager';
import UsersManager from './UsersManager';
import MediaLibrary from './MediaLibrary';
import PermissionGuard, { ActionGuard } from './PermissionGuard';
import { 
  UserRole, 
  getAccessibleTabs, 
  hasPermission, 
  getRoleDisplayName,
  getRoleColor 
} from '../../utils/permissions';

interface CMSStats {
  totalProperties: number;
  activeListings: number;
  totalUsers: number;
  totalAgents: number;
  totalEvents: number;
  monthlyRevenue: number;
  conversionRate: number;
  pendingApprovals: number;
}

interface CMSDashboardProps {
  userRole: UserRole;
  userInfo: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
  };
}

const CMSDashboard: React.FC<CMSDashboardProps> = ({ userRole, userInfo }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<CMSStats>({
    totalProperties: 0,
    activeListings: 0,
    totalUsers: 0,
    totalAgents: 0,
    totalEvents: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
    pendingApprovals: 0
  });

  // Role-specific navigation items with permissions
  const getNavigationItems = () => {
    const accessibleTabs = getAccessibleTabs(userRole);
    const baseItems = [
      { id: 'overview', label: 'Overview', icon: ChartBarIcon, path: '/cms' },
    ];

    const allItems = [
      { id: 'properties', label: 'Properties', icon: BuildingOfficeIcon, path: '/cms' },
      { id: 'inquiries', label: 'Inquiries', icon: EnvelopeIcon, path: '/cms' },
      { id: 'performance', label: 'Performance', icon: ChartBarIcon, path: '/cms' },
      { id: 'projects', label: 'Projects', icon: BuildingOfficeIcon, path: '/cms' },
      { id: 'units', label: 'Units', icon: HomeIcon, path: '/cms' },
      { id: 'sales', label: 'Sales', icon: CurrencyDollarIcon, path: '/cms' },
      { id: 'marketing', label: 'Marketing', icon: DocumentTextIcon, path: '/cms' },
      { id: 'users', label: 'Users', icon: UsersIcon, path: '/cms' },
      { id: 'agents', label: 'Agents', icon: UserGroupIcon, path: '/cms' },
      { id: 'events', label: 'Events', icon: CalendarIcon, path: '/cms' },
      { id: 'content', label: 'Content', icon: DocumentTextIcon, path: '/cms' },
      { id: 'media', label: 'Media Library', icon: PhotoIcon, path: '/cms' },
      { id: 'settings', label: 'Settings', icon: Cog6ToothIcon, path: '/cms' }
    ];

    // Filter items based on permissions
    const filteredItems = allItems.filter(item => accessibleTabs.includes(item.id));
    
    return [...baseItems, ...filteredItems];
  };
  };

  const navigationItems = getNavigationItems();

  // Role-specific dashboard title
  const getDashboardTitle = () => {
    switch (userRole) {
      case 'agent': return 'Agent CMS';
      case 'developer': return 'Developer CMS';
      case 'seller': return 'Seller CMS';
      case 'admin': return 'Admin CMS';
      default: return 'CMS Dashboard';
    }
  };

  // Role-specific dashboard subtitle
  const getDashboardSubtitle = () => {
    switch (userRole) {
      case 'agent': return 'Manage your properties and client inquiries';
      case 'developer': return 'Manage your development projects and units';
      case 'seller': return 'Manage your property listings and offers';
      case 'admin': return 'Platform administration and management';
      default: return 'Content Management System';
    }
  };

  // Load stats from API
  useEffect(() => {
    // In real app, fetch from API
    const loadStats = async () => {
      const defaultStats: CMSStats = {
        totalProperties: 0,
        activeListings: 0,
        totalUsers: 0,
        totalAgents: 0,
        totalEvents: 0,
        monthlyRevenue: 0,
        conversionRate: 0,
        pendingApprovals: 0
      };
      
      setStats(defaultStats);
    };

    loadStats();
  }, [userRole]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
            </div>
            <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Listings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeListings}</p>
            </div>
            <HomeIcon className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        {userRole === 'admin' && (
          <>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <UsersIcon className="h-8 w-8 text-purple-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₱{(stats.monthlyRevenue / 1000000).toFixed(1)}M</p>
                </div>
                <CurrencyDollarIcon className="h-8 w-8 text-yellow-500" />
              </div>
            </Card>
          </>
        )}

        {userRole !== 'admin' && (
          <>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₱{(stats.monthlyRevenue / 1000).toFixed(0)}K</p>
                </div>
                <CurrencyDollarIcon className="h-8 w-8 text-yellow-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
                </div>
                <ChartBarIcon className="h-8 w-8 text-indigo-500" />
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">New property listing added</span>
            <span className="text-xs text-gray-400 ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Inquiry received from client</span>
            <span className="text-xs text-gray-400 ml-auto">4 hours ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Property view scheduled</span>
            <span className="text-xs text-gray-400 ml-auto">1 day ago</span>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'properties':
        return (
          <PermissionGuard role={userRole} action="canView" resource="properties">
            <PropertiesManager userRole={userRole} userId={userInfo.id} />
          </PermissionGuard>
        );
      case 'users':
        return (
          <PermissionGuard role={userRole} action="canViewAllUsers">
            <UsersManager userRole={userRole} />
          </PermissionGuard>
        );
      case 'agents':
        return (
          <PermissionGuard role={userRole} action="canView" resource="agents">
            <div className="p-6">Agents management coming soon...</div>
          </PermissionGuard>
        );
      case 'events':
        return (
          <PermissionGuard role={userRole} action="canManageEvents">
            <div className="p-6">Events management coming soon...</div>
          </PermissionGuard>
        );
      case 'content':
        return (
          <PermissionGuard role={userRole} action="canManageContent">
            <div className="p-6">Content management coming soon...</div>
          </PermissionGuard>
        );
      case 'media':
        return (
          <PermissionGuard role={userRole} action="canUploadMedia">
            <MediaLibrary userRole={userRole} />
          </PermissionGuard>
        );
      case 'settings':
        return (
          <PermissionGuard role={userRole} action="canManageSettings">
            <div className="p-6">Settings coming soon...</div>
          </PermissionGuard>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <DashboardLayout
      userRole={userRole}
      userInfo={userInfo}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      title={getDashboardTitle()}
      subtitle={getDashboardSubtitle()}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default CMSDashboard; 