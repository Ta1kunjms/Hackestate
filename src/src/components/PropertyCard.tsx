import React from 'react';
import { MapPinIcon, HomeIcon, CalendarIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Button } from './ui';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  isNew?: boolean;
  isFeatured?: boolean;
  yearBuilt?: number;
}

interface PropertyCardProps {
  property: Property;
  onSave?: (propertyId: string) => void;
  isSaved?: boolean;
  className?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSave,
  isSaved = false,
  className = ''
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSave) {
      onSave(property.id);
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${className}`}>
      {/* Property Image */}
      <div className="relative aspect-property overflow-hidden">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Status Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {property.isNew && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              New
            </span>
          )}
          {property.isFeatured && (
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Featured
            </span>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveClick}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          aria-label={isSaved ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isSaved ? (
            <HeartSolidIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Property Details */}
      <div className="p-6">
        {/* Price */}
        <div className="mb-3">
          <p className="text-2xl font-bold text-gray-900">
            {formatPrice(property.price)}
          </p>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-4">
          <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-sm truncate">{property.location}</span>
        </div>

        {/* Property Features */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <HomeIcon className="h-4 w-4 mr-1" />
            <span>{property.bedrooms}BR</span>
          </div>
          <div className="flex items-center">
            <span>{property.bathrooms}BA</span>
          </div>
          <div className="flex items-center">
            <span>{property.area} sqm</span>
          </div>
          {property.yearBuilt && (
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>{property.yearBuilt}</span>
            </div>
          )}
        </div>

        {/* Property Type */}
        <div className="mb-4">
          <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
            {property.type}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outlined"
            size="sm"
            className="flex-1 !border-gray-300 !text-gray-700 hover:!border-orange-500 hover:!text-orange-500"
          >
            View Details
          </Button>
          <Button
            variant="filled"
            size="sm"
            className="flex-1 !bg-orange-500 hover:!bg-orange-600"
          >
            Contact Agent
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard; 