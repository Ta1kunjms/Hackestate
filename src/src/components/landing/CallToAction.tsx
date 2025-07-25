import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CallToAction: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');

  const handleListProperty = () => {
    // Navigate to property listing form (placeholder)
    navigate('/list-property');
  };

  const handleContactAgent = () => {
    // Navigate to contact/agent selection (placeholder)
    navigate('/contact');
  };

  const handleGetStarted = () => {
    if (activeTab === 'buy') {
      navigate('/properties');
    } else {
      handleListProperty();
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center text-white">
          {/* Main Headline */}
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Ready to Make Your
            <br />
            <span className="text-yellow-300">Next Move?</span>
          </h2>
          
          <p className="text-xl lg:text-2xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed">
            Whether you're buying your dream home or selling your current property, 
            our expert team is here to guide you every step of the way.
          </p>

          {/* Toggle Tabs */}
          <div className="inline-flex bg-white/20 backdrop-blur-sm rounded-full p-1 mb-12">
            <button
              onClick={() => setActiveTab('buy')}
              className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 text-lg ${
                activeTab === 'buy'
                  ? 'bg-white text-orange-500 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              I'm Looking to Buy
            </button>
            <button
              onClick={() => setActiveTab('sell')}
              className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 text-lg ${
                activeTab === 'sell'
                  ? 'bg-white text-orange-500 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              I'm Ready to Sell
            </button>
          </div>

          {/* Dynamic Content Based on Tab */}
          <div className="mb-12">
            {activeTab === 'buy' ? (
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                  Find Your Perfect Home Today
                </h3>
                <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                  Browse thousands of verified properties, get expert advice, 
                  and secure your dream home with our trusted agents.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/properties')}
                    className="px-10 py-4 bg-white text-orange-500 font-bold rounded-full text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    Browse Properties
                  </button>
                  <button
                    onClick={handleContactAgent}
                    className="px-10 py-4 border-2 border-white text-white font-bold rounded-full text-lg hover:bg-white hover:text-orange-500 transition-all duration-300 transform hover:scale-105"
                  >
                    Talk to an Agent
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                  Get Top Dollar for Your Property
                </h3>
                <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                  List with confidence using our proven marketing strategies, 
                  professional photography, and expert pricing guidance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleListProperty}
                    className="px-10 py-4 bg-white text-orange-500 font-bold rounded-full text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    List My Property
                  </button>
                  <button
                    onClick={() => navigate('/property-valuation')}
                    className="px-10 py-4 border-2 border-white text-white font-bold rounded-full text-lg hover:bg-white hover:text-orange-500 transition-all duration-300 transform hover:scale-105"
                  >
                    Get Free Valuation
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">24hr</div>
              <div className="text-sm opacity-80">Average Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">15+</div>
              <div className="text-sm opacity-80">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">₱2.5B+</div>
              <div className="text-sm opacity-80">Properties Sold</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-sm opacity-80">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction; 