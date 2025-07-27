import { supabase } from '../lib/supabase';

export interface Inquiry {
  id: string;
  property_id: string;
  user_id: string;
  agent_id?: string;
  message: string;
  status: 'New' | 'In Progress' | 'Responded' | 'Closed';
  created_at: string;
  updated_at: string;
}

export interface CreateInquiryData {
  property_id: string;
  user_id: string;
  agent_id?: string;
  message: string;
  status?: 'New' | 'In Progress' | 'Responded' | 'Closed';
}

export interface UpdateInquiryData extends Partial<CreateInquiryData> {
  id: string;
}

export interface InquiryWithProperty extends Inquiry {
  property: {
    id: string;
    title: string;
    address: string;
    city: string;
    price: number;
    images: string[];
  };
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  agent?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export class InquiryService {
  // Get all inquiries with optional filters
  static async getInquiries(filters?: {
    property_id?: string;
    user_id?: string;
    agent_id?: string;
    status?: string;
  }): Promise<Inquiry[]> {
    let query = supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters) {
      if (filters.property_id) {
        query = query.eq('property_id', filters.property_id);
      }
      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      if (filters.agent_id) {
        query = query.eq('agent_id', filters.agent_id);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching inquiries:', error);
      throw new Error('Failed to fetch inquiries');
    }

    return data || [];
  }

  // Get inquiries with related data (property, user, agent)
  static async getInquiriesWithDetails(filters?: {
    property_id?: string;
    user_id?: string;
    agent_id?: string;
    status?: string;
  }): Promise<InquiryWithProperty[]> {
    let query = supabase
      .from('inquiries')
      .select(`
        *,
        property:properties(id, title, address, city, price, images),
        user:profiles!inquiries_user_id_fkey(id, first_name, last_name, email),
        agent:profiles!inquiries_agent_id_fkey(id, first_name, last_name, email)
      `)
      .order('created_at', { ascending: false });

    if (filters) {
      if (filters.property_id) {
        query = query.eq('property_id', filters.property_id);
      }
      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      if (filters.agent_id) {
        query = query.eq('agent_id', filters.agent_id);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching inquiries with details:', error);
      throw new Error('Failed to fetch inquiries');
    }

    return data || [];
  }

  // Get a single inquiry by ID
  static async getInquiryById(id: string): Promise<Inquiry | null> {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching inquiry:', error);
      throw new Error('Failed to fetch inquiry');
    }

    return data;
  }

  // Create a new inquiry
  static async createInquiry(inquiryData: CreateInquiryData): Promise<Inquiry> {
    const { data, error } = await supabase
      .from('inquiries')
      .insert([inquiryData])
      .select()
      .single();

    if (error) {
      console.error('Error creating inquiry:', error);
      throw new Error('Failed to create inquiry');
    }

    return data;
  }

  // Update an existing inquiry
  static async updateInquiry(inquiryData: UpdateInquiryData): Promise<Inquiry> {
    const { id, ...updateData } = inquiryData;
    
    const { data, error } = await supabase
      .from('inquiries')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating inquiry:', error);
      throw new Error('Failed to update inquiry');
    }

    return data;
  }

  // Delete an inquiry
  static async deleteInquiry(id: string): Promise<void> {
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting inquiry:', error);
      throw new Error('Failed to delete inquiry');
    }
  }

  // Get inquiries for a specific property
  static async getInquiriesByProperty(propertyId: string): Promise<InquiryWithProperty[]> {
    return this.getInquiriesWithDetails({ property_id: propertyId });
  }

  // Get inquiries for a specific user
  static async getInquiriesByUser(userId: string): Promise<InquiryWithProperty[]> {
    return this.getInquiriesWithDetails({ user_id: userId });
  }

  // Get inquiries for a specific agent
  static async getInquiriesByAgent(agentId: string): Promise<InquiryWithProperty[]> {
    return this.getInquiriesWithDetails({ agent_id: agentId });
  }

  // Update inquiry status
  static async updateInquiryStatus(id: string, status: Inquiry['status']): Promise<Inquiry> {
    const { data, error } = await supabase
      .from('inquiries')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating inquiry status:', error);
      throw new Error('Failed to update inquiry status');
    }

    return data;
  }

  // Get inquiry statistics
  static async getInquiryStats(agentId?: string): Promise<{
    total: number;
    new: number;
    inProgress: number;
    responded: number;
    closed: number;
  }> {
    let query = supabase
      .from('inquiries')
      .select('status');

    if (agentId) {
      query = query.eq('agent_id', agentId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching inquiry stats:', error);
      throw new Error('Failed to fetch inquiry statistics');
    }

    const inquiries = data || [];
    const stats = {
      total: inquiries.length,
      new: inquiries.filter(i => i.status === 'New').length,
      inProgress: inquiries.filter(i => i.status === 'In Progress').length,
      responded: inquiries.filter(i => i.status === 'Responded').length,
      closed: inquiries.filter(i => i.status === 'Closed').length,
    };

    return stats;
  }
} 