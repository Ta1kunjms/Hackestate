import React from 'react';
import { useNavigate } from 'react-router-dom';

// Blog posts data
const blogPosts = [
  {
    id: 1,
    title: '2024 Philippine Real Estate Market Outlook',
    excerpt: 'Discover the latest trends, investment opportunities, and market predictions for the Philippine property sector.',
    category: 'Market Analysis',
    readTime: '5 min read',
    publishDate: 'March 15, 2024',
    imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    author: 'Maria Santos',
    featured: true
  },
  {
    id: 2,
    title: 'First-Time Buyer\'s Guide to BGC Properties',
    excerpt: 'Everything you need to know about purchasing your first condominium in Bonifacio Global City.',
    category: 'Buying Guide',
    readTime: '8 min read',
    publishDate: 'March 12, 2024',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    author: 'David Chen',
    featured: false
  },
  {
    id: 3,
    title: 'Investment Properties: ROI Strategies',
    excerpt: 'Maximize your property investment returns with these proven strategies and market insights.',
    category: 'Investment',
    readTime: '6 min read',
    publishDate: 'March 10, 2024',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    author: 'Carlos Mendoza',
    featured: false
  }
];

// Events data
const upcomingEvents = [
  {
    id: 1,
    title: 'Metro Manila Property Expo 2024',
    description: 'Join us for the biggest real estate showcase featuring exclusive pre-selling projects and investment opportunities.',
    date: 'April 20-22, 2024',
    time: '10:00 AM - 6:00 PM',
    location: 'SMX Convention Center, Pasay',
    type: 'Expo',
    price: 'Free Entry',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 2,
    title: 'Real Estate Investment Seminar',
    description: 'Learn from industry experts about property investment strategies, financing options, and market trends.',
    date: 'April 15, 2024',
    time: '2:00 PM - 5:00 PM',
    location: 'Makati Shangri-La',
    type: 'Seminar',
    price: '₱1,500',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 3,
    title: 'First-Time Homebuyer Workshop',
    description: 'Essential workshop covering home loans, legal processes, and tips for new property buyers.',
    date: 'April 25, 2024',
    time: '9:00 AM - 12:00 PM',
    location: 'Online Webinar',
    type: 'Workshop',
    price: 'Free',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false
  }
];

const BlogEventTeasers: React.FC = () => {
  const navigate = useNavigate();

  const handleReadMore = (postId: number) => {
    // Navigate to blog post (placeholder)
    navigate(`/blog/${postId}`);
  };

  const handleEventRegister = (eventId: number) => {
    // Navigate to event registration (placeholder)
    navigate(`/events/${eventId}/register`);
  };

  const handleViewAllBlogs = () => {
    navigate('/blog');
  };

  const handleViewAllEvents = () => {
    navigate('/events');
  };

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Blog Section */}
        <div className="mb-20">
          {/* Blog Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Latest <span className="text-orange-500">Insights</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Stay informed with expert analysis, market trends, and practical guides 
                from our real estate professionals.
              </p>
            </div>
            <button
              onClick={handleViewAllBlogs}
              className="mt-6 lg:mt-0 px-6 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors duration-300"
            >
              View All Articles
            </button>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article
                key={post.id}
                className={`group cursor-pointer ${
                  index === 0 ? 'lg:col-span-2' : ''
                }`}
                onClick={() => handleReadMore(post.id)}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-orange-200">
                  {/* Image */}
                  <div className={`relative overflow-hidden ${index === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {post.featured && (
                      <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-xs font-semibold text-gray-700">{post.category}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span>{post.publishDate}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                      <span className="mx-2">•</span>
                      <span>{post.author}</span>
                    </div>
                    
                    <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors ${
                      index === 0 ? 'text-xl lg:text-2xl' : 'text-lg'
                    }`}>
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center text-orange-500 font-semibold text-sm group-hover:text-orange-600">
                      Read More
                      <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Events Section */}
        <div>
          {/* Events Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Upcoming <span className="text-orange-500">Events</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Join our exclusive events, workshops, and seminars to network with industry 
                professionals and enhance your real estate knowledge.
              </p>
            </div>
            <button
              onClick={handleViewAllEvents}
              className="mt-6 lg:mt-0 px-6 py-3 border-2 border-orange-500 text-orange-500 font-semibold rounded-full hover:bg-orange-500 hover:text-white transition-colors duration-300"
            >
              View All Events
            </button>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-orange-200"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {event.featured && (
                    <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-semibold text-gray-700">{event.type}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {/* Price & Register Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-orange-500">{event.price}</span>
                    <button
                      onClick={() => handleEventRegister(event.id)}
                      className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-300"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-12 text-center text-white">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">
            Stay in the Loop
          </h3>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest market insights, property listings, 
            and exclusive event invitations delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-8 py-3 bg-white text-orange-500 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300 whitespace-nowrap">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogEventTeasers; 