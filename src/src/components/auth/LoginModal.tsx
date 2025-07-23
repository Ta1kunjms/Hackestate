import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Input } from '../ui';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login, isLoading, redirectToRegister, redirectToResetPassword } = useAuth();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Refs for focus management
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Focus on first input when modal opens
  useEffect(() => {
    if (isLoginModalOpen) {
      // Small delay to ensure modal is fully rendered
      setTimeout(() => {
        emailRef.current?.focus();
      }, 100);
    }
  }, [isLoginModalOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isLoginModalOpen) {
      setFormData({ email: '', password: '' });
      setErrors({});
    }
  }, [isLoginModalOpen]);

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
    
    // Focus on first field with error
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
      const announcement = `Login form has ${errorCount} error${errorCount > 1 ? 's' : ''}. Please check and correct the highlighted fields.`;
      
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

    try {
      await login(formData.email, formData.password);
      // Modal will be closed by the auth context on successful login
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Login failed. Please try again.',
      });
      
      // Announce error
      const errorAnnouncement = document.createElement('div');
      errorAnnouncement.setAttribute('aria-live', 'assertive');
      errorAnnouncement.className = 'sr-only';
      errorAnnouncement.textContent = 'Login failed. Please check your credentials and try again.';
      document.body.appendChild(errorAnnouncement);
      
      setTimeout(() => {
        document.body.removeChild(errorAnnouncement);
      }, 1000);
    }
  };

  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
    
    // Clear errors when user starts typing
    if (errors[field] || errors.general) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
        general: undefined,
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
    <Modal
      open={isLoginModalOpen}
      onClose={closeLoginModal}
      title="Sign In"
      size="sm"
      className="max-w-md"
      dismissible={!isLoading}
    >
      <div className="px-2">
        <p className="text-gray-600 text-center mb-6">
          Sign in to save properties, set alerts, and more
        </p>

        {/* General error message */}
        {errors.general && (
          <div 
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6" 
            role="alert"
            aria-live="polite"
          >
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        <form 
          onSubmit={handleSubmit} 
          className="space-y-4"
          noValidate
          aria-label="Quick sign in form"
        >
          <div>
                         <Input
               type="email"
               label="Email Address"
               value={formData.email}
               onChange={handleInputChange('email')}
               error={!!errors.email}
               required
               size="lg"
               className="w-full"
               disabled={isLoading}
             />
            {errors.email && (
              <p 
                id="modal-email-error" 
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
               type="password"
               label="Password"
               value={formData.password}
               onChange={handleInputChange('password')}
               error={!!errors.password}
               required
               size="lg"
               className="w-full"
               disabled={isLoading}
             />
            {errors.password && (
              <p 
                id="modal-password-error" 
                className="text-red-500 text-sm mt-1" 
                role="alert"
                aria-live="polite"
              >
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                aria-describedby="modal-remember-help"
                disabled={isLoading}
              />
              <span className="text-gray-700">Remember me</span>
              <span id="modal-remember-help" className="sr-only">
                Keep me signed in on this device
              </span>
            </label>
            <button
              type="button"
              onClick={redirectToResetPassword}
              className="text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              aria-label="Reset your password"
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            variant="filled"
            color="blue"
            size="lg"
            fullWidth
            loading={isLoading}
            className="mt-6"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={redirectToRegister}
              className="text-blue-600 hover:text-blue-800 font-semibold underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              aria-label="Create a new account"
              disabled={isLoading}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal; 