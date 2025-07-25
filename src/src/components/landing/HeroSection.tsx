import React, { useState } from 'react';
import { Button, Input } from '../ui';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Navbar from '../layout/Navbar';

interface SearchFilters {
  location: string;
  propertyType: string;
  priceRange: string;
  searchType: 'buy' | 'rent' | 'sell';
}

const HeroSection: React.FC = () => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    location: 'General Santos City',
    propertyType: 'house',
    priceRange: '150000-300000',
    searchType: 'buy'
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Search filters:', searchFilters);
  };

  const handleInputChange = (field: keyof SearchFilters) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleTabChange = (searchType: 'buy' | 'rent' | 'sell') => {
    setSearchFilters(prev => ({
      ...prev,
      searchType
    }));
  };

  return (
    <section className="relative h-screen" style={{ backgroundColor: '#1C1C1E' }}>
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
            
            <p className="text-xl text-gray-200 leading-relaxed mb-8">
              Explore distinguished properties with confidence —<br />
              built for buyers, sellers, and serious investors.
            </p>

            <button 
              className="px-6 py-3 rounded-full text-white font-semibold transition-all hover:shadow-lg transform hover:scale-105"
              style={{ 
                backgroundColor: '#F5A623',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}
            >
              Explore Properties
            </button>
          </div>
        </div>
      </div>

      {/* Floating Search Bar */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-30">
        <div 
          className="bg-white rounded-xl shadow-2xl overflow-hidden"
          style={{ 
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            minWidth: '800px'
          }}
        >
          {/* Search Tabs */}
          <div className="flex border-b border-gray-200">
            {(['buy', 'rent', 'sell'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 py-4 px-6 text-lg font-semibold capitalize transition-colors ${
                  searchFilters.searchType === tab
                    ? 'text-white'
                    : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
                }`}
                style={{
                  backgroundColor: searchFilters.searchType === tab ? '#F5A623' : 'transparent'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="p-6">
            <div className="flex gap-4 items-end">
              {/* Category */}
              <div className="flex-1">
                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="propertyType"
                  value={searchFilters.propertyType}
                  onChange={handleInputChange('propertyType')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:border-orange-500"
                >
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="land">Land</option>
                </select>
              </div>

              {/* Location */}
              <div className="flex-1">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  value={searchFilters.location}
                  onChange={handleInputChange('location')}
                  placeholder="General Santos City"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:border-orange-500"
                />
              </div>

              {/* Price Range */}
              <div className="flex-1">
                <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  id="priceRange"
                  value={searchFilters.priceRange}
                  onChange={handleInputChange('priceRange')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:border-orange-500"
                >
                  <option value="150000-300000">₱150,000 - ₱300,000</option>
                  <option value="300000-500000">₱300,000 - ₱500,000</option>
                  <option value="500000-1000000">₱500,000 - ₱1,000,000</option>
                  <option value="1000000-2000000">₱1,000,000 - ₱2,000,000</option>
                  <option value="2000000-5000000">₱2,000,000 - ₱5,000,000</option>
                  <option value="5000000+">₱5,000,000+</option>
                </select>
              </div>

              {/* Search Button */}
              <div>
                <button
                  type="submit"
                  className="flex items-center px-5 py-3 rounded-lg text-white font-semibold transition-colors hover:opacity-90"
                  style={{ backgroundColor: '#F5A623' }}
                >
                  <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 