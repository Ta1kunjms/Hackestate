import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UsersIcon, 
  UserGroupIcon, 
  HomeIcon, 
  CalendarIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '../../src/src/components/layout/DashboardLayout';
import { Button } from '../../src/src/components/ui';

// Mock admin data
const mockAdmin = {
  id: 'admin-1',
  name: 'System Administrator',
  email: 'admin@realestate.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  role: 'Super Admin',
  lastLogin: '2024-01-16T08:00:00Z'
};

// Mock platform stats
const platformStats = {
  totalUsers: 1247,
  activeUsers: 892,
  totalAgents: 45,
  verifiedAgents: 38,
  totalProperties: 1832,
  activeListings: 1456,
  totalEvents: 28,
  upcomingEvents: 12,
  monthlyRevenue: 1250000,
  conversionRate: 3.2
};

// Mock users data
const mockUsers = [
  {
    id: '1',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    role: 'User',
    status: 'Active',
    joinDate: '2024-01-10',
    lastActive: '2024-01-16',
    savedProperties: 5,
    inquiries: 12
  },
  {
    id: '2',
    name: 'John Chen',
    email: 'john.chen@email.com',
    role: 'User',
    status: 'Active',
    joinDate: '2024-01-08',
    lastActive: '2024-01-15',
    savedProperties: 3,
    inquiries: 8
  },
  {
    id: '3',
    name: 'Ana Rodriguez',
    email: 'ana.rodriguez@email.com',
    role: 'User',
    status: 'Suspended',
    joinDate: '2023-12-20',
    lastActive: '2024-01-10',
    savedProperties: 0,
    inquiries: 2
  }
];

// Mock agents data
const mockAgents = [
  {
    id: '1',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@realestate.com',
    phone: '+63 917 123 4567',
    status: 'Verified',
    license: 'RE-12345678',
    joinDate: '2023-06-15',
    properties: 8,
    sales: 12,
    rating: 4.9,
    commission: 8.5
  },
  {
    id: '2',
    name: 'David Kim',
    email: 'david.kim@realestate.com',
    phone: '+63 917 987 6543',
    status: 'Pending',
    license: 'RE-87654321',
    joinDate: '2024-01-01',
    properties: 2,
    sales: 0,
    rating: 0,
    commission: 8.0
  }
];

// Mock events data
const mockEvents = [
  {
    id: '1',
    title: 'Metro Manila Property Expo 2024',
    date: '2024-04-20',
    time: '10:00 AM',
    location: 'SMX Convention Center',
    type: 'Expo',
    status: 'Published',
    attendees: 245,
    maxCapacity: 500
  },
  {
    id: '2',
    title: 'Real Estate Investment Seminar',
    date: '2024-04-15',
    time: '2:00 PM',
    location: 'Makati Shangri-La',
    type: 'Seminar',
    status: 'Draft',
    attendees: 0,
    maxCapacity: 100
  }
];

// Mock content data
const mockContent = [
  {
    id: '1',
    title: '2024 Philippine Real Estate Market Outlook',
    type: 'Blog Post',
    status: 'Published',
    author: 'Admin',
    publishDate: '2024-01-15',
    views: 1234,
    category: 'Market Analysis'
  },
  {
    id: '2',
    title: 'First-Time Buyer\'s Guide',
    type: 'Guide',
    status: 'Draft',
    author: 'Admin',
    publishDate: null,
    views: 0,
    category: 'Buying Guide'
  }
];

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'agents' | 'properties' | 'events' | 'content' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `₱${(amount / 1000000).toFixed(1)}M`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'verified':
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUserAction = (userId: string, action: string) => {
    console.log(`${action} user ${userId}`);
    // In real app, make API call
  };

  const handleAgentAction = (agentId: string, action: string) => {
    console.log(`${action} agent ${agentId}`);
    // In real app, make API call
  };

  const handleEventAction = (eventId: string, action: string) => {
    console.log(`${action} event ${eventId}`);
    // In real app, make API call
  };

  const handleContentAction = (contentId: string, action: string) => {
    console.log(`${action} content ${contentId}`);
    // In real app, make API call
  };

  return (
    <DashboardLayout
      userRole="admin"
      userInfo={{
        name: mockAdmin.name,
        email: mockAdmin.email,
        avatar: mockAdmin.avatar,
        role: mockAdmin.role
      }}
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab as any)}
      title="Admin Dashboard"
      subtitle={`${mockAdmin.role} • Last login: ${formatDate(mockAdmin.lastLogin)}`}
      actions={
        <div className="flex items-center space-x-4">
          <Button variant="outlined">
            <ChartBarIcon className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Cog6ToothIcon className="w-4 h-4 mr-2" />
            System Settings
          </Button>
        </div>
      }
    >

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Platform Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <UsersIcon className="w-8 h-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">{platformStats.totalUsers.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-xs text-green-600">{platformStats.activeUsers} active</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <UserGroupIcon className="w-8 h-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">{platformStats.totalAgents}</p>
                      <p className="text-sm text-gray-600">Total Agents</p>
                      <p className="text-xs text-green-600">{platformStats.verifiedAgents} verified</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <HomeIcon className="w-8 h-8 text-purple-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">{platformStats.totalProperties.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Total Properties</p>
                      <p className="text-xs text-green-600">{platformStats.activeListings} active</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <ChartBarIcon className="w-8 h-8 text-orange-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(platformStats.monthlyRevenue)}</p>
                      <p className="text-sm text-gray-600">Monthly Revenue</p>
                      <p className="text-xs text-green-600">{platformStats.conversionRate}% conversion</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Users */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
                    <Button variant="outlined" size="sm" onClick={() => setActiveTab('users')}>
                      View All
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {mockUsers.slice(0, 3).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">Joined {formatDate(user.joinDate)}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Alerts */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">System Alerts</h2>
                    <Button variant="outlined" size="sm">
                      Mark All Read
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
                      <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900">Pending Agent Verification</h4>
                        <p className="text-sm text-gray-600">2 agents awaiting verification</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                      <DocumentTextIcon className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900">Content Review Required</h4>
                        <p className="text-sm text-gray-600">3 blog posts need approval</p>
                        <p className="text-xs text-gray-500">4 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-3 bg-green-50 rounded-lg">
                      <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900">System Backup Complete</h4>
                        <p className="text-sm text-gray-600">Daily backup successful</p>
                        <p className="text-xs text-gray-500">6 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
                    />
                  </div>
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>{user.savedProperties} saved properties</div>
                            <div>{user.inquiries} inquiries sent</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.joinDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleUserAction(user.id, 'view')}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUserAction(user.id, 'edit')}
                                className="text-orange-600 hover:text-orange-900"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUserAction(user.id, user.status === 'Active' ? 'suspend' : 'activate')}
                                className={user.status === 'Active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                              >
                                {user.status === 'Active' ? <XMarkIcon className="w-4 h-4" /> : <CheckIcon className="w-4 h-4" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agents' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Agent Management</h2>
                <Button>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add New Agent
                </Button>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockAgents.map((agent) => (
                        <tr key={agent.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                              <div className="text-sm text-gray-500">{agent.email}</div>
                              <div className="text-xs text-gray-500">License: {agent.license}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                              {agent.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>{agent.properties} properties</div>
                            <div>{agent.sales} sales</div>
                            <div className="flex items-center">
                              <span className="text-yellow-400">★</span>
                              <span className="ml-1">{agent.rating || 'No rating'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {agent.commission}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleAgentAction(agent.id, 'view')}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleAgentAction(agent.id, 'edit')}
                                className="text-orange-600 hover:text-orange-900"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              {agent.status === 'Pending' && (
                                <button
                                  onClick={() => handleAgentAction(agent.id, 'verify')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <CheckIcon className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
                <Button>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create New Event
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><CalendarIcon className="w-4 h-4 inline mr-2" />{event.date} at {event.time}</p>
                          <p><span className="w-4 h-4 inline-block mr-2">📍</span>{event.location}</p>
                          <p><span className="w-4 h-4 inline-block mr-2">🎫</span>{event.attendees}/{event.maxCapacity} attendees</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outlined" onClick={() => handleEventAction(event.id, 'view')}>
                        <EyeIcon className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outlined" onClick={() => handleEventAction(event.id, 'edit')}>
                        <PencilIcon className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <button
                        onClick={() => handleEventAction(event.id, 'delete')}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
                <Button>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create New Content
                </Button>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockContent.map((content) => (
                        <tr key={content.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{content.title}</div>
                              <div className="text-sm text-gray-500">By {content.author}</div>
                              <div className="text-xs text-gray-500">{content.category}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {content.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(content.status)}`}>
                              {content.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>{content.views.toLocaleString()} views</div>
                            <div>{content.publishDate ? formatDate(content.publishDate) : 'Not published'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleContentAction(content.id, 'view')}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleContentAction(content.id, 'edit')}
                                className="text-orange-600 hover:text-orange-900"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleContentAction(content.id, 'delete')}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
              
              <div className="space-y-8">
                {/* Platform Settings */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate (%)</label>
                      <input
                        type="number"
                        defaultValue="8.5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500">
                        <option value="PHP">Philippine Peso (₱)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Property Images</label>
                      <input
                        type="number"
                        defaultValue="20"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Auto-approve Listings</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500">
                        <option value="false">Manual Review Required</option>
                        <option value="true">Auto-approve</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Email Settings */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Settings</h3>
                  
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-700">Send welcome emails to new users</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-700">Send listing notifications to agents</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Send weekly performance reports</span>
                    </label>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button className="!bg-orange-500 hover:!bg-orange-600 !text-white">
                    Save Settings
                  </Button>
                </div>
              </div>
            </div>
          )}
    </DashboardLayout>
  );
};

export default AdminDashboard; 