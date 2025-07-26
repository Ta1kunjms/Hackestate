import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Typography, Input, Button } from '@material-tailwind/react';
import { UserRegistrationData, RoleName } from '../../types/user';
import { getRoleDisplayName, getRoleDescription, requiresApproval, getDefaultRole } from '../../utils/authRedirects';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role_name?: string;
}

const UserRegistration: React.FC = () => {
  const [formData, setFormData] = useState<UserRegistrationData>({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    role_name: getDefaultRole()
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Refs for focus management
  const emailRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);

  // Focus on email input when component mounts
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // First name validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    } else if (formData.first_name.trim().length < 2) {
      newErrors.first_name = 'First name must be at least 2 characters long';
    }

    // Last name validation
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    } else if (formData.last_name.trim().length < 2) {
      newErrors.last_name = 'Last name must be at least 2 characters long';
    }

    // Phone validation (optional but if provided, must be valid)
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Role validation
    if (!formData.role_name) {
      newErrors.role_name = 'Please select a role';
    }

    setErrors(newErrors);
    
    // Focus on first error field
    if (newErrors.email && emailRef.current) {
      emailRef.current.focus();
    } else if (newErrors.first_name && firstNameRef.current) {
      firstNameRef.current.focus();
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement actual registration logic with Supabase
      console.log('Registration attempt:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success announcement (client-side only)
      if (typeof document !== 'undefined') {
        const successAnnouncement = document.createElement('div');
        successAnnouncement.setAttribute('aria-live', 'polite');
        successAnnouncement.className = 'sr-only';
        successAnnouncement.textContent = `Registration successful! ${requiresApproval(formData.role_name) ? 'Your application is pending approval.' : 'Welcome to the platform!'}`;
        document.body.appendChild(successAnnouncement);
        
        setTimeout(() => {
          document.body.removeChild(successAnnouncement);
        }, 1000);
      }
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roleName = e.target.value as RoleName;
    setFormData(prev => ({
      ...prev,
      role_name: roleName
    }));
    
    if (errors.role_name) {
      setErrors(prev => ({
        ...prev,
        role_name: undefined
      }));
    }
  };

  const roles: RoleName[] = ['buyer', 'seller', 'agent', 'developer'];

  if (isSubmitted) {
    return (
      <section className="grid text-center h-screen items-center p-8 bg-white">
        <div>
          <div className="mx-auto max-w-[24rem] bg-white p-8 rounded-lg shadow-lg">
            <div 
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              role="img" 
              aria-label="Success icon"
            >
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-3xl font-bold text-gray-800 mb-4">Registration Successful!</h3>
            
            {requiresApproval(formData.role_name) ? (
              <div>
                <p className="text-gray-600 mb-6">
                  Thank you for registering as a <strong>{getRoleDisplayName(formData.role_name)}</strong>!
                </p>
                <p className="text-gray-600 mb-6">
                  Your application is now under review. We'll notify you via email once a decision has been made.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 text-sm">
                    <strong>What happens next?</strong><br />
                    • We'll review your application within 2-3 business days<br />
                    • You'll receive an email notification of our decision<br />
                    • Once approved, you'll have full access to all features
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 mb-6">
                Welcome to the platform! Your account has been created successfully.
              </p>
            )}
            
            <div className="space-y-4">
              <Button
                color="blue"
                size="lg"
                className="!bg-blue-600 !text-white hover:!bg-blue-700 !py-3 !px-6 !font-medium !text-base !rounded-lg !transition-all !duration-200"
                fullWidth
                onClick={() => window.location.href = '/auth/login'}
              >
                Continue to Sign In
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="grid text-center h-screen items-center p-8 bg-white">
      <div>
        <h3 className="text-3xl font-bold text-gray-800 mb-2">
          Create Your Account
        </h3>
        <p className="mb-8 text-gray-600 font-normal text-lg">
          Join our real estate platform and choose your role to get started.
        </p>

        {/* Error Messages */}
        {Object.keys(errors).length > 0 && (
          <div className="mx-auto max-w-[24rem] mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm font-medium mb-2">Please fix the following errors:</p>
            <ul className="text-red-600 text-sm space-y-1">
              {Object.values(errors).map((error, index) => 
                error && <li key={index}>• {error}</li>
              )}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mx-auto max-w-[24rem] text-left bg-white p-8 rounded-lg shadow-lg">
          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="mb-2 block font-medium text-gray-900 text-sm">
              Email Address*
            </label>
            <Input
              ref={emailRef}
              id="email"
              name="email"
              color="gray"
              size="lg"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              className="w-full !text-gray-900 placeholder:!text-gray-500 placeholder:!opacity-100 focus:!border-t-blue-500 !border-t-blue-gray-200"
              labelProps={{ className: "hidden" }}
              required
              crossOrigin={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="mb-2 block font-medium text-gray-900 text-sm">
              Password*
            </label>
            <Input
              id="password"
              name="password"
              color="gray"
              size="lg"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a strong password"
              className="w-full !text-gray-900 placeholder:!text-gray-500 placeholder:!opacity-100 focus:!border-t-blue-500 !border-t-blue-gray-200"
              labelProps={{ className: "hidden" }}
              required
              crossOrigin={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
            <p className="text-sm text-gray-500 mt-1">
              Must be at least 8 characters with uppercase, lowercase, number, and special character.
            </p>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="mb-2 block font-medium text-gray-900 text-sm">
              Confirm Password*
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              color="gray"
              size="lg"
              type="password"
              value={confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              className="w-full !text-gray-900 placeholder:!text-gray-500 placeholder:!opacity-100 focus:!border-t-blue-500 !border-t-blue-gray-200"
              labelProps={{ className: "hidden" }}
              required
              crossOrigin={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="first_name" className="mb-2 block font-medium text-gray-900 text-sm">
                First Name*
              </label>
              <Input
                ref={firstNameRef}
                id="first_name"
                name="first_name"
                color="gray"
                size="lg"
                type="text"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="First name"
                className="w-full !text-gray-900 placeholder:!text-gray-500 placeholder:!opacity-100 focus:!border-t-blue-500 !border-t-blue-gray-200"
                labelProps={{ className: "hidden" }}
                required
                crossOrigin={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            </div>
            <div>
              <label htmlFor="last_name" className="mb-2 block font-medium text-gray-900 text-sm">
                Last Name*
              </label>
              <Input
                id="last_name"
                name="last_name"
                color="gray"
                size="lg"
                type="text"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Last name"
                className="w-full !text-gray-900 placeholder:!text-gray-500 placeholder:!opacity-100 focus:!border-t-blue-500 !border-t-blue-gray-200"
                labelProps={{ className: "hidden" }}
                required
                crossOrigin={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="mb-6">
            <label htmlFor="phone" className="mb-2 block font-medium text-gray-900 text-sm">
              Phone Number (Optional)
            </label>
            <Input
              id="phone"
              name="phone"
              color="gray"
              size="lg"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              className="w-full !text-gray-900 placeholder:!text-gray-500 placeholder:!opacity-100 focus:!border-t-blue-500 !border-t-blue-gray-200"
              labelProps={{ className: "hidden" }}
              crossOrigin={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          </div>

          {/* Role Selection */}
          <div className="mb-8">
            <label htmlFor="role_name" className="mb-2 block font-medium text-gray-900 text-sm">
              Select Your Role*
            </label>
            <select
              id="role_name"
              name="role_name"
              value={formData.role_name}
              onChange={handleRoleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            >
              <option value="">Choose a role...</option>
              {roles.map(role => (
                <option key={role} value={role}>
                  {getRoleDisplayName(role)}
                </option>
              ))}
            </select>
            
            {formData.role_name && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 font-medium">
                  {getRoleDisplayName(formData.role_name)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {getRoleDescription(formData.role_name)}
                </p>
                {requiresApproval(formData.role_name) && (
                  <p className="text-sm text-blue-600 mt-1 font-medium">
                    ⚠️ This role requires approval before access is granted.
                  </p>
                )}
              </div>
            )}
          </div>

          <Button 
            type="submit"
            color="blue" 
            size="lg" 
            className="mt-8 mb-4 !bg-blue-600 !text-white hover:!bg-blue-700 !py-3 !px-6 !font-medium !text-base !rounded-lg !shadow-md hover:!shadow-lg !transition-all !duration-200" 
            fullWidth
            loading={isLoading}
            disabled={isLoading}
            placeholder={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
          
          <p className="mt-6 text-center font-normal text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default UserRegistration; 