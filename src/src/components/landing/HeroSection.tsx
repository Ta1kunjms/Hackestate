import React, { useState } from 'react';
import { Button, Input } from '../ui';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface SearchFilters {
  location: string;
  propertyType: string;
  priceRange: string;
  searchType: 'buy' | 'rent' | 'sell';
}

const HeroSection: React.FC = () => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    location: '',
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
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <nav className="flex justify-between items-center p-6 lg:px-12">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">🏠</span>
            </div>
            <span className="text-2xl font-bold text-white">TOPPIX</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="#" className="text-white hover:text-green-400 transition-colors">Home</a>
            <a href="#" className="text-white hover:text-green-400 transition-colors">Buy</a>
            <a href="#" className="text-white hover:text-green-400 transition-colors">Rent</a>
            <a href="#" className="text-white hover:text-green-400 transition-colors">Sell</a>
            <a href="#" className="text-white hover:text-green-400 transition-colors">Explore</a>
            <a href="#" className="text-white hover:text-green-400 transition-colors">Blog</a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <button className="text-white hover:text-green-400 transition-colors">Login</button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition-colors">
              Sign up
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-center px-6 lg:px-12">
          <div className="max-w-6xl w-full">
            <div className="text-center mb-12">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
                Designed for <span className="text-orange-400">Seekers.</span>
                <br />
                Powered by <span className="text-orange-400">Trust.</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Explore distinguished properties with confidence — <br />
                built for buyers, sellers, and serious investors.
              </p>

              <div className="mt-8">
                <Button
                  variant="filled"
                  className="!bg-orange-500 hover:!bg-orange-600 !px-8 !py-4 !text-lg !font-semibold !rounded-full"
                >
                  Explore Properties
                </Button>
              </div>
            </div>

            {/* Search Widget */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Search Tabs */}
                <div className="flex border-b border-gray-200">
                  {(['buy', 'rent', 'sell'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => handleTabChange(tab)}
                      className={`flex-1 py-4 px-6 text-lg font-semibold capitalize transition-colors ${
                        searchFilters.searchType === tab
                          ? 'bg-orange-500 text-white'
                          : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
                    {/* Category */}
                    <div>
                      <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        id="propertyType"
                        value={searchFilters.propertyType}
                        onChange={handleInputChange('propertyType')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="house">House</option>
                        <option value="apartment">Apartment</option>
                        <option value="condo">Condo</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="land">Land</option>
                      </select>
                    </div>

                    {/* Location */}
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <Input
                          id="location"
                          type="text"
                          value={searchFilters.location}
                          onChange={handleInputChange('location')}
                          placeholder="General Santos City"
                          className="w-full !text-gray-900 placeholder:!text-gray-500"
                          size="lg"
                        />
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-2">
                        Price Range
                      </label>
                      <select
                        id="priceRange"
                        value={searchFilters.priceRange}
                        onChange={handleInputChange('priceRange')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                      <Button
                        type="submit"
                        variant="filled"
                        className="w-full !bg-orange-500 hover:!bg-orange-600 !py-3 !text-lg !font-semibold !rounded-lg"
                      >
                        <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                        Search
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 