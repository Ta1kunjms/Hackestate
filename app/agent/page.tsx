import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  HomeIcon, 
  ChatBubbleLeftIcon, 
  ChartBarIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Button } from '../components/ui';

// Mock agent data
const mockAgent = {
  id: '1',
  name: 'Carlos Mendoza',
  email: 'carlos.mendoza@realestate.com',
  phone: '+63 917 123 4567',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  title: 'Senior Real Estate Agent',
  license: 'RE-12345678',
  experience: '8+ years',
  rating: 4.9,
  reviewCount: 127,
  joinDate: '2016-03-15'
};

// Mock agent properties
const agentProperties = [
  {
    id: '1',
    title: 'Modern 3-Bedroom House with Swimming Pool',
    price: 4500000,
    location: 'Alabang, Muntinlupa City',
    type: 'House',
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    status: 'Active',
    views: 245,
    inquiries: 12,
    datePosted: '2024-01-10',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    title: 'Luxury Condominium Unit with City View',
    price: 8500000,
    location: 'Makati City',
    type: 'Condo',
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    status: 'Pending',
    views: 189,
    inquiries: 8,
    datePosted: '2024-01-05',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    title: 'Executive Villa with Private Pool',
    price: 12000000,
    location: 'Antipolo, Rizal',
    type: 'Villa',
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    status: 'Sold',
    views: 167,
    inquiries: 15,
    datePosted: '2023-12-20',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

// Mock inquiries
const inquiries = [
  {
    id: '1',
    propertyId: '1',
    propertyTitle: 'Modern 3-Bedroom House with Swimming Pool',
    clientName: 'Maria Santos',
    clientEmail: 'maria.santos@email.com',
    clientPhone: '+63 917 987 6543',
    message: 'Hi, I\'m interested in scheduling a viewing for this property. When would be a good time this weekend?',
    type: 'Viewing Request',
    status: 'New',
    priority: 'High',
    createdDate: '2024-01-16T10:30:00Z',
    responseDeadline: '2024-01-17T10:30:00Z'
  },
  {
    id: '2',
    propertyId: '2',
    propertyTitle: 'Luxury Condominium Unit with City View',
    clientName: 'John Chen',
    clientEmail: 'john.chen@email.com',
    clientPhone: '+63 917 555 0123',
    message: 'I would like more information about the HOA fees and building amenities. Also, is parking included?',
    type: 'Information Request',
    status: 'Responded',
    priority: 'Medium',
    createdDate: '2024-01-15T14:20:00Z',
    responseDate: '2024-01-15T16:45:00Z'
  },
  {
    id: '3',
    propertyId: '1',
    propertyTitle: 'Modern 3-Bedroom House with Swimming Pool',
    clientName: 'Ana Rodriguez',
    clientEmail: 'ana.rodriguez@email.com',
    clientPhone: '+63 917 444 5678',
    message: 'Is the price negotiable? I\'m a cash buyer and can close quickly.',
    type: 'Price Inquiry',
    status: 'In Progress',
    priority: 'High',
    createdDate: '2024-01-14T09:15:00Z'
  },
  {
    id: '4',
    propertyId: '2',
    propertyTitle: 'Luxury Condominium Unit with City View',
    clientName: 'David Kim',
    clientEmail: 'david.kim@email.com',
    clientPhone: '+63 917 333 2109',
    message: 'Thank you for the quick response! I\'ll submit my offer by tomorrow.',
    type: 'Follow-up',
    status: 'Closed',
    priority: 'Low',
    createdDate: '2024-01-12T11:00:00Z',
    responseDate: '2024-01-12T13:30:00Z'
  }
];

const AgentDashboard: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'inquiries' | 'performance'>('overview');
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return `₱${(price / 1000000).toFixed(1)}M`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      case 'new':
        return 'bg-red-100 text-red-800';
      case 'responded':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleDeleteProperty = (propertyId: string) => {
    console.log('Delete property:', propertyId);
    // In real app, make API call
  };

  const handleEditProperty = (propertyId: string) => {
    router.push(`/agent/properties/${propertyId}/edit`);
  };

  const handleRespondToInquiry = (inquiryId: string) => {
    console.log('Respond to inquiry:', inquiryId);
    // In real app, open response modal or navigate to detailed view
  };

  const activeProperties = agentProperties.filter(p => p.status === 'Active').length;
  const pendingProperties = agentProperties.filter(p => p.status === 'Pending').length;
  const soldProperties = agentProperties.filter(p => p.status === 'Sold').length;
  const totalViews = agentProperties.reduce((sum, p) => sum + p.views, 0);
  const totalInquiries = agentProperties.reduce((sum, p) => sum + p.inquiries, 0);
  const newInquiries = inquiries.filter(i => i.status === 'New').length;

  return (
    <DashboardLayout
      userRole="agent"
      userInfo={{
        name: mockAgent.name,
        email: mockAgent.email,
        avatar: mockAgent.avatar,
        role: mockAgent.title
      }}
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab as any)}
      title={`${mockAgent.name} Dashboard`}
      subtitle={`${mockAgent.title} • License: ${mockAgent.license} • ${mockAgent.rating} (${mockAgent.reviewCount} reviews)`}
      actions={
        <Button
          onClick={() => router.push('/agent/properties/new')}
          className="!bg-orange-500 hover:!bg-orange-600 !text-white"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add New Property
        </Button>
      }
    >

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <HomeIcon className="w-8 h-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">{activeProperties}</p>
                      <p className="text-sm text-gray-600">Active Listings</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <ClockIcon className="w-8 h-8 text-yellow-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">{pendingProperties}</p>
                      <p className="text-sm text-gray-600">Pending Sales</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-8 h-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">{soldProperties}</p>
                      <p className="text-sm text-gray-600">Sold This Month</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <ChatBubbleLeftIcon className="w-8 h-8 text-purple-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">{newInquiries}</p>
                      <p className="text-sm text-gray-600">New Inquiries</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Inquiries */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Inquiries</h2>
                    <Button variant="outlined" size="sm" onClick={() => setActiveTab('inquiries')}>
                      View All
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {inquiries.slice(0, 3).map((inquiry) => (
                      <div key={inquiry.id} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900">{inquiry.clientName}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                              {inquiry.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{inquiry.type}</p>
                          <p className="text-xs text-gray-500">{formatDateTime(inquiry.createdDate)}</p>
                        </div>
                        <Button size="sm" variant="outlined" onClick={() => handleRespondToInquiry(inquiry.id)}>
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Property Performance */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Top Performing Properties</h2>
                    <Button variant="outlined" size="sm" onClick={() => setActiveTab('properties')}>
                      View All
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {agentProperties
                      .sort((a, b) => (b.views + b.inquiries) - (a.views + a.inquiries))
                      .slice(0, 3)
                      .map((property) => (
                      <div key={property.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <img
                          src={property.imageUrl}
                          alt={property.title}
                          className="w-12 h-12 rounded-lg object-cover mr-3"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{property.title}</h4>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{property.views} views</span>
                            <span>{property.inquiries} inquiries</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                          {property.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'properties' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Properties</h2>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">{agentProperties.length} total properties</span>
                  <Button onClick={() => router.push('/agent/properties/new')}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Property
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {agentProperties.map((property) => (
                  <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="relative">
                      <img
                        src={property.imageUrl}
                        alt={property.title}
                        className="w-full h-48 object-cover"
                      />
                      <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                        {property.status}
                      </span>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{property.title}</h3>
                      <p className="text-lg font-bold text-orange-500 mb-2">{formatPrice(property.price)}</p>
                      <p className="text-sm text-gray-600 mb-3">{property.location}</p>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                        <span>{property.bedrooms} bed</span>
                        <span>{property.bathrooms} bath</span>
                        <span>{property.area} sqm</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <EyeIcon className="w-4 h-4 mr-1" />
                            {property.views}
                          </span>
                          <span className="flex items-center">
                            <ChatBubbleLeftIcon className="w-4 h-4 mr-1" />
                            {property.inquiries}
                          </span>
                        </div>
                        <span>Posted {formatDate(property.datePosted)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outlined" onClick={() => router.push(`/property/${property.id}`)}>
                          <EyeIcon className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outlined" onClick={() => handleEditProperty(property.id)}>
                          <PencilIcon className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <button
                          onClick={() => handleDeleteProperty(property.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'inquiries' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Property Inquiries</h2>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">{inquiries.length} total inquiries</span>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="responded">Responded</option>
                    <option value="in-progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <div key={inquiry.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{inquiry.clientName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                            {inquiry.status}
                          </span>
                          <span className={`text-xs font-medium ${getPriorityColor(inquiry.priority)}`}>
                            {inquiry.priority} Priority
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{inquiry.propertyTitle}</p>
                        <p className="text-gray-700 mb-4">{inquiry.message}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <EnvelopeIcon className="w-4 h-4 mr-1" />
                            {inquiry.clientEmail}
                          </div>
                          <div className="flex items-center">
                            <PhoneIcon className="w-4 h-4 mr-1" />
                            {inquiry.clientPhone}
                          </div>
                          <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {formatDateTime(inquiry.createdDate)}
                          </div>
                        </div>
                        
                        {inquiry.responseDeadline && new Date(inquiry.responseDeadline) > new Date() && (
                          <div className="mt-2 text-sm text-orange-600">
                            Response needed by {formatDateTime(inquiry.responseDeadline)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {inquiry.status === 'New' && (
                          <Button
                            onClick={() => handleRespondToInquiry(inquiry.id)}
                            className="!bg-orange-500 hover:!bg-orange-600 !text-white"
                          >
                            Respond
                          </Button>
                        )}
                        <Button variant="outlined" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
              
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Views</h3>
                  <p className="text-3xl font-bold text-blue-500">{totalViews.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-2">Across all properties</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Inquiries</h3>
                  <p className="text-3xl font-bold text-green-500">{totalInquiries}</p>
                  <p className="text-sm text-gray-500 mt-2">Conversion rate: {((totalInquiries / totalViews) * 100).toFixed(1)}%</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Avg. Response Time</h3>
                  <p className="text-3xl font-bold text-purple-500">2.4h</p>
                  <p className="text-sm text-gray-500 mt-2">Industry avg: 6.2h</p>
                </div>
              </div>

              {/* Recent Performance */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Performance Summary</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 font-medium text-gray-900">Property</th>
                        <th className="text-left py-3 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 font-medium text-gray-900">Views</th>
                        <th className="text-left py-3 font-medium text-gray-900">Inquiries</th>
                        <th className="text-left py-3 font-medium text-gray-900">Conversion</th>
                        <th className="text-left py-3 font-medium text-gray-900">Days Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agentProperties.map((property) => {
                        const daysActive = Math.floor((new Date().getTime() - new Date(property.datePosted).getTime()) / (1000 * 60 * 60 * 24));
                        const conversion = property.views > 0 ? ((property.inquiries / property.views) * 100).toFixed(1) : '0.0';
                        
                        return (
                          <tr key={property.id} className="border-b border-gray-100">
                            <td className="py-3">
                              <div className="flex items-center">
                                <img src={property.imageUrl} alt="" className="w-8 h-8 rounded object-cover mr-3" />
                                <div>
                                  <p className="font-medium text-gray-900">{property.title}</p>
                                  <p className="text-gray-500">{formatPrice(property.price)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                                {property.status}
                              </span>
                            </td>
                            <td className="py-3">{property.views}</td>
                            <td className="py-3">{property.inquiries}</td>
                            <td className="py-3">{conversion}%</td>
                            <td className="py-3">{daysActive} days</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
    </DashboardLayout>
  );
};

export default AgentDashboard; 