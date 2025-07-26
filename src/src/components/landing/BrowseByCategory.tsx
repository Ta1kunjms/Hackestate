import React from 'react';
import { useRouter } from 'next/navigation';

// Category data with images and descriptions
const categories = [
  {
    type: 'House',
    title: 'Houses',
    description: 'Single-family homes with privacy and space',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    count: '120+ Properties'
  },
  { 
    type: 'Condo',
    title: 'Condominiums',
    description: 'Modern living with premium amenities',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    count: '85+ Properties'
  },
  {
    type: 'Apartment',
    title: 'Apartments',
    description: 'Affordable comfort in prime locations',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    count: '95+ Properties'
  },
  {
    type: 'Villa',
    title: 'Luxury Villas',
    description: 'Exclusive properties with exceptional features',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    count: '45+ Properties'
  },
  {
    type: 'Townhouse',
    title: 'Townhouses',
    description: 'Multi-level living with contemporary design',
    imageUrl: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    count: '60+ Properties'
  },
  {
    type: 'Commercial',
    title: 'Commercial',
    description: 'Business spaces and investment opportunities',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    count: '30+ Properties'
  }
];

const BrowseByCategory: React.FC = () => {
  const router = useRouter();

  const handleCategoryClick = (propertyType: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set('type', propertyType.toLowerCase());
    router.push(`/properties?${searchParams.toString()}`);
  };

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Browse by <span className="text-orange-500">Category</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover your ideal property type. From cozy apartments to luxury villas, 
            we have something for every lifestyle and budget.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.type}
              onClick={() => handleCategoryClick(category.type)}
              className="group relative overflow-hidden rounded-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {/* Background Image */}
              <div className="aspect-[4/3] relative">
                <img
                  src={category.imageUrl}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 bg-orange-500 text-xs font-semibold rounded-full mb-3">
                    {category.count}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-orange-300 transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-white leading-relaxed">
                  {category.description}
                </p>
              </div>

              {/* Hover Arrow */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Categories CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => router.push('/properties')}  
            className="inline-flex items-center px-8 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors duration-300 transform hover:scale-105"
          >
            View All Properties
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default BrowseByCategory; 