'use client'
import React from 'react';
import Link from 'next/link';
import { Button } from '../../src/src/components/ui';
import Navbar from '../../src/src/components/layout/Navbar';
import Footer from '../../src/src/components/layout/Footer';
import { useRouter } from 'next/navigation';

interface ErrorPageProps {
  errorCode: 404 | 500;
  title?: string;
  message?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ 
  errorCode, 
  title, 
  message 
}) => {
  const router = useRouter();
  const errorContent = {
    404: {
      title: title || "Page Not Found",
      message: message || "The page you're looking for doesn't exist or has been moved.",
      illustration: "🏠❌",
      suggestions: [
        "Check the URL for typing errors",
        "Go back to the previous page", 
        "Visit our homepage to start fresh",
        "Browse our property listings"
      ]
    },
    500: {
      title: title || "Server Error", 
      message: message || "Something went wrong on our end. We're working to fix it.",
      illustration: "🔧⚠️",
      suggestions: [
        "Try refreshing the page",
        "Wait a few minutes and try again",
        "Contact support if the problem persists",
        "Check our status page for updates"
      ]
    }
  };

  const content = errorContent[errorCode];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          {/* Error Illustration */}
          <div className="mb-8">
            {content ? (
              <>
                <div className="text-6xl mb-4">{content.illustration}</div>
                <h1 className="text-6xl font-bold text-gray-800 mb-2">{errorCode}</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">{content.title}</h2>
                <p className="text-gray-600 text-lg leading-relaxed">{content.message}</p>
              </>
            ) : (
              <div className="text-red-500">An unknown error occurred.</div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {/* <Link href="/"> */}
              {/* <Button
                variant="filled"
                color="blue"
                size="lg"
                className="w-full sm:w-auto"
              >
                Go Home
              </Button>
            </Link> */}
            <Button
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Go Back
            </Button>
          </div>

          {/* Helpful Suggestions */}
          <div className="bg-gray-50 rounded-lg p-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-3">You can try:</h3>
            <ul className="space-y-2">
              {content ? content.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-gray-600">{suggestion}</span>
                </li>
              )) : (
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span className="text-gray-600">No suggestions available.</span>
                </li>
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Popular pages:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/properties" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Browse Properties
              </Link>
              <Link 
                href="/agents" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Find Agents
              </Link>
              <Link 
                href="/about" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                About Us
              </Link>
              <Link 
                href="/contact" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ErrorPage; 