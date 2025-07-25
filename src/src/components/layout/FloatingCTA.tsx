import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface FloatingCTAProps {
  showOnScroll?: boolean;
  className?: string;
}

const FloatingCTA: React.FC<FloatingCTAProps> = ({ 
  showOnScroll = true, 
  className = '' 
}) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(!showOnScroll);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!showOnScroll) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Show after scrolling 50% of viewport height
      setIsVisible(scrollPosition > windowHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showOnScroll]);

  const handleListProperty = () => {
    router.push('/list-property');
  };

  const handleContactAgent = () => {
    router.push('/contact');
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <div className="relative">
        {/* Expanded Menu */}
        <div className={`absolute bottom-16 right-0 transition-all duration-300 ${
          isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 min-w-[200px]">
            {/* List Property */}
            <button
              onClick={handleListProperty}
              className="w-full flex items-center px-4 py-3 text-left hover:bg-orange-50 rounded-xl transition-colors duration-200 group"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0V5a2 2 0 012-2h6l2 2h6a2 2 0 012 2v2M7 13h10M7 17h4" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900">List Property</div>
                <div className="text-xs text-gray-500">Sell your home</div>
              </div>
            </button>

            {/* Contact Agent */}
            <button
              onClick={handleContactAgent}
              className="w-full flex items-center px-4 py-3 text-left hover:bg-blue-50 rounded-xl transition-colors duration-200 group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Contact Agent</div>
                <div className="text-xs text-gray-500">Get expert help</div>
              </div>
            </button>

            {/* Browse Properties */}
            <button
              onClick={() => router.push('/properties')}
              className="w-full flex items-center px-4 py-3 text-left hover:bg-green-50 rounded-xl transition-colors duration-200 group"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Browse Properties</div>
                <div className="text-xs text-gray-500">Find your home</div>
              </div>
            </button>
          </div>
        </div>

        {/* Main Floating Button */}
        <button
          onClick={toggleExpanded}
          className={`w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group hover:scale-110 ${
            isExpanded ? 'rotate-45' : ''
          }`}
        >
          <svg 
            className={`w-6 h-6 transition-transform duration-300 ${isExpanded ? 'rotate-45' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {isExpanded ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            )}
          </svg>
        </button>

        {/* Pulse Animation */}
        {!isExpanded && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-red-500 animate-ping opacity-20"></div>
        )}
      </div>
    </div>
  );
};

export default FloatingCTA; 