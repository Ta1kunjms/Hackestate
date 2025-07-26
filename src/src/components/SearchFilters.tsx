import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchFiltersData {
  location: string;
  propertyType: string;
  priceRange: string;
  searchType: 'buy' | 'rent' | 'sell';
}

interface SearchFiltersProps {
  onSearch: (filters: SearchFiltersData) => void;
  className?: string;
  variant?: 'floating' | 'inline';
  initialFilters?: Partial<SearchFiltersData>;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ 
  onSearch, 
  className = '', 
  variant = 'inline',
  initialFilters 
}) => {
  const [searchFilters, setSearchFilters] = useState<SearchFiltersData>({
    location: initialFilters?.location || '',
    propertyType: initialFilters?.propertyType || 'all',
    priceRange: initialFilters?.priceRange || 'all',
    searchType: initialFilters?.searchType || 'buy'
  });

  // Update filters when initialFilters change
  React.useEffect(() => {
    if (initialFilters) {
      setSearchFilters({
        location: initialFilters.location || '',
        propertyType: initialFilters.propertyType || 'all',
        priceRange: initialFilters.priceRange || 'all',
        searchType: initialFilters.searchType || 'buy'
      });
    }
  }, [initialFilters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchFilters);
  };

  const handleInputChange = (field: keyof SearchFiltersData) => (
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

  const containerClasses = variant === 'floating' 
    ? `bg-card rounded-xl shadow-2xl overflow-hidden ${className}`
    : `bg-card rounded-lg shadow-sm border border-border overflow-hidden ${className}`;

  const formClasses = variant === 'floating'
    ? 'p-6'
    : 'p-4';

  return (
    <div className={containerClasses}>
      {/* Search Tabs */}
      <div className="flex border-b border-border">
        {(['buy', 'rent', 'sell'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`flex-1 py-3 px-4 text-sm font-semibold capitalize transition-colors ${
              searchFilters.searchType === tab
                ? 'text-white bg-orange-500'
                : 'text-card-foreground hover:text-orange-500 hover:bg-orange-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className={formClasses}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Property Type */}
          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-card-foreground mb-2">
              Property Type
            </label>
            <select
              id="propertyType"
              value={searchFilters.propertyType}
              onChange={handleInputChange('propertyType')}
              className="w-full px-3 py-2 border border-border rounded-lg text-card-foreground bg-background focus:outline-none focus:ring-2 focus:border-orange-500"
            >
              <option value="all">All Types</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="villa">Villa</option>
              <option value="penthouse">Penthouse</option>
              <option value="loft">Loft</option>
              <option value="bungalow">Bungalow</option>
              <option value="duplex">Duplex</option>
              <option value="studio">Studio</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-card-foreground mb-2">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={searchFilters.location}
              onChange={handleInputChange('location')}
              placeholder="Enter city or area..."
              className="w-full px-3 py-2 border border-border rounded-lg text-card-foreground bg-background focus:outline-none focus:ring-2 focus:border-orange-500"
            />
          </div>

          {/* Price Range */}
          <div>
            <label htmlFor="priceRange" className="block text-sm font-medium text-card-foreground mb-2">
              Price Range
            </label>
            <select
              id="priceRange"
              value={searchFilters.priceRange}
              onChange={handleInputChange('priceRange')}
              className="w-full px-3 py-2 border border-border rounded-lg text-card-foreground bg-background focus:outline-none focus:ring-2 focus:border-orange-500"
            >
              <option value="all">Any Price</option>
              <option value="0-2000000">Under ₱2M</option>
              <option value="2000000-5000000">₱2M - ₱5M</option>
              <option value="5000000-10000000">₱5M - ₱10M</option>
              <option value="10000000-15000000">₱10M - ₱15M</option>
              <option value="15000000+">₱15M+</option>
            </select>
          </div>

          {/* Search Button */}
          <div>
            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-white font-semibold transition-colors hover:bg-orange-600 bg-orange-500"
            >
              <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchFilters; 