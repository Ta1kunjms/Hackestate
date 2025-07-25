import React from 'react';
import { useNavigate } from 'react-router-dom';

// Process steps data
const buyingSteps = [
  {
    step: 1,
    title: 'Search & Discover',
    description: 'Browse our curated collection of properties using advanced filters. Save favorites and set up alerts for new listings.',
    icon: 'search',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100'
  },
  {
    step: 2,
    title: 'Connect with Agents',
    description: 'Get matched with experienced local agents who understand your needs and preferred neighborhoods.',
    icon: 'users',
    color: 'text-green-500',
    bgColor: 'bg-green-100'
  },
  {
    step: 3,
    title: 'Schedule Viewings',
    description: 'Book virtual or in-person property tours at your convenience. Get detailed insights and ask questions.',
    icon: 'calendar',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100'
  },
  {
    step: 4,
    title: 'Make an Offer',
    description: 'Submit competitive offers with agent guidance. We handle negotiations to get you the best deal.',
    icon: 'handshake',
    color: 'text-orange-500',
    bgColor: 'bg-orange-100'
  },
  {
    step: 5,
    title: 'Secure Financing',
    description: 'Get connected with trusted lenders and mortgage experts. We assist with pre-approval and loan processing.',
    icon: 'creditcard',
    color: 'text-red-500',
    bgColor: 'bg-red-100'
  },
  {
    step: 6,
    title: 'Close the Deal',
    description: 'Complete inspections, finalize paperwork, and get your keys. Welcome to your new home!',
    icon: 'key',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100'
  }
];

const sellingSteps = [
  {
    step: 1,
    title: 'Property Evaluation',
    description: 'Get a comprehensive market analysis and professional property valuation to determine optimal pricing.',
    icon: 'chart',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100'
  },
  {
    step: 2,
    title: 'Prepare & Stage',
    description: 'Enhance your property\'s appeal with professional staging advice and high-quality photography.',
    icon: 'camera',
    color: 'text-green-500',
    bgColor: 'bg-green-100'
  },
  {
    step: 3,
    title: 'List & Market',
    description: 'Launch your listing across multiple platforms with optimized descriptions and premium visibility.',
    icon: 'megaphone',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100'
  },
  {
    step: 4,
    title: 'Review Offers',
    description: 'Receive and evaluate offers from qualified buyers. We help you choose the best terms.',
    icon: 'document',
    color: 'text-orange-500',
    bgColor: 'bg-orange-100'
  },
  {
    step: 5,
    title: 'Negotiate & Accept',
    description: 'Navigate negotiations with expert guidance to maximize your sale price and favorable terms.',
    icon: 'handshake',
    color: 'text-red-500',
    bgColor: 'bg-red-100'
  },
  {
    step: 6,
    title: 'Complete Sale',
    description: 'Handle all closing procedures, legal documentation, and transfer of ownership seamlessly.',
    icon: 'check',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100'
  }
];

const HowItWorks: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<'buying' | 'selling'>('buying');

  const renderIcon = (iconName: string, colorClass: string) => {
    const iconProps = {
      className: `w-6 h-6 ${colorClass}`,
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    };

    switch (iconName) {
      case 'search':
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      case 'users':
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        );
      case 'calendar':
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'handshake':
        return (
          <svg {...iconProps} fill="currentColor">
            <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H9v5h2v-3h1c.55 0 1 .45 1 1v4h2v-4c0-1.1-.45-2-1.55-2H11v-3h8V7z"/>
          </svg>
        );
      case 'creditcard':
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'key':
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        );
      case 'chart':
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'camera':
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'megaphone':
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        );
      case 'document':
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'check':
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const currentSteps = activeTab === 'buying' ? buyingSteps : sellingSteps;

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How It <span className="text-orange-500">Works</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Whether you're buying your first home or selling a property, our streamlined process 
            makes real estate transactions simple and stress-free.
          </p>

          {/* Toggle Tabs */}
          <div className="inline-flex bg-gray-100 rounded-full p-1 mb-8">
            <button
              onClick={() => setActiveTab('buying')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'buying'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              Buying Process
            </button>
            <button
              onClick={() => setActiveTab('selling')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'selling'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              Selling Process
            </button>
          </div>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentSteps.map((step, index) => (
            <div
              key={step.step}
              className="relative group"
            >
              {/* Connecting Line (hidden on mobile) */}
              {index < currentSteps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-8 h-0.5 bg-gray-200 transform translate-x-4 -translate-y-1/2" />
              )}

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-orange-200">
                {/* Step Number & Icon */}
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 ${step.bgColor} rounded-full flex items-center justify-center mr-4`}>
                    {renderIcon(step.icon, step.color)}
                  </div>
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-12 text-white">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">
            Ready to {activeTab === 'buying' ? 'Find Your Dream Home' : 'Sell Your Property'}?
          </h3>
          <p className="text-lg mb-8 opacity-90">
            {activeTab === 'buying' 
              ? 'Start your property search today and let our experts guide you home.'
              : 'Get a free property valuation and list with confidence.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/properties')}
              className="px-8 py-4 bg-white text-orange-500 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300"
            >
              {activeTab === 'buying' ? 'Browse Properties' : 'List Your Property'}
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-orange-500 transition-colors duration-300"
            >
              Talk to an Expert
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 