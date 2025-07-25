'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  MapPinIcon,
  TagIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Layout from '../../src/src/components/layout/Layout';
import Navbar from '../../src/src/components/layout/Navbar';
import Footer from '../../src/src/components/layout/Footer';
import EventCard, { Event } from '../../src/src/components/EventCard';
import { Button } from '../../src/src/components/ui';

// Mock events data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Metro Manila Property Expo 2024',
    description: 'The largest real estate exhibition in the Philippines featuring top developers, latest projects, and exclusive deals. Meet with industry experts, explore investment opportunities, and discover your dream property.',
    date: '2024-04-20',
    time: '10:00',
    endTime: '18:00',
    location: 'SMX Convention Center',
    address: 'SMX Convention Center, Mall of Asia Complex, Pasay City',
    category: 'Expo',
    price: 0,
    maxAttendees: 500,
    currentAttendees: 245,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    organizer: {
      name: 'Philippine Real Estate Association',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      company: 'PREA'
    },
    tags: ['Real Estate', 'Investment', 'Property', 'Networking'],
    featured: true,
    status: 'Published',
    registrationDeadline: '2024-04-18'
  },
  {
    id: '2',
    title: 'Real Estate Investment Strategies Seminar',
    description: 'Learn from successful real estate investors about proven strategies, market analysis, and wealth building through property investment. Perfect for beginners and experienced investors.',
    date: '2024-04-15',
    time: '14:00',
    endTime: '17:00',
    location: 'Makati Shangri-La',
    address: 'Makati Shangri-La, Ayala Avenue, Makati City',
    category: 'Seminar',
    price: 2500,
    maxAttendees: 100,
    currentAttendees: 67,
    imageUrl: 'https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    organizer: {
      name: 'Carlos Mendoza',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      company: 'Elite Real Estate'
    },
    tags: ['Investment', 'Education', 'Strategy', 'Finance'],
    featured: false,
    status: 'Published',
    registrationDeadline: '2024-04-13'
  },
  {
    id: '3',
    title: 'First-Time Home Buyer Workshop',
    description: 'Complete guide for first-time home buyers covering loan processes, legal requirements, property inspection, and negotiation tips. Includes Q&A session with experts.',
    date: '2024-04-25',
    time: '09:00',
    endTime: '12:00',
    location: 'Bonifacio Global City',
    address: 'The Fort, Taguig City',
    category: 'Workshop',
    price: 1500,
    maxAttendees: 50,
    currentAttendees: 23,
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    organizer: {
      name: 'Maria Santos',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      company: 'HomeFinder PH'
    },
    tags: ['First-time Buyers', 'Education', 'Home Buying', 'Legal'],
    featured: false,
    status: 'Published',
    registrationDeadline: '2024-04-23'
  },
  {
    id: '4',
    title: 'Luxury Property Showcase',
    description: 'Exclusive viewing of premium properties in prime locations. Meet with luxury property specialists and explore high-end residential and commercial projects.',
    date: '2024-05-05',
    time: '16:00',
    endTime: '20:00',
    location: 'Rockwell Center',
    address: 'Rockwell Center, Makati City',
    category: 'Tour',
    price: 5000,
    maxAttendees: 30,
    currentAttendees: 28,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    organizer: {
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      company: 'Luxury Properties Inc.'
    },
    tags: ['Luxury', 'Premium', 'Showcase', 'High-end'],
    featured: true,
    status: 'Published',
    registrationDeadline: '2024-05-03'
  },
  {
    id: '5',
    title: 'Real Estate Digital Marketing Webinar',
    description: 'Learn how to leverage digital marketing for real estate success. Covers social media marketing, lead generation, virtual tours, and online advertising strategies.',
    date: '2024-04-30',
    time: '19:00',
    endTime: '21:00',
    location: 'Online Event',
    address: 'Virtual Event - Zoom Platform',
    category: 'Webinar',
    price: 800,
    maxAttendees: 200,
    currentAttendees: 156,
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    organizer: {
      name: 'Tech Real Estate Hub',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      company: 'Digital RE Solutions'
    },
    tags: ['Digital Marketing', 'Technology', 'Online', 'Social Media'],
    featured: false,
    status: 'Published',
    registrationDeadline: '2024-04-28'
  },
  {
    id: '6',
    title: 'Property Management Networking Event',
    description: 'Connect with property managers, landlords, and service providers. Share experiences, discuss challenges, and build valuable business relationships in the property management industry.',
    date: '2024-05-10',
    time: '18:30',
    endTime: '21:30',
    location: 'Alabang Town Center',
    address: 'Alabang Town Center, Muntinlupa City',
    category: 'Networking',
    price: 1200,
    maxAttendees: 80,
    currentAttendees: 42,
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    organizer: {
      name: 'Property Managers Association',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      company: 'PMA Philippines'
    },
    tags: ['Networking', 'Property Management', 'Business', 'Professional'],
    featured: false,
    status: 'Published',
    registrationDeadline: '2024-05-08'
  }
];

interface EventFilters {
  category: string;
  location: string;
  priceRange: string;
  dateRange: string;
  tags: string[];
}

type SortOption = 'date-asc' | 'date-desc' | 'price-asc' | 'price-desc' | 'popularity' | 'featured';

const EventsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('date-asc');
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<EventFilters>({
    category: searchParams.get('category') || 'all',
    location: searchParams.get('location') || 'all',
    priceRange: searchParams.get('price') || 'all',
    dateRange: searchParams.get('date') || 'all',
    tags: []
  });

  // Extract unique values for filter options
  const categories = ['all', ...Array.from(new Set(mockEvents.map(e => e.category)))];
  const locations = ['all', ...Array.from(new Set(mockEvents.map(e => e.location)))];
  const allTags = Array.from(new Set(mockEvents.flatMap(e => e.tags)));

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.location !== 'all') params.set('location', filters.location);
    if (filters.priceRange !== 'all') params.set('price', filters.priceRange);
    if (filters.dateRange !== 'all') params.set('date', filters.dateRange);
    
    // setSearchParams(params);
  }, [searchTerm, filters]);

  const handleRSVP = (eventId: string) => {
    setRegisteredEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      location: 'all',
      priceRange: 'all',
      dateRange: 'all',
      tags: []
    });
    setSearchTerm('');
  };

  const getFilteredAndSortedEvents = () => {
    let filtered = mockEvents;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.organizer.name.toLowerCase().includes(term) ||
        event.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(event => event.category === filters.category);
    }

    // Location filter
    if (filters.location !== 'all') {
      filtered = filtered.filter(event => event.location === filters.location);
    }

    // Price range filter
    if (filters.priceRange !== 'all') {
      switch (filters.priceRange) {
        case 'free':
          filtered = filtered.filter(event => event.price === 0);
          break;
        case 'under-2000':
          filtered = filtered.filter(event => event.price > 0 && event.price < 2000);
          break;
        case '2000-5000':
          filtered = filtered.filter(event => event.price >= 2000 && event.price <= 5000);
          break;
        case 'over-5000':
          filtered = filtered.filter(event => event.price > 5000);
          break;
      }
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (filters.dateRange) {
        case 'today':
          filtered = filtered.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.toDateString() === today.toDateString();
          });
          break;
        case 'this-week':
          const weekEnd = new Date(today);
          weekEnd.setDate(today.getDate() + 7);
          filtered = filtered.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today && eventDate <= weekEnd;
          });
          break;
        case 'this-month':
          const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          filtered = filtered.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today && eventDate <= monthEnd;
          });
          break;
        case 'upcoming':
          filtered = filtered.filter(event => new Date(event.date) >= today);
          break;
      }
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(event =>
        filters.tags.some(tag => event.tags.includes(tag))
      );
    }

    // Sort events
    switch (sortBy) {
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        filtered.sort((a, b) => b.currentAttendees - a.currentAttendees);
        break;
      case 'featured':
        filtered.sort((a, b) => {
          if (a.featured === b.featured) {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          }
          return a.featured ? -1 : 1;
        });
        break;
      default:
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return filtered;
  };

  const filteredEvents = getFilteredAndSortedEvents();
  const hasActiveFilters = filters.category !== 'all' || filters.location !== 'all' || 
    filters.priceRange !== 'all' || filters.dateRange !== 'all' || 
    filters.tags.length > 0 || searchTerm;

  return (
    <Layout>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Real Estate <span className="text-orange-500">Events</span>
            </h1>
            <p className="text-xl text-gray-600">
              Discover upcoming seminars, workshops, networking events, and property showcases
            </p>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search events, topics, or organizers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500 text-sm"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500 text-sm"
                >
                  <option value="date-asc">Date: Soonest First</option>
                  <option value="date-desc">Date: Latest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="popularity">Most Popular</option>
                  <option value="featured">Featured First</option>
                </select>

                <Button
                  variant="outlined"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`!border-gray-300 !text-gray-700 hover:!bg-gray-50 ${showFilters ? '!bg-gray-100' : ''}`}
                >
                  <FunnelIcon className="w-4 h-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      !
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500 text-sm"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500 text-sm"
                    >
                      {locations.map(location => (
                        <option key={location} value={location}>
                          {location === 'all' ? 'All Locations' : location}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                    <select
                      value={filters.priceRange}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500 text-sm"
                    >
                      <option value="all">All Prices</option>
                      <option value="free">Free Events</option>
                      <option value="under-2000">Under ₱2,000</option>
                      <option value="2000-5000">₱2,000 - ₱5,000</option>
                      <option value="over-5000">Over ₱5,000</option>
                    </select>
                  </div>

                  {/* Date Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500 text-sm"
                    >
                      <option value="all">All Dates</option>
                      <option value="today">Today</option>
                      <option value="this-week">This Week</option>
                      <option value="this-month">This Month</option>
                      <option value="upcoming">Upcoming</option>
                    </select>
                  </div>
                </div>

                {/* Tags Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          setFilters(prev => ({
                            ...prev,
                            tags: prev.tags.includes(tag)
                              ? prev.tags.filter(t => t !== tag)
                              : [...prev.tags, tag]
                          }));
                        }}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          filters.tags.includes(tag)
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <TagIcon className="w-3 h-3 inline mr-1" />
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <div className="flex justify-end">
                    <Button
                      variant="outlined"
                      onClick={clearFilters}
                      className="!border-gray-300 !text-gray-700 hover:!bg-gray-50"
                    >
                      <XMarkIcon className="w-4 h-4 mr-2" />
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-600">
                Showing {filteredEvents.length} of {mockEvents.length} events
                {hasActiveFilters && (
                  <span className="ml-2 text-orange-600">• Filtered results</span>
                )}
              </p>
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onRSVP={handleRSVP}
                  isRegistered={registeredEvents.has(event.id)}
                  variant={event.featured ? 'featured' : 'default'}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters to find events that match your interests.
                </p>
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  className="!border-orange-500 !text-orange-500 hover:!bg-orange-500 hover:!text-white"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default EventsPage; 