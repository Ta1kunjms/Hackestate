import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardBody, Button } from '../../components/ui';
import PageWrapper from '../../components/layout/PageWrapper';
import Section from '../../components/layout/Section';

type VerificationState = 'pending' | 'success' | 'error' | 'expired';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [verificationState, setVerificationState] = useState<VerificationState>('pending');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  // Get token and email from URL parameters
  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }

    if (token) {
      // Auto-verify if token is present
      verifyEmail(token);
    }
  }, [token, emailParam]);

  const verifyEmail = async (verificationToken: string) => {
    setIsLoading(true);
    
    // Announce verification start
    const startAnnouncement = document.createElement('div');
    startAnnouncement.setAttribute('aria-live', 'polite');
    startAnnouncement.className = 'sr-only';
    startAnnouncement.textContent = 'Starting email verification process...';
    document.body.appendChild(startAnnouncement);
    
    try {
      // TODO: Implement actual email verification logic
      console.log('Verifying email with token:', verificationToken);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate different outcomes for demo
      const randomOutcome = Math.random();
      let finalState: VerificationState;
      let announcement: string;
      
      if (randomOutcome > 0.8) {
        finalState = 'expired';
        announcement = 'Email verification link has expired. Please request a new one.';
      } else if (randomOutcome > 0.9) {
        finalState = 'error';
        announcement = 'Email verification failed. The link may be invalid.';
      } else {
        finalState = 'success';
        announcement = 'Email verification successful! You can now access all account features.';
      }
      
      setVerificationState(finalState);
      
      // Announce result
      const resultAnnouncement = document.createElement('div');
      resultAnnouncement.setAttribute('aria-live', finalState === 'success' ? 'polite' : 'assertive');
      resultAnnouncement.className = 'sr-only';
      resultAnnouncement.textContent = announcement;
      document.body.appendChild(resultAnnouncement);
      
      setTimeout(() => {
        document.body.removeChild(resultAnnouncement);
      }, 2000);
    } catch (error) {
      console.error('Email verification error:', error);
      setVerificationState('error');
      
      const errorAnnouncement = document.createElement('div');
      errorAnnouncement.setAttribute('aria-live', 'assertive');
      errorAnnouncement.className = 'sr-only';
      errorAnnouncement.textContent = 'Email verification failed due to a technical error.';
      document.body.appendChild(errorAnnouncement);
      
      setTimeout(() => {
        document.body.removeChild(errorAnnouncement);
      }, 2000);
    } finally {
      setIsLoading(false);
      document.body.removeChild(startAnnouncement);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Implement resend verification logic
      console.log('Resending verification email to:', email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const successAnnouncement = document.createElement('div');
      successAnnouncement.setAttribute('aria-live', 'polite');
      successAnnouncement.className = 'sr-only';
      successAnnouncement.textContent = 'Verification email sent successfully. Please check your inbox.';
      document.body.appendChild(successAnnouncement);
      
      alert('Verification email sent! Please check your inbox.');
      
      setTimeout(() => {
        document.body.removeChild(successAnnouncement);
      }, 1000);
    } catch (error) {
      console.error('Resend verification error:', error);
      
      const errorAnnouncement = document.createElement('div');
      errorAnnouncement.setAttribute('aria-live', 'assertive');
      errorAnnouncement.className = 'sr-only';
      errorAnnouncement.textContent = 'Failed to send verification email. Please try again.';
      document.body.appendChild(errorAnnouncement);
      
      alert('Failed to resend verification email. Please try again.');
      
      setTimeout(() => {
        document.body.removeChild(errorAnnouncement);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const renderVerificationContent = () => {
    switch (verificationState) {
      case 'pending':
        return (
          <div className="text-center">
            <div 
              className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
              role="img" 
              aria-label="Verification in progress"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" aria-hidden="true"></div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Verifying Your Email</h1>
            <p className="text-gray-600" aria-live="polite">
              Please wait while we verify your email address...
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div 
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              role="img" 
              aria-label="Success icon"
            >
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Email Verified!</h1>
            <p className="text-gray-600 mb-8">
              Your email address has been successfully verified. You can now access all features of your account.
            </p>
            <Button
              variant="filled"
              color="green"
              size="lg"
              fullWidth
              onClick={() => window.location.href = '/auth/login'}
              aria-describedby="continue-help"
            >
              Continue to Sign In
            </Button>
            <span id="continue-help" className="sr-only">
              Navigate to the sign in page to access your verified account
            </span>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center">
            <div 
              className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6"
              role="img" 
              aria-label="Warning icon"
            >
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Link Expired</h1>
            <p className="text-gray-600 mb-8">
              This verification link has expired. Please request a new verification email.
            </p>
            <Button
              variant="filled"
              color="blue"
              size="lg"
              fullWidth
              loading={isLoading}
              onClick={handleResendVerification}
              className="mb-4"
              aria-describedby="resend-help"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send New Verification Email'}
            </Button>
            <span id="resend-help" className="sr-only">
              Request a new verification email to complete account setup
            </span>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div 
              className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
              role="img" 
              aria-label="Error icon"
            >
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Verification Failed</h1>
            <p className="text-gray-600 mb-8">
              We couldn't verify your email address. The link may be invalid or expired.
            </p>
            <div className="space-y-4">
              <Button
                variant="filled"
                color="blue"
                size="lg"
                fullWidth
                loading={isLoading}
                onClick={handleResendVerification}
                aria-describedby="retry-help"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send New Verification Email'}
              </Button>
              <span id="retry-help" className="sr-only">
                Try sending a new verification email to complete account setup
              </span>
              
              <Button
                variant="outlined"
                color="gray"
                size="lg"
                fullWidth
                onClick={() => window.location.href = '/auth/login'}
                aria-label="Return to sign in page"
              >
                Back to Sign In
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // If no token provided, show manual verification request
  if (!token) {
    return (
      <Section background="gray" padding="lg">
        <PageWrapper>
          <div className="max-w-md mx-auto">
            <Card className="shadow-xl">
              <CardBody className="p-8 text-center">
                <div 
                  className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  role="img" 
                  aria-label="Email icon"
                >
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Verify Your Email</h1>
                <p className="text-gray-600 mb-8">
                  Please check your email and click the verification link we sent you to activate your account.
                </p>
                
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Didn't receive the email? Check your spam folder or click below to resend.
                  </p>
                  
                  <Button
                    variant="filled"
                    color="blue"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                    onClick={handleResendVerification}
                    aria-describedby="manual-resend-help"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Resend Verification Email'}
                  </Button>
                  <span id="manual-resend-help" className="sr-only">
                    Send a new verification email to complete account setup
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
              {renderVerificationContent()}
              
              {verificationState !== 'success' && (
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <Link
                    to="/auth/login"
                    className="text-blue-600 hover:text-blue-800 font-semibold underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    aria-label="Return to sign in page"
                  >
                    ← Back to Sign In
                  </Link>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </PageWrapper>
    </Section>
  );
};

export default VerifyEmail; 