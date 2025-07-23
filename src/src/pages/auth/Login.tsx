import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Button, Input } from '../../components/ui';
import PageWrapper from '../../components/layout/PageWrapper';
import Section from '../../components/layout/Section';

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs for focus management
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  // Focus on first input when component mounts
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

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    
    // Focus on first field with error for accessibility
    if (newErrors.email && emailRef.current) {
      emailRef.current.focus();
    } else if (newErrors.password && passwordRef.current) {
      passwordRef.current.focus();
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Announce errors to screen readers
      const errorCount = Object.keys(errors).length;
      const announcement = `Form has ${errorCount} error${errorCount > 1 ? 's' : ''}. Please check and correct the highlighted fields.`;
      
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
      // TODO: Implement actual login logic
      console.log('Login attempt:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success announcement
      const successAnnouncement = document.createElement('div');
      successAnnouncement.setAttribute('aria-live', 'polite');
      successAnnouncement.className = 'sr-only';
      successAnnouncement.textContent = 'Login successful! Redirecting...';
      document.body.appendChild(successAnnouncement);
      
      // Redirect on success (placeholder)
      alert('Login successful! (Placeholder)');
      
      setTimeout(() => {
        document.body.removeChild(successAnnouncement);
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      
      // Error announcement
      const errorAnnouncement = document.createElement('div');
      errorAnnouncement.setAttribute('aria-live', 'assertive');
      errorAnnouncement.className = 'sr-only';
      errorAnnouncement.textContent = 'Login failed. Please check your credentials and try again.';
      document.body.appendChild(errorAnnouncement);
      
      alert('Login failed. Please try again.');
      
      setTimeout(() => {
        document.body.removeChild(errorAnnouncement);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enhanced keyboard navigation
    if (e.key === 'Enter' && e.target === emailRef.current) {
      e.preventDefault();
      passwordRef.current?.focus();
    }
  };

  return (
    <Section background="gray" padding="lg">
      <PageWrapper>
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl">
            <CardBody className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                <p className="text-gray-600">Sign in to your account</p>
              </div>

              <form 
                onSubmit={handleSubmit} 
                className="space-y-6"
                noValidate
                aria-label="Sign in form"
              >
                <div>
                  <Input
                    ref={emailRef}
                    type="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    onKeyDown={handleKeyDown}
                    error={!!errors.email}
                    required
                    size="lg"
                    className="w-full"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    autoComplete="email"
                  />
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
                    ref={passwordRef}
                    type="password"
                    label="Password"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    error={!!errors.password}
                    required
                    size="lg"
                    className="w-full"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    autoComplete="current-password"
                  />
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

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      aria-describedby="remember-help"
                    />
                    <span className="text-sm text-gray-700">Remember me</span>
                    <span id="remember-help" className="sr-only">
                      Keep me signed in on this device
                    </span>
                  </label>
                  <Link
                    to="/auth/reset-password"
                    className="text-sm text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    aria-label="Reset your password"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  ref={submitRef}
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
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
                <span id="submit-help" className="sr-only">
                  Submit the login form to access your account
                </span>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/auth/register"
                    className="text-blue-600 hover:text-blue-800 font-semibold underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    aria-label="Create a new account"
                  >
                    Sign up
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

export default Login; 