import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Button, Input } from '../../components/ui';
import PageWrapper from '../../components/layout/PageWrapper';
import Section from '../../components/layout/Section';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  acceptTerms: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  acceptTerms?: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs for focus management
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);

  // Focus on first input when component mounts
  useEffect(() => {
    firstNameRef.current?.focus();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    
    // Focus on first field with error for accessibility
    const errorFields = [
      { field: 'firstName', ref: firstNameRef },
      { field: 'lastName', ref: lastNameRef },
      { field: 'email', ref: emailRef },
      { field: 'phone', ref: phoneRef },
      { field: 'password', ref: passwordRef },
      { field: 'confirmPassword', ref: confirmPasswordRef },
      { field: 'acceptTerms', ref: termsRef },
    ];
    
    for (const { field, ref } of errorFields) {
      if (newErrors[field as keyof FormErrors] && ref.current) {
        ref.current.focus();
        break;
      }
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Announce errors to screen readers
      const errorCount = Object.keys(errors).length;
      const announcement = `Registration form has ${errorCount} error${errorCount > 1 ? 's' : ''}. Please review and correct the highlighted fields.`;
      
      // Create live region for announcements
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.textContent = announcement;
      document.body.appendChild(liveRegion);
      
      // Remove after announcement
      setTimeout(() => {
        document.body.removeChild(liveRegion);
      }, 1000);
      
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement actual registration logic
      console.log('Registration attempt:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success announcement
      const successAnnouncement = document.createElement('div');
      successAnnouncement.setAttribute('aria-live', 'polite');
      successAnnouncement.className = 'sr-only';
      successAnnouncement.textContent = 'Registration successful! Please check your email for verification instructions.';
      document.body.appendChild(successAnnouncement);
      
      // Redirect to verification on success (placeholder)
      alert('Registration successful! Please check your email for verification.');
      
      setTimeout(() => {
        document.body.removeChild(successAnnouncement);
      }, 1000);
    } catch (error) {
      console.error('Registration error:', error);
      
      // Error announcement
      const errorAnnouncement = document.createElement('div');
      errorAnnouncement.setAttribute('aria-live', 'assertive');
      errorAnnouncement.className = 'sr-only';
      errorAnnouncement.textContent = 'Registration failed. Please try again or contact support.';
      document.body.appendChild(errorAnnouncement);
      
      alert('Registration failed. Please try again.');
      
      setTimeout(() => {
        document.body.removeChild(errorAnnouncement);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegisterFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'acceptTerms' ? e.target.checked : e.target.value;
    
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleKeyDown = (currentRef: React.RefObject<HTMLInputElement | null>, nextRef: React.RefObject<HTMLInputElement | null>) => (
    e: React.KeyboardEvent
  ) => {
    // Enhanced keyboard navigation
    if (e.key === 'Enter' && e.target === currentRef.current) {
      e.preventDefault();
      nextRef.current?.focus();
    }
  };

  return (
    <Section background="gray" padding="lg">
      <PageWrapper>
        <div className="max-w-lg mx-auto">
          <Card className="shadow-xl">
            <CardBody className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
                <p className="text-gray-600">Join our real estate community</p>
              </div>

              <form 
                onSubmit={handleSubmit} 
                className="space-y-6"
                noValidate
                aria-label="Account registration form"
              >
                <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <legend className="sr-only">Personal Information</legend>
                  
                  <div>
                    <Input
                      ref={firstNameRef}
                      type="text"
                      label="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange('firstName')}
                      onKeyDown={handleKeyDown(firstNameRef, lastNameRef)}
                      error={!!errors.firstName}
                      required
                      size="lg"
                      className="w-full"
                      aria-invalid={!!errors.firstName}
                      aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                      autoComplete="given-name"
                    />
                    {errors.firstName && (
                      <p 
                        id="firstName-error" 
                        className="text-red-500 text-sm mt-1" 
                        role="alert"
                        aria-live="polite"
                      >
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      ref={lastNameRef}
                      type="text"
                      label="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange('lastName')}
                      onKeyDown={handleKeyDown(lastNameRef, emailRef)}
                      error={!!errors.lastName}
                      required
                      size="lg"
                      className="w-full"
                      aria-invalid={!!errors.lastName}
                      aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                      autoComplete="family-name"
                    />
                    {errors.lastName && (
                      <p 
                        id="lastName-error" 
                        className="text-red-500 text-sm mt-1" 
                        role="alert"
                        aria-live="polite"
                      >
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </fieldset>

                <div>
                  <Input
                    ref={emailRef}
                    type="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    onKeyDown={handleKeyDown(emailRef, phoneRef)}
                    error={!!errors.email}
                    required
                    size="lg"
                    className="w-full"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : 'email-help'}
                    autoComplete="email"
                  />
                  <p id="email-help" className="text-sm text-gray-500 mt-1">
                    We'll use this email to send you account updates and verification.
                  </p>
                  {errors.email && (
                    <p 
                      id="email-error" 
                      className="text-red-500 text-sm mt-1" 
                      role="alert"
                      aria-live="polite"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    ref={phoneRef}
                    type="tel"
                    label="Phone Number (Optional)"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    onKeyDown={handleKeyDown(phoneRef, passwordRef)}
                    error={!!errors.phone}
                    size="lg"
                    className="w-full"
                    placeholder="+1 (555) 123-4567"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : 'phone-help'}
                    autoComplete="tel"
                  />
                  <p id="phone-help" className="text-sm text-gray-500 mt-1">
                    Optional. We may use this for account security notifications.
                  </p>
                  {errors.phone && (
                    <p 
                      id="phone-error" 
                      className="text-red-500 text-sm mt-1" 
                      role="alert"
                      aria-live="polite"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>

                <fieldset className="space-y-4">
                  <legend className="sr-only">Password Security</legend>
                  
                  <div>
                    <Input
                      ref={passwordRef}
                      type="password"
                      label="Password"
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      onKeyDown={handleKeyDown(passwordRef, confirmPasswordRef)}
                      error={!!errors.password}
                      required
                      size="lg"
                      className="w-full"
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? 'password-error' : 'password-help'}
                      autoComplete="new-password"
                    />
                    <p id="password-help" className="text-sm text-gray-500 mt-1">
                      Must be at least 8 characters with uppercase, lowercase, and number.
                    </p>
                    {errors.password && (
                      <p 
                        id="password-error" 
                        className="text-red-500 text-sm mt-1" 
                        role="alert"
                        aria-live="polite"
                      >
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      ref={confirmPasswordRef}
                      type="password"
                      label="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange('confirmPassword')}
                      error={!!errors.confirmPassword}
                      required
                      size="lg"
                      className="w-full"
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                      autoComplete="new-password"
                    />
                    {errors.confirmPassword && (
                      <p 
                        id="confirmPassword-error" 
                        className="text-red-500 text-sm mt-1" 
                        role="alert"
                        aria-live="polite"
                      >
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </fieldset>

                <div>
                  <label className="flex items-start space-x-3">
                    <input
                      ref={termsRef}
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange('acceptTerms')}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      aria-invalid={!!errors.acceptTerms}
                      aria-describedby={errors.acceptTerms ? 'terms-error' : 'terms-help'}
                      required
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the{' '}
                      <Link 
                        to="/terms" 
                        className="text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                        aria-label="Read Terms of Service (opens in new tab)"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link 
                        to="/privacy" 
                        className="text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                        aria-label="Read Privacy Policy (opens in new tab)"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  <p id="terms-help" className="text-sm text-gray-500 mt-1 ml-7">
                    Required to create an account and use our services.
                  </p>
                  {errors.acceptTerms && (
                    <p 
                      id="terms-error" 
                      className="text-red-500 text-sm mt-1 ml-7" 
                      role="alert"
                      aria-live="polite"
                    >
                      {errors.acceptTerms}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="filled"
                  color="blue"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  className="mt-6"
                  aria-describedby="submit-help"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
                <span id="submit-help" className="sr-only">
                  Submit the registration form to create your account
                </span>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/auth/login"
                    className="text-blue-600 hover:text-blue-800 font-semibold underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    aria-label="Sign in to existing account"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </PageWrapper>
    </Section>
  );
};

export default Register;