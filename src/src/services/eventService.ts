import { Event } from '../components/EventCard';

// Mock API endpoints
const API_BASE_URL = '/api/events';

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  jobTitle?: string;
  attendeeType: 'individual' | 'corporate';
  dietaryRestrictions?: string;
  specialRequests?: string;
  paymentMethod: 'credit_card' | 'bank_transfer' | 'cash';
  agreeToTerms: boolean;
  subscribeNewsletter: boolean;
}

export interface RegistrationResponse {
  success: boolean;
  registrationId: string;
  confirmationNumber: string;
  event: Event;
  attendee: RegistrationData;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentDetails?: {
    amount: number;
    currency: string;
    transactionId?: string;
    paymentInstructions?: string;
  };
}

export interface EventsFilter {
  category?: string;
  location?: string;
  priceRange?: string;
  dateRange?: string;
  tags?: string[];
  search?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock database for registrations
let mockRegistrations: RegistrationResponse[] = [];
let registrationCounter = 1;

class EventService {
  /**
   * Register for an event
   */
  async registerForEvent(eventId: string, registrationData: RegistrationData): Promise<ApiResponse<RegistrationResponse>> {
    try {
      // Simulate API call delay
      await delay(1500 + Math.random() * 1000);

      // Simulate validation errors (5% chance)
      if (Math.random() < 0.05) {
        throw new Error('Registration failed: Email already registered for this event');
      }

      // Mock event data (in real app, fetch from database)
      const mockEvent: Event = {
        id: eventId,
        title: 'Sample Event',
        description: 'Event description',
        date: '2024-04-20',
        time: '10:00',
        location: 'Sample Location',
        address: 'Sample Address',
        category: 'Seminar',
        price: 2500,
        maxAttendees: 100,
        currentAttendees: 45,
        imageUrl: 'https://example.com/image.jpg',
        organizer: {
          name: 'Organizer Name',
          avatar: 'https://example.com/avatar.jpg',
          company: 'Company Name'
        },
        tags: ['Tag1', 'Tag2'],
        featured: false,
        status: 'Published',
        registrationDeadline: '2024-04-18'
      };

      const confirmationNumber = `EVT-${Date.now()}-${registrationCounter.toString().padStart(4, '0')}`;
      const registrationId = `reg_${registrationCounter}`;
      
      registrationCounter++;

      const registration: RegistrationResponse = {
        success: true,
        registrationId,
        confirmationNumber,
        event: mockEvent,
        attendee: registrationData,
        paymentStatus: registrationData.paymentMethod === 'cash' ? 'pending' : 'completed',
        paymentDetails: {
          amount: mockEvent.price,
          currency: 'PHP',
          transactionId: registrationData.paymentMethod !== 'cash' ? `txn_${Date.now()}` : undefined,
          paymentInstructions: this.getPaymentInstructions(registrationData.paymentMethod, mockEvent.price)
        }
      };

      mockRegistrations.push(registration);

      return {
        data: registration,
        message: 'Registration successful',
        status: 200
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  }

  /**
   * Get user's event registrations
   */
  async getUserRegistrations(userEmail: string): Promise<ApiResponse<RegistrationResponse[]>> {
    try {
      await delay(800);

      const userRegistrations = mockRegistrations.filter(
        reg => reg.attendee.email === userEmail
      );

      return {
        data: userRegistrations,
        message: 'Registrations retrieved successfully',
        status: 200
      };
    } catch (error) {
      throw new Error('Failed to fetch registrations');
    }
  }

  /**
   * Cancel event registration
   */
  async cancelRegistration(registrationId: string): Promise<ApiResponse<{ cancelled: boolean }>> {
    try {
      await delay(1000);

      const registrationIndex = mockRegistrations.findIndex(
        reg => reg.registrationId === registrationId
      );

      if (registrationIndex === -1) {
        throw new Error('Registration not found');
      }

      // Simulate cancellation policy (can't cancel within 24 hours)
      const eventDate = new Date(mockRegistrations[registrationIndex].event.date);
      const now = new Date();
      const hoursUntilEvent = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursUntilEvent < 24) {
        throw new Error('Cannot cancel registration within 24 hours of event');
      }

      mockRegistrations.splice(registrationIndex, 1);

      return {
        data: { cancelled: true },
        message: 'Registration cancelled successfully',
        status: 200
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Cancellation failed');
    }
  }

  /**
   * Get event details
   */
  async getEventDetails(eventId: string): Promise<ApiResponse<Event>> {
    try {
      await delay(500);

      // Mock event details (in real app, fetch from database)
      const mockEvent: Event = {
        id: eventId,
        title: 'Metro Manila Property Expo 2024',
        description: 'The largest real estate exhibition in the Philippines featuring top developers, latest projects, and exclusive deals.',
        date: '2024-04-20',
        time: '10:00',
        endTime: '18:00',
        location: 'SMX Convention Center',
        address: 'SMX Convention Center, Mall of Asia Complex, Pasay City',
        category: 'Expo',
        price: 0,
        maxAttendees: 500,
        currentAttendees: 245,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        organizer: {
          name: 'Philippine Real Estate Association',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          company: 'PREA'
        },
        tags: ['Real Estate', 'Investment', 'Property', 'Networking'],
        featured: true,
        status: 'Published',
        registrationDeadline: '2024-04-18',
        requirements: [
          'Valid government-issued ID',
          'Business card (for corporate attendees)',
          'Confirmation email'
        ]
      };

      return {
        data: mockEvent,
        message: 'Event details retrieved successfully',
        status: 200
      };
    } catch (error) {
      throw new Error('Failed to fetch event details');
    }
  }

  /**
   * Get filtered events
   */
  async getEvents(filters: EventsFilter = {}): Promise<ApiResponse<Event[]>> {
    try {
      await delay(600);

      // Mock events data (in real app, fetch from database with filters)
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Metro Manila Property Expo 2024',
          description: 'The largest real estate exhibition in the Philippines featuring top developers, latest projects, and exclusive deals.',
          date: '2024-04-20',
          time: '10:00',
          endTime: '18:00',
          location: 'SMX Convention Center',
          address: 'SMX Convention Center, Mall of Asia Complex, Pasay City',
          category: 'Expo',
          price: 0,
          maxAttendees: 500,
          currentAttendees: 245,
          imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          organizer: {
            name: 'Philippine Real Estate Association',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            company: 'PREA'
          },
          tags: ['Real Estate', 'Investment', 'Property', 'Networking'],
          featured: true,
          status: 'Published',
          registrationDeadline: '2024-04-18'
        },
        // Add more mock events as needed
      ];

      // Apply filters (simplified mock implementation)
      let filteredEvents = mockEvents;

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredEvents = filteredEvents.filter(event =>
          event.title.toLowerCase().includes(searchTerm) ||
          event.description.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.category && filters.category !== 'all') {
        filteredEvents = filteredEvents.filter(event => event.category === filters.category);
      }

      if (filters.location && filters.location !== 'all') {
        filteredEvents = filteredEvents.filter(event => event.location === filters.location);
      }

      return {
        data: filteredEvents,
        message: 'Events retrieved successfully',
        status: 200
      };
    } catch (error) {
      throw new Error('Failed to fetch events');
    }
  }

  /**
   * Check if user is registered for an event
   */
  async isUserRegistered(eventId: string, userEmail: string): Promise<ApiResponse<{ isRegistered: boolean; registration?: RegistrationResponse }>> {
    try {
      await delay(300);

      const registration = mockRegistrations.find(
        reg => reg.event.id === eventId && reg.attendee.email === userEmail
      );

      return {
        data: {
          isRegistered: !!registration,
          registration
        },
        message: 'Registration status checked',
        status: 200
      };
    } catch (error) {
      throw new Error('Failed to check registration status');
    }
  }

  /**
   * Send confirmation email
   */
  async sendConfirmationEmail(registrationId: string): Promise<ApiResponse<{ sent: boolean }>> {
    try {
      await delay(1000);

      // Simulate email sending
      const registration = mockRegistrations.find(reg => reg.registrationId === registrationId);
      
      if (!registration) {
        throw new Error('Registration not found');
      }

      // Mock email content generation
      console.log(`Sending confirmation email to ${registration.attendee.email}`);

      return {
        data: { sent: true },
        message: 'Confirmation email sent successfully',
        status: 200
      };
    } catch (error) {
      throw new Error('Failed to send confirmation email');
    }
  }

  /**
   * Generate payment instructions based on method
   */
  private getPaymentInstructions(paymentMethod: string, amount: number): string {
    switch (paymentMethod) {
      case 'credit_card':
        return 'Payment processed via credit card. Transaction confirmation will be sent to your email.';
      case 'bank_transfer':
        return `Please transfer ₱${amount.toLocaleString()} to:\nBank: BDO Unibank\nAccount: 1234567890\nAccount Name: Event Management Inc.\nPlease use confirmation number as reference.`;
      case 'cash':
        return `Please bring ₱${amount.toLocaleString()} in cash to the event venue. Payment can be made at the registration desk.`;
      default:
        return 'Payment instructions will be provided separately.';
    }
  }

  /**
   * Validate registration data
   */
  validateRegistrationData(data: RegistrationData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.firstName.trim()) errors.push('First name is required');
    if (!data.lastName.trim()) errors.push('Last name is required');
    if (!data.email.trim()) errors.push('Email is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Invalid email format');
    if (!data.phone.trim()) errors.push('Phone number is required');
    if (data.attendeeType === 'corporate' && !data.company?.trim()) {
      errors.push('Company name is required for corporate registration');
    }
    if (!data.agreeToTerms) errors.push('You must agree to the terms and conditions');

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const eventService = new EventService();

// Export additional types for use in components 