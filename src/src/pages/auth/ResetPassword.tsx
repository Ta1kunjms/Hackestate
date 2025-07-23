import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Button, Input } from '../../components/ui';
import PageWrapper from '../../components/layout/PageWrapper';
import Section from '../../components/layout/Section';

interface ResetPasswordFormData {
  email: string;
}

interface FormErrors {
  email?: string;
}

const ResetPassword: React.FC = () => {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    email: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Ref for focus management
  const emailRef = useRef<HTMLInputElement>(null);

  // Focus on email input when component mounts
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    
    // Focus on email field if there's an error
    if (newErrors.email && emailRef.current) {
      emailRef.current.focus();
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Announce error to screen readers
      const announcement = 'Please enter a valid email address to reset your password.';
      
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.textContent = announcement;
      document.body.appendChild(liveRegion);
      
      setTimeout(() => {
        document.body.removeChild(liveRegion);
      }, 1000);
      
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement actual reset password logic
      console.log('Reset password attempt for:', formData.email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success announcement
      const successAnnouncement = document.createElement('div');
      successAnnouncement.setAttribute('aria-live', 'polite');
      successAnnouncement.className = 'sr-only';
      successAnnouncement.textContent = 'Password reset email sent successfully. Please check your inbox.';
      document.body.appendChild(successAnnouncement);
      
      setIsSubmitted(true);
      
      setTimeout(() => {
        document.body.removeChild(successAnnouncement);
      }, 1000);
    } catch (error) {
      console.error('Reset password error:', error);
      
      const errorAnnouncement = document.createElement('div');
      errorAnnouncement.setAttribute('aria-live', 'assertive');
      errorAnnouncement.className = 'sr-only';
      errorAnnouncement.textContent = 'Failed to send reset email. Please try again.';
      document.body.appendChild(errorAnnouncement);
      
      alert('Failed to send reset email. Please try again.');
      
      setTimeout(() => {
        document.body.removeChild(errorAnnouncement);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      email: e.target.value,
    });
    
    // Clear error when user starts typing
    if (errors.email) {
      setErrors({});
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Implement resend logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const resendAnnouncement = document.createElement('div');
      resendAnnouncement.setAttribute('aria-live', 'polite');
      resendAnnouncement.className = 'sr-only';
      resendAnnouncement.textContent = 'Reset email sent again successfully.';
      document.body.appendChild(resendAnnouncement);
      
      alert('Reset email sent again!');
      
      setTimeout(() => {
        document.body.removeChild(resendAnnouncement);
      }, 1000);
    } catch (error) {
      console.error('Resend error:', error);
      alert('Failed to resend email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Section background="gray" padding="lg">
        <PageWrapper>
          <div className="max-w-md mx-auto">
            <Card className="shadow-xl">
              <CardBody className="p-8 text-center">
                <div 
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  role="img" 
                  aria-label="Success icon"
                >
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-4">Check Your Email</h1>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to:
                </p>
                <p className="text-blue-600 font-semibold mb-8" aria-label={`Email address: ${formData.email}`}>
                  {formData.email}
                </p>
                
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Didn't receive the email? Check your spam folder or click below to resend.
                  </p>
                  
                  <Button
                    variant="outlined"
                    color="blue"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                    onClick={handleResend}
                    aria-describedby="resend-help"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Resend Email'}
                  </Button>
                  <span id="resend-help" className="sr-only">
                    Send another password reset email to your address
                  </span>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Link
                    to="/auth/login"
                    className="text-blue-600 hover:text-blue-800 font-semibold underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    aria-label="Return to sign in page"
                  >
                    ← Back to Sign In
                  </Link>
                </div>
              </CardBody>
            </Card>
          </div>
        </PageWrapper>
      </Section>
    );
  }

  return (
    <Section background="gray" padding="lg">
      <PageWrapper>
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl">
            <CardBody className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
                <p className="text-gray-600">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form 
                onSubmit={handleSubmit} 
                className="space-y-6"
                noValidate
                aria-label="Password reset form"
              >
                <div>
                  <Input
                    ref={emailRef}
                    type="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    required
                    size="lg"
                    className="w-full"
                    placeholder="Enter your email address"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : 'email-help'}
                    autoComplete="email"
                  />
                  <p id="email-help" className="text-sm text-gray-500 mt-1">
                    We'll send password reset instructions to this email address.
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
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                <span id="submit-help" className="sr-only">
                  Submit the form to receive password reset instructions
                </span>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Remember your password?{' '}
                  <Link
                    to="/auth/login"
                    className="text-blue-600 hover:text-blue-800 font-semibold underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    aria-label="Return to sign in page"
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

export default ResetPassword; 