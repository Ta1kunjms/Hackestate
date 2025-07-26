import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { PlatformStats, User, Agent, Property, Event, Content, Role } from '../types';

export const useAdminData = (isAdmin: boolean) => {
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
  const [properties, setProperties] = useState<Property[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          status: profile.is_active !== false ? 'Active' : 'Inactive',
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
          status: profile.is_verified === true ? 'Verified' : 'Pending',
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

  const loadProperties = async () => {
    try {
      console.log('Loading properties...');
      
      // Get all properties with agent information
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          agent:profiles(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading properties:', error);
        setProperties([]);
        return;
      }

      console.log('Raw properties data:', data);

      if (!data || data.length === 0) {
        console.log('No properties found in database');
        setProperties([]);
        return;
      }

      const formattedProperties: Property[] = await Promise.all((data || []).map(async (property: any) => {
        // Get views count for this property
        let viewsCount = 0;
        try {
          const { count } = await supabase
            .from('property_views')
            .select('*', { count: 'exact', head: true })
            .eq('property_id', property.id);
          viewsCount = count || 0;
        } catch (error) {
          console.log('Property views table not found for property stats');
        }

        // Get inquiries count for this property
        let inquiriesCount = 0;
        try {
          const { count } = await supabase
            .from('inquiries')
            .select('*', { count: 'exact', head: true })
            .eq('property_id', property.id);
          inquiriesCount = count || 0;
        } catch (error) {
          console.log('Inquiries table not found for property stats');
        }

        return {
          id: property.id,
          title: property.title || 'Untitled Property',
          address: property.address || 'No address',
          price: property.price || 0,
          type: property.property_type || 'Residential',
          status: property.status || 'Active',
          agent: property.agent ? `${property.agent.first_name || ''} ${property.agent.last_name || ''}`.trim() : 'Unknown Agent',
          agent_id: property.agent_id || '',
          bedrooms: property.bedrooms || 0,
          bathrooms: property.bathrooms || 0,
          area: property.area || 0,
          created_at: property.created_at,
          views: viewsCount,
          inquiries: inquiriesCount
        };
      }));

      console.log('Final formatted properties:', formattedProperties);
      setProperties(formattedProperties);
    } catch (error) {
      console.error('Error loading properties:', error);
      setProperties([]);
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
        maxCapacity: event.max_capacity || 0,
        imageUrl: event.image_url || '',
        price: event.price || 0,
        description: event.description || ''
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

  // Load all data
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
        
        // Load all data
        await Promise.all([
          loadPlatformStats(),
          loadUsers(),
          loadAgents(),
          loadProperties(),
          loadEvents(),
          loadContent(),
          loadRoles()
        ]);
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, [isAdmin]);

  return {
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
  };
}; 