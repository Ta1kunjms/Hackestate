'use client';

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
import { PropertyService, Property } from '../../src/src/services/propertyService';
import { InquiryService } from '../../src/src/services/inquiryService';

// Extended property details interface
interface PropertyDetails extends Property {
  nearbyAmenities?: string[];
  floorPlan?: string;
  galleryImages?: Array<{
    id: string;
    url: string;
    caption: string;
    type: 'photo' | '360' | 'video';
  }>;
}

const PropertyDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [savedSimilarProperties, setSavedSimilarProperties] = useState<Set<string>>(new Set());
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferredContact: 'email' as 'email' | 'phone',
    visitDate: '',
    visitTime: ''
  });

  // Load property from database
  useEffect(() => {
    const loadProperty = async () => {
      if (!id) {
        router.push('/properties');
        return;
      }

      try {
        const dbProperty = await PropertyService.getPropertyById(id);
        if (dbProperty) {
          // Transform database property to PropertyDetails format
          const propertyDetails: PropertyDetails = {
            ...dbProperty,
            nearbyAmenities: [
              'Shopping Center - 5 min drive',
              'Schools - 10 min drive',
              'Medical Center - 7 min drive',
              'Public Transport - 3 min walk'
            ],
            floorPlan: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            galleryImages: dbProperty.images.map((img, index) => ({
              id: index.toString(),
              url: img,
              caption: `Property image ${index + 1}`,
              type: 'photo' as const
            }))
          };
          setProperty(propertyDetails);
          
          // Update contact form message
          setContactForm(prev => ({
            ...prev,
            message: `Hi, I'm interested in ${propertyDetails.title}. Please contact me with more information.`
          }));
        } else {
          router.push('/properties');
        }
      } catch (error) {
        console.error('Error loading property:', error);
        router.push('/properties');
      } finally {
        setIsLoading(false);
      }
    };

    loadProperty();
  }, [id, router]);

  if (isLoading) {
    return (
      <Layout>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading property details...</p>
          </div>
        </div>
        <Footer />
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
            <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/properties')}>
              Browse Properties
            </Button>
          </div>
        </div>
        <Footer />
      </Layout>
    );
  }

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
          text: `Check out this ${property.property_type?.toLowerCase()} in ${property.address || property.city}`,
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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // TODO: Re-enable when inquiries table is created
      // await InquiryService.createInquiry({
      //   property_id: property.id,
      //   user_id: 'user-1', // TODO: Get from auth context
      //   message: contactForm.message,
      //   status: 'New'
      // });
      
      alert('Thank you! Your message has been sent to the agent. (Inquiry functionality temporarily disabled)');
      setShowContactForm(false);
    } catch (error) {
      console.error('Error sending inquiry:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

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
                      <span>{property.address || property.city}</span>
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
                    <span>{property.bedrooms || 0} Bedrooms</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center mr-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    <span>{property.bathrooms || 0} Bathrooms</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>{property.area_sqm || 0} sqm</span>
                  </div>
                  {property.year_built && (
                    <div className="flex items-center">
                      <span>Built in {property.year_built}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Property Images */}
              {property.galleryImages && property.galleryImages.length > 0 && (
                <PropertyImageGallery images={property.galleryImages} propertyTitle={property.title} />
              )}

              {/* Property Description */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {property.description || 'No description available.'}
                </p>
              </div>

              {/* Property Features */}
              {property.features && property.features.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nearby Amenities */}
              {property.nearbyAmenities && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Nearby Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.nearbyAmenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Form */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Agent</h3>
                
                {showContactForm ? (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" className="flex-1">
                        Send Message
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => setShowContactForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <Button
                      onClick={() => setShowContactForm(true)}
                      className="w-full"
                    >
                      Contact Agent
                    </Button>
                    <Button
                      variant="outlined"
                      className="w-full"
                    >
                      Schedule Viewing
                    </Button>
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{property.property_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium">{property.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bedrooms:</span>
                    <span className="font-medium">{property.bedrooms || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bathrooms:</span>
                    <span className="font-medium">{property.bathrooms || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Area:</span>
                    <span className="font-medium">{property.area_sqm || 0} sqm</span>
                  </div>
                  {property.year_built && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Year Built:</span>
                      <span className="font-medium">{property.year_built}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default PropertyDetailsPage; 