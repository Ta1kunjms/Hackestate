import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon, PlayIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

interface PropertyImage {
  id: string;
  url: string;
  caption?: string;
  type: 'photo' | '360' | 'video';
}

interface PropertyImageGalleryProps {
  images: PropertyImage[];
  propertyTitle: string;
}

const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({ images, propertyTitle }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const currentImage = images[currentImageIndex];
  const thumbnailsToShow = images.slice(0, 6); // Show first 6 as thumbnails

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const prevLightboxImage = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const renderMediaIcon = (type: string) => {
    switch (type) {
      case '360':
        return (
          <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2v-2zm1.61-9.96c-2.06-.3-3.88.97-4.12 2.96-.05.4.25.75.65.75.36 0 .66-.26.72-.61.15-1.18 1.19-2.05 2.38-1.79.75.16 1.33.94 1.33 1.72 0 .6-.4 1.14-.9 1.45L11 13.5v1.5h2v-.88c1.85-.87 2.34-3.13 1.61-4.58-.48-.96-1.33-1.69-2.38-1.79z"/>
            </svg>
            360°
          </div>
        );
      case 'video':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 backdrop-blur-sm rounded-full p-4">
              <PlayIcon className="w-12 h-12 text-white" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative">
        <div className="aspect-[16/10] relative overflow-hidden rounded-xl bg-gray-200">
          <img
            src={currentImage?.url}
            alt={`${propertyTitle} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Media Type Overlay */}
          {renderMediaIcon(currentImage?.type)}

          {/* Image Counter */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
            {currentImageIndex + 1} / {images.length}
          </div>

          {/* Expand Button */}
          <button
            onClick={() => openLightbox(currentImageIndex)}
            className="absolute bottom-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
            title="View in fullscreen"
          >
            <ArrowsPointingOutIcon className="w-5 h-5 text-gray-700" />
          </button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
              >
                <ChevronRightIcon className="w-5 h-5 text-gray-700" />
              </button>
            </>
          )}
        </div>

        {/* Image Caption */}
        {currentImage?.caption && (
          <p className="mt-2 text-sm text-gray-600">{currentImage.caption}</p>
        )}
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-6 gap-2">
        {thumbnailsToShow.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setCurrentImageIndex(index)}
            className={`relative aspect-[4/3] rounded-lg overflow-hidden transition-all ${
              index === currentImageIndex
                ? 'ring-2 ring-orange-500'
                : 'hover:opacity-75'
            }`}
          >
            <img
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Media Type Icon */}
            {image.type === '360' && (
              <div className="absolute top-1 left-1 bg-blue-500 text-white px-1 py-0.5 rounded text-xs font-semibold">
                360°
              </div>
            )}
            {image.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayIcon className="w-4 h-4 text-white drop-shadow-lg" />
              </div>
            )}
          </button>
        ))}

        {/* Show More Button */}
        {images.length > 6 && (
          <button
            onClick={() => openLightbox(0)}
            className="aspect-[4/3] rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors flex flex-col items-center justify-center"
          >
            <span className="text-sm font-semibold text-gray-700">+{images.length - 6}</span>
            <span className="text-xs text-gray-500">more</span>
          </button>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 text-white z-10">
            <span className="text-sm">{lightboxIndex + 1} / {images.length}</span>
          </div>

          {/* Main Lightbox Image */}
          <div className="relative max-w-7xl max-h-full">
            <img
              src={images[lightboxIndex]?.url}
              alt={`${propertyTitle} - Image ${lightboxIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Media Type Overlay */}
            {renderMediaIcon(images[lightboxIndex]?.type)}
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevLightboxImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2"
              >
                <ChevronLeftIcon className="w-8 h-8" />
              </button>
              <button
                onClick={nextLightboxImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2"
              >
                <ChevronRightIcon className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setLightboxIndex(index)}
                className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden transition-all ${
                  index === lightboxIndex
                    ? 'ring-2 ring-white'
                    : 'opacity-60 hover:opacity-80'
                }`}
              >
                <img
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Image Caption */}
          {images[lightboxIndex]?.caption && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white text-center">
              <p className="text-sm">{images[lightboxIndex].caption}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyImageGallery; 