'use client'
import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../../src/src/contexts/AuthContext';
import ProtectedRoute from '../../src/src/components/auth/ProtectedRoute';
import { supabase } from '../../src/src/lib/supabase';
import EventCreateModal from '../../src/src/components/cms/EventCreateModal';

// Real data interfaces
interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  totalAgents: number;
  verifiedAgents: number;
  totalProperties: number;
  activeListings: number;
  totalEvents: number;
  upcomingEvents: number;
  monthlyRevenue: number;
  conversionRate: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role_id: string; // role id only
  status: string;
  joinDate: string;
  lastActive: string;
  savedProperties: number;
  inquiries: number;
}

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  license: string;
  joinDate: string;
  properties: number;
  sales: number;
  rating: number;
  commission: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  status: string;
  attendees: number;
  maxCapacity: number;
}

interface Content {
  id: string;
  title: string;
  type: string;
  status: string;
  author: string;
  publishDate: string | null;
  views: number;
  category: string;
}

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const { user, userRole, isAdmin } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'agents' | 'properties' | 'events' | 'content' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showEventCreateModal, setShowEventCreateModal] = useState(false);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  
  // Real data state
  const [platformStats, setPlatformStats] = useState<PlatformStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalAgents: 0,
    verifiedAgents: 0,
    totalProperties: 0,
    activeListings: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    monthlyRevenue: 0,
    conversionRate: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Computed filtered agents
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = searchTerm === '' || 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.license.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
      agent.status.toLowerCase() === selectedFilter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  // Add state to track which user's role is being edited
  const [editingRoleUserId, setEditingRoleUserId] = useState<string | null>(null);

  // Load real data
  useEffect(() => {
    const loadAdminData = async () => {
      if (!isAdmin) return;
      
      setIsLoading(true);
      try {
        // Test database connection first
        console.log('Testing database connection...');
        const { data: testData, error: testError } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);
        
        if (testError) {
          console.error('Database connection test failed:', testError);
          alert('Database connection failed. Please check your Supabase configuration.');
          return;
        }
        
        console.log('Database connection successful');
        
        // Load platform stats
        await loadPlatformStats();
        
        // Load users
        await loadUsers();
        
        // Load agents
        await loadAgents();
        
        // Load events
        await loadEvents();
        
        // Load content
        await loadContent();
        await loadRoles(); // <-- fetch roles
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, [isAdmin]);

  const loadPlatformStats = async () => {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get agents count
      const { data: agentRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('name', 'agent')
        .single();

      const { count: totalAgents } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role_id', agentRole?.id);

      // Get active users (users who logged in within last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', thirtyDaysAgo.toISOString());

      // Get verified agents (agents with verified status)
      const { count: verifiedAgents } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role_id', agentRole?.id)
        .eq('is_verified', true);

      // Get properties count (if properties table exists)
      let totalProperties = 0;
      let activeListings = 0;
      try {
        const { count: propertiesCount } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true });
        
        const { count: activePropertiesCount } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');
        
        totalProperties = propertiesCount || 0;
        activeListings = activePropertiesCount || 0;
      } catch (error) {
        console.log('Properties table not found, using 0');
      }

      // Get events count (if events table exists)
      let totalEvents = 0;
      let upcomingEvents = 0;
      try {
        const { count: eventsCount } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true });
        
        const { count: upcomingEventsCount } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .gte('event_date', new Date().toISOString());
        
        totalEvents = eventsCount || 0;
        upcomingEvents = upcomingEventsCount || 0;
      } catch (error) {
        console.log('Events table not found, using 0');
      }

      // Calculate conversion rate (users who became agents / total users)
      const conversionRate = (totalUsers || 0) > 0 ? ((totalAgents || 0) / (totalUsers || 0) * 100) : 0;

      setPlatformStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalAgents: totalAgents || 0,
        verifiedAgents: verifiedAgents || 0,
        totalProperties,
        activeListings,
        totalEvents,
        upcomingEvents,
        monthlyRevenue: 0, // This would come from transactions table
        conversionRate: Math.round(conversionRate * 100) / 100
      });
    } catch (error) {
      console.error('Error loading platform stats:', error);
    }
  };

  const loadUsers = async () => {
    try {
      console.log('Loading users...');
      
      // Simple query to get all profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading users:', error);
        setUsers([]);
        return;
      }

      console.log('Raw user data:', data);

      if (!data || data.length === 0) {
        console.log('No users found in database');
        setUsers([]);
        return;
      }

      const formattedUsers: User[] = await Promise.all((data || []).map(async (profile: any) => {
        // Get saved properties count for this user
        let savedPropertiesCount = 0;
        try {
          const { count } = await supabase
            .from('saved_properties')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id);
          savedPropertiesCount = count || 0;
        } catch (error) {
          console.log('Saved properties table not found for user stats');
        }

        // Get inquiries count for this user
        let inquiriesCount = 0;
        try {
          const { count } = await supabase
            .from('inquiries')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id);
          inquiriesCount = count || 0;
        } catch (error) {
          console.log('Inquiries table not found for user stats');
        }

        return {
          id: profile.id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown',
          email: profile.email,
          role_id: profile.role_id || '',
          status: profile.is_active !== false ? 'Active' : 'Inactive', // Default to Active if field doesn't exist
          joinDate: profile.created_at,
          lastActive: profile.updated_at,
          savedProperties: savedPropertiesCount,
          inquiries: inquiriesCount
        };
      }));

      console.log('Final formatted users:', formattedUsers);
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
  };

  const loadAgents = async () => {
    try {
      console.log('Loading agents...');
      
      // First, get the agent role ID
      const { data: agentRole, error: roleError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('name', 'agent')
        .single();

      if (roleError) {
        console.error('Error getting agent role:', roleError);
        setAgents([]);
        return;
      }

      console.log('Agent role found:', agentRole);

      // Get all profiles with agent role
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role_id', agentRole.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading agents:', error);
        setAgents([]);
        return;
      }

      console.log('Raw agent data:', data);

      if (!data || data.length === 0) {
        console.log('No agents found in database');
        setAgents([]);
        return;
      }

      const formattedAgents: Agent[] = await Promise.all((data || []).map(async (profile: any) => {
        // Get properties count for this agent
        let propertiesCount = 0;
        try {
          const { count } = await supabase
            .from('properties')
            .select('*', { count: 'exact', head: true })
            .eq('agent_id', profile.id);
          propertiesCount = count || 0;
        } catch (error) {
          console.log('Properties table not found for agent stats');
        }

        // Get sales count for this agent (if sales table exists)
        let salesCount = 0;
        try {
          const { count } = await supabase
            .from('sales')
            .select('*', { count: 'exact', head: true })
            .eq('agent_id', profile.id);
          salesCount = count || 0;
        } catch (error) {
          console.log('Sales table not found for agent stats');
        }

        // Get average rating for this agent (if reviews table exists)
        let averageRating = 0;
        try {
          const { data: reviews } = await supabase
            .from('reviews')
            .select('rating')
            .eq('agent_id', profile.id);
          
          if (reviews && reviews.length > 0) {
            const totalRating = reviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0);
            averageRating = Math.round((totalRating / reviews.length) * 10) / 10;
          }
        } catch (error) {
          console.log('Reviews table not found for agent stats');
        }

        return {
          id: profile.id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown',
          email: profile.email,
          phone: profile.phone || 'N/A',
          status: profile.is_verified === true ? 'Verified' : 'Pending', // Default to Pending if field doesn't exist
          license: `RE-${profile.id.slice(0, 8).toUpperCase()}`,
          joinDate: profile.created_at,
          properties: propertiesCount,
          sales: salesCount,
          rating: averageRating,
          commission: 8.5
        };
      }));

      console.log('Final formatted agents:', formattedAgents);
      setAgents(formattedAgents);
    } catch (error) {
      console.error('Error loading agents:', error);
      setAgents([]);
    }
  };

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.log('Events table not found or error:', error);
        setEvents([]);
        return;
      }

      const formattedEvents: Event[] = (data || []).map((event: any) => ({
        id: event.id,
        title: event.title || 'Untitled Event',
        date: event.event_date,
        time: event.event_time || 'TBD',
        location: event.location || 'TBD',
        type: event.event_type || 'Event',
        status: event.status || 'Draft',
        attendees: event.attendees_count || 0,
        maxCapacity: event.max_capacity || 0
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    }
  };

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.log('Blog posts table not found or error:', error);
        setContent([]);
        return;
      }

      const formattedContent: Content[] = (data || []).map((post: any) => ({
        id: post.id,
        title: post.title || 'Untitled Post',
        type: 'Blog Post',
        status: post.status || 'Draft',
        author: post.author_name || 'Admin',
        publishDate: post.published_at,
        views: post.view_count || 0,
        category: post.category || 'General'
      }));

      setContent(formattedContent);
    } catch (error) {
      console.error('Error loading content:', error);
      setContent([]);
    }
  };

  const loadRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('id, name')
        .eq('is_active', true)
        .order('name', { ascending: true });
      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error('Error loading roles:', error);
      setRoles([]);
    }
  };

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

  const handleAgentAction = async (agentId: string, action: string) => {
    try {
      switch (action) {
        case 'view':
          console.log(`Viewing agent ${agentId}`);
          // In real app, navigate to agent detail page
          break;
        case 'edit':
          console.log(`Editing agent ${agentId}`);
          // In real app, open edit modal
          break;
        case 'verify':
          if (window.confirm('Verify this agent?')) {
            const { error } = await supabase
              .from('profiles')
              .update({ is_verified: true })
              .eq('id', agentId);
            if (error) throw error;
            await loadAgents();
            alert('Agent verified successfully!');
          }
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this agent? This cannot be undone.')) {
            const { error } = await supabase
              .from('profiles')
              .delete()
              .eq('id', agentId);
            if (error) throw error;
            await loadAgents();
            alert('Agent deleted successfully!');
          }
          break;
        default:
          console.log(`${action} agent ${agentId}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing agent:`, error);
      alert(`Failed to ${action} agent: ${(error as any).message}`);
    }
  };

  const handleEventAction = (eventId: string, action: string) => {
    console.log(`${action} event ${eventId}`);
    // In real app, make API call
  };

  const handleContentAction = (contentId: string, action: string) => {
    console.log(`${action} content ${contentId}`);
    // In real app, make API call
  };

  const handleRecentUserClick = (userId: string) => {
    setActiveTab('users');
    // In a real app, you might want to scroll to or highlight the specific user
    console.log(`Viewing user ${userId}`);
  };

  const handleRecentEventClick = (eventId: string) => {
    setActiveTab('events');
    // In a real app, you might want to scroll to or highlight the specific event
    console.log(`Viewing event ${eventId}`);
  };

  const handleExportReport = () => {
    // Show coming soon notification
    alert('Export Report feature coming soon! This will allow you to download comprehensive platform analytics and user data reports.');
  };

  const handleCreateEvent = async (data: any) => {
    // Insert event into Supabase
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
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      if (error) throw error;
      await loadUsers();
      alert('User deleted!');
    } catch (error) {
      alert('Failed to delete user: ' + (error as any).message);
    }
  };

  // Handler to suspend/unsuspend user
  const handleSuspendUser = async (userId: string, suspend: boolean) => {
    const action = suspend ? 'suspend' : 'unsuspend';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !suspend })
        .eq('id', userId);
      if (error) throw error;
      await loadUsers();
      alert(`User ${suspend ? 'suspended' : 'unsuspended'}!`);
    } catch (error) {
      alert('Failed to update user status: ' + (error as any).message);
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
        onTabChange={(tab) => setActiveTab(tab as any)}
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
          agents: agents.length, // Use actual agents array length instead of platformStats
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
                        View All ({users.length})
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {users.length > 0 ? (
                        users.slice(0, 3).map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => handleRecentUserClick(user.id)}>
                            <div>
                              <h4 className="font-medium text-gray-900">{user.name}</h4>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <p className="text-xs text-gray-500">Joined {formatDate(user.joinDate)}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <UsersIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p>No users found</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Events */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Recent Events</h2>
                      <Button variant="outlined" size="sm" onClick={() => setActiveTab('events')}>
                        View All ({events.length})
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {events.length > 0 ? (
                        events.slice(0, 3).map((event) => (
                          <div key={event.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => handleRecentEventClick(event.id)}>
                            <div>
                              <h4 className="font-medium text-gray-900">{event.title}</h4>
                              <p className="text-sm text-gray-600">{event.location}</p>
                              <p className="text-xs text-gray-500">{formatDate(event.date)} at {event.time}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                              {event.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p>No events found</p>
                        </div>
                      )}
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
                    <Button 
                      variant="outlined" 
                      onClick={() => loadUsers()}
                      className="flex items-center"
                    >
                      <span className="mr-2">🔄</span>
                      Refresh
                    </Button>
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.length > 0 ? (
                          users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Active
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div>{user.savedProperties} saved properties</div>
                                <div>{user.inquiries} inquiries sent</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(user.joinDate)}
                              </td>
                              {/* Role cell with hover-to-edit */}
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 relative"
                                  onMouseEnter={() => setEditingRoleUserId(user.id)}
                                  onMouseLeave={() => setEditingRoleUserId(null)}
                              >
                                {editingRoleUserId === user.id ? (
                                  <select
                                    autoFocus
                                    value={user.role_id || ''}
                                    onChange={e => {
                                      handleChangeUserRole(user.id, e.target.value);
                                      setEditingRoleUserId(null);
                                    }}
                                    className="border rounded px-2 py-1 text-xs bg-white shadow"
                                    onBlur={() => setEditingRoleUserId(null)}
                                  >
                                    <option value="">Select role</option>
                                    {roles.map(role => (
                                      <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <span className="cursor-pointer hover:underline hover:text-orange-600 transition-colors">{roles.find(r => r.id === user.role_id)?.name || 'Unknown'}</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  {/* Suspend button (always, disabled for now) */}
                                  <button
                                    disabled
                                    className="text-yellow-600 border border-yellow-400 rounded px-2 py-1 text-xs font-semibold opacity-50 cursor-not-allowed"
                                    title="Suspend user (coming soon)"
                                  >
                                    Suspend
                                  </button>
                                  {/* Delete button */}
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="text-red-600 hover:text-red-900"
                                    title="Delete user"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center">
                                <UsersIcon className="w-12 h-12 text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                                <p className="text-gray-500 mb-4">
                                  {isLoading ? 'Loading users...' : 'There are no users in the system yet.'}
                                </p>
                                {!isLoading && (
                                  <Button 
                                    variant="outlined" 
                                    onClick={() => loadUsers()}
                                    className="flex items-center"
                                  >
                                    <span className="mr-2">🔄</span>
                                    Refresh Users
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
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
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search agents..."
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
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                    </select>
                    <Button 
                      variant="outlined" 
                      onClick={() => loadAgents()}
                      className="flex items-center"
                    >
                      <span className="mr-2">🔄</span>
                      Refresh
                    </Button>

                  </div>
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAgents.length > 0 ? (
                          filteredAgents.map((agent) => (
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(agent.joinDate)}
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
                                      title="Verify agent"
                                    >
                                      <CheckIcon className="w-4 h-4" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleAgentAction(agent.id, 'delete')}
                                    className="text-red-600 hover:text-red-900"
                                    title="Delete agent"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center">
                                <UserGroupIcon className="w-12 h-12 text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
                                <p className="text-gray-500 mb-4">
                                  {isLoading ? 'Loading agents...' : 
                                   searchTerm || selectedFilter !== 'all' ? 'No agents match your search criteria.' : 
                                   'There are no agents in the system yet.'}
                                </p>
                                {!isLoading && (
                                  <Button 
                                    variant="outlined" 
                                    onClick={() => loadAgents()}
                                    className="flex items-center"
                                  >
                                    <span className="mr-2">🔄</span>
                                    Refresh Agents
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
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
                  <Button onClick={() => setShowEventCreateModal(true)}>
                    <PlusIcon className="w-4 h-4 mr-2" />
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
          </>
        )}
      </DashboardLayout>
      <EventCreateModal
        open={showEventCreateModal}
        onClose={() => setShowEventCreateModal(false)}
        onCreate={async (data) => {
          await handleCreateEvent(data);
          setShowEventCreateModal(false);
        }}
      />
    </ProtectedRoute>
  );
};

export default AdminDashboard; 