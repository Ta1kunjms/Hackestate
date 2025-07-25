'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Typography, Input, Button } from '@material-tailwind/react';
import { EyeSlashIcon, EyeIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../../src/src/contexts/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const state = {
    message: searchParams.get('message'),
    email: searchParams.get('email'),
  };
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: state?.email || '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(!!state?.message);
  
  const togglePasswordVisibility = () => setPasswordShown((cur) => !cur);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
    if (error) setError('');
  };

  return (
    <section className="grid text-center h-screen items-center p-8 bg-white">
      <div>
        <h3 className="text-3xl font-bold text-gray-800 mb-2">
          Sign In
        </h3>
        <p className="mb-8 text-gray-600 font-normal text-lg">
          Enter your email and password to sign in
        </p>

        {/* Success Message from Registration */}
        {showSuccessMessage && state?.message && (
          <div className="mx-auto max-w-[24rem] mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-green-600 text-xl mr-3">✅</div>
                <p className="text-green-800 text-sm">{state.message}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSuccessMessage(false)}
                className="text-green-600 hover:text-green-800 text-xl"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mx-auto max-w-[24rem] mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm font-medium">
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mx-auto max-w-[24rem] text-left bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-6">
            <label htmlFor="email" className="mb-2 block font-medium text-gray-900 text-sm">
              Your Email
            </label>
            <Input
              id="email"
              color="gray"
              size="lg"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              placeholder="name@mail.com"
              className="w-full !text-gray-900 placeholder:!text-gray-500 placeholder:!opacity-100 focus:!border-t-blue-500 !border-t-blue-gray-200"
              labelProps={{
                className: "hidden",
              }}
              required
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="mb-2 block font-medium text-gray-900 text-sm">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                size="lg"
                value={formData.password}
                onChange={handleInputChange('password')}
                placeholder="********"
                labelProps={{
                  className: "hidden",
                }}
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
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
          
          <div className="mt-4 flex justify-end">
            <Link
              href="/auth/reset-password"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>
          
          <p className="mt-6 text-center font-normal text-sm text-gray-600">
            Not registered?{" "}
            <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200">
              Create account
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login; 