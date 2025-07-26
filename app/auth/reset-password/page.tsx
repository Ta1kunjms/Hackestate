import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Typography, Input, Button } from '@material-tailwind/react';

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
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement actual reset password logic
      console.log('Reset password attempt for:', formData.email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success announcement (client-side only)
      if (typeof document !== 'undefined') {
        const successAnnouncement = document.createElement('div');
        successAnnouncement.setAttribute('aria-live', 'polite');
        successAnnouncement.className = 'sr-only';
        successAnnouncement.textContent = 'Password reset email sent successfully. Please check your inbox.';
        document.body.appendChild(successAnnouncement);
        
        setTimeout(() => {
          document.body.removeChild(successAnnouncement);
        }, 1000);
      }
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Reset password error:', error);
      alert('Failed to send reset email. Please try again.');
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
      
      // Success announcement (client-side only)
      if (typeof document !== 'undefined') {
        const resendAnnouncement = document.createElement('div');
        resendAnnouncement.setAttribute('aria-live', 'polite');
        resendAnnouncement.className = 'sr-only';
        resendAnnouncement.textContent = 'Reset email sent again successfully.';
        document.body.appendChild(resendAnnouncement);
        
        setTimeout(() => {
          document.body.removeChild(resendAnnouncement);
        }, 1000);
      }
      
      alert('Reset email sent again!');
    } catch (error) {
      console.error('Resend error:', error);
      alert('Failed to resend email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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

            <h3 className="text-3xl font-bold text-gray-800 mb-4">Check Your Email</h3>
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
                color="blue"
                variant="outlined"
                size="lg"
                className="mt-4 mb-4 !border-blue-600 !text-blue-600 hover:!bg-blue-600 hover:!text-white !py-3 !px-6 !font-medium !text-base !rounded-lg !transition-all !duration-200"
                fullWidth
                loading={isLoading}
                onClick={handleResend}
                disabled={isLoading}
                placeholder={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {isLoading ? 'Sending...' : 'Resend Email'}
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link
                href="/auth/login"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                ← Back to Sign In
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
          Reset Password
        </h3>
        <p className="mb-8 text-gray-600 font-normal text-lg">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {/* Error Message */}
        {errors.email && (
          <div className="mx-auto max-w-[24rem] mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm font-medium">
              {errors.email}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mx-auto max-w-[24rem] text-left bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-6">
            <label htmlFor="email" className="mb-2 block font-medium text-gray-900 text-sm">
              Email Address*
            </label>
            <Input
              ref={emailRef}
              id="email"
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
            <p className="text-sm text-gray-500 mt-1">
              We'll send password reset instructions to this email address.
            </p>
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
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
          
          <p className="mt-6 text-center font-normal text-sm text-gray-600">
            Remember your password?{" "}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword; 