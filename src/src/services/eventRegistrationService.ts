import { supabase } from '../lib/supabase';

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  registration_date: string;
  status: 'Registered' | 'Attended' | 'Cancelled' | 'No Show';
  payment_status: 'Pending' | 'Paid' | 'Refunded';
  payment_amount?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  registration?: EventRegistration;
}

export class EventRegistrationService {
  // Register for an event
  static async registerForEvent(eventId: string, userId: string): Promise<RegistrationResponse> {
    try {
      // Check if event exists and has available capacity
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('id, title, max_capacity, attendees_count, price')
        .eq('id', eventId)
        .single();

      if (eventError || !event) {
        return {
          success: false,
          message: 'Event not found'
        };
      }

      // Check if event is full
      if (event.attendees_count >= event.max_capacity) {
        return {
          success: false,
          message: 'Event is full'
        };
      }

      // Check if user is already registered
      const { data: existingRegistration } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .single();

      if (existingRegistration) {
        return {
          success: false,
          message: 'You are already registered for this event'
        };
      }

      // Create registration
      const { data: registration, error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: userId,
          payment_amount: event.price || 0
        })
        .select()
        .single();

      if (error) {
        console.error('Registration error:', error);
        return {
          success: false,
          message: 'Failed to register for event'
        };
      }

      return {
        success: true,
        message: 'Successfully registered for event',
        registration
      };
    } catch (error) {
      console.error('Registration service error:', error);
      return {
        success: false,
        message: 'An error occurred while registering'
      };
    }
  }

  // Cancel registration
  static async cancelRegistration(eventId: string, userId: string): Promise<RegistrationResponse> {
    try {
      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId);

      if (error) {
        console.error('Cancel registration error:', error);
        return {
          success: false,
          message: 'Failed to cancel registration'
        };
      }

      return {
        success: true,
        message: 'Registration cancelled successfully'
      };
    } catch (error) {
      console.error('Cancel registration service error:', error);
      return {
        success: false,
        message: 'An error occurred while cancelling registration'
      };
    }
  }

  // Check if user is registered for an event
  static async isUserRegistered(eventId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Check registration error:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Check registration service error:', error);
      return false;
    }
  }

  // Get user's registrations
  static async getUserRegistrations(userId: string): Promise<EventRegistration[]> {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          *,
          events (
            id,
            title,
            event_date,
            event_time,
            location,
            image_url
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get user registrations error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get user registrations service error:', error);
      return [];
    }
  }

  // Get event registrations (admin only)
  static async getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          *,
          profiles (
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get event registrations error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get event registrations service error:', error);
      return [];
    }
  }

  // Update registration status (admin only)
  static async updateRegistrationStatus(
    registrationId: string, 
    status: EventRegistration['status']
  ): Promise<RegistrationResponse> {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .update({ status })
        .eq('id', registrationId)
        .select()
        .single();

      if (error) {
        console.error('Update registration status error:', error);
        return {
          success: false,
          message: 'Failed to update registration status'
        };
      }

      return {
        success: true,
        message: 'Registration status updated successfully',
        registration: data
      };
    } catch (error) {
      console.error('Update registration status service error:', error);
      return {
        success: false,
        message: 'An error occurred while updating status'
      };
    }
  }
} 