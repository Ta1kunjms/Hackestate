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
    <div className={`w-full max-w-sm mx-auto bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group ${className}`}>
      {/* Property Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {property.isNew && (
            <span className="bg-emerald-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-sm">
              New
            </span>
          )}
          {property.isFeatured && (
            <span className="bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveClick}
          className="absolute top-3 right-3 w-8 h-8 bg-white/95 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm"
          aria-label={isSaved ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isSaved ? (
            <HeartSolidIcon className="h-4 w-4 text-red-500" />
          ) : (
            <HeartIcon className="h-4 w-4 text-gray-600 hover:text-red-500" />
          )}
        </button>
      </div>

      {/* Property Details */}
      <div className="p-4">
        {/* Price and Type Row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold text-gray-900 truncate">
              {formatPrice(property.price)}
            </p>
          </div>
          <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium shrink-0">
            {property.type}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight min-h-[2.5rem]">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-start text-gray-600 mb-3">
          <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0 text-gray-400 mt-0.5" />
          <span className="text-xs truncate">{property.location}</span>
        </div>

        {/* Property Features Grid */}
        <div className="grid grid-cols-3 gap-2 mb-3 py-2 bg-gray-50 rounded-lg px-2">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <HomeIcon className="h-3 w-3 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Bed</p>
            <p className="text-xs font-semibold text-gray-900">{property.bedrooms}</p>
          </div>
          <div className="text-center border-l border-r border-gray-200">
            <div className="flex items-center justify-center mb-1">
              <div className="w-3 h-3 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Bath</p>
            <p className="text-xs font-semibold text-gray-900">{property.bathrooms}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <CalendarIcon className="h-3 w-3 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Area</p>
            <p className="text-xs font-semibold text-gray-900">{property.area}m²</p>
          </div>
        </div>

        {/* Year Built */}
        {property.yearBuilt && (
          <div className="text-center text-xs text-gray-500 mb-3">
            Built in {property.yearBuilt}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="sm"
            className="flex-1 !border-gray-200 !text-gray-700 hover:!border-gray-300 hover:!bg-gray-50 !font-medium !text-xs !py-2"
          >
            View Details
          </Button>
          <Button
            variant="filled"
            size="sm"
            className="flex-1 !bg-orange-500 hover:!bg-orange-600 !font-medium !shadow-sm !text-xs !py-2"
          >
            Contact Agent
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard; 