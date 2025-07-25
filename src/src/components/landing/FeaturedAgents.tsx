import React from 'react';
import { useRouter } from 'next/navigation';
import AgentCard from '../AgentCard';
import { Button } from '../ui';

// Featured agents data
const featuredAgents = [
  {
    id: '1',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    name: 'Carlos Mendoza',
    location: 'Makati City, Metro Manila',
    language: 'English, Filipino',
    experience: '8+ years experience',
    profileUrl: '/agents/1',
    specialties: ['Luxury Condos', 'Commercial'],
    rating: 4.9,
    properties: 45
  },
  {
    id: '2',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    name: 'Maria Santos',
    location: 'Bonifacio Global City',
    language: 'English, Filipino, Spanish',
    experience: '6+ years experience',
    profileUrl: '/agents/2',
    specialties: ['Family Homes', 'Investments'],
    rating: 4.8,
    properties: 38
  },
  {
    id: '3',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    name: 'David Chen',
    location: 'Ortigas Center, Pasig',
    language: 'English, Mandarin, Filipino',
    experience: '10+ years experience',
    profileUrl: '/agents/3',
    specialties: ['High-rise Living', 'New Developments'],
    rating: 4.9,
    properties: 52
  },
  {
    id: '4',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    name: 'Ana Rodriguez',
    location: 'Alabang, Muntinlupa',
    language: 'English, Filipino',
    experience: '5+ years experience',
    profileUrl: '/agents/4',
    specialties: ['Suburban Homes', 'Family Properties'],
    rating: 4.7,
    properties: 29
  }
];

const FeaturedAgents: React.FC = () => {
  const router = useRouter();

  const handleViewAllAgents = () => {
    router.push('/agents'); // This would be the agents directory page
  };

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured <span className="text-orange-500">Agents</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Connect with our top-performing real estate professionals. 
            Our experienced agents are here to guide you through every step of your property journey.
          </p>
          
          {/* View All Agents Button */}
          <Button
            variant="outlined"
            onClick={handleViewAllAgents}
            className="!border-orange-500 !text-orange-500 hover:!bg-orange-500 hover:!text-white !px-8 !py-3 !text-lg !font-semibold"
          >
            VIEW ALL AGENTS
          </Button>
        </div>

        {/* Enhanced Agent Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredAgents.map((agent) => (
            <div key={agent.id} className="group">
              {/* Enhanced Agent Card with Additional Info */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-orange-200">
                {/* Agent Photo */}
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={agent.avatarUrl} 
                    alt={agent.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                  />
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-semibold text-gray-700">{agent.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Agent Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{agent.location}</p>
                  <p className="text-xs text-gray-500 mb-3">{agent.language}</p>
                  
                  {/* Properties Count */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500">{agent.experience}</span>
                    <span className="text-xs font-semibold text-orange-600">{agent.properties} Properties</span>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {agent.specialties.map((specialty) => (
                      <span 
                        key={specialty}
                        className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  {/* Contact Button */}
                  <button
                    onClick={() => router.push(agent.profileUrl)}
                    className="w-full bg-orange-500 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-300 group-hover:shadow-md"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Need personalized assistance?
            </h3>
            <p className="text-gray-600 mb-6">
              Our expert agents are ready to help you find the perfect property 
              or get the best value for your listing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/contact')}
                className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors duration-300"
              >
                Get Personalized Help
              </button>
              <button
                onClick={() => router.push('/properties')}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-orange-500 hover:text-orange-500 transition-colors duration-300"
              >
                Browse Properties
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAgents; 