'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowLeftIcon,
  ShareIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import Layout from '../../../src/src/components/layout/Layout';
import TopPixNavbar from '../../../src/src/components/layout/Navbar';
import Footer from '../../../src/src/components/layout/Footer';
import { Button } from '../../../src/src/components/ui';
import { EventRegistrationButton } from '../../../src/src/components/EventRegistrationButton';
import { supabase } from '../../../src/src/lib/supabase';
import { useAuth } from '../../../src/src/contexts/AuthContext';

interface EventDetails {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  address?: string;
  category: string;
  price: number;
  maxAttendees: number;
  currentAttendees: number;
  imageUrl?: string;
  organizer?: {
    name: string;
    avatar: string;
    company: string;
  };
  tags: string[];
  featured: boolean;
  status: string;
  registrationDeadline?: string;
}

const EventDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);

  const eventId = params.id as string;

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          setError('Event not found');
          return;
        }

        // Map DB fields to EventDetails type
        const eventDetails: EventDetails = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          date: data.event_date,
          time: data.event_time || '',
          endTime: data.end_time || '',
          location: data.location,
          address: data.address || '',
          category: data.event_type || 'Other',
          price: data.price || 0,
          maxAttendees: data.max_capacity || 0,
          currentAttendees: data.attendees_count || 0,
          imageUrl: data.image_url || '',
          organizer: data.organizer || { name: '', avatar: '', company: '' },
          tags: data.tags || [],
          featured: data.featured || false,
          status: data.status || 'Published',
          registrationDeadline: data.registration_deadline || '',
        };

        setEvent(eventDetails);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    const checkRegistration = async () => {
      if (!user?.id || !eventId) {
        setCheckingRegistration(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('event_registrations')
          .select('id')
          .eq('event_id', eventId)
          .eq('user_id', user.id)
          .single();

        setIsRegistered(!!data);
      } catch (error) {
        // User is not registered
        setIsRegistered(false);
      } finally {
        setCheckingRegistration(false);
      }
    };

    checkRegistration();
  }, [user?.id, eventId]);

  const handleRegistrationChange = () => {
    // Refresh the event data to update attendee count
    window.location.reload();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return (
      <Layout>
        <TopPixNavbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading event details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <Layout>
        <TopPixNavbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The event you are looking for does not exist.'}</p>
            <Button onClick={() => router.push('/events')}>
              Back to Events
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const isEventFull = event.currentAttendees >= event.maxAttendees;
  const spotsRemaining = event.maxAttendees - event.currentAttendees;
  const isEventPast = new Date(event.date) < new Date();

  return (
    <Layout>
      <TopPixNavbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="outlined"
              onClick={() => router.push('/events')}
              className="!border-gray-300 !text-gray-700 hover:!bg-gray-50"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </div>

          {/* Event Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            {event.imageUrl && (
              <div className="h-80 bg-gray-200">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-0 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {event.featured && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                        Featured
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      event.status === 'Published' ? 'bg-green-100 text-green-800' :
                      event.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                  <p className="text-lg text-gray-600">{event.category}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outlined"
                    onClick={handleShare}
                    className="!border-gray-300 !text-gray-700 hover:!bg-gray-50"
                  >
                    <ShareIcon className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="outlined"
                    className="!border-gray-300 !text-gray-700 hover:!bg-gray-50"
                  >
                    <BookmarkIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Event Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="w-5 h-5 mr-2" />
                  <span>{formatTime(event.time)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                  <span>{event.price > 0 ? `₱${event.price.toLocaleString()}` : 'Free'}</span>
                </div>
              </div>

              {/* Registration Status */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center text-gray-600">
                  <UserGroupIcon className="w-5 h-5 mr-2" />
                  <span>{event.currentAttendees}/{event.maxAttendees} attendees</span>
                  <span className="ml-2 text-sm text-gray-500">
                    ({spotsRemaining} spots remaining)
                  </span>
                </div>

                {!isEventPast && (
                  <EventRegistrationButton
                    eventId={event.id}
                    maxCapacity={event.maxAttendees}
                    currentAttendees={event.currentAttendees}
                    price={event.price}
                    onRegistrationChange={handleRegistrationChange}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-3 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 lg:p-10">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Event</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
                </div>
              </div>

              {/* Organizer Info */}
              {event.organizer && event.organizer.name && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 lg:p-10">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Organizer</h2>
                  <div className="flex items-center">
                    {event.organizer.avatar && (
                      <img
                        src={event.organizer.avatar}
                        alt={event.organizer.name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">{event.organizer.name}</h3>
                      {event.organizer.company && (
                        <p className="text-gray-600">{event.organizer.company}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 lg:p-10">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              {/* Event Summary Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{formatTime(event.time)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{event.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">
                      {event.price > 0 ? `₱${event.price.toLocaleString()}` : 'Free'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium">{event.maxAttendees} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available:</span>
                    <span className={`font-medium ${spotsRemaining <= 5 ? 'text-red-600' : 'text-green-600'}`}>
                      {spotsRemaining} spots
                    </span>
                  </div>
                </div>
              </div>

              {/* Registration Status */}
              {user && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Status</h3>
                  {checkingRegistration ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Checking registration...</p>
                    </div>
                  ) : isRegistered ? (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-green-600 font-medium">You're registered!</p>
                      <p className="text-sm text-gray-600 mt-1">We'll send you updates about this event.</p>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-600 mb-3">You're not registered for this event yet.</p>
                      <EventRegistrationButton
                        eventId={event.id}
                        maxCapacity={event.maxAttendees}
                        currentAttendees={event.currentAttendees}
                        price={event.price}
                        onRegistrationChange={handleRegistrationChange}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Event Status */}
              {isEventPast && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 lg:p-8">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Event Ended</h3>
                  <p className="text-yellow-700 text-sm">
                    This event has already taken place. Check out our upcoming events!
                  </p>
                </div>
              )}

              {isEventFull && !isEventPast && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 lg:p-8">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Event Full</h3>
                  <p className="text-red-700 text-sm">
                    This event has reached maximum capacity. Check out our other events!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default EventDetailsPage; 