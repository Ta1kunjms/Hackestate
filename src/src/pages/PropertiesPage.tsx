import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import PropertyCard from '../components/PropertyCard';
import { Button } from '../components/ui';
import Layout from '../components/layout/Layout';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SearchFilters from '../components/SearchFilters';

// Mock data for all properties (moved from FeaturedListings)
const allProperties = [
  {
    id: '1',
    title: 'Modern 3-Bedroom House with Swimming Pool',
    price: 4500000,
    location: 'Alabang, Muntinlupa City',
    type: 'House',
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    yearBuilt: 2022,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    isNew: true,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Luxury Condominium Unit with City View',
    price: 8500000,
    location: 'Makati City',
    type: 'Condo',
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    yearBuilt: 2023,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    isFeatured: true,
  },
  {
    id: '3',
    title: 'Charming Townhouse in Gated Community',
    price: 3200000,
    location: 'Quezon City',
    type: 'Townhouse',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    yearBuilt: 2021,
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    isNew: true,
  },
  {
    id: '4',
    title: 'Spacious Family Home with Garden',
    price: 5200000,
    location: 'Pasig City',
    type: 'House',
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    yearBuilt: 2020,
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    isFeatured: true,
  },
  {
    id: '5',
    title: 'Modern Studio Apartment Downtown',
    price: 2800000,
    location: 'Mandaluyong City',
    type: 'Apartment',
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    yearBuilt: 2023,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    isNew: true,
  },
  {
    id: '6',
    title: 'Executive Villa with Private Pool',
    price: 12000000,
    location: 'Antipolo, Rizal',
    type: 'Villa',
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    yearBuilt: 2022,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    isFeatured: true,
  },
  {
    id: '7',
    title: 'Cozy Beach House with Ocean View',
    price: 6800000,
    location: 'Batangas City',
    type: 'House',
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    yearBuilt: 2021,
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    isFeatured: true,
  },
  {
    id: '8',
    title: 'High-Rise Penthouse Suite',
    price: 15000000,
    location: 'Bonifacio Global City',
    type: 'Penthouse',
    bedrooms: 4,
    bathrooms: 3,
    area: 220,
    yearBuilt: 2023,
    imageUrl: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    isNew: true,
    isFeatured: true,
  },
  {
    id: '9',
    title: 'Traditional Filipino House',
    price: 3800000,
    location: 'Laguna',
    type: 'House',
    bedrooms: 4,
    bathrooms: 2,
    area: 160,
    yearBuilt: 2020,
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    isFeatured: true,
  },
  {
    id: '10',
    title: 'Modern Duplex with Rooftop Garden',
    price: 7200000,
    location: 'Cebu City',
    type: 'Duplex',
    bedrooms: 3,
    bathrooms: 3,
    area: 190,
    yearBuilt: 2022,
    imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    isNew: true,
  },
  {
    id: '11',
    title: 'Luxury Loft in Business District',
    price: 9500000,
    location: 'Ortigas Center',
    type: 'Loft',
    bedrooms: 2,
    bathrooms: 2,
    area: 110,
    yearBuilt: 2023,
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    isFeatured: true,
  },
  {
    id: '12',
    title: 'Garden Bungalow with Pool',
    price: 4200000,
    location: 'Cavite',
    type: 'Bungalow',
    bedrooms: 2,
    bathrooms: 2,
    area: 130,
    yearBuilt: 2021,
    imageUrl: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    isNew: true,
  },
  {
    id: '13',
    title: 'Corporate Housing Complex Unit',
    price: 3600000,
    location: 'Taguig City',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 1,
    area: 75,
    yearBuilt: 2022,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    isFeatured: true,
  },
  {
    id: '14',
    title: 'Mountain View Retreat House',
    price: 5800000,
    location: 'Tagaytay City',
    type: 'House',
    bedrooms: 3,
    bathrooms: 2,
    area: 170,
    yearBuilt: 2020,
    imageUrl: 'https://images.unsplash.com/photo-1494526585095-c41746248156?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    isFeatured: true,
  },
  {
    id: '15',
    title: 'Urban Studio with City Access',
    price: 2200000,
    location: 'Manila',
    type: 'Studio',
    bedrooms: 1,
    bathrooms: 1,
    area: 35,
    yearBuilt: 2023,
    imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    isNew: true,
  },
];

interface SearchFiltersData {
  location: string;
  propertyType: string;
  priceRange: string;
  searchType: 'buy' | 'rent' | 'sell';
}

const PropertiesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [savedProperties, setSavedProperties] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const [searchFilters, setSearchFilters] = useState<SearchFiltersData | null>(null);
  
  const propertiesPerPage = 12; // 4 columns × 3 rows

  // Apply URL search parameters on page load
  useEffect(() => {
    const location = searchParams.get('location');
    const type = searchParams.get('type');
    const price = searchParams.get('price');
    const searchType = searchParams.get('searchType') as 'buy' | 'rent' | 'sell';

    if (location || type || price || searchType) {
      setSearchFilters({
        location: location || '',
        propertyType: type || 'all',
        priceRange: price || 'all',
        searchType: searchType || 'buy'
      });
    }
  }, [searchParams]);

  const handleSaveProperty = (propertyId: string) => {
    setSavedProperties(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(propertyId)) {
        newSaved.delete(propertyId);
      } else {
        newSaved.add(propertyId);
      }
      return newSaved;
    });
  };

  const handleSearch = (filters: SearchFiltersData) => {
    setSearchFilters(filters);
    setCurrentPage(0); // Reset to first page on new search
  };

  // Filter and sort properties
  const getFilteredAndSortedProperties = () => {
    let filtered = allProperties;

    // Apply search filters from SearchFilters component
    if (searchFilters) {
      // Location filter
      if (searchFilters.location) {
        filtered = filtered.filter(property =>
          property.location.toLowerCase().includes(searchFilters.location.toLowerCase()) ||
          property.title.toLowerCase().includes(searchFilters.location.toLowerCase())
        );
      }

      // Property type filter
      if (searchFilters.propertyType !== 'all') {
        filtered = filtered.filter(property =>
          property.type.toLowerCase() === searchFilters.propertyType.toLowerCase()
        );
      }

      // Price range filter
      if (searchFilters.priceRange !== 'all') {
        const [min, max] = searchFilters.priceRange.includes('+') 
          ? [parseInt(searchFilters.priceRange.replace('+', '')), Infinity]
          : searchFilters.priceRange.split('-').map(Number);
        
        filtered = filtered.filter(property =>
          property.price >= min && (max === Infinity || property.price <= max)
        );
      }
    }

    // Default sort by price (low to high)
    filtered.sort((a, b) => a.price - b.price);

    return filtered;
  };

  const filteredProperties = getFilteredAndSortedProperties();
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  const getCurrentProperties = () => {
    const startIndex = currentPage * propertiesPerPage;
    return filteredProperties.slice(startIndex, startIndex + propertiesPerPage);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(0);
  }, [searchFilters]);



  return (
    <Layout>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              All <span className="text-orange-500">Properties</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Browse our complete collection of premium properties. Use the filters below to find your perfect home.
            </p>
          </div>

          {/* Advanced Search Filters */}
          <div className="mb-8">
            <SearchFilters 
              onSearch={handleSearch} 
              initialFilters={searchFilters || undefined}
            />
          </div>

          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Showing {getCurrentProperties().length} of {filteredProperties.length} properties
              {searchFilters && (
                <span className="ml-2 text-orange-600">
                  (Search active: {searchFilters.searchType}
                  {searchFilters.location && ` in ${searchFilters.location}`}
                  {searchFilters.propertyType !== 'all' && ` - ${searchFilters.propertyType}`}
                  {searchFilters.priceRange !== 'all' && ` - ${searchFilters.priceRange}`})
                </span>
              )}
            </p>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12 place-items-center">
            {getCurrentProperties().map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSave={handleSaveProperty}
                isSaved={savedProperties.has(property.id)}
              />
            ))}
          </div>

          {/* No Results */}
          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No properties found matching your criteria.</p>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchFilters(null);
                }}
                className="mt-4 !border-orange-500 !text-orange-500 hover:!bg-orange-500 hover:!text-white"
              >
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                        currentPage === index
                          ? 'bg-orange-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default PropertiesPage; 