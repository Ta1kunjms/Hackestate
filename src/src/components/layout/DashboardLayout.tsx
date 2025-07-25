import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Bars3Icon, 
  XMarkIcon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  HeartIcon,
  BuildingOfficeIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import Layout from './Layout';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  count?: number;
  badge?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'user' | 'agent' | 'admin';
  userInfo: {
    name: string;
    email: string;
    avatar: string;
    role?: string;
  };
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userRole,
  userInfo,
  activeTab,
  onTabChange,
  title,
  subtitle,
  actions
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items based on user role
  const getNavigationItems = (): NavigationItem[] => {
    switch (userRole) {
      case 'user':
        return [
          { id: 'overview', label: 'Overview', icon: ChartBarIcon, path: '/dashboard' },
          { id: 'saved', label: 'Saved Properties', icon: HeartIcon, path: '/dashboard', count: 12 },
          { id: 'alerts', label: 'Search Alerts', icon: BellIcon, path: '/dashboard', count: 3 },
          { id: 'preferences', label: 'Preferences', icon: Cog6ToothIcon, path: '/dashboard' }
        ];
      case 'agent':
        return [
          { id: 'overview', label: 'Overview', icon: ChartBarIcon, path: '/agent/dashboard' },
          { id: 'properties', label: 'My Properties', icon: BuildingOfficeIcon, path: '/agent/dashboard', count: 8 },
          { id: 'inquiries', label: 'Inquiries', icon: EnvelopeIcon, path: '/agent/dashboard', count: 15, badge: 'new' },
          { id: 'performance', label: 'Performance', icon: ChartBarIcon, path: '/agent/dashboard' }
        ];
      case 'admin':
        return [
          { id: 'overview', label: 'Overview', icon: ChartBarIcon, path: '/admin/dashboard' },
          { id: 'users', label: 'Users', icon: UsersIcon, path: '/admin/dashboard', count: 1247 },
          { id: 'agents', label: 'Agents', icon: UserGroupIcon, path: '/admin/dashboard', count: 45 },
          { id: 'properties', label: 'Properties', icon: BuildingOfficeIcon, path: '/admin/dashboard', count: 1832 },
          { id: 'events', label: 'Events', icon: CalendarIcon, path: '/admin/dashboard', count: 28 },
          { id: 'content', label: 'Content', icon: DocumentTextIcon, path: '/admin/dashboard', count: 156 },
          { id: 'settings', label: 'Settings', icon: Cog6ToothIcon, path: '/admin/dashboard' }
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const handleNavigation = (item: NavigationItem) => {
    if (onTabChange) {
      onTabChange(item.id);
    }
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    // In real app, handle logout logic
    console.log('Logout clicked');
    navigate('/auth/login');
  };

  const getDashboardTitle = () => {
    if (title) return title;
    switch (userRole) {
      case 'user':
        return 'User Dashboard';
      case 'agent':
        return 'Agent Dashboard';
      case 'admin':
        return 'Admin Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const getDashboardSubtitle = () => {
    if (subtitle) return subtitle;
    switch (userRole) {
      case 'user':
        return 'Manage your property searches and preferences';
      case 'agent':
        return 'Manage your listings and client relationships';
      case 'admin':
        return 'Oversee platform operations and content';
      default:
        return '';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
              <div className="flex items-center">
                <HomeIcon className="w-8 h-8 text-orange-500" />
                <span className="ml-2 text-xl font-bold text-gray-900">RealEstate</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <img
                  src={userInfo.avatar}
                  alt={userInfo.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{userInfo.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{userInfo.role || userRole}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count && (
                    <span className="bg-gray-200 text-gray-600 text-xs rounded-full px-2 py-0.5">
                      {item.count}
                    </span>
                  )}
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-2">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:pl-64">
          {/* Top Bar */}
          <div className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16">
            <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
              {/* Left Side */}
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
                >
                  <Bars3Icon className="w-5 h-5" />
                </button>
                
                <div className="hidden lg:block">
                  <h1 className="text-xl font-semibold text-gray-900">{getDashboardTitle()}</h1>
                </div>
              </div>

              {/* Center - Search */}
              <div className="hidden md:block flex-1 max-w-lg mx-8">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500 text-sm"
                  />
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <BellIcon className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={userInfo.avatar}
                      alt={userInfo.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-40">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{userInfo.name}</p>
                        <p className="text-xs text-gray-500">{userInfo.email}</p>
                      </div>
                      
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <UserCircleIcon className="w-4 h-4 inline mr-2" />
                        Profile Settings
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 inline mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Page Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 lg:hidden">{getDashboardTitle()}</h1>
                  <p className="text-gray-600 mt-1">{getDashboardSubtitle()}</p>
                </div>
                
                {actions && (
                  <div className="flex items-center space-x-4">
                    {actions}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardLayout; 