'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  HomeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  CheckIcon,
  XMarkIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import Layout from '../../../../../src/src/components/layout/Layout';
import Navbar from '../../../../../src/src/components/layout/Navbar';
import Footer from '../../../../../src/src/components/layout/Footer';
import { Button, Input, Select, Textarea, FormField } from '../../../../../src/src/components/ui';
import { useAuth } from '../../../../../src/src/contexts/AuthContext';
import { PropertyService, Property, UpdatePropertyData } from '../../../../../src/src/services/propertyService';

interface PropertyFormData {
  title: string;
  type: 'house' | 'condo' | 'apartment' | 'land' | 'commercial';
  price: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  yearBuilt: string;
  description: string;
  features: string[];
  images: File[];
  contactPhone: string;
  contactEmail: string;
}

const EditPropertyPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const { user, hasPermission } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Partial<PropertyFormData>>({});

  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    type: 'house',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    yearBuilt: '',
    description: '',
    features: [],
    images: [],
    contactPhone: '',
    contactEmail: ''
  });

  const propertyTypes = [
    { value: 'house', label: 'House' },
    { value: 'condo', label: 'Condominium' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'land', label: 'Land/Lot' },
    { value: 'commercial', label: 'Commercial' }
  ];

  const availableFeatures = [
    'Swimming Pool', 'Gym', 'Parking', 'Garden', 'Balcony', 
    'Security', 'Elevator', 'Air Conditioning', 'Internet Ready',
    'Furnished', 'Pet Friendly', 'Near Public Transport', 'School Nearby'
  ];

  // Load property data
  useEffect(() => {
    const loadProperty = async () => {
      if (!id) {
        router.push('/seller/dashboard');
        return;
      }

      try {
        // Load property from database
        const property = await PropertyService.getPropertyById(id);
        
        if (property) {
          setFormData({
            title: property.title,
            type: property.property_type.toLowerCase() as any,
            price: property.price.toString(),
            location: property.address,
            bedrooms: property.bedrooms?.toString() || '',
            bathrooms: property.bathrooms?.toString() || '',
            area: property.area_sqm?.toString() || '',
            yearBuilt: property.year_built?.toString() || '',
            description: property.description || '',
            features: property.features || [],
            images: [],
            contactPhone: '', // TODO: Get from user profile
            contactEmail: '' // TODO: Get from user profile
          });
        } else {
          // Property not found
          router.push('/seller/dashboard');
          return;
        }
      } catch (error) {
        console.error('Error loading property:', error);
        router.push('/seller/dashboard');
        return;
      } finally {
        setIsLoading(false);
      }
    };

    loadProperty();
  }, [id, router]);

  // Check permissions
  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/seller/dashboard');
      return;
    }

    if (!hasPermission('can_list_properties') && !hasPermission('can_manage_system')) {
      router.push('/');
    }
  }, [user, hasPermission, router]);

  const validateForm = (): boolean => {
    const newErrors: Partial<PropertyFormData> = {};

    if (!formData.title.trim()) newErrors.title = 'Property title is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.bedrooms.trim()) newErrors.bedrooms = 'Number of bedrooms is required';
    if (!formData.bathrooms.trim()) newErrors.bathrooms = 'Number of bathrooms is required';
    if (!formData.area.trim()) newErrors.area = 'Property area is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Contact phone is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PropertyFormData, value: string | string[] | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !id) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Prepare property data for database update
      const propertyData: UpdatePropertyData = {
        id,
        title: formData.title,
        description: formData.description,
        address: formData.location,
        city: formData.location.split(',')[0]?.trim() || formData.location,
        price: parseFloat(formData.price),
        property_type: formData.type.charAt(0).toUpperCase() + formData.type.slice(1) as any,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area_sqm: parseFloat(formData.area),
        year_built: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
        features: formData.features,
        amenities: formData.features
      };

      // Update in database
      const updatedProperty = await PropertyService.updateProperty(propertyData);
      
      console.log('Property updated in database:', updatedProperty);
      
      setSubmitStatus('success');
      
      // Redirect to seller dashboard after successful update
      setTimeout(() => {
        router.push('/seller/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error updating property:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading property...</p>
          </div>
        </div>
        <Footer />
      </Layout>
    );
  }

  return (
    <Layout>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="outlined"
                onClick={() => router.push('/seller/dashboard')}
                className="flex items-center"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
                <p className="text-gray-600">Update your property listing information</p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="flex items-center">
                <CheckIcon className="h-6 w-6 text-green-500 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-green-800">
                    Property Updated Successfully!
                  </h3>
                  <p className="text-green-700">
                    Your property has been updated and is now live on the platform.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <div className="flex items-center">
                <XMarkIcon className="h-6 w-6 text-red-500 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-red-800">
                    Update Failed
                  </h3>
                  <p className="text-red-700">
                    There was an error updating your property. Please try again.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Property Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <HomeIcon className="h-6 w-6 mr-2" />
                  Basic Information
                </h3>

                <FormField
                  label="Property Title"
                  error={errors.title}
                >
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Modern 3-Bedroom House with Pool"
                    required
                  />
                </FormField>

                <FormField
                  label="Property Type"
                >
                  <Select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    required
                  >
                    {propertyTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField
                  label="Price (₱)"
                  error={errors.price}
                >
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="e.g., 5000000"
                    required
                  />
                </FormField>

                <FormField
                  label="Location"
                  error={errors.location}
                >
                  <Input
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Makati City, Metro Manila"
                    required
                  />
                </FormField>
              </div>

              {/* Property Details */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <MapPinIcon className="h-6 w-6 mr-2" />
                  Property Details
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Bedrooms"
                    error={errors.bedrooms}
                  >
                    <Input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      placeholder="3"
                      required
                    />
                  </FormField>

                  <FormField
                    label="Bathrooms"
                    error={errors.bathrooms}
                  >
                    <Input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      placeholder="2"
                      required
                    />
                  </FormField>
                </div>

                <FormField
                  label="Area (sqm)"
                  error={errors.area}
                >
                  <Input
                    type="number"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    placeholder="150"
                    required
                  />
                </FormField>

                <FormField
                  label="Year Built"
                >
                  <Input
                    type="number"
                    value={formData.yearBuilt}
                    onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                    placeholder="2020"
                  />
                </FormField>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <FormField
                label="Property Description"
                error={errors.description}
              >
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
                  placeholder="Describe your property in detail. Include key features, amenities, and what makes it special..."
                  required
                />
              </FormField>
            </div>

            {/* Features */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Features & Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableFeatures.map(feature => (
                  <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <PhotoIcon className="h-6 w-6 mr-2" />
                Property Images
              </h3>
              <div className="space-y-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
                
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Property image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Contact Phone"
                  error={errors.contactPhone}
                >
                  <Input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    placeholder="+63 912 345 6789"
                    required
                  />
                </FormField>

                <FormField
                  label="Contact Email"
                  error={errors.contactEmail}
                >
                  <Input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </FormField>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end space-x-4">
              <Button
                type="button"
                variant="outlined"
                onClick={() => router.push('/seller/dashboard')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? 'Updating...' : 'Update Property'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </Layout>
  );
};

export default EditPropertyPage; 