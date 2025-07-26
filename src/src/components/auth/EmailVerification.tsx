import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Typography, Button } from '@material-tailwind/react';
import { supabase } from '../../lib/supabase';
import { getUserProfile } from '../../services/authService';
import { getRoleBasedRedirectUrl } from '../../utils/authRedirects';

const EmailVerification: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | 'loading'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get the current session to check if user is authenticated
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw new Error('Failed to get session');
        }

        if (!session) {
          setVerificationStatus('error');
          setErrorMessage('No active session found. Please try logging in again.');
          setIsVerifying(false);
          return;
        }

        // Check if email is confirmed
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          throw new Error('Failed to get user information');
        }

        if (!user) {
          setVerificationStatus('error');
          setErrorMessage('User not found. Please try logging in again.');
          setIsVerifying(false);
          return;
        }

        if (!user.email_confirmed_at) {
          setVerificationStatus('error');
          setErrorMessage('Email not yet confirmed. Please check your email and click the verification link.');
          setIsVerifying(false);
          return;
        }

        // Email is confirmed, get user profile with role information
        const profileResult = await getUserProfile(user.id);
        
        if (!profileResult.success) {
          throw new Error('Failed to get user profile');
        }

        setUserProfile(profileResult.profile);
        setVerificationStatus('success');
        
        // Auto-redirect after 3 seconds
        setTimeout(() => {
          const redirectUrl = getRoleBasedRedirectUrl(profileResult.profile.role.name);
          router.push(redirectUrl);
        }, 3000);

      } catch (error) {
        console.error('Email verification error:', error);
        setVerificationStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setIsVerifying(false);
      }
    };

    handleEmailVerification();
  }, [router]);

  const handleResendVerification = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setErrorMessage('No user found. Please try logging in again.');
        return;
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email!
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('');
        alert('Verification email sent! Please check your inbox.');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      setErrorMessage('Failed to resend verification email. Please try again.');
    }
  };

  const handleManualRedirect = () => {
    if (userProfile) {
      const redirectUrl = getRoleBasedRedirectUrl(userProfile.role.name);
      router.push(redirectUrl);
    } else {
      router.push('/auth/login');
    }
  };

  if (isVerifying) {
    return (
      <section className="grid text-center h-screen items-center p-8 bg-white">
        <div>
          <div className="mx-auto max-w-[24rem] bg-white p-8 rounded-lg shadow-lg">
            <div 
              className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin"
              role="img" 
              aria-label="Loading icon"
            >
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>

            <h3 className="text-3xl font-bold text-gray-800 mb-4">Verifying Email</h3>
            <p className="text-gray-600 mb-6">
              Please wait while we verify your email address...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (verificationStatus === 'success') {
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

            <h3 className="text-3xl font-bold text-gray-800 mb-4">Email Verified!</h3>
            <p className="text-gray-600 mb-6">
              Your email has been successfully verified. Welcome to the platform!
            </p>
            
            {userProfile && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  <strong>Role:</strong> {userProfile.role.name}<br />
                  <strong>Name:</strong> {userProfile.first_name} {userProfile.last_name}
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <Button
                color="blue"
                size="lg"
                className="!bg-blue-600 !text-white hover:!bg-blue-700 !py-3 !px-6 !font-medium !text-base !rounded-lg !transition-all !duration-200"
                fullWidth
                onClick={handleManualRedirect}
              >
                Continue to Dashboard
              </Button>
              
              <p className="text-sm text-gray-500">
                You will be automatically redirected in a few seconds...
              </p>
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

  if (verificationStatus === 'error') {
    return (
      <section className="grid text-center h-screen items-center p-8 bg-white">
        <div>
          <div className="mx-auto max-w-[24rem] bg-white p-8 rounded-lg shadow-lg">
            <div 
              className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
              role="img" 
              aria-label="Error icon"
            >
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <h3 className="text-3xl font-bold text-gray-800 mb-4">Verification Failed</h3>
            <p className="text-gray-600 mb-6">
              {errorMessage}
            </p>
            
            <div className="space-y-4">
              <Button
                color="blue"
                variant="outlined"
                size="lg"
                className="!border-blue-600 !text-blue-600 hover:!bg-blue-600 hover:!text-white !py-3 !px-6 !font-medium !text-base !rounded-lg !transition-all !duration-200"
                fullWidth
                onClick={handleResendVerification}
              >
                Resend Verification Email
              </Button>
              
              <Button
                color="gray"
                variant="outlined"
                size="lg"
                className="!border-gray-600 !text-gray-600 hover:!bg-gray-600 hover:!text-white !py-3 !px-6 !font-medium !text-base !rounded-lg !transition-all !duration-200"
                fullWidth
                onClick={() => router.push('/auth/login')}
              >
                Back to Sign In
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

  return null;
};

export default EmailVerification; 