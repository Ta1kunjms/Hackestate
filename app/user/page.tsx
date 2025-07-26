'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  HeartIcon, 
  BellIcon, 
  Cog6ToothIcon, 
  EyeIcon,
  TrashIcon,
  PencilIcon,
  ChartBarIcon,
  CalendarIcon,
  MapPinIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';
import DashboardLayout from '../../src/src/components/layout/DashboardLayout';
import PropertyCard from '../../src/src/components/PropertyCard';
import { Button } from '../../src/src/components/ui';
import { useAuth } from '../../src/src/contexts/AuthContext';
import { supabase } from '../../src/src/lib/supabase';

// Mock user data
const mockUser = {
  id: '1',
  name: 'Maria Santos',
  email: 'maria.santos@email.com',
  phone: '+63 917 123 4567',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  memberSince: '2023-06-15',
  preferences: {
    priceRange: '2000000-5000000',
    propertyTypes: ['House', 'Condo'],
    locations: ['Makati City', 'Bonifacio Global City'],
    bedrooms: '2-3',
    emailNotifications: true,
    smsNotifications: false,
    weeklyReports: true
  }
};

// Mock saved properties
const savedProperties = [
  {
    id: '1',
    title: 'Modern 3-Bedroom House with Swimming Pool',
    price: 4500000,
    location: 'Alabang, Muntinlupa City',
    type: 'House',
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    yearBuilt: 2022,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    isNew: true,
    isFeatured: true,
    savedDate: '2024-01-15'
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
    yearBuilt: 2023,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    isFeatured: true,
    savedDate: '2024-01-10'
  },
  {
    id: '3',
    title: 'Charming Townhouse in Gated Community',
    price: 3200000,
    location: 'Quezon City',
    type: 'Townhouse',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    yearBuilt: 2021,
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    isNew: true,
    savedDate: '2024-01-08'
  }
];

// Mock search alerts
const searchAlerts = [
  {
    id: '1',
    name: 'BGC Condos Under ₱10M',
    criteria: {
      location: 'Bonifacio Global City',
      propertyType: 'Condo',
      maxPrice: 10000000,
      bedrooms: '2+'
    },
    frequency: 'Daily',
    isActive: true,
    createdDate: '2024-01-01',
    matchCount: 12
  },
  {
    id: '2',
    name: 'Houses in Alabang',
    criteria: {
      location: 'Alabang',
      propertyType: 'House',
      maxPrice: 6000000,
      bedrooms: '3+'
    },
    frequency: 'Weekly',
    isActive: true,
    createdDate: '2023-12-20',
    matchCount: 8
  },
  {
    id: '3',
    name: 'New Properties in Makati',
    criteria: {
      location: 'Makati City',
      propertyType: 'All',
      isNew: true
    },
    frequency: 'Instant',
    isActive: false,
    createdDate: '2023-12-15',
    matchCount: 3
  }
];

// Mock recent activities
const recentActivities = [
  {
    id: '1',
    type: 'property_saved',
    title: 'Saved Modern 3-Bedroom House',
    description: 'Property in Alabang, Muntinlupa City',
    date: '2024-01-15',
    icon: 'heart'
  },
  {
    id: '2',
    type: 'alert_triggered',
    title: 'New Alert Match',
    description: '3 new properties match "BGC Condos Under ₱10M"',
    date: '2024-01-14',
    icon: 'bell'
  },
  {
    id: '3',
    type: 'property_viewed',
    title: 'Viewed Luxury Condominium',
    description: 'Property in Makati City',
    date: '2024-01-13',
    icon: 'eye'
  },
  {
    id: '4',
    type: 'agent_contacted',
    title: 'Contacted Agent Carlos Mendoza',
    description: 'Inquiry about Modern 3-Bedroom House',
    date: '2024-01-12',
    icon: 'chat'
  }
];

const UserDashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'alerts' | 'preferences'>('overview');
  const [savedPropertiesState, setSavedPropertiesState] = useState<Set<string>>(
    new Set(savedProperties.map(p => p.id))
  );
  const [userPreferences, setUserPreferences] = useState({
    priceRange: '2000000-5000000',
    propertyTypes: ['House', 'Condo'],
    locations: ['Makati City', 'Bonifacio Global City'],
    bedrooms: '2-3',
    emailNotifications: true,
    smsNotifications: false,
    weeklyReports: true
  });
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  // Load user preferences from database
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('preferences')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error loading preferences:', error);
          }

          if (data?.preferences) {
            setUserPreferences(prev => ({ ...prev, ...data.preferences }));
          }
        } catch (error) {
          console.error('Error loading preferences:', error);
        }
      }
    };

    loadUserPreferences();
  }, [user]);

  const handleSaveProperty = (propertyId: string) => {
    setSavedPropertiesState(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(propertyId)) {
        newSaved.delete(propertyId);
      } else {
        newSaved.add(propertyId);
      }
      return newSaved;
    });
  };

  const handleDeleteAlert = (alertId: string) => {
    console.log('Delete alert:', alertId);
    // In real app, make API call
  };

  const handleToggleAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('search_alerts')
        .update({ 
          is_active: !searchAlerts.find(a => a.id === alertId)?.isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', alertId);

      if (error) throw error;
      
      // Update local state
      console.log('Alert toggled successfully');
    } catch (error) {
      console.error('Error toggling alert:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return `₱${(price / 1000000).toFixed(1)}M`;
  };

  const savePreferences = async () => {
    if (!user) return;
    
    setIsSavingPreferences(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          preferences: userPreferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      console.log('Preferences saved successfully');
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'heart':
        return <HeartSolidIcon className="w-4 h-4 text-red-500" />;
      case 'bell':
        return <BellSolidIcon className="w-4 h-4 text-blue-500" />;
      case 'eye':
        return <EyeIcon className="w-4 h-4 text-green-500" />;
      case 'chat':
        return <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.03 8-9 8s9 3.582 9 8z" />
        </svg>;
      default:
        return <ChartBarIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  // Redirect if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    router.push('/auth/login');
    return null;
  }

  // Use real user data or fallback to mock data
  const currentUser = {
    id: user.id,
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
    email: user.email,
    phone: user.phone || '',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    memberSince: new Date().toISOString().split('T')[0],
    preferences: {
      priceRange: '2000000-5000000',
      propertyTypes: ['House', 'Condo'],
      locations: ['Makati City', 'Bonifacio Global City'],
      bedrooms: '2-3',
      emailNotifications: true,
      smsNotifications: false,
      weeklyReports: true
    }
  };

  return (
    <DashboardLayout
      userRole="user"
      userInfo={{
        name: currentUser.name,
        email: currentUser.email,
        avatar: currentUser.avatar,
        role: 'Premium User'
      }}
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab as any)}
      title={`Welcome back, ${currentUser.name.split(' ')[0]}!`}
      subtitle={`Member since ${formatDate(currentUser.memberSince)}`}
      actions={
        <Button
          onClick={() => router.push('/profile')}
          variant="outlined"
          className="!border-orange-500 !text-orange-500 hover:!bg-orange-500 hover:!text-white"
        >
          <Cog6ToothIcon className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      }
    >

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <HeartIcon className="w-8 h-8 text-red-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">{savedProperties.length}</p>
                      <p className="text-sm text-gray-600">Saved Properties</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <BellIcon className="w-8 h-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">{searchAlerts.filter(a => a.isActive).length}</p>
                      <p className="text-sm text-gray-600">Active Alerts</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <EyeIcon className="w-8 h-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">24</p>
                      <p className="text-sm text-gray-600">Properties Viewed</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <CalendarIcon className="w-8 h-8 text-purple-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">3</p>
                      <p className="text-sm text-gray-600">Scheduled Viewings</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                  <Button variant="outlined" size="sm">View All</Button>
                </div>
                
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        {getActivityIcon(activity.icon)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(activity.date)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Saved Properties</h2>
                <p className="text-gray-600">{savedProperties.length} properties saved</p>
              </div>
              
              {savedProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedProperties.map((property) => (
                    <div key={property.id} className="relative">
                      <PropertyCard
                        property={property}
                        onSave={handleSaveProperty}
                        isSaved={savedPropertiesState.has(property.id)}
                      />
                      <div className="mt-2 text-sm text-gray-500">
                        Saved on {formatDate(property.savedDate)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <HeartIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No saved properties yet</h3>
                  <p className="text-gray-600 mb-4">Start browsing and save properties you're interested in.</p>
                  <Button onClick={() => router.push('/properties')}>
                    Browse Properties
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'alerts' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Search Alerts</h2>
                <Button onClick={() => router.push('/properties')}>
                  <BellIcon className="w-4 h-4 mr-2" />
                  Create New Alert
                </Button>
              </div>
              
              <div className="space-y-4">
                {searchAlerts.map((alert) => (
                  <div key={alert.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{alert.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            alert.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {alert.isActive ? 'Active' : 'Paused'}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3 space-y-1">
                          <p><MapPinIcon className="w-4 h-4 inline mr-1" />{alert.criteria.location}</p>
                          <p><HomeIcon className="w-4 h-4 inline mr-1" />{alert.criteria.propertyType}</p>
                          {alert.criteria.maxPrice && (
                            <p>Max price: {formatPrice(alert.criteria.maxPrice)}</p>
                          )}
                          {alert.criteria.bedrooms && (
                            <p>Bedrooms: {alert.criteria.bedrooms}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Frequency: {alert.frequency}</span>
                          <span>•</span>
                          <span>{alert.matchCount} current matches</span>
                          <span>•</span>
                          <span>Created {formatDate(alert.createdDate)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleAlert(alert.id)}
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                          title={alert.isActive ? 'Pause alert' : 'Activate alert'}
                        >
                          {alert.isActive ? (
                            <BellSolidIcon className="w-5 h-5" />
                          ) : (
                            <BellIcon className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                          title="Edit alert"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete alert"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {searchAlerts.length === 0 && (
                <div className="text-center py-12">
                  <BellIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No search alerts yet</h3>
                  <p className="text-gray-600 mb-4">Set up alerts to get notified when new properties match your criteria.</p>
                  <Button onClick={() => router.push('/properties')}>
                    Create Your First Alert
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Preferences</h2>
              
              <div className="space-y-8">
                {/* Search Preferences */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Preferences</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Price Range</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500">
                        <option value="2000000-5000000">₱2M - ₱5M</option>
                        <option value="5000000-10000000">₱5M - ₱10M</option>
                        <option value="10000000+">₱10M+</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Bedrooms</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500">
                        <option value="1">1 Bedroom</option>
                        <option value="2">2 Bedrooms</option>
                        <option value="3">3 Bedrooms</option>
                        <option value="4+">4+ Bedrooms</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Locations</label>
                      <div className="flex flex-wrap gap-2">
                        {['Makati City', 'Bonifacio Global City', 'Quezon City', 'Pasig City', 'Taguig City'].map((location) => (
                          <label key={location} className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                              checked={userPreferences.locations.includes(location)}
                              onChange={(e) => {
                                const newLocations = e.target.checked
                                  ? [...userPreferences.locations, location]
                                  : userPreferences.locations.filter(l => l !== location);
                                setUserPreferences(prev => ({ ...prev, locations: newLocations }));
                              }}
                            />
                            <span className="ml-2 text-sm text-gray-700">{location}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                  
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        checked={userPreferences.emailNotifications}
                        onChange={(e) => setUserPreferences(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                      />
                      <span className="ml-2 text-sm text-gray-700">Email notifications for new matches</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        checked={userPreferences.smsNotifications}
                        onChange={(e) => setUserPreferences(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                      />
                      <span className="ml-2 text-sm text-gray-700">SMS notifications for urgent updates</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        checked={userPreferences.weeklyReports}
                        onChange={(e) => setUserPreferences(prev => ({ ...prev, weeklyReports: e.target.checked }))}
                      />
                      <span className="ml-2 text-sm text-gray-700">Weekly market reports</span>
                    </label>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button 
                    className="!bg-orange-500 hover:!bg-orange-600 !text-white"
                    onClick={savePreferences}
                    disabled={isSavingPreferences}
                  >
                    {isSavingPreferences ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </div>
              </div>
            </div>
          )}
      </DashboardLayout>
  );
};

export default UserDashboard; 