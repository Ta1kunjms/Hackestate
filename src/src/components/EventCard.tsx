import React, { useState } from 'react';
import { useRouter } from 'next/navigation';  
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  UsersIcon,
  StarIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { Button } from './ui';
import EventRegistrationModal from './EventRegistrationModal';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  address: string;
  category: 'Seminar' | 'Workshop' | 'Expo' | 'Networking' | 'Tour' | 'Webinar';
  price: number;
  maxAttendees: number;
  currentAttendees: number;
  imageUrl: string;
  organizer: {
    name: string;
    avatar: string;
    company: string;
  };
  tags: string[];
  featured: boolean;
  status: 'Published' | 'Draft' | 'Cancelled' | 'Sold Out';
  registrationDeadline: string;
  requirements?: string[];
}

interface EventCardProps {
  event: Event;
  onRSVP?: (eventId: string) => void;
  isRegistered?: boolean;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onRSVP,
  isRegistered = false,
  variant = 'default',
  className = ''
}) => {
  const router = useRouter();
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `₱${price.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Sold Out':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Seminar':
        return 'bg-blue-100 text-blue-800';
      case 'Workshop':
        return 'bg-purple-100 text-purple-800';
      case 'Expo':
        return 'bg-orange-100 text-orange-800';
      case 'Networking':
        return 'bg-green-100 text-green-800';
      case 'Tour':
        return 'bg-pink-100 text-pink-800';
      case 'Webinar':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isEventFull = event.currentAttendees >= event.maxAttendees;
  const isEventPast = new Date(event.date) < new Date();
  const spotsRemaining = event.maxAttendees - event.currentAttendees;
  const isDeadlinePassed = new Date(event.registrationDeadline) < new Date();

  const canRegister = event.status === 'Published' && !isEventFull && !isEventPast && !isDeadlinePassed && !isRegistered;

  const handleCardClick = () => {
    router.push(`/events/${event.id}`);
  };

  const handleRSVPClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (canRegister) {
      setShowRegistrationModal(true);
    }
  };

  const handleRegistrationComplete = (registrationData: any) => {
    if (onRSVP) {
      onRSVP(event.id);
    }
    setShowRegistrationModal(false);
  };

  if (variant === 'compact') {
    return (
      <div 
        onClick={handleCardClick}
        className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-4 cursor-pointer ${className}`}
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {event.title}
                </h3>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <CalendarIcon className="w-3 h-3 mr-1" />
                  {formatDate(event.date)} • {formatTime(event.time)}
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <MapPinIcon className="w-3 h-3 mr-1" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                  {event.category}
                </span>
                <span className="text-xs font-semibold text-gray-900">
                  {formatPrice(event.price)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleCardClick}
      className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer ${
        variant === 'featured' ? 'ring-2 ring-orange-500 ring-opacity-50' : ''
      } ${className}`}
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlays */}
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          {event.featured && (
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <StarIcon className="w-3 h-3 mr-1" />
              Featured
            </span>
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
            {event.category}
          </span>
        </div>
        
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
            {event.status}
          </span>
        </div>
        
        {/* Price Badge */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-1">
            <span className="text-sm font-bold text-gray-900">
              {formatPrice(event.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
            {event.title}
          </h3>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Event Meta Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span>
              {formatTime(event.time)}
              {event.endTime && ` - ${formatTime(event.endTime)}`}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span className="truncate">{event.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <UsersIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span>
              {event.currentAttendees}/{event.maxAttendees} attendees
              {spotsRemaining > 0 && spotsRemaining <= 10 && (
                <span className="text-orange-600 ml-1">
                  • {spotsRemaining} spots left
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Tags */}
        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
              >
                <TagIcon className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{event.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Organizer */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img
              src={event.organizer.avatar}
              alt={event.organizer.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-900">{event.organizer.name}</p>
              <p className="text-xs text-gray-500">{event.organizer.company}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => handleRSVPClick({} as React.MouseEvent)}
            disabled={!canRegister}
            className={`flex-1 ${
              isRegistered
                ? '!bg-green-500 !text-white !border-green-500'
                : canRegister
                ? '!bg-orange-500 hover:!bg-orange-600 !text-white'
                : '!bg-gray-300 !text-gray-500 !cursor-not-allowed'
            }`}
          >
            {isRegistered ? (
              'Registered ✓'
            ) : isEventFull ? (
              'Sold Out'
            ) : isEventPast ? (
              'Event Ended'
            ) : isDeadlinePassed ? (
              'Registration Closed'
            ) : (
              'Register Now'
            )}
          </Button>
          
          <Button
            variant="outlined"
            onClick={handleCardClick}
            className="!border-gray-300 !text-gray-700 hover:!bg-gray-50"
          >
            Details
          </Button>
        </div>

        {/* Registration Deadline Warning */}
        {canRegister && new Date(event.registrationDeadline).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000 && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-xs text-yellow-800">
              Registration closes: {formatDate(event.registrationDeadline)}
            </p>
          </div>
                  )}
      </div>

      {/* Registration Modal */}
      <EventRegistrationModal
        event={event}
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onRegister={handleRegistrationComplete}
      />
    </div>
  );
};

export default EventCard; 