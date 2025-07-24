import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import PropertyCard from '../PropertyCard';
import { Button } from '../ui';

// Mock data for featured properties
const featuredProperties = [
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
];

const FeaturedListings: React.FC = () => {
  const [savedProperties, setSavedProperties] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const propertiesPerPage = 6;
  const totalPages = Math.ceil(featuredProperties.length / propertiesPerPage);

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

  const getCurrentProperties = () => {
    const startIndex = currentPage * propertiesPerPage;
    return featuredProperties.slice(startIndex, startIndex + propertiesPerPage);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured <span className="text-orange-500">Properties</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our handpicked selection of premium properties. From modern condominiums 
            to luxury villas, find your perfect home today.
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {getCurrentProperties().map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSave={handleSaveProperty}
              isSaved={savedProperties.has(property.id)}
            />
          ))}
        </div>

        {/* Navigation and View All */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Pagination */}
          {totalPages > 1 && (
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
          )}

          {/* View All Button */}
          <Button
            variant="outlined"
            className="!border-orange-500 !text-orange-500 hover:!bg-orange-500 hover:!text-white !px-8 !py-3 !text-lg !font-semibold"
          >
            View All Properties
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl lg:text-4xl font-bold text-orange-500 mb-2">500+</div>
            <div className="text-gray-600 font-medium">Properties Listed</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-bold text-orange-500 mb-2">98%</div>
            <div className="text-gray-600 font-medium">Client Satisfaction</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-bold text-orange-500 mb-2">250+</div>
            <div className="text-gray-600 font-medium">Verified Agents</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings; 