'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Typography, Input, Button } from '@material-tailwind/react';
import { EyeSlashIcon, EyeIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../../src/src/contexts/AuthContext';

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
  const { register, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
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
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  // Refs for focus management
  const firstNameRef = useRef<HTMLInputElement>(null);

  const togglePasswordVisibility = () => setPasswordShown((cur) => !cur);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordShown((cur) => !cur);

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
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({}); // Clear any previous errors
    
    try {
      // Use real Supabase registration
      register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
      });
      
      // Show success state
      setRegistrationSuccess(true);
      
      // Navigate to login after 3 seconds
      setTimeout(() => {
        router.push(
          `/auth/login?message=${encodeURIComponent('Registration successful! Please check your email for verification before signing in.')}&email=${encodeURIComponent(formData.email)}`
        );
      }, 3000);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Show user-friendly error messages
      if (error.message.includes('already registered')) {
        setErrors({ email: 'An account with this email already exists. Please try signing in instead.' });
      } else if (error.message.includes('Invalid email')) {
        setErrors({ email: 'Please enter a valid email address.' });
      } else if (error.message.includes('Password')) {
        setErrors({ password: error.message });
      } else {
        setErrors({ 
          email: error.message || 'Registration failed. Please check your details and try again.' 
        });
      }
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

  return (
    <section className="min-h-screen bg-white py-8 px-4">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-[32rem]">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-gray-800 mb-2">
              Create Account
            </h3>
            <p className="mb-6 text-gray-600 font-normal text-lg">
              Join our real estate community
            </p>
          </div>

          {/* Registration Success Message */}
          {registrationSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="text-green-600 text-xl mr-3">✅</div>
                <div>
                  <p className="text-green-800 font-medium">Registration Successful!</p>
                  <p className="text-green-700 text-sm mt-1">
                    Please check your email for a verification link. You'll be redirected to sign in shortly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm font-medium">
                Please correct the errors below
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="mb-2 block font-medium text-gray-900 text-sm">
                  First Name*
                </label>
                <Input
                  ref={firstNameRef}
                  id="firstName"
                  color="gray"
                  size="lg"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  className="w-full !text-gray-900 placeholder:!text-gray-500 placeholder:!opacity-100 focus:!border-t-blue-500 !border-t-blue-gray-200"
                  labelProps={{ className: "hidden" }}
                  required
                  crossOrigin={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  onResize={undefined}
                  onResizeCapture={undefined}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="mb-2 block font-medium text-gray-900 text-sm">
                  Last Name*
                </label>
                <Input
                  id="lastName"
                  color="gray"
                  size="lg"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  className="w-full !text-gray-900 placeholder:!text-gray-500 placeholder:!opacity-100 focus:!border-t-blue-500 !border-t-blue-gray-200"
                  labelProps={{ className: "hidden" }}
                  required
                  crossOrigin={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  onResize={undefined}
                  onResizeCapture={undefined}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
            <label htmlFor="email" className="mb-2 block font-medium text-gray-900 text-sm">
              Email Address*
            </label>
            <Input
              id="email"
              color="gray"
              size="lg"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              placeholder="name@mail.com"
              className="w-full !text-gray-900 placeholder:!text-gray-500 placeholder:!opacity-100 focus:!border-t-blue-500 !border-t-blue-gray-200"
              labelProps={{ className: "hidden" }}
              required
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
            />
            <p className="text-sm text-gray-500 mt-1">
              We'll use this email to send you account updates and verification.
            </p>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

            {/* Phone */}
            <div className="mb-4">
            <label htmlFor="phone" className="mb-2 block font-medium text-gray-900 text-sm">
              Phone Number (Optional)
            </label>
            <Input
              id="phone"
              color="gray"
              size="lg"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange('phone')}
              placeholder="+1 (555) 123-4567"
              className="w-full !text-gray-900 placeholder:!text-gray-500 placeholder:!opacity-100 focus:!border-t-blue-500 !border-t-blue-gray-200"
              labelProps={{ className: "hidden" }}
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
            />
            <p className="text-sm text-gray-500 mt-1">
              Optional. We may use this for account security notifications.
            </p>
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

            {/* Password */}
            <div className="mb-4">
            <label htmlFor="password" className="mb-2 block font-medium text-gray-900 text-sm">
              Password*
            </label>
            <div className="relative">
              <Input
                id="password"
                size="lg"
                value={formData.password}
                onChange={handleInputChange('password')}
                placeholder="********"
                labelProps={{ className: "hidden" }}
                className="w-full !text-gray-900 placeholder:!text-gray-500 placeholder:!opacity-100 focus:!border-t-blue-500 !border-t-blue-gray-200 !pr-12"
                type={passwordShown ? "text" : "password"}
                required
                crossOrigin={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
              />
              <button 
                type="button"
                onClick={togglePasswordVisibility} 
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 hover:text-gray-900"
              >
                {passwordShown ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              At least 8 characters with uppercase, lowercase, and number.
            </p>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

            {/* Confirm Password */}
            <div className="mb-4">
            <label htmlFor="confirmPassword" className="mb-2 block font-medium text-gray-900 text-sm">
              Confirm Password*
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                size="lg"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                placeholder="********"
                labelProps={{ className: "hidden" }}
                className="w-full !text-gray-900 placeholder:!text-gray-500 placeholder:!opacity-100 focus:!border-t-blue-500 !border-t-blue-gray-200 !pr-12"
                type={confirmPasswordShown ? "text" : "password"}
                required
                crossOrigin={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
              />
              <button 
                type="button"
                onClick={toggleConfirmPasswordVisibility} 
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 hover:text-gray-900"
              >
                {confirmPasswordShown ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

            {/* Terms and Conditions */}
            <div className="mb-4">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={handleInputChange('acceptTerms')}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                required
              />
              <span className="text-sm text-gray-700">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </Link>
              </span>
            </label>
            <p className="text-sm text-gray-500 mt-1 ml-7">
              Required to create an account and use our services.
            </p>
            {errors.acceptTerms && (
              <p className="text-red-500 text-sm mt-1 ml-7">{errors.acceptTerms}</p>
            )}
          </div>

            <Button 
              type="submit"
              color="blue" 
              size="lg" 
              className="mt-6 mb-3 !bg-blue-600 !text-white hover:!bg-blue-700 !py-3 !px-6 !font-medium !text-base !rounded-lg !shadow-md hover:!shadow-lg !transition-all !duration-200" 
              fullWidth
              loading={isLoading || authLoading}
              disabled={isLoading || authLoading || registrationSuccess}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
            >
              {registrationSuccess 
                ? 'Registration Complete!' 
                : isLoading || authLoading 
                  ? 'Creating Account...' 
                  : 'Create Account'
              }
            </Button>
            
            <p className="mt-4 text-center font-normal text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;