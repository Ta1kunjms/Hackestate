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
import { supabase } from '../../src/src/lib/supabase';

// Events will be loaded from Supabase

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
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract unique values for filter options
  const categories = ['all', ...Array.from(new Set(events.map(e => e.category)))];
  const locations = ['all', ...Array.from(new Set(events.map(e => e.location)))];
  const allTags = Array.from(new Set(events.flatMap(e => e.tags || [])));

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });
      if (error) {
        setError('Failed to load events');
        setEvents([]);
      } else {
        // Map DB fields to Event type and add fallback fields for compatibility
        setEvents((data || []).map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description || '',
          date: event.event_date,
          time: event.event_time || '',
          endTime: event.end_time || '',
          location: event.location,
          address: event.address || '',
          category: event.event_type || 'Other',
          price: event.price || 0,
          maxAttendees: event.max_capacity || 0,
          currentAttendees: event.attendees_count || 0,
          imageUrl: event.image_url || '',
          organizer: event.organizer || { name: '', avatar: '', company: '' },
          tags: event.tags || [],
          featured: event.featured || false,
          status: event.status || 'Published',
          registrationDeadline: event.registration_deadline || '',
        })));
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

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
    let filtered = events;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        (event.organizer?.name?.toLowerCase().includes(term) || false) ||
        (event.tags || []).some(tag => tag.toLowerCase().includes(term))
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
        filters.tags.some(tag => (event.tags || []).includes(tag))
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
        filtered.sort((a, b) => (b.currentAttendees || 0) - (a.currentAttendees || 0));
        break;
      case 'featured':
        filtered.sort((a, b) => {
          if ((a.featured || false) === (b.featured || false)) {
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

          {/* Loading and Error States */}
          {loading && (
            <div className="text-center py-12 text-gray-500">Loading events...</div>
          )}
          {error && (
            <div className="text-center py-12 text-red-500">{error}</div>
          )}

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
                Showing {filteredEvents.length} of {events.length} events
                {hasActiveFilters && (
                  <span className="ml-2 text-orange-600">• Filtered results</span>
                )}
              </p>
            </div>
          </div>

          {/* Events Grid */}
          {!loading && !error && filteredEvents.length > 0 ? (
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