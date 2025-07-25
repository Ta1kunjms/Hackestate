// Newsletter Service - Mock implementation that can be easily swapped with real providers

export interface NewsletterSubscription {
  email: string;
  firstName: string;
  lastName?: string;
  interests?: string[];
  source?: string;
  subscriptionDate?: string;
  status?: 'active' | 'pending' | 'unsubscribed';
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
  subscriptionId?: string;
  data?: NewsletterSubscription;
}

export interface NewsletterProviderConfig {
  apiKey: string;
  listId?: string;
  endpoint?: string;
  provider: 'mailchimp' | 'resend' | 'sendgrid' | 'convertkit' | 'mock';
}

// Mock storage for development
let mockSubscriptions: NewsletterSubscription[] = [];

class NewsletterService {
  private config: NewsletterProviderConfig;

  constructor(config: NewsletterProviderConfig) {
    this.config = config;
  }

  /**
   * Subscribe a user to the newsletter
   */
  async subscribe(subscription: Omit<NewsletterSubscription, 'subscriptionDate' | 'status'>): Promise<NewsletterResponse> {
    try {
      // Input validation
      if (!subscription.email || !this.isValidEmail(subscription.email)) {
        return {
          success: false,
          message: 'Please provide a valid email address.'
        };
      }

      if (!subscription.firstName?.trim()) {
        return {
          success: false,
          message: 'First name is required.'
        };
      }

      // Check if already subscribed
      const existingSubscription = await this.checkSubscription(subscription.email);
      if (existingSubscription.isSubscribed) {
        return {
          success: false,
          message: 'This email is already subscribed to our newsletter.'
        };
      }

      // Route to appropriate provider
      switch (this.config.provider) {
        case 'mailchimp':
          return await this.subscribeToMailchimp(subscription);
        case 'resend':
          return await this.subscribeToResend(subscription);
        case 'sendgrid':
          return await this.subscribeToSendgrid(subscription);
        case 'convertkit':
          return await this.subscribeToConvertKit(subscription);
        case 'mock':
        default:
          return await this.subscribeToMock(subscription);
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      return {
        success: false,
        message: 'Failed to subscribe. Please try again later.'
      };
    }
  }

  /**
   * Unsubscribe a user from the newsletter
   */
  async unsubscribe(email: string): Promise<NewsletterResponse> {
    try {
      // Route to appropriate provider
      switch (this.config.provider) {
        case 'mailchimp':
          return await this.unsubscribeFromMailchimp(email);
        case 'resend':
          return await this.unsubscribeFromResend(email);
        case 'sendgrid':
          return await this.unsubscribeFromSendgrid(email);
        case 'convertkit':
          return await this.unsubscribeFromConvertKit(email);
        case 'mock':
        default:
          return await this.unsubscribeFromMock(email);
      }
    } catch (error) {
      console.error('Newsletter unsubscribe error:', error);
      return {
        success: false,
        message: 'Failed to unsubscribe. Please try again later.'
      };
    }
  }

  /**
   * Check if an email is subscribed
   */
  async checkSubscription(email: string): Promise<{ isSubscribed: boolean; subscription?: NewsletterSubscription }> {
    try {
      switch (this.config.provider) {
        case 'mock':
        default:
          const subscription = mockSubscriptions.find(sub => 
            sub.email.toLowerCase() === email.toLowerCase() && sub.status === 'active'
          );
          return {
            isSubscribed: !!subscription,
            subscription
          };
      }
    } catch (error) {
      console.error('Check subscription error:', error);
      return { isSubscribed: false };
    }
  }

  /**
   * Get subscription statistics
   */
  async getStats(): Promise<{
    totalSubscribers: number;
    activeSubscribers: number;
    recentSubscriptions: number;
    topInterests: { interest: string; count: number; }[];
  }> {
    try {
      switch (this.config.provider) {
        case 'mock':
        default:
          const activeSubscriptions = mockSubscriptions.filter(sub => sub.status === 'active');
          const recentSubscriptions = mockSubscriptions.filter(sub => {
            const subDate = new Date(sub.subscriptionDate || '');
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return subDate >= weekAgo && sub.status === 'active';
          });

          // Calculate top interests
          const interestCounts: { [key: string]: number } = {};
          activeSubscriptions.forEach(sub => {
            sub.interests?.forEach(interest => {
              interestCounts[interest] = (interestCounts[interest] || 0) + 1;
            });
          });

          const topInterests = Object.entries(interestCounts)
            .map(([interest, count]) => ({ interest, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

          return {
            totalSubscribers: mockSubscriptions.length,
            activeSubscribers: activeSubscriptions.length,
            recentSubscriptions: recentSubscriptions.length,
            topInterests
          };
      }
    } catch (error) {
      console.error('Get stats error:', error);
      return {
        totalSubscribers: 0,
        activeSubscribers: 0,
        recentSubscriptions: 0,
        topInterests: []
      };
    }
  }

  // Provider-specific implementations
  
  /**
   * Mailchimp integration
   */
  private async subscribeToMailchimp(subscription: Omit<NewsletterSubscription, 'subscriptionDate' | 'status'>): Promise<NewsletterResponse> {
    // Mock Mailchimp API call
    await this.simulateAPICall();

    const mailchimpData = {
      email_address: subscription.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: subscription.firstName,
        LNAME: subscription.lastName || '',
        INTERESTS: subscription.interests?.join(', ') || ''
      },
      tags: subscription.interests || []
    };

    // In a real implementation, you would make an API call to Mailchimp:
    // const response = await fetch(`https://${datacenter}.api.mailchimp.com/3.0/lists/${this.config.listId}/members`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${this.config.apiKey}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(mailchimpData)
    // });

    return {
      success: true,
      message: 'Successfully subscribed to our newsletter!',
      subscriptionId: `mc_${Date.now()}`,
      data: {
        ...subscription,
        subscriptionDate: new Date().toISOString(),
        status: 'active'
      }
    };
  }

  /**
   * Resend integration
   */
  private async subscribeToResend(subscription: Omit<NewsletterSubscription, 'subscriptionDate' | 'status'>): Promise<NewsletterResponse> {
    // Mock Resend API call
    await this.simulateAPICall();

    const resendData = {
      email: subscription.email,
      first_name: subscription.firstName,
      last_name: subscription.lastName,
      interests: subscription.interests
    };

    // In a real implementation, you would make an API call to Resend:
    // const response = await fetch(`https://api.resend.com/audiences/${this.config.listId}/contacts`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${this.config.apiKey}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(resendData)
    // });

    return {
      success: true,
      message: 'Successfully subscribed to our newsletter!',
      subscriptionId: `resend_${Date.now()}`,
      data: {
        ...subscription,
        subscriptionDate: new Date().toISOString(),
        status: 'active'
      }
    };
  }

  /**
   * SendGrid integration
   */
  private async subscribeToSendgrid(subscription: Omit<NewsletterSubscription, 'subscriptionDate' | 'status'>): Promise<NewsletterResponse> {
    // Mock SendGrid API call
    await this.simulateAPICall();

    // In a real implementation, you would use SendGrid Marketing Campaigns API
    return {
      success: true,
      message: 'Successfully subscribed to our newsletter!',
      subscriptionId: `sg_${Date.now()}`,
      data: {
        ...subscription,
        subscriptionDate: new Date().toISOString(),
        status: 'active'
      }
    };
  }

  /**
   * ConvertKit integration
   */
  private async subscribeToConvertKit(subscription: Omit<NewsletterSubscription, 'subscriptionDate' | 'status'>): Promise<NewsletterResponse> {
    // Mock ConvertKit API call
    await this.simulateAPICall();

    // In a real implementation, you would use ConvertKit API
    return {
      success: true,
      message: 'Successfully subscribed to our newsletter!',
      subscriptionId: `ck_${Date.now()}`,
      data: {
        ...subscription,
        subscriptionDate: new Date().toISOString(),
        status: 'active'
      }
    };
  }

  /**
   * Mock implementation for development
   */
  private async subscribeToMock(subscription: Omit<NewsletterSubscription, 'subscriptionDate' | 'status'>): Promise<NewsletterResponse> {
    // Simulate API delay
    await this.simulateAPICall();

    // Simulate occasional failures for testing
    if (Math.random() < 0.05) {
      throw new Error('Simulated API error');
    }

    const newSubscription: NewsletterSubscription = {
      ...subscription,
      subscriptionDate: new Date().toISOString(),
      status: 'active'
    };

    mockSubscriptions.push(newSubscription);

    return {
      success: true,
      message: 'Successfully subscribed to our newsletter!',
      subscriptionId: `mock_${Date.now()}`,
      data: newSubscription
    };
  }

  // Unsubscribe implementations
  private async unsubscribeFromMailchimp(email: string): Promise<NewsletterResponse> {
    await this.simulateAPICall();
    return { success: true, message: 'Successfully unsubscribed from newsletter.' };
  }

  private async unsubscribeFromResend(email: string): Promise<NewsletterResponse> {
    await this.simulateAPICall();
    return { success: true, message: 'Successfully unsubscribed from newsletter.' };
  }

  private async unsubscribeFromSendgrid(email: string): Promise<NewsletterResponse> {
    await this.simulateAPICall();
    return { success: true, message: 'Successfully unsubscribed from newsletter.' };
  }

  private async unsubscribeFromConvertKit(email: string): Promise<NewsletterResponse> {
    await this.simulateAPICall();
    return { success: true, message: 'Successfully unsubscribed from newsletter.' };
  }

  private async unsubscribeFromMock(email: string): Promise<NewsletterResponse> {
    await this.simulateAPICall();
    
    const subscriptionIndex = mockSubscriptions.findIndex(
      sub => sub.email.toLowerCase() === email.toLowerCase()
    );
    
    if (subscriptionIndex !== -1) {
      mockSubscriptions[subscriptionIndex].status = 'unsubscribed';
    }
    
    return { success: true, message: 'Successfully unsubscribed from newsletter.' };
  }

  // Utility methods
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private async simulateAPICall(minDelay = 500, maxDelay = 1500): Promise<void> {
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Send welcome email (would integrate with email service)
   */
  async sendWelcomeEmail(subscription: NewsletterSubscription): Promise<{ sent: boolean; error?: string }> {
    try {
      await this.simulateAPICall();
      
      // In a real implementation, you would send an email using your email service
      console.log('Welcome email sent to:', subscription.email);
      
      return { sent: true };
    } catch (error) {
      return { 
        sent: false, 
        error: error instanceof Error ? error.message : 'Failed to send welcome email' 
      };
    }
  }

  /**
   * Update subscription preferences
   */
  async updateSubscription(email: string, updates: Partial<NewsletterSubscription>): Promise<NewsletterResponse> {
    try {
      switch (this.config.provider) {
        case 'mock':
        default:
          const subscriptionIndex = mockSubscriptions.findIndex(
            sub => sub.email.toLowerCase() === email.toLowerCase()
          );
          
          if (subscriptionIndex === -1) {
            return {
              success: false,
              message: 'Subscription not found.'
            };
          }
          
          mockSubscriptions[subscriptionIndex] = {
            ...mockSubscriptions[subscriptionIndex],
            ...updates
          };
          
          return {
            success: true,
            message: 'Subscription updated successfully.',
            data: mockSubscriptions[subscriptionIndex]
          };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update subscription.'
      };
    }
  }
}

// Factory function to create newsletter service with different providers
export const createNewsletterService = (config: NewsletterProviderConfig): NewsletterService => {
  return new NewsletterService(config);
};

// Default configuration for development
const defaultConfig: NewsletterProviderConfig = {
  apiKey: process.env.REACT_APP_NEWSLETTER_API_KEY || 'mock-api-key',
  listId: process.env.REACT_APP_NEWSLETTER_LIST_ID || 'mock-list-id',
  provider: (process.env.REACT_APP_NEWSLETTER_PROVIDER as any) || 'mock'
};

// Export singleton instance for easy use
export const newsletterService = createNewsletterService(defaultConfig); 