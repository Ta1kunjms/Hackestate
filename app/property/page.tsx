import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { HeartIcon, ShareIcon, MapPinIcon, CalendarIcon, HomeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Layout from '../../src/src/components/layout/Layout';
import Navbar from '../../src/src/components/layout/Navbar';
import Footer from '../../src/src/components/layout/Footer';
import PropertyImageGallery from '../../src/src/components/PropertyImageGallery';
import PropertyCard from '../../src/src/components/PropertyCard';
import { Button } from '../../src/src/components/ui';

// Mock property data with detailed information
const mockPropertyDetails = {
  id: '1',
  title: 'Modern 3-Bedroom House with Swimming Pool',
  price: 4500000,
  location: 'Alabang, Muntinlupa City',
  type: 'House',
  bedrooms: 3,
  bathrooms: 2,
  area: 150,
  yearBuilt: 2022,
  isNew: true,
  isFeatured: true,
  description: `Experience luxury living in this stunning modern 3-bedroom house located in the prestigious Alabang area. This beautifully designed home features contemporary architecture, high-quality finishes, and a private swimming pool perfect for relaxation and entertainment.

The open-plan living area creates a seamless flow between the kitchen, dining, and living rooms, ideal for both daily living and hosting guests. Large windows throughout the home provide abundant natural light and garden views.

The master bedroom includes an en-suite bathroom and walk-in closet, while two additional bedrooms offer flexibility for family, guests, or a home office. The property sits on a well-landscaped lot with mature trees and tropical plants.`,
  features: [
    'Private Swimming Pool',
    'Modern Kitchen with Island',
    'Master Suite with Walk-in Closet',
    'Covered Garage for 2 Cars',
    'Landscaped Garden',
    'Security System',
    'Central Air Conditioning',
    'High-Speed Internet Ready',
    'Backup Generator',
    'Outdoor Entertainment Area'
  ],
  nearbyAmenities: [
    'Alabang Town Center - 5 min drive',
    'Festival Mall - 8 min drive',
    'Southwoods Golf Club - 12 min drive',
    'International Schools - 10 min drive',
    'Medical Center - 7 min drive',
    'Churches - 3 min walk'
  ],
  floorPlan: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  images: [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      caption: 'Beautiful exterior with modern architecture',
      type: 'photo' as const
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      caption: 'Spacious living room with natural light',
      type: 'photo' as const
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      caption: 'Modern kitchen with island and premium appliances',
      type: 'photo' as const
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1540518614846-7eded1d52033?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      caption: 'Master bedroom with walk-in closet',
      type: 'photo' as const
    },
    {
      id: '5',
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      caption: 'Luxurious bathroom with modern fixtures',
      type: 'photo' as const
    },
    {
      id: '6',
      url: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      caption: 'Private swimming pool and outdoor area',
      type: 'photo' as const
    },
    {
      id: '7',
      url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      caption: '360° Virtual Tour of Living Room',
      type: '360' as const
    },
    {
      id: '8',
      url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      caption: 'Property Walkthrough Video',
      type: 'video' as const
    }
  ],
  agent: {
    id: '1',
    name: 'Carlos Mendoza',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    title: 'Senior Real Estate Agent',
    experience: '8+ years experience',
    phone: '+63 917 123 4567',
    email: 'carlos.mendoza@realestate.com',
    bio: 'Carlos specializes in luxury properties in the Alabang area and has helped over 200 families find their dream homes.',
    rating: 4.9,
    reviewCount: 127
  }
};

// Mock similar properties
const similarProperties = [
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
  }
];

const PropertyDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };
  const [property] = useState(mockPropertyDetails); // In real app, fetch by ID
  const [isSaved, setIsSaved] = useState(false);
  const [savedSimilarProperties, setSavedSimilarProperties] = useState<Set<string>>(new Set());
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Hi, I'm interested in ${mockPropertyDetails.title}. Please contact me with more information.`,
    preferredContact: 'email' as 'email' | 'phone',
    visitDate: '',
    visitTime: ''
  });

  useEffect(() => {
    // In real app, fetch property details by ID
    if (!id) {
      router.push('/properties');
    }
  }, [id, router]);

  const handleSaveProperty = () => {
    setIsSaved(!isSaved);
  };

  const handleSaveSimilarProperty = (propertyId: string) => {
    setSavedSimilarProperties(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(propertyId)) {
        newSaved.delete(propertyId);
      } else {
        newSaved.add(propertyId);
      }
      return newSaved;
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this ${property.type.toLowerCase()} in ${property.location}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing cancelled');
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert('Property URL copied to clipboard!');
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    // In real app, send to backend
    alert('Thank you! Your message has been sent to the agent.');
    setShowContactForm(false);
  };

  const formatPrice = (price: number) => {
    return `₱${(price / 1000000).toFixed(1)}M`;
  };

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <button onClick={() => router.push('/')} className="hover:text-orange-500">Home</button>
              <span>/</span>
              <button onClick={() => router.push('/properties')} className="hover:text-orange-500">Properties</button>
              <span>/</span>
              <span className="text-gray-900">{property.title}</span>
            </div>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Property Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span>{property.location}</span>
                    </div>
                    <div className="text-3xl font-bold text-orange-500">
                      {formatPrice(property.price)}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveProperty}
                      className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:border-orange-500 transition-colors"
                    >
                      {isSaved ? (
                        <HeartIconSolid className="h-6 w-6 text-red-500" />
                      ) : (
                        <HeartIcon className="h-6 w-6 text-gray-600" />
                      )}
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:border-orange-500 transition-colors"
                    >
                      <ShareIcon className="h-6 w-6 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Property Stats */}
                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <HomeIcon className="h-4 w-4 mr-1" />
                    <span>{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11" />
                    </svg>
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <span>{property.area} sqm</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>Built in {property.yearBuilt}</span>
                  </div>
                </div>

                {/* Property Badges */}
                <div className="flex space-x-2 mt-4">
                  {property.isNew && (
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                      New
                    </span>
                  )}
                  {property.isFeatured && (
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                      Featured
                    </span>
                  )}
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-sm font-semibold rounded-full">
                    {property.type}
                  </span>
                </div>
              </div>

              {/* Image Gallery */}
              <PropertyImageGallery images={property.images} propertyTitle={property.title} />

              {/* Description */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                <div className="prose prose-gray max-w-none">
                  {property.description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nearby Amenities */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Nearby Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.nearbyAmenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <MapPinIcon className="h-4 w-4 text-orange-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floor Plan */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Floor Plan</h2>
                <div className="aspect-[16/10] bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={property.floorPlan}
                    alt="Floor Plan"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Agent Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Agent</h3>
                  
                  <div className="flex items-center mb-4">
                    <img
                      src={property.agent.photo}
                      alt={property.agent.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{property.agent.name}</h4>
                      <p className="text-sm text-gray-600">{property.agent.title}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(property.agent.rating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">
                          {property.agent.rating} ({property.agent.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{property.agent.bio}</p>

                  <div className="space-y-3">
                    <Button
                      onClick={() => setShowContactForm(!showContactForm)}
                      className="w-full !bg-orange-500 hover:!bg-orange-600 !text-white"
                    >
                      {showContactForm ? 'Hide Contact Form' : 'Send Message'}
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outlined"
                        onClick={() => window.open(`tel:${property.agent.phone}`)}
                        className="!border-orange-500 !text-orange-500 hover:!bg-orange-500 hover:!text-white text-sm"
                      >
                        Call Now
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => window.open(`mailto:${property.agent.email}`)}
                        className="!border-orange-500 !text-orange-500 hover:!bg-orange-500 hover:!text-white text-sm"
                      >
                        Email
                      </Button>
                    </div>
                  </div>

                  {/* Contact Form */}
                  {showContactForm && (
                    <form onSubmit={handleContactSubmit} className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                        <textarea
                          required
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
                        />
                      </div>

                      {/* Schedule Viewing */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Schedule a Viewing (Optional)</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Preferred Date</label>
                            <input
                              type="date"
                              value={contactForm.visitDate}
                              onChange={(e) => setContactForm({...contactForm, visitDate: e.target.value})}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Preferred Time</label>
                            <select
                              value={contactForm.visitTime}
                              onChange={(e) => setContactForm({...contactForm, visitTime: e.target.value})}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:border-orange-500"
                            >
                              <option value="">Select time</option>
                              <option value="morning">Morning (9AM-12PM)</option>
                              <option value="afternoon">Afternoon (1PM-5PM)</option>
                              <option value="evening">Evening (6PM-8PM)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full !bg-orange-500 hover:!bg-orange-600 !text-white">
                        Send Message
                      </Button>
                    </form>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Schedule Virtual Tour
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Get Mortgage Pre-Approval
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Property Comparison
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          <div className="mt-16">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Similar <span className="text-orange-500">Properties</span>
              </h2>
              <p className="text-gray-600">
                Discover other properties that might interest you in the same area or price range.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((similarProperty) => (
                <PropertyCard
                  key={similarProperty.id}
                  property={similarProperty}
                  onSave={handleSaveSimilarProperty}
                  isSaved={savedSimilarProperties.has(similarProperty.id)}
                />
              ))}
            </div>

            <div className="text-center mt-8">
              <Button
                variant="outlined"
                onClick={() => router.push('/properties')}
                className="!border-orange-500 !text-orange-500 hover:!bg-orange-500 hover:!text-white !px-8 !py-3"
              >
                View All Properties
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default PropertyDetailsPage; 