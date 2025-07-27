import { supabase } from '../lib/supabase';

export interface Property {
  id: string;
  title: string;
  description?: string;
  address: string;
  city: string;
  state?: string;
  zip_code?: string;
  country: string;
  price: number;
  property_type: 'House' | 'Condo' | 'Apartment' | 'Townhouse' | 'Land' | 'Commercial' | 'Other';
  status: 'Available' | 'Sold' | 'Under Contract' | 'Off Market';
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
  lot_area_sqm?: number;
  year_built?: number;
  agent_id?: string;
  images: string[];
  amenities: string[];
  features: string[];
  created_at: string;
  updated_at: string;
}

export interface CreatePropertyData {
  title: string;
  description?: string;
  address: string;
  city: string;
  state?: string;
  zip_code?: string;
  country?: string;
  price: number;
  property_type: 'House' | 'Condo' | 'Apartment' | 'Townhouse' | 'Land' | 'Commercial' | 'Other';
  status?: 'Available' | 'Sold' | 'Under Contract' | 'Off Market';
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
  lot_area_sqm?: number;
  year_built?: number;
  agent_id?: string;
  images?: string[];
  amenities?: string[];
  features?: string[];
}

export interface UpdatePropertyData extends Partial<CreatePropertyData> {
  id: string;
}

export interface PropertyFilters {
  city?: string;
  property_type?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  status?: string;
  agent_id?: string;
}

export class PropertyService {
  // Get all properties with optional filters
  static async getProperties(filters?: PropertyFilters): Promise<Property[]> {
    let query = supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters) {
      if (filters.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }
      if (filters.property_type) {
        query = query.eq('property_type', filters.property_type);
      }
      if (filters.min_price) {
        query = query.gte('price', filters.min_price);
      }
      if (filters.max_price) {
        query = query.lte('price', filters.max_price);
      }
      if (filters.bedrooms) {
        query = query.gte('bedrooms', filters.bedrooms);
      }
      if (filters.bathrooms) {
        query = query.gte('bathrooms', filters.bathrooms);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.agent_id) {
        query = query.eq('agent_id', filters.agent_id);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching properties:', error);
      throw new Error('Failed to fetch properties');
    }

    return data || [];
  }

  // Get a single property by ID
  static async getPropertyById(id: string): Promise<Property | null> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching property:', error);
      throw new Error('Failed to fetch property');
    }

    return data;
  }

  // Create a new property
  static async createProperty(propertyData: CreatePropertyData): Promise<Property> {
    const { data, error } = await supabase
      .from('properties')
      .insert([propertyData])
      .select()
      .single();

    if (error) {
      console.error('Error creating property:', error);
      throw new Error('Failed to create property');
    }

    return data;
  }

  // Update an existing property
  static async updateProperty(propertyData: UpdatePropertyData): Promise<Property> {
    const { id, ...updateData } = propertyData;
    
    const { data, error } = await supabase
      .from('properties')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating property:', error);
      throw new Error('Failed to update property');
    }

    return data;
  }

  // Delete a property
  static async deleteProperty(id: string): Promise<void> {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting property:', error);
      throw new Error('Failed to delete property');
    }
  }

  // Get properties by agent ID
  static async getPropertiesByAgent(agentId: string): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching agent properties:', error);
      throw new Error('Failed to fetch agent properties');
    }

    return data || [];
  }

  // Get available properties (for public listing)
  static async getAvailableProperties(): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'Available')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching available properties:', error);
      throw new Error('Failed to fetch available properties');
    }

    return data || [];
  }

  // Search properties by text
  static async searchProperties(searchTerm: string): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching properties:', error);
      throw new Error('Failed to search properties');
    }

    return data || [];
  }
} 