'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '../../src/src/components/layout/DashboardLayout';
import { Button } from '../../src/src/components/ui';
import { useAuth } from '../../src/src/contexts/AuthContext';
import ProtectedRoute from '../../src/src/components/auth/ProtectedRoute';
import { supabase } from '../../src/src/lib/supabase';
import EventCreateModal from '../../src/src/components/cms/EventCreateModal';

// Import admin components
import {
  useAdminData,
  OverviewTab,
  UsersTab,
  AgentsTab,
  PropertiesTab,
  UserDetailsModal,
  UserEditModal,
  UserDeleteModal,
  AgentDetailsModal,
  AgentEditModal,
  AgentDeleteModal,
  PropertyDetailsModal,
  PropertyEditModal,
  PropertyDeleteModal,
  AdminTab,
  formatDate
} from '../../src/src/components/admin';

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const { user, userRole, isAdmin } = useAuth();
  
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showEventCreateModal, setShowEventCreateModal] = useState(false);
  
  // Modal states
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showUserEditModal, setShowUserEditModal] = useState(false);
  const [showUserDeleteModal, setShowUserDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [showAgentDetailsModal, setShowAgentDetailsModal] = useState(false);
  const [showAgentEditModal, setShowAgentEditModal] = useState(false);
  const [showAgentDeleteModal, setShowAgentDeleteModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  const [showPropertyDetailsModal, setShowPropertyDetailsModal] = useState(false);
  const [showPropertyEditModal, setShowPropertyEditModal] = useState(false);
  const [showPropertyDeleteModal, setShowPropertyDeleteModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  // Use the admin data hook
  const {
    platformStats,
    users,
    agents,
    properties,
    events,
    content,
    roles,
    isLoading,
    loadUsers,
    loadAgents,
    loadProperties,
    loadEvents,
    loadContent,
    loadRoles
  } = useAdminData(isAdmin || false);

  // Event handlers
  const handleUserAction = (userId: string, action: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    setSelectedUser(user);
    
    switch (action) {
      case 'view':
        setShowUserDetailsModal(true);
        break;
      case 'edit':
        setShowUserEditModal(true);
        break;
      case 'delete':
        setShowUserDeleteModal(true);
        break;
      default:
        console.log(`${action} user ${userId}`);
    }
  };

  const handleAgentAction = (agentId: string, action: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;
    
    setSelectedAgent(agent);
    
    switch (action) {
      case 'view':
        setShowAgentDetailsModal(true);
        break;
      case 'edit':
        setShowAgentEditModal(true);
        break;
      case 'delete':
        setShowAgentDeleteModal(true);
        break;
      default:
        console.log(`${action} agent ${agentId}`);
    }
  };

  const handlePropertyAction = (propertyId: string, action: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;
    
    setSelectedProperty(property);
    
    switch (action) {
      case 'view':
        setShowPropertyDetailsModal(true);
        break;
      case 'edit':
        setShowPropertyEditModal(true);
        break;
      case 'delete':
        setShowPropertyDeleteModal(true);
        break;
      default:
        console.log(`${action} property ${propertyId}`);
    }
  };

  const handleEventAction = (eventId: string, action: string) => {
    console.log(`${action} event ${eventId}`);
  };

  const handleContentAction = (contentId: string, action: string) => {
    console.log(`${action} content ${contentId}`);
  };

  const handleRecentUserClick = (userId: string) => {
    setActiveTab('users');
    console.log(`Viewing user ${userId}`);
  };

  const handleRecentEventClick = (eventId: string) => {
    setActiveTab('events');
    console.log(`Viewing event ${eventId}`);
  };

  const handleExportReport = () => {
    alert('Export Report feature coming soon! This will allow you to download comprehensive platform analytics and user data reports.');
  };

  const handleCreateEvent = async (data: any) => {
    const { error } = await supabase.from('events').insert({
      title: data.title,
      event_date: data.date,
      event_time: data.time,
      location: data.location,
      description: data.description,
      event_type: data.category,
      status: 'Published',
    });
    if (!error) {
      await loadEvents();
    } else {
      alert('Failed to create event: ' + error.message);
    }
  };

  // Handler to change user role
  const handleChangeUserRole = async (userId: string, newRoleId: string) => {
    if (!window.confirm('Change this user\'s role?')) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role_id: newRoleId })
        .eq('id', userId);
      if (error) throw error;
      await loadUsers();
      alert('User role updated!');
    } catch (error) {
      alert('Failed to update user role: ' + (error as any).message);
    }
  };

  // Handler to delete user
  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      if (error) throw error;
      await loadUsers();
      setShowUserDeleteModal(false);
      setSelectedUser(null);
      alert('User deleted successfully!');
    } catch (error) {
      alert('Failed to delete user: ' + (error as any).message);
    }
  };

  // Handler to delete agent
  const handleDeleteAgent = async (agentId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', agentId);
      if (error) throw error;
      await loadAgents();
      setShowAgentDeleteModal(false);
      setSelectedAgent(null);
      alert('Agent deleted successfully!');
    } catch (error) {
      alert('Failed to delete agent: ' + (error as any).message);
    }
  };

  // Handler to delete property
  const handleDeleteProperty = async (propertyId: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);
      if (error) throw error;
      await loadProperties();
      setShowPropertyDeleteModal(false);
      setSelectedProperty(null);
      alert('Property deleted successfully!');
    } catch (error) {
      alert('Failed to delete property: ' + (error as any).message);
    }
  };

  // Handler to update agent commission
  const handleUpdateAgentCommission = async (agentId: string, commission: number) => {
    try {
      // In a real app, you would save this to the database
      alert(`Commission rate updated to ${commission}% for agent ${agentId}`);
      setShowAgentEditModal(false);
      setSelectedAgent(null);
    } catch (error) {
      alert('Failed to update agent commission: ' + (error as any).message);
    }
  };

  // Handler to update property
  const handleUpdateProperty = async (propertyId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', propertyId);
      if (error) throw error;
      await loadProperties();
      alert('Property updated successfully!');
    } catch (error) {
      alert('Failed to update property: ' + (error as any).message);
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout
        userRole="admin"
        userInfo={{
          name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Admin',
          email: user?.email || 'admin@realestate.com',
          avatar: user?.avatar || 'https://via.placeholder.com/50',
          role: userRole?.name || 'Super Admin'
        }}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as AdminTab)}
        title="Admin Dashboard"
        subtitle={`${userRole?.name || 'Admin'} • Last login: ${formatDate(new Date().toISOString())}`}
        actions={
          <div className="flex items-center space-x-4">
            <Button variant="outlined" onClick={handleExportReport}>
              <ChartBarIcon className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        }
        counts={{
          users: platformStats.totalUsers,
          agents: agents.length,
          properties: platformStats.totalProperties,
          events: platformStats.totalEvents,
          content: content.length
        }}
      >
        {/* Show loading state */}
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading admin data...</p>
            </div>
          </div>
        )}

        {/* Show content when not loading */}
        {!isLoading && (
          <>
            {/* Tab Content */}
            {activeTab === 'overview' && (
              <OverviewTab
                platformStats={platformStats}
                users={users}
                events={events}
                onTabChange={setActiveTab}
                onRecentUserClick={handleRecentUserClick}
                onRecentEventClick={handleRecentEventClick}
              />
            )}

            {activeTab === 'users' && (
              <UsersTab
                users={users}
                roles={roles}
                searchTerm={searchTerm}
                selectedFilter={selectedFilter}
                isLoading={isLoading}
                onSearchChange={setSearchTerm}
                onFilterChange={setSelectedFilter}
                onRefresh={loadUsers}
                onUserAction={handleUserAction}
                onChangeUserRole={handleChangeUserRole}
              />
            )}

            {activeTab === 'agents' && (
              <AgentsTab
                agents={agents}
                searchTerm={searchTerm}
                isLoading={isLoading}
                onSearchChange={setSearchTerm}
                onRefresh={loadAgents}
                onAgentAction={handleAgentAction}
              />
            )}

            {activeTab === 'properties' && (
              <PropertiesTab
                properties={properties}
                searchTerm={searchTerm}
                isLoading={isLoading}
                onSearchChange={setSearchTerm}
                onRefresh={loadProperties}
                onPropertyAction={handlePropertyAction}
              />
            )}

            {activeTab === 'events' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
                  <Button onClick={() => setShowEventCreateModal(true)}>
                    Create New Event
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {events.map((event) => (
                    <div key={event.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>📅 {event.date} at {event.time}</p>
                            <p>📍 {event.location}</p>
                            <p>🎫 {event.attendees}/{event.maxCapacity} attendees</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {event.status}
                        </span>
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
                  <Button>Create New Content</Button>
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
                        {content.map((content) => (
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
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
                                  View
                                </button>
                                <button
                                  onClick={() => handleContentAction(content.id, 'edit')}
                                  className="text-orange-600 hover:text-orange-900"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleContentAction(content.id, 'delete')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
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
          </>
        )}
      </DashboardLayout>

      {/* Event Create Modal */}
      <EventCreateModal
        open={showEventCreateModal}
        onClose={() => setShowEventCreateModal(false)}
        onCreate={async (data) => {
          await handleCreateEvent(data);
          setShowEventCreateModal(false);
        }}
      />

      {/* User Modals */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={showUserDetailsModal}
        onClose={() => setShowUserDetailsModal(false)}
      />

      <UserEditModal
        user={selectedUser}
        roles={roles}
        isOpen={showUserEditModal}
        onClose={() => setShowUserEditModal(false)}
        onSave={handleChangeUserRole}
      />

      <UserDeleteModal
        user={selectedUser}
        isOpen={showUserDeleteModal}
        onClose={() => setShowUserDeleteModal(false)}
        onDelete={handleDeleteUser}
      />

      {/* Agent Modals */}
      <AgentDetailsModal
        agent={selectedAgent}
        isOpen={showAgentDetailsModal}
        onClose={() => setShowAgentDetailsModal(false)}
      />

      <AgentEditModal
        agent={selectedAgent}
        isOpen={showAgentEditModal}
        onClose={() => setShowAgentEditModal(false)}
        onSave={handleUpdateAgentCommission}
      />

      <AgentDeleteModal
        agent={selectedAgent}
        isOpen={showAgentDeleteModal}
        onClose={() => setShowAgentDeleteModal(false)}
        onDelete={handleDeleteAgent}
      />

      {/* Property Modals */}
      <PropertyDetailsModal
        property={selectedProperty}
        isOpen={showPropertyDetailsModal}
        onClose={() => setShowPropertyDetailsModal(false)}
      />

      <PropertyEditModal
        property={selectedProperty}
        isOpen={showPropertyEditModal}
        onClose={() => setShowPropertyEditModal(false)}
        onSave={handleUpdateProperty}
      />

      <PropertyDeleteModal
        property={selectedProperty}
        isOpen={showPropertyDeleteModal}
        onClose={() => setShowPropertyDeleteModal(false)}
        onDelete={handleDeleteProperty}
      />
    </ProtectedRoute>
  );
};

export default AdminDashboard; 