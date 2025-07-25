import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PropertyCard from '../PropertyCard';
import { Button } from '../ui';

// Simplified featured properties for landing page preview
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
];

const FeaturedListings: React.FC = () => {
  const [savedProperties, setSavedProperties] = useState<Set<string>>(new Set());
  const router = useRouter();

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

  const handleViewAllProperties = () => {
    router.push('/properties');
  };

  return (
    <section className="pt-32 pb-16 lg:pb-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured <span className="text-orange-500">Properties</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Discover our handpicked selection of premium properties. From modern condominiums 
            to luxury villas, find your perfect home today.
          </p>
          
          {/* View All Button */}
          <Button
            variant="outlined"
            onClick={handleViewAllProperties}
            className="!border-orange-500 !text-orange-500 hover:!bg-orange-500 hover:!text-white !px-8 !py-3 !text-lg !font-semibold"
          >
            VIEW ALL PROPERTIES
          </Button>
        </div>

        {/* Properties Grid - Only 4 featured properties */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center">
          {featuredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSave={handleSaveProperty}
              isSaved={savedProperties.has(property.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings; 