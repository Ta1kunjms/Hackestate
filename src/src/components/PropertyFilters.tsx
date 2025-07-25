import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export interface PropertyFiltersData {
  location: string;
  propertyType: string;
  priceRange: string;
  searchType: 'buy' | 'rent' | 'sell';
  bedrooms: string;
  bathrooms: string;
  minArea: string;
  maxArea: string;
  yearBuilt: string;
  amenities: string[];
  isNew: boolean;
  isFeatured: boolean;
}

interface PropertyFiltersProps {
  onFiltersChange: (filters: PropertyFiltersData) => void;
  className?: string;
  variant?: 'sidebar' | 'compact';
  initialFilters?: Partial<PropertyFiltersData>;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  onFiltersChange,
  className = '',
  variant = 'sidebar',
  initialFilters
}) => {
  const [filters, setFilters] = useState<PropertyFiltersData>({
    location: initialFilters?.location || '',
    propertyType: initialFilters?.propertyType || 'all',
    priceRange: initialFilters?.priceRange || 'all',
    searchType: initialFilters?.searchType || 'buy',
    bedrooms: initialFilters?.bedrooms || 'all',
    bathrooms: initialFilters?.bathrooms || 'all',
    minArea: initialFilters?.minArea || '',
    maxArea: initialFilters?.maxArea || '',
    yearBuilt: initialFilters?.yearBuilt || 'all',
    amenities: initialFilters?.amenities || [],
    isNew: initialFilters?.isNew || false,
    isFeatured: initialFilters?.isFeatured || false
  });

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    details: false,
    amenities: false,
    special: false
  });

  const amenitiesList = [
    'Swimming Pool', 'Gym', 'Parking', 'Garden', 'Balcony', 
    'Security', 'Elevator', 'Air Conditioning', 'Internet Ready'
  ];

  const handleFilterChange = (field: keyof PropertyFiltersData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearchTypeChange = (searchType: 'buy' | 'rent' | 'sell') => {
    const newFilters = { ...filters, searchType };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    
    const newFilters = { ...filters, amenities: newAmenities };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearAllFilters = () => {
    const clearedFilters: PropertyFiltersData = {
      location: '',
      propertyType: 'all',
      priceRange: 'all',
      searchType: 'buy',
      bedrooms: 'all',
      bathrooms: 'all',
      minArea: '',
      maxArea: '',
      yearBuilt: 'all',
      amenities: [],
      isNew: false,
      isFeatured: false
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
        {/* Search Tabs */}
        <div className="flex border-b border-gray-200">
          {(['buy', 'rent', 'sell'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleSearchTypeChange(tab)}
              className={`flex-1 py-3 px-4 text-sm font-semibold capitalize transition-colors ${
                filters.searchType === tab
                  ? 'text-white bg-orange-500'
                  : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Compact Form */}
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <input
                type="text"
                value={filters.location}
                onChange={handleFilterChange('location')}
                placeholder="Location..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
              />
            </div>
            <div>
              <select
                value={filters.propertyType}
                onChange={handleFilterChange('propertyType')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
              >
                <option value="all">All Types</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
              </select>
            </div>
            <div>
              <select
                value={filters.priceRange}
                onChange={handleFilterChange('priceRange')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
              >
                <option value="all">Any Price</option>
                <option value="0-2000000">Under ₱2M</option>
                <option value="2000000-5000000">₱2M - ₱5M</option>
                <option value="5000000-10000000">₱5M - ₱10M</option>
                <option value="10000000+">₱10M+</option>
              </select>
            </div>
            <div>
              <select
                value={filters.bedrooms}
                onChange={handleFilterChange('bedrooms')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
              >
                <option value="all">Any Bedrooms</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>
            </div>
            <div>
              <button
                onClick={clearAllFilters}
                className="w-full px-4 py-2 text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-orange-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>
          <button
            onClick={clearAllFilters}
            className="text-sm text-orange-500 hover:text-orange-600 font-medium"
          >
            Clear All
          </button>
        </div>

        {/* Search Type Tabs */}
        <div className="mt-4 flex bg-gray-100 rounded-lg p-1">
          {(['buy', 'rent', 'sell'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleSearchTypeChange(tab)}
              className={`flex-1 py-2 px-3 text-sm font-medium capitalize rounded-md transition-colors ${
                filters.searchType === tab
                  ? 'text-white bg-orange-500 shadow-sm'
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Basic Filters */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('basic')}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50"
        >
          <span className="font-medium text-gray-900">Basic Search</span>
          {expandedSections.basic ? (
            <ChevronUpIcon className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.basic && (
          <div className="px-6 pb-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={filters.location}
                onChange={handleFilterChange('location')}
                placeholder="Enter city, area, or address..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                value={filters.propertyType}
                onChange={handleFilterChange('propertyType')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
              >
                <option value="all">All Property Types</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condominium</option>
                <option value="townhouse">Townhouse</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Penthouse</option>
                <option value="loft">Loft</option>
                <option value="duplex">Duplex</option>
                <option value="studio">Studio</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                value={filters.priceRange}
                onChange={handleFilterChange('priceRange')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
              >
                <option value="all">Any Price</option>
                <option value="0-2000000">Under ₱2M</option>
                <option value="2000000-5000000">₱2M - ₱5M</option>
                <option value="5000000-10000000">₱5M - ₱10M</option>
                <option value="10000000-15000000">₱10M - ₱15M</option>
                <option value="15000000+">₱15M+</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('details')}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50"
        >
          <span className="font-medium text-gray-900">Property Details</span>
          {expandedSections.details ? (
            <ChevronUpIcon className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.details && (
          <div className="px-6 pb-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <select
                  value={filters.bedrooms}
                  onChange={handleFilterChange('bedrooms')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
                >
                  <option value="all">Any</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4 Bedrooms</option>
                  <option value="5">5+ Bedrooms</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                <select
                  value={filters.bathrooms}
                  onChange={handleFilterChange('bathrooms')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
                >
                  <option value="all">Any</option>
                  <option value="1">1 Bathroom</option>
                  <option value="2">2 Bathrooms</option>
                  <option value="3">3 Bathrooms</option>
                  <option value="4">4+ Bathrooms</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Area (sqm)</label>
                <input
                  type="number"
                  value={filters.minArea}
                  onChange={handleFilterChange('minArea')}
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Area (sqm)</label>
                <input
                  type="number"
                  value={filters.maxArea}
                  onChange={handleFilterChange('maxArea')}
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year Built</label>
              <select
                value={filters.yearBuilt}
                onChange={handleFilterChange('yearBuilt')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
              >
                <option value="all">Any Year</option>
                <option value="2023-2024">2023-2024 (New)</option>
                <option value="2020-2022">2020-2022</option>
                <option value="2015-2019">2015-2019</option>
                <option value="2010-2014">2010-2014</option>
                <option value="2000-2009">2000-2009</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Amenities */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('amenities')}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50"
        >
          <span className="font-medium text-gray-900">Amenities</span>
          {expandedSections.amenities ? (
            <ChevronUpIcon className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.amenities && (
          <div className="px-6 pb-4">
            <div className="grid grid-cols-1 gap-2">
              {amenitiesList.map((amenity) => (
                <label key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Special Filters */}
      <div>
        <button
          onClick={() => toggleSection('special')}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50"
        >
          <span className="font-medium text-gray-900">Special Features</span>
          {expandedSections.special ? (
            <ChevronUpIcon className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.special && (
          <div className="px-6 pb-4 space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.isNew}
                onChange={handleFilterChange('isNew')}
                className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700">New Properties Only</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.isFeatured}
                onChange={handleFilterChange('isFeatured')}
                className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700">Featured Properties Only</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyFilters; 