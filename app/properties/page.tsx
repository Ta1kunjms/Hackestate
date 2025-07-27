'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon, MapIcon, ViewColumnsIcon } from '@heroicons/react/24/outline';
import PropertyCard from '../../src/src/components/PropertyCard';
import PropertyFilters, { PropertyFiltersData } from '../../src/src/components/PropertyFilters';
import { Button } from '../../src/src/components/ui';
import Layout from '../../src/src/components/layout/Layout';
import Navbar from '../../src/src/components/layout/Navbar';
import Footer from '../../src/src/components/layout/Footer';
import { PropertyService, Property } from '../../src/src/services/propertyService';

// Platform properties - in real app, this would come from API
const allProperties: any[] = [];

interface SearchFiltersData {
  location: string;
  propertyType: string;
  priceRange: string;
  searchType: 'buy' | 'rent';
}

type SortOption = 'price-asc' | 'price-desc' | 'newest' | 'oldest' | 'area-asc' | 'area-desc';

const PropertiesPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [savedProperties, setSavedProperties] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState<PropertyFiltersData | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [sellerProperties, setSellerProperties] = useState<any[]>([]);
  
  const propertiesPerPage = 12;

  // Apply URL search parameters on page load
  useEffect(() => {
    const location = searchParams.get('location');
    const type = searchParams.get('type');
    const price = searchParams.get('price');
    const searchType = searchParams.get('searchType') as 'buy' | 'rent';

    if (location || type || price || searchType) {
      setFilters({
        location: location || '',
        propertyType: type || 'all',
        priceRange: price || 'all',
        searchType: searchType || 'buy',
        bedrooms: 'all',
        bathrooms: 'all',
        minArea: '',
        maxArea: '',
        yearBuilt: 'all',
        amenities: [],
        isNew: false,
        isFeatured: false
      });
    }
  }, [searchParams]);

  // Load properties from database
  useEffect(() => {
    const loadProperties = async () => {
      try {
        // Load available properties from database
        const availableProperties = await PropertyService.getAvailableProperties();
        setSellerProperties(availableProperties);
      } catch (error) {
        console.error('Error loading properties:', error);
        setSellerProperties([]);
      }
    };

    loadProperties();
  }, []);

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

  const handleFiltersChange = (newFilters: PropertyFiltersData) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  // Enhanced filtering logic
  const getFilteredAndSortedProperties = () => {
    // Combine platform properties with seller properties
    const combinedProperties = [...allProperties, ...sellerProperties];
    let filtered = combinedProperties;

    if (filters) {
      // Location filter
      if (filters.location) {
        filtered = filtered.filter(property =>
          property.location.toLowerCase().includes(filters.location.toLowerCase()) ||
          property.title.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      // Property type filter
      if (filters.propertyType !== 'all') {
        filtered = filtered.filter(property =>
          property.type.toLowerCase() === filters.propertyType.toLowerCase()
        );
      }

      // Price range filter
      if (filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.includes('+') 
          ? [parseInt(filters.priceRange.replace('+', '')), Infinity]
          : filters.priceRange.split('-').map(Number);
        
        filtered = filtered.filter(property =>
          property.price >= min && (max === Infinity || property.price <= max)
        );
      }

      // Bedrooms filter
      if (filters.bedrooms !== 'all') {
        const bedroomCount = parseInt(filters.bedrooms);
        filtered = filtered.filter(property => {
          if (filters.bedrooms === '5') return property.bedrooms >= 5;
          return property.bedrooms === bedroomCount;
        });
      }

      // Bathrooms filter
      if (filters.bathrooms !== 'all') {
        const bathroomCount = parseInt(filters.bathrooms);
        filtered = filtered.filter(property => {
          if (filters.bathrooms === '4') return property.bathrooms >= 4;
          return property.bathrooms === bathroomCount;
        });
      }

      // Area filters
      if (filters.minArea) {
        filtered = filtered.filter(property => property.area >= parseInt(filters.minArea));
      }
      if (filters.maxArea) {
        filtered = filtered.filter(property => property.area <= parseInt(filters.maxArea));
      }

      // Year built filter
      if (filters.yearBuilt !== 'all') {
        const [minYear, maxYear] = filters.yearBuilt.split('-').map(Number);
        filtered = filtered.filter(property => 
          property.yearBuilt >= minYear && property.yearBuilt <= (maxYear || new Date().getFullYear())
        );
      }

      // Special filters
      if (filters.isNew) {
        filtered = filtered.filter(property => property.isNew);
      }
      if (filters.isFeatured) {
        filtered = filtered.filter(property => property.isFeatured);
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => b.yearBuilt - a.yearBuilt);
        break;
      case 'oldest':
        filtered.sort((a, b) => a.yearBuilt - b.yearBuilt);
        break;
      case 'area-asc':
        filtered.sort((a, b) => a.area - b.area);
        break;
      case 'area-desc':
        filtered.sort((a, b) => b.area - a.area);
        break;
      default:
        filtered.sort((a, b) => a.price - b.price);
    }

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

  return (
    <Layout>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 ${showFilters ? 'grid grid-cols-1 lg:grid-cols-4 gap-8' : ''}`}>
          {/* Sidebar Filters */}
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <PropertyFilters
                  onFiltersChange={handleFiltersChange}
                  initialFilters={filters || undefined}
                  variant="sidebar"
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className={showFilters ? 'lg:col-span-3' : 'col-span-full'}>
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    All <span className="text-orange-500">Properties</span>
                  </h1>
                  <p className="text-gray-600">
                    Browse our complete collection of premium properties
                  </p>
                </div>

                {/* View Controls */}
                <div className="mt-4 lg:mt-0 flex items-center space-x-4">
                  {/* Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                    Filters
                  </button>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="area-asc">Area: Small to Large</option>
                      <option value="area-desc">Area: Large to Small</option>
                    </select>
                  </div>

                  {/* View Toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setShowMap(false)}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        !showMap
                          ? 'text-white bg-orange-500 shadow-sm'
                          : 'text-gray-600 hover:text-orange-500'
                      }`}
                    >
                      <ViewColumnsIcon className="h-4 w-4 mr-1" />
                      Grid
                    </button>
                    <button
                      onClick={() => setShowMap(true)}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        showMap
                          ? 'text-white bg-orange-500 shadow-sm'
                          : 'text-gray-600 hover:text-orange-500'
                      }`}
                    >
                      <MapIcon className="h-4 w-4 mr-1" />
                      Map
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Filters for Mobile */}
            {!showFilters && (
              <div className="mb-6">
                <PropertyFilters
                  onFiltersChange={handleFiltersChange}
                  initialFilters={filters || undefined}
                  variant="compact"
                />
              </div>
            )}

            {/* Results Summary */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Showing {getCurrentProperties().length} of {filteredProperties.length} properties
                  {filters && (
                    <span className="ml-2 text-orange-600">
                      • Filtered results
                    </span>
                  )}
                </p>
              </div>
              
              {/* Quick Stats */}
              {filteredProperties.length > 0 && (
                <div className="hidden md:flex text-xs text-gray-500 space-x-4">
                  <span>Avg: ₱{(filteredProperties.reduce((sum, p) => sum + p.price, 0) / filteredProperties.length / 1000000).toFixed(1)}M</span>
                  <span>Min: ₱{(Math.min(...filteredProperties.map(p => p.price)) / 1000000).toFixed(1)}M</span>
                  <span>Max: ₱{(Math.max(...filteredProperties.map(p => p.price)) / 1000000).toFixed(1)}M</span>
                </div>
              )}
            </div>

            {/* Map View */}
            {showMap && (
              <div className="mb-8 h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Interactive Map View</p>
                  <p className="text-sm text-gray-500">Coming Soon - Map integration with property locations</p>
                </div>
              </div>
            )}

            {/* Properties Grid */}
            {!showMap && (
              <div className={`grid gap-6 mb-12 ${
                showFilters 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              }`}>
                {getCurrentProperties().map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onSave={handleSaveProperty}
                    isSaved={savedProperties.has(property.id)}
                  />
                ))}
              </div>
            )}

            {/* No Results */}
            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or clearing some filters.
                  </p>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setFilters(null);
                      setSortBy('price-asc');
                    }}
                    className="!border-orange-500 !text-orange-500 hover:!bg-orange-500 hover:!text-white"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !showMap && (
              <div className="flex justify-center">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                      const pageIndex = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + index;
                      return (
                        <button
                          key={pageIndex}
                          onClick={() => setCurrentPage(pageIndex)}
                          className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                            currentPage === pageIndex
                              ? 'bg-orange-500 text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {pageIndex + 1}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages - 1}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default PropertiesPage; 