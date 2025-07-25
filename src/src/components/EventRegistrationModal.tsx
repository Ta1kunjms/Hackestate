import React, { useState } from 'react';
import { 
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  CreditCardIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { Event } from './EventCard';
import { Button, Input, Select, Textarea, FormField } from './ui';
import { eventService, RegistrationData, RegistrationResponse } from '../services/eventService';

interface EventRegistrationModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onRegister: (registrationData: RegistrationData) => void;
}

// Import RegistrationData from service instead of defining locally

const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  event,
  isOpen,
  onClose,
  onRegister
}) => {
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    attendeeType: 'individual',
    dietaryRestrictions: '',
    specialRequests: '',
    paymentMethod: 'credit_card',
    agreeToTerms: false,
    subscribeNewsletter: true
  });

  const [errors, setErrors] = useState<Partial<RegistrationData & { terms?: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationSuccess, setRegistrationSuccess] = useState<RegistrationResponse | null>(null);
  const [apiError, setApiError] = useState<string>('');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `₱${price.toLocaleString()}`;
  };

  const validateForm = () => {
    const newErrors: Partial<RegistrationData & { terms?: string }> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.attendeeType === 'corporate' && !formData.company?.trim()) {
      newErrors.company = 'Company name is required for corporate registration';
    }

    if (!formData.agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');
    
    try {
      const response = await eventService.registerForEvent(event.id, formData);
      setRegistrationSuccess(response.data);
      onRegister(formData);
      
      // Auto-close modal after success delay
      setTimeout(() => {
        onClose();
        setRegistrationSuccess(null);
      }, 3000);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof RegistrationData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isEventFull = event.currentAttendees >= event.maxAttendees;
  const spotsRemaining = event.maxAttendees - event.currentAttendees;

  if (!isOpen) return null;

  // Show success state
  if (registrationSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-4">
            Your registration has been confirmed. You'll receive a confirmation email shortly.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-1">Confirmation Number:</p>
            <p className="font-mono text-lg font-semibold text-gray-900">
              {registrationSuccess.confirmationNumber}
            </p>
          </div>
          
          <div className="space-y-2">
            <Button
              onClick={onClose}
              className="!bg-green-500 hover:!bg-green-600 !text-white w-full"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Register for Event</h2>
              <p className="text-gray-600">Complete your registration below</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center mt-4 space-x-4">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Event Details</span>
            </div>
            <div className={`h-0.5 flex-1 ${currentStep >= 2 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Registration</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Event Summary */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex items-start space-x-4">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    {formatTime(event.time)}
                    {event.endTime && ` - ${formatTime(event.endTime)}`}
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center">
                    <UsersIcon className="w-4 h-4 mr-2" />
                    {spotsRemaining} spots remaining
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(event.price)}
                  </span>
                </div>
              </div>
            </div>

            {isEventFull && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-sm text-red-700 font-medium">This event is fully booked</span>
                </div>
              </div>
            )}
          </div>

          {/* Registration Form */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    leftIcon={<UserIcon className="w-4 h-4" />}
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
                    leftIcon={<UserIcon className="w-4 h-4" />}
                  />
                </FormField>

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
                  hint="Format: +63 917 123 4567"
                >
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+63 917 123 4567"
                    variant={errors.phone ? 'error' : 'default'}
                    leftIcon={<PhoneIcon className="w-4 h-4" />}
                  />
                </FormField>
              </div>
            </div>

            {/* Registration Type */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Registration Type</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="attendeeType"
                    value="individual"
                    checked={formData.attendeeType === 'individual'}
                    onChange={(e) => handleInputChange('attendeeType', e.target.value)}
                    className="h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Individual Registration</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="attendeeType"
                    value="corporate"
                    checked={formData.attendeeType === 'corporate'}
                    onChange={(e) => handleInputChange('attendeeType', e.target.value)}
                    className="h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Corporate Registration</span>
                </label>
              </div>
            </div>

            {/* Professional Information */}
            {formData.attendeeType === 'corporate' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Company Name"
                    required
                    error={errors.company}
                  >
                    <Input
                      type="text"
                      value={formData.company || ''}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Enter your company name"
                      variant={errors.company ? 'error' : 'default'}
                      leftIcon={<BuildingOfficeIcon className="w-4 h-4" />}
                    />
                  </FormField>

                  <FormField
                    label="Job Title"
                    hint="Optional"
                  >
                    <Input
                      type="text"
                      value={formData.jobTitle || ''}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      placeholder="Enter your job title"
                      leftIcon={<UserIcon className="w-4 h-4" />}
                    />
                  </FormField>
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h4>
              <div className="space-y-4">
                <FormField
                  label="Dietary Restrictions or Allergies"
                  hint="Please specify any dietary restrictions or food allergies (optional)"
                >
                  <Textarea
                    value={formData.dietaryRestrictions || ''}
                    onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                    rows={3}
                    placeholder="e.g., Vegetarian, Gluten-free, Nut allergy..."
                    resize="none"
                  />
                </FormField>

                <FormField
                  label="Special Requests or Accessibility Needs"
                  hint="Any special accommodations or requests (optional)"
                >
                  <Textarea
                    value={formData.specialRequests || ''}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    rows={3}
                    placeholder="e.g., Wheelchair accessibility, preferred seating..."
                    resize="none"
                  />
                </FormField>
              </div>
            </div>

            {/* Payment Method */}
            {event.price > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h4>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={formData.paymentMethod === 'credit_card'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                    />
                    <CreditCardIcon className="w-5 h-5 ml-3 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-700">Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                    />
                    <BanknotesIcon className="w-5 h-5 ml-3 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-700">Bank Transfer</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="w-5 h-5 ml-3 mr-2 text-gray-400 flex items-center justify-center text-xs font-bold">₱</span>
                    <span className="text-sm text-gray-700">Cash (Pay at venue)</span>
                  </label>
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="space-y-3">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  className={`h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 mt-0.5 ${
                    errors.agreeToTerms ? 'border-red-500' : ''
                  }`}
                />
                <span className="ml-2 text-sm text-gray-700">
                  I agree to the <a href="#" className="text-orange-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a> *
                </span>
              </label>
              {errors.terms && (
                <p className="text-red-500 text-xs">{errors.terms}</p>
              )}

              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.subscribeNewsletter}
                  onChange={(e) => handleInputChange('subscribeNewsletter', e.target.checked)}
                  className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 mt-0.5"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Subscribe to our newsletter for updates on future events and real estate news
                </span>
              </label>
            </div>
          </div>

          {/* API Error Display */}
          {apiError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-red-700">{apiError}</span>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outlined"
              onClick={onClose}
              disabled={isSubmitting}
              className="!border-gray-300 !text-gray-700 hover:!bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isEventFull}
              className={`!bg-orange-500 hover:!bg-orange-600 !text-white ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Registration...
                </div>
              ) : (
                `Register for ${formatPrice(event.price)}`
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventRegistrationModal; 