import React, { useState } from 'react';
import { 
  NewspaperIcon,
  EnvelopeIcon,
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BookOpenIcon,
  ChartBarIcon as TrendingUpIcon,
  UserGroupIcon,
  LightBulbIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import Layout from '../components/layout/Layout';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Button, Input, FormField } from '../components/ui';
import { newsletterService } from '../services/newsletterService';

interface NewsletterFormData {
  email: string;
  firstName: string;
  interests: string[];
}

interface BlogPreview {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  publishDate: string;
  author: {
    name: string;
    avatar: string;
  };
  imageUrl: string;
  featured: boolean;
}

// Mock upcoming blog content
const upcomingContent: BlogPreview[] = [
  {
    id: '1',
    title: 'Philippine Real Estate Market Outlook 2024',
    description: 'Comprehensive analysis of market trends, price predictions, and investment opportunities in the Philippine real estate sector.',
    category: 'Market Analysis',
    readTime: '8 min read',
    publishDate: 'Coming March 2024',
    author: {
      name: 'Carlos Mendoza',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    imageUrl: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: '2',
    title: 'First-Time Buyer\'s Complete Guide',
    description: 'Everything you need to know about buying your first property in the Philippines, from financing to legal requirements.',
    category: 'Buying Guide',
    readTime: '12 min read',
    publishDate: 'Coming March 2024',
    author: {
      name: 'Maria Santos',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: '3',
    title: 'Smart Home Technology Trends',
    description: 'How modern technology is transforming real estate and what buyers should look for in smart-enabled properties.',
    category: 'Technology',
    readTime: '6 min read',
    publishDate: 'Coming April 2024',
    author: {
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: '4',
    title: 'Sustainable Living and Green Buildings',
    description: 'The rise of eco-friendly construction and how sustainable features impact property values and livability.',
    category: 'Sustainability',
    readTime: '10 min read',
    publishDate: 'Coming April 2024',
    author: {
      name: 'Ana Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    imageUrl: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false
  }
];

const BlogTeaserPage: React.FC = () => {
  const [formData, setFormData] = useState<NewsletterFormData>({
    email: '',
    firstName: '',
    interests: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const interestOptions = [
    'Market Analysis',
    'Buying Guides',
    'Investment Tips',
    'Technology Trends',
    'Legal Insights',
    'Design & Architecture',
    'Sustainability',
    'Market News'
  ];

  const handleInputChange = (field: keyof NewsletterFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (subscriptionStatus === 'error') {
      setSubscriptionStatus('idle');
      setErrorMessage('');
    }
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setErrorMessage('Email address is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    if (!formData.firstName.trim()) {
      setErrorMessage('First name is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubscriptionStatus('error');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await newsletterService.subscribe({
        email: formData.email,
        firstName: formData.firstName,
        interests: formData.interests,
        source: 'blog_teaser_page'
      });

      if (response.success) {
        setSubscriptionStatus('success');
        setFormData({ email: '', firstName: '', interests: [] });
        
        // Send welcome email if available
        if (response.data) {
          await newsletterService.sendWelcomeEmail(response.data);
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setSubscriptionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Market Analysis':
        return 'bg-blue-100 text-blue-800';
      case 'Buying Guide':
        return 'bg-green-100 text-green-800';
      case 'Technology':
        return 'bg-purple-100 text-purple-800';
      case 'Sustainability':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 bg-gradient-to-br from-orange-500 to-orange-600 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              {/* Coming Soon Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                <SparklesIcon className="w-4 h-4 mr-2" />
                Coming Soon
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Real Estate <span className="text-orange-200">Insights</span> Blog
              </h1>
              
              <p className="text-xl lg:text-2xl text-orange-100 mb-8 leading-relaxed">
                Expert advice, market analysis, and insider tips to help you navigate 
                the Philippine real estate market with confidence.
              </p>

              {/* Launch Timeline */}
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-center text-white mb-4">
                  <ClockIcon className="w-6 h-6 mr-3" />
                  <span className="text-lg font-semibold">Launching March 2024</span>
                </div>
                <p className="text-orange-100 text-sm">
                  Be the first to access our comprehensive real estate content library
                </p>
              </div>

              {/* Stats Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center">
                  <BookOpenIcon className="w-8 h-8 text-orange-200 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">50+</div>
                  <div className="text-orange-100 text-sm">Expert Articles</div>
                </div>
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center">
                  <TrendingUpIcon className="w-8 h-8 text-orange-200 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">Weekly</div>
                  <div className="text-orange-100 text-sm">Market Updates</div>
                </div>
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center">
                  <UserGroupIcon className="w-8 h-8 text-orange-200 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">Expert</div>
                  <div className="text-orange-100 text-sm">Contributors</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-4">
                <EnvelopeIcon className="w-4 h-4 mr-2" />
                Early Access
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Get Notified When We Launch
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join our exclusive newsletter and be the first to access expert insights, 
                market reports, and actionable real estate advice.
              </p>
            </div>

            {subscriptionStatus === 'success' ? (
              <div className="max-w-md mx-auto text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircleIcon className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">You're All Set!</h3>
                <p className="text-gray-600 mb-6">
                  Thank you for subscribing! We'll notify you as soon as our blog launches 
                  with exclusive content tailored to your interests.
                </p>
                <Button
                  onClick={() => setSubscriptionStatus('idle')}
                  variant="outlined"
                  className="!border-orange-500 !text-orange-500 hover:!bg-orange-500 hover:!text-white"
                >
                  Subscribe Another Email
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className="bg-gray-50 rounded-2xl p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <FormField
                      label="First Name"
                      required
                      error={subscriptionStatus === 'error' && !formData.firstName ? 'First name is required' : undefined}
                    >
                      <Input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Enter your first name"
                        variant={subscriptionStatus === 'error' && !formData.firstName ? 'error' : 'default'}
                        leftIcon={<UserGroupIcon className="w-4 h-4" />}
                      />
                    </FormField>

                    <FormField
                      label="Email Address"
                      required
                      error={subscriptionStatus === 'error' && errorMessage.includes('email') ? errorMessage : undefined}
                    >
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email address"
                        variant={subscriptionStatus === 'error' && errorMessage.includes('email') ? 'error' : 'default'}
                        leftIcon={<EnvelopeIcon className="w-4 h-4" />}
                      />
                    </FormField>
                  </div>

                  {/* Interest Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      What topics interest you most? <span className="text-gray-500">(Optional)</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {interestOptions.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => handleInterestToggle(interest)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            formData.interests.includes(interest)
                              ? 'bg-orange-500 text-white shadow-sm'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Error Message */}
                  {subscriptionStatus === 'error' && errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-sm text-red-700">{errorMessage}</span>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full !bg-orange-500 hover:!bg-orange-600 !text-white !py-4 !text-lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Subscribing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <EnvelopeIcon className="w-5 h-5 mr-2" />
                        Get Early Access
                      </div>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    By subscribing, you agree to receive our newsletter. You can unsubscribe at any time.
                  </p>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Coming Soon Content Preview */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium mb-4">
                <LightBulbIcon className="w-4 h-4 mr-2" />
                Coming Soon
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                What to Expect
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get a sneak peek at the expert content we're preparing for you
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Featured Article */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      <img
                        src={upcomingContent[0].imageUrl}
                        alt={upcomingContent[0].title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-1/2 p-8">
                      <div className="flex items-center mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(upcomingContent[0].category)}`}>
                          {upcomingContent[0].category}
                        </span>
                        <span className="ml-3 text-xs text-orange-500 font-medium">Featured</span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {upcomingContent[0].title}
                      </h3>
                      
                      <p className="text-gray-600 mb-6">
                        {upcomingContent[0].description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={upcomingContent[0].author.avatar}
                            alt={upcomingContent[0].author.name}
                            className="w-8 h-8 rounded-full object-cover mr-3"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{upcomingContent[0].author.name}</p>
                            <p className="text-xs text-gray-500">{upcomingContent[0].readTime}</p>
                          </div>
                        </div>
                        <span className="text-sm text-orange-600 font-medium">
                          {upcomingContent[0].publishDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Articles */}
              {upcomingContent.slice(1).map((article) => (
                <div key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={article.author.avatar}
                          alt={article.author.name}
                          className="w-6 h-6 rounded-full object-cover mr-2"
                        />
                        <span className="text-xs text-gray-500">{article.author.name}</span>
                      </div>
                      <span className="text-xs text-orange-600 font-medium">
                        {article.publishDate}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Why Subscribe?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get exclusive access to premium content and expert insights
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
                  <NewspaperIcon className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Analysis</h3>
                <p className="text-gray-600">
                  In-depth market analysis from industry professionals with years of experience in Philippine real estate.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <TrendingUpIcon className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Market Insights</h3>
                <p className="text-gray-600">
                  Stay ahead of market trends with weekly updates on prices, opportunities, and emerging areas.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                  <LightBulbIcon className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Actionable Tips</h3>
                <p className="text-gray-600">
                  Practical advice you can implement immediately, from buying strategies to investment planning.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Become a Real Estate Expert?
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Join thousands of subscribers who will get early access to our comprehensive real estate blog.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => document.getElementById('newsletter-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="!bg-white !text-orange-600 hover:!bg-orange-50 !font-semibold !px-8 !py-4"
              >
                <EnvelopeIcon className="w-5 h-5 mr-2" />
                Subscribe Now
              </Button>
              <Button
                onClick={() => window.location.href = '/events'}
                variant="outlined"
                className="!border-white !text-white hover:!bg-white hover:!text-orange-600 !font-semibold !px-8 !py-4"
              >
                <ArrowRightIcon className="w-5 h-5 mr-2" />
                View Events
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </Layout>
  );
};

export default BlogTeaserPage; 