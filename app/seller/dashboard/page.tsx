'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  HomeIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ChartBarIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Layout from '../../../src/src/components/layout/Layout';
import Navbar from '../../../src/src/components/layout/Navbar';
import Footer from '../../../src/src/components/layout/Footer';
import { Button, Card } from '../../../src/src/components/ui';
import { useAuth } from '../../../src/src/contexts/AuthContext';
import { PropertyService, Property } from '../../../src/src/services/propertyService';
import { InquiryService, InquiryWithProperty } from '../../../src/src/services/inquiryService';

interface DashboardProperty extends Property {
  views: number;
  inquiries: number;
  imageUrl: string;
}

const SellerDashboard: React.FC = () => {
  const router = useRouter();
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'inquiries'>('overview');
  const [properties, setProperties] = useState<DashboardProperty[]>([]);
  const [inquiries, setInquiries] = useState<InquiryWithProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load dashboard data from database
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // Load properties from database
        const dbProperties = await PropertyService.getPropertiesByAgent(user.id);
        
        // Transform database properties to dashboard format
        const dashboardProperties: DashboardProperty[] = dbProperties.map(prop => ({
          ...prop,
          views: 0, // TODO: Get from property_views table
          inquiries: 0, // TODO: Get from inquiries table
          imageUrl: prop.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
        }));
        
        setProperties(dashboardProperties);

        // TODO: Re-enable when inquiries table is created
        // const dbInquiries = await InquiryService.getInquiriesByAgent(user.id);
        // setInquiries(dbInquiries);
        setInquiries([]);

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setProperties([]);
        setInquiries([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id]);

  // Check permissions
  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/seller/dashboard');
      return;
    }

    if (!hasPermission('can_list_properties') && !hasPermission('can_manage_system')) {
      router.push('/');
    }
  }, [user, hasPermission, router]);

  const getStatusColor = (status: Property['status']) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Under Contract': return 'bg-yellow-100 text-yellow-800';
      case 'Sold': return 'bg-blue-100 text-blue-800';
      case 'Off Market': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInquiryStatusColor = (status: InquiryWithProperty['status']) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Responded': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditProperty = (propertyId: string) => {
    router.push(`/seller/properties/${propertyId}/edit`);
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      try {
        await PropertyService.deleteProperty(propertyId);
        setProperties(properties.filter(p => p.id !== propertyId));
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property. Please try again.');
      }
    }
  };

  const handleInquiryStatusChange = async (inquiryId: string, newStatus: InquiryWithProperty['status']) => {
    try {
      // TODO: Re-enable when inquiries table is created
      // await InquiryService.updateInquiryStatus(inquiryId, newStatus);
      // setInquiries(inquiries.map(inquiry => 
      //   inquiry.id === inquiryId 
      //     ? { ...inquiry, status: newStatus }
      //     : inquiry
      // ));
      alert('Inquiry status update temporarily disabled');
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      alert('Failed to update inquiry status. Please try again.');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </Layout>
    );
  }

  const totalProperties = properties.length;
  const activeProperties = properties.filter(p => p.status === 'Available').length;
  const totalViews = properties.reduce((sum, p) => sum + p.views, 0);
  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter(i => i.status === 'New').length;

  return (
    <Layout>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
              <p className="text-gray-600">Manage your property listings and inquiries</p>
            </div>
            <Button onClick={() => router.push('/list-property')}>
              <PlusIcon className="h-5 w-5 mr-2" />
              List New Property
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <HomeIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{totalProperties}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold text-gray-900">{activeProperties}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <EyeIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{totalViews}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <EnvelopeIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New Inquiries</p>
                  <p className="text-2xl font-bold text-gray-900">{newInquiries}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Overview', icon: ChartBarIcon },
                  { id: 'properties', label: 'Properties', icon: HomeIcon },
                  { id: 'inquiries', label: 'Inquiries', icon: EnvelopeIcon }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Recent Properties */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Properties</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {properties.slice(0, 3).map(property => (
                        <Card key={property.id} className="p-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={property.imageUrl}
                              alt={property.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {property.title}
                              </p>
                              <p className="text-sm text-gray-500">{property.city}</p>
                              <p className="text-sm font-medium text-orange-600">
                                {formatPrice(property.price)}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Recent Inquiries */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Inquiries</h3>
                    <div className="space-y-3">
                      {inquiries.slice(0, 3).map(inquiry => (
                        <Card key={inquiry.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {inquiry.property.title}
                              </p>
                              <p className="text-sm text-gray-500">
                                {inquiry.user.first_name} {inquiry.user.last_name}
                              </p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getInquiryStatusColor(inquiry.status)}`}>
                              {inquiry.status}
                            </span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'properties' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Your Properties</h3>
                    <Button onClick={() => router.push('/list-property')}>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Property
                    </Button>
                  </div>
                  
                  {properties.length === 0 ? (
                    <div className="text-center py-8">
                      <HomeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
                      <p className="text-gray-500 mb-4">Start by listing your first property</p>
                      <Button onClick={() => router.push('/list-property')}>
                        List Your First Property
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Property
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Views
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Inquiries
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {properties.map(property => (
                            <tr key={property.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img
                                    src={property.imageUrl}
                                    alt={property.title}
                                    className="w-10 h-10 rounded-lg object-cover mr-3"
                                  />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {property.title}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {property.city}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
                                  {property.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {property.views}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {property.inquiries}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEditProperty(property.id)}
                                    className="text-orange-600 hover:text-orange-900"
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProperty(property.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'inquiries' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Property Inquiries</h3>
                  
                  {inquiries.length === 0 ? (
                    <div className="text-center py-8">
                      <EnvelopeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries yet</h3>
                      <p className="text-gray-500">Inquiries from potential buyers will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {inquiries.map(inquiry => (
                        <Card key={inquiry.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="text-sm font-medium text-gray-900">
                                  {inquiry.property.title}
                                </h4>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getInquiryStatusColor(inquiry.status)}`}>
                                  {inquiry.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                <strong>From:</strong> {inquiry.user.first_name} {inquiry.user.last_name} ({inquiry.user.email})
                              </p>
                              <p className="text-sm text-gray-600 mb-3">{inquiry.message}</p>
                              <p className="text-xs text-gray-500">
                                {formatDate(inquiry.created_at)}
                              </p>
                            </div>
                            <div className="ml-4">
                              <select
                                value={inquiry.status}
                                onChange={(e) => handleInquiryStatusChange(inquiry.id, e.target.value as any)}
                                className="text-sm border border-gray-300 rounded-md px-2 py-1"
                              >
                                <option value="New">New</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Responded">Responded</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
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

export default SellerDashboard; 