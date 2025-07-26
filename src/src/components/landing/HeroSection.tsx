import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../layout/Navbar';
import SearchFilters from '../SearchFilters';
import Link from 'next/link';

interface SearchFiltersData {
  location: string;
  propertyType: string;
  priceRange: string;
  searchType: 'buy' | 'rent' | 'sell';
}

const HeroSection: React.FC = () => {
  const router = useRouter();

  const handleSearch = (filters: SearchFiltersData) => {
    // Navigate to properties page with search filters as URL params
    const searchParams = new URLSearchParams();
    
    if (filters.location) searchParams.set('location', filters.location);
    if (filters.propertyType !== 'all') searchParams.set('type', filters.propertyType);
    if (filters.priceRange !== 'all') searchParams.set('price', filters.priceRange);
    searchParams.set('searchType', filters.searchType);
    
    router.push(`/properties?${searchParams.toString()}`);
  };

  return (
    <section className="relative h-screen bg-background hero-section">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
      
      {/* Fixed Navigation */}
      <Navbar />

      {/* Hero Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="max-w-2xl">
            {/* Main Headline */}
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              Designed for <span style={{ color: '#F5A623' }}>Seekers.</span>
              <br />
              Powered by <span style={{ color: '#F5A623' }}>Trust.</span>
            </h1>
            
            <p className="text-xl text-white leading-relaxed mb-8">
              Explore distinguished properties with confidence —<br />
              built for buyers, sellers, and serious investors.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <button 
                onClick={() => router.push('/properties')}
                className="px-8 py-4 rounded-full text-white font-bold text-lg transition-all hover:shadow-lg transform hover:scale-105"
                style={{ 
                  backgroundColor: '#F5A623',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}
              >
                Browse Properties
              </button>
              <button 
                onClick={() => router.push('/list-property')}
                className="px-8 py-4 rounded-full border-2 border-white text-white font-bold text-lg transition-all hover:bg-white hover:text-gray-900 transform hover:scale-105"
                style={{ 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  color: '#ffffff'
                }}
              >
                List Your Property
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Search Bar */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-30">
        <SearchFilters 
          onSearch={handleSearch} 
          variant="floating"
          className="min-w-[800px]"
        />
      </div>
    </section>
  );
};

export default HeroSection; 