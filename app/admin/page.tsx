'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '../../src/src/components/layout/DashboardLayout';
import { Button } from '../../src/src/components/ui';
import { useAuth } from '../../src/src/contexts/AuthContext';
import ProtectedRoute from '../../src/src/components/auth/ProtectedRoute';
import { supabase } from '../../src/src/lib/supabase';


// Import admin components
import {
  useAdminData,
  OverviewTab,
  UsersTab,
  AgentsTab,
  PropertiesTab,
  EventsTab,
  SettingsTab,
  UserDetailsModal,
  UserEditModal,
  UserDeleteModal,
  AgentDetailsModal,
  AgentEditModal,
  AgentDeleteModal,
  PropertyDetailsModal,
  PropertyEditModal,
  PropertyDeleteModal,
  EventDeleteModal,
  AdminTab,
  formatDate
} from '../../src/src/components/admin';

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const { user, userRole, isAdmin } = useAuth();
  
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
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

  const [showEventDeleteModal, setShowEventDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

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
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    switch (action) {
      case 'view':
        // Redirect to individual event page
        router.push(`/events/${eventId}`);
        break;
      case 'delete':
        setSelectedEvent(event);
        setShowEventDeleteModal(true);
        break;
      default:
        console.log(`${action} event ${eventId}`);
    }
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
      price: parseFloat(data.price) || 0,
      max_capacity: parseInt(data.maxCapacity) || 0,
      image_url: data.imageUrl || '',
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

  const handleUpdateEvent = async (eventId: string, updates: any) => {
    try {
      // Map form fields to database columns
      const mappedUpdates = {
        title: updates.title,
        event_date: updates.date,
        event_time: updates.time,
        location: updates.location,
        description: updates.description,
        event_type: updates.category,
        price: parseFloat(updates.price) || 0,
        max_capacity: parseInt(updates.maxCapacity) || 0,
        image_url: updates.imageUrl || '',
      };

      const { error } = await supabase
        .from('events')
        .update(mappedUpdates)
        .eq('id', eventId);
      if (error) throw error;
      await loadEvents();
      alert('Event updated successfully!');
    } catch (error) {
      alert('Failed to update event: ' + (error as any).message);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);
      if (error) throw error;
      await loadEvents();
      setShowEventDeleteModal(false);
      setSelectedEvent(null);
      alert('Event deleted successfully!');
    } catch (error) {
      alert('Failed to delete event: ' + (error as any).message);
    }
  };

  // Handler to save settings
  const handleSaveSettings = async (settings: any) => {
    try {
      // In a real app, you would save these to a settings table in the database
      // For now, we'll just simulate the save operation
      console.log('Saving settings:', settings);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // You could save to Supabase like this:
      // const { error } = await supabase
      //   .from('system_settings')
      //   .upsert({ 
      //     id: 1, 
      //     settings: JSON.stringify(settings),
      //     updated_at: new Date().toISOString()
      //   });
      // if (error) throw error;
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving settings:', error);
      return Promise.reject(error);
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
              <EventsTab
                events={events}
                isLoading={isLoading}
                onRefresh={loadEvents}
                onEventAction={handleEventAction}
                onCreateEvent={handleCreateEvent}
                onUpdateEvent={handleUpdateEvent}
              />
            )}

            {activeTab === 'content' && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Management</h2>
                  <p className="text-gray-500">Coming Soon</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <SettingsTab onSaveSettings={handleSaveSettings} />
            )}
          </>
        )}
      </DashboardLayout>



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

      {/* Event Modals */}
      <EventDeleteModal
        event={selectedEvent}
        open={showEventDeleteModal}
        onClose={() => setShowEventDeleteModal(false)}
        onDelete={handleDeleteEvent}
      />
    </ProtectedRoute>
  );
};

export default AdminDashboard; 