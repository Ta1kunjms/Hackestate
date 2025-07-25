import React, { useState } from 'react';
import { 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import Layout from '../components/layout/Layout';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Button, Input, Select, Textarea, FormField } from '../components/ui';

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  inquiryType: string;
  propertyType: string;
  budget: string;
  timeline: string;
  message: string;
  preferredContact: string;
  agreeToTerms: boolean;
}

interface ContactFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  inquiryType?: string;
  message?: string;
  agreeToTerms?: string;
}

interface OfficeLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  isMain: boolean;
}

interface ContactInfo {
  type: 'phone' | 'email' | 'address' | 'hours';
  icon: React.ComponentType<any>;
  title: string;
  primary: string;
  secondary?: string;
  action?: string;
}

// Mock office locations
const officeLocations: OfficeLocation[] = [
  {
    id: 'makati',
    name: 'Makati Business District',
    address: '123 Ayala Avenue, Makati City',
    city: 'Metro Manila',
    phone: '+63 2 8123 4567',
    email: 'makati@realestate.ph',
    hours: {
      weekdays: '9:00 AM - 7:00 PM',
      saturday: '9:00 AM - 5:00 PM',
      sunday: 'Closed'
    },
    coordinates: { lat: 14.5547, lng: 121.0244 },
    isMain: true
  },
  {
    id: 'bgc',
    name: 'Bonifacio Global City',
    address: '456 26th Street, BGC, Taguig',
    city: 'Metro Manila',
    phone: '+63 2 8234 5678',
    email: 'bgc@realestate.ph',
    hours: {
      weekdays: '9:00 AM - 6:00 PM',
      saturday: '10:00 AM - 4:00 PM',
      sunday: 'Closed'
    },
    coordinates: { lat: 14.5515, lng: 121.0498 },
    isMain: false
  },
  {
    id: 'ortigas',
    name: 'Ortigas Center',
    address: '789 Emerald Avenue, Pasig City',
    city: 'Metro Manila',
    phone: '+63 2 8345 6789',
    email: 'ortigas@realestate.ph',
    hours: {
      weekdays: '9:00 AM - 6:00 PM',
      saturday: '10:00 AM - 3:00 PM',
      sunday: 'Closed'
    },
    coordinates: { lat: 14.5832, lng: 121.0610 },
    isMain: false
  }
];

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    inquiryType: '',
    propertyType: '',
    budget: '',
    timeline: '',
    message: '',
    preferredContact: 'email',
    agreeToTerms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<any>({});
  const [selectedOffice, setSelectedOffice] = useState<string>(officeLocations[0].id);

  // Contact information data
  const contactInfo: ContactInfo[] = [
    {
      type: 'phone',
      icon: PhoneIcon,
      title: 'Phone',
      primary: '+63 2 8123 4567',
      secondary: 'Mon-Fri 9AM-7PM',
      action: 'tel:+6281234567'
    },
    {
      type: 'email',
      icon: EnvelopeIcon,
      title: 'Email',
      primary: 'hello@realestate.ph',
      secondary: 'We reply within 24 hours',
      action: 'mailto:hello@realestate.ph'
    },
    {
      type: 'address',
      icon: MapPinIcon,
      title: 'Main Office',
      primary: '123 Ayala Avenue',
      secondary: 'Makati City, Metro Manila'
    },
    {
      type: 'hours',
      icon: ClockIcon,
      title: 'Business Hours',
      primary: 'Mon-Fri: 9AM-7PM',
      secondary: 'Sat: 9AM-5PM, Sun: Closed'
    }
  ];

  const inquiryTypes = [
    'General Inquiry',
    'Buy Property',
    'Sell Property',
    'Rent Property',
    'Property Investment',
    'Property Management',
    'Market Analysis',
    'Schedule Viewing',
    'Partnership Opportunity',
    'Media Inquiry'
  ];

  const propertyTypes = [
    'Residential House',
    'Condominium',
    'Townhouse',
    'Lot/Land',
    'Commercial Building',
    'Office Space',
    'Retail Space',
    'Warehouse',
    'Mixed-Use Development'
  ];

  const budgetRanges = [
    'Under ₱1M',
    '₱1M - ₱3M',
    '₱3M - ₱5M',
    '₱5M - ₱10M',
    '₱10M - ₱20M',
    '₱20M - ₱50M',
    'Above ₱50M'
  ];

  const timelineOptions = [
    'Immediately',
    'Within 1 month',
    'Within 3 months',
    'Within 6 months',
    'Within 1 year',
    'No specific timeline'
  ];

  // Handle form input changes
  const handleInputChange = (field: keyof ContactForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.inquiryType) newErrors.inquiryType = 'Please select an inquiry type';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success (95% success rate)
      if (Math.random() > 0.05) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          inquiryType: '',
          propertyType: '',
          budget: '',
          timeline: '',
          message: '',
          preferredContact: 'email',
          agreeToTerms: false
        });
      } else {
        throw new Error('Service temporarily unavailable. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrors({ message: error instanceof Error ? error.message : 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedOfficeData = officeLocations.find(office => office.id === selectedOffice) || officeLocations[0];

  return (
    <Layout>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Get in Touch
              </h1>
              <p className="text-xl lg:text-2xl text-orange-100 max-w-3xl mx-auto">
                Have questions about real estate? Our expert team is here to help you find 
                the perfect property or answer any questions you may have.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
                  <div className="w-12 h-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <info.icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                  {info.action ? (
                    <a 
                      href={info.action}
                      className="text-orange-600 hover:text-orange-700 font-medium block mb-1"
                    >
                      {info.primary}
                    </a>
                  ) : (
                    <p className="text-gray-900 font-medium mb-1">{info.primary}</p>
                  )}
                  {info.secondary && (
                    <p className="text-sm text-gray-600">{info.secondary}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                    <p className="text-gray-600">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                  </div>

                  {submitStatus === 'success' && (
                    <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                        <div>
                          <h3 className="text-sm font-medium text-green-800">Message Sent Successfully!</h3>
                          <p className="text-sm text-green-700 mt-1">
                            Thank you for contacting us. We'll respond to your inquiry within 24 hours.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label="First Name"
                        required
                        error={errors.firstName}
                      >
                        <Input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="Enter your first name"
                          variant={errors.firstName ? 'error' : 'default'}
                          leftIcon={<UserGroupIcon className="w-4 h-4" />}
                        />
                      </FormField>

                      <FormField
                        label="Last Name"
                        required
                        error={errors.lastName}
                      >
                        <Input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Enter your last name"
                          variant={errors.lastName ? 'error' : 'default'}
                          leftIcon={<UserGroupIcon className="w-4 h-4" />}
                        />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label="Email Address"
                        required
                        error={errors.email}
                      >
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter your email address"
                          variant={errors.email ? 'error' : 'default'}
                          leftIcon={<EnvelopeIcon className="w-4 h-4" />}
                        />
                      </FormField>

                      <FormField
                        label="Phone Number"
                        required
                        error={errors.phone}
                      >
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Enter your phone number"
                          variant={errors.phone ? 'error' : 'default'}
                          leftIcon={<PhoneIcon className="w-4 h-4" />}
                        />
                      </FormField>
                    </div>

                    {/* Inquiry Details */}
                    <FormField
                      label="Subject"
                      required
                      error={errors.subject}
                    >
                      <Input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="Brief subject of your inquiry"
                        variant={errors.subject ? 'error' : 'default'}
                        leftIcon={<DocumentTextIcon className="w-4 h-4" />}
                      />
                    </FormField>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label="Inquiry Type"
                        required
                        error={errors.inquiryType}
                      >
                        <Select
                          value={formData.inquiryType}
                          onChange={(e) => handleInputChange('inquiryType', e.target.value)}
                          placeholder="Select inquiry type"
                          variant={errors.inquiryType ? 'error' : 'default'}
                        >
                          {inquiryTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </Select>
                      </FormField>

                      <FormField
                        label="Property Type"
                        hint="Optional - if property related"
                      >
                        <Select
                          value={formData.propertyType}
                          onChange={(e) => handleInputChange('propertyType', e.target.value)}
                          placeholder="Select property type"
                        >
                          {propertyTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </Select>
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label="Budget Range"
                        hint="Optional - for buying/renting"
                      >
                        <Select
                          value={formData.budget}
                          onChange={(e) => handleInputChange('budget', e.target.value)}
                          placeholder="Select budget range"
                        >
                          {budgetRanges.map((range) => (
                            <option key={range} value={range}>{range}</option>
                          ))}
                        </Select>
                      </FormField>

                      <FormField
                        label="Timeline"
                        hint="Optional - when do you need this"
                      >
                        <Select
                          value={formData.timeline}
                          onChange={(e) => handleInputChange('timeline', e.target.value)}
                          placeholder="Select timeline"
                        >
                          {timelineOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </Select>
                      </FormField>
                    </div>

                    <FormField
                      label="Message"
                      required
                      error={errors.message}
                      hint="Please provide details about your inquiry"
                    >
                      <Textarea
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Tell us more about what you're looking for..."
                        rows={6}
                        variant={errors.message ? 'error' : 'default'}
                      />
                    </FormField>

                    <FormField
                      label="Preferred Contact Method"
                    >
                      <Select
                        value={formData.preferredContact}
                        onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                      >
                        <option value="email">Email</option>
                        <option value="phone">Phone Call</option>
                        <option value="sms">Text Message</option>
                        <option value="whatsapp">WhatsApp</option>
                      </Select>
                    </FormField>

                    {/* Terms Agreement */}
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                        className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                        I agree to the{' '}
                        <a href="/terms" className="text-orange-600 hover:text-orange-700 underline">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="/privacy" className="text-orange-600 hover:text-orange-700 underline">
                          Privacy Policy
                        </a>
                        , and consent to being contacted about this inquiry.
                        {errors.agreeToTerms && (
                          <span className="block text-red-600 text-xs mt-1">{errors.agreeToTerms}</span>
                        )}
                      </label>
                    </div>

                    {/* Error Messages */}
                    {submitStatus === 'error' && errors.message && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                          <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
                          <span className="text-sm text-red-700">{errors.message}</span>
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
                          Sending Message...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <EnvelopeIcon className="w-5 h-5 mr-2" />
                          Send Message
                        </div>
                      )}
                    </Button>
                  </form>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-8">
                {/* Office Locations */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Our Offices</h3>
                  
                  {/* Office Selector */}
                  <div className="mb-6">
                    <Select
                      value={selectedOffice}
                      onChange={(e) => setSelectedOffice(e.target.value)}
                    >
                      {officeLocations.map((office) => (
                        <option key={office.id} value={office.id}>
                          {office.name} {office.isMain ? '(Main)' : ''}
                        </option>
                      ))}
                    </Select>
                  </div>

                  {/* Selected Office Details */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{selectedOfficeData.name}</h4>
                      {selectedOfficeData.isMain && (
                        <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full mt-1">
                          Main Office
                        </span>
                      )}
                    </div>

                    <div className="flex items-start space-x-3">
                      <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900">{selectedOfficeData.address}</p>
                        <p className="text-gray-600 text-sm">{selectedOfficeData.city}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <a 
                        href={`tel:${selectedOfficeData.phone}`}
                        className="text-orange-600 hover:text-orange-700"
                      >
                        {selectedOfficeData.phone}
                      </a>
                    </div>

                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <a 
                        href={`mailto:${selectedOfficeData.email}`}
                        className="text-orange-600 hover:text-orange-700"
                      >
                        {selectedOfficeData.email}
                      </a>
                    </div>

                    <div className="flex items-start space-x-3">
                      <ClockIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="text-gray-900">Mon-Fri: {selectedOfficeData.hours.weekdays}</p>
                        <p className="text-gray-900">Saturday: {selectedOfficeData.hours.saturday}</p>
                        <p className="text-gray-900">Sunday: {selectedOfficeData.hours.sunday}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
                  <div className="space-y-4">
                    <Button
                      onClick={() => window.open('tel:+6281234567')}
                      variant="outlined"
                      className="w-full !border-orange-500 !text-orange-500 hover:!bg-orange-500 hover:!text-white"
                    >
                      <PhoneIcon className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                    
                    <Button
                      onClick={() => window.open('https://wa.me/6281234567')}
                      variant="outlined"
                      className="w-full !border-green-500 !text-green-500 hover:!bg-green-500 hover:!text-white"
                    >
                      <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    
                    <Button
                      onClick={() => window.open('/events')}
                      variant="outlined"
                      className="w-full !border-blue-500 !text-blue-500 hover:!bg-blue-500 hover:!text-white"
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Book Appointment
                    </Button>
                  </div>
                </div>

                {/* FAQ Link */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <QuestionMarkCircleIcon className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Need Quick Answers?</h4>
                      <p className="text-sm text-blue-700 mb-4">
                        Check our FAQ section for instant answers to common questions.
                      </p>
                      <Button
                        size="sm"
                        className="!bg-blue-500 hover:!bg-blue-600 !text-white"
                      >
                        View FAQ
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Us</h2>
              <p className="text-xl text-gray-600">
                Visit our offices across Metro Manila
              </p>
            </div>

            {/* Interactive Map */}
            <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-96 lg:h-[500px]">
                {/* Placeholder for actual map integration */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <div className="text-center">
                    <MapPinIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Interactive Map</h3>
                    <p className="text-gray-600 mb-4 max-w-md">
                      This area will contain an embedded Google Maps showing all our office locations
                    </p>
                    <div className="bg-white rounded-lg p-4 inline-block shadow-sm">
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Main Office:</strong> {selectedOfficeData.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedOfficeData.address}, {selectedOfficeData.city}
                      </p>
                      <p className="text-sm text-gray-600">
                        Coordinates: {selectedOfficeData.coordinates.lat}, {selectedOfficeData.coordinates.lng}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Map Integration Code would go here */}
                {/* 
                <iframe 
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d${zoom}!2d${selectedOfficeData.coordinates.lng}!3d${selectedOfficeData.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1`}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                */}
              </div>
            </div>

            {/* Office Location Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {officeLocations.map((office) => (
                <div 
                  key={office.id}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedOffice === office.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedOffice(office.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{office.name}</h4>
                      {office.isMain && (
                        <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full mt-1">
                          Main Office
                        </span>
                      )}
                    </div>
                    <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700">{office.address}</p>
                    <p className="text-gray-600">{office.city}</p>
                    <p className="text-orange-600 font-medium">{office.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Contact Options */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Other Ways to Reach Us</h2>
              <p className="text-xl text-gray-600">
                Choose the communication method that works best for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <GlobeAltIcon className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Chat with our team in real-time
                </p>
                <Button size="sm" variant="outlined" className="!border-blue-500 !text-blue-500 hover:!bg-blue-500 hover:!text-white">
                  Start Chat
                </Button>
              </div>

              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <DevicePhoneMobileIcon className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">SMS Support</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get quick answers via text
                </p>
                <Button size="sm" variant="outlined" className="!border-green-500 !text-green-500 hover:!bg-green-500 hover:!text-white">
                  Send SMS
                </Button>
              </div>

              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <CalendarIcon className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Schedule Call</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Book a convenient time to talk
                </p>
                <Button size="sm" variant="outlined" className="!border-purple-500 !text-purple-500 hover:!bg-purple-500 hover:!text-white">
                  Book Call
                </Button>
              </div>

              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <DocumentTextIcon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Help Center</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Browse our knowledge base
                </p>
                <Button size="sm" variant="outlined" className="!border-orange-500 !text-orange-500 hover:!bg-orange-500 hover:!text-white">
                  Get Help
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </Layout>
  );
};

export default ContactPage; 