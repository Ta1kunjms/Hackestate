'use client'
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserCircleIcon,
  CameraIcon,
  LockClosedIcon,
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  HomeIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  AtSymbolIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckSolidIcon } from '@heroicons/react/24/solid';
import Layout from '../../src/src/components/layout/Layout';
import Navbar from '../../src/src/components/layout/Navbar';
import Footer from '../../src/src/components/layout/Footer';
import { Button, Input, Select, Textarea, FormField } from '../../src/src/components/ui';
import { useAuth } from '../../src/src/contexts/AuthContext';
import { supabase } from '../../src/src/lib/supabase';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  avatar: string;
  bio: string;
  occupation: string;
  company: string;
  website: string;
  preferredLanguage: string;
  timezone: string;
  joinDate: string;
  lastLogin: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

interface NotificationPreferences {
  emailNotifications: {
    propertyAlerts: boolean;
    priceChanges: boolean;
    newListings: boolean;
    savedSearches: boolean;
    agentMessages: boolean;
    marketReports: boolean;
    newsletter: boolean;
    systemUpdates: boolean;
  };
  pushNotifications: {
    instantAlerts: boolean;
    dailyDigest: boolean;
    weeklyReports: boolean;
    emergencyAlerts: boolean;
  };
  smsNotifications: {
    propertyAlerts: boolean;
    appointments: boolean;
    emergencyOnly: boolean;
  };
  frequency: 'instant' | 'daily' | 'weekly' | 'monthly';
}

interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Default notification preferences
const defaultNotifications: NotificationPreferences = {
  emailNotifications: {
    propertyAlerts: true,
    priceChanges: true,
    newListings: true,
    savedSearches: true,
    agentMessages: true,
    marketReports: false,
    newsletter: true,
    systemUpdates: true
  },
  pushNotifications: {
    instantAlerts: true,
    dailyDigest: false,
    weeklyReports: true,
    emergencyAlerts: true
  },
  smsNotifications: {
    propertyAlerts: false,
    appointments: true,
    emergencyOnly: true
  },
  frequency: 'daily'
};

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<'personal' | 'password' | 'notifications' | 'privacy'>('personal');
  const [profile, setProfile] = useState<UserProfile>(() => {
    if (user) {
      return {
        id: user.id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
        phone: user.phone || '',
        dateOfBirth: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'Philippines'
        },
        avatar: '/default-avatar.png',
        bio: '',
        occupation: '',
        company: '',
        website: '',
        preferredLanguage: 'English',
        timezone: 'Asia/Manila',
        joinDate: new Date().toISOString().split('T')[0],
        lastLogin: new Date().toISOString(),
        emailVerified: false,
        phoneVerified: false
      };
    }
    return {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Philippines'
      },
      avatar: '/default-avatar.png',
      bio: '',
      occupation: '',
      company: '',
      website: '',
      preferredLanguage: 'English',
      timezone: 'Asia/Manila',
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString(),
      emailVerified: false,
      phoneVerified: false
    };
  });
  const [notifications, setNotifications] = useState<NotificationPreferences>(defaultNotifications);
  const [passwordData, setPasswordData] = useState<PasswordUpdate>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<any>({});

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error loading profile:', error);
          }

          if (data) {
            setProfile(prev => ({
              ...prev,
              firstName: data.first_name || '',
              lastName: data.last_name || '',
              phone: data.phone || '',
              email: user.email,
              avatar: data.avatar_url || prev.avatar,
              ...(data.settings?.personal && {
                dateOfBirth: data.settings.personal.dateOfBirth || '',
                address: data.settings.personal.address || prev.address,
                bio: data.settings.personal.bio || '',
                occupation: data.settings.personal.occupation || '',
                company: data.settings.personal.company || '',
                website: data.settings.personal.website || '',
                preferredLanguage: data.settings.personal.preferredLanguage || 'English',
                timezone: data.settings.personal.timezone || 'Asia/Manila'
              })
            }));

            // Load notification settings
            if (data.settings?.notifications) {
              setNotifications(data.settings.notifications);
            }
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      }
    };

    loadUserProfile();
  }, [user]);

  // Handle profile form changes
  const handleProfileChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfile(prev => {
        const parentValue = prev[parent as keyof UserProfile];
        if (typeof parentValue === 'object' && parentValue !== null) {
          return {
            ...prev,
            [parent]: {
              ...parentValue,
              [child]: value
            }
          };
        }
        return prev;
      });
    } else {
      setProfile(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle notification preference changes
  const handleNotificationChange = (category: string, setting: string, value: boolean | string) => {
    setNotifications(prev => {
      const categoryValue = prev[category as keyof NotificationPreferences];
      
             if (typeof categoryValue === 'object' && categoryValue !== null && !Array.isArray(categoryValue)) {
         return {
           ...prev,
           [category]: {
             ...(categoryValue as Record<string, any>),
             [setting]: value
           }
         };
       } else {
         return {
           ...prev,
           [category]: value
         };
       }
    });
  };

  // Handle password form changes
  const handlePasswordChange = (field: keyof PasswordUpdate, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    
    // Clear password errors when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        setErrors({ avatar: 'Please upload a valid image file (JPEG, PNG, or WebP)' });
        return;
      }
      
      if (file.size > maxSize) {
        setErrors({ avatar: 'Image file size must be less than 5MB' });
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Create a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${user!.id}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;
        
        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (uploadError) {
          console.error('Upload error:', uploadError);
          // If bucket doesn't exist, try to create it
          if (uploadError.message?.includes('bucket') || uploadError.message?.includes('not found')) {
            throw new Error('Storage bucket not configured. Please contact support.');
          }
          throw uploadError;
        }
        
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        
        // Update profile with new avatar URL
        setProfile(prev => ({ ...prev, avatar: publicUrl }));
        setErrors({ avatar: undefined });
        
        // Save the avatar URL to the database
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            avatar_url: publicUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', user!.id);
        
        if (updateError) {
          console.error('Error saving avatar URL:', updateError);
        }
        
      } catch (error) {
        console.error('Error uploading avatar:', error);
        
        // Fallback: save as data URL if storage fails
        if (error instanceof Error && error.message.includes('Storage bucket not configured')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              setProfile(prev => ({ ...prev, avatar: e.target!.result as string }));
              setErrors({ avatar: undefined });
              
              // Save the data URL to database
              supabase
                .from('profiles')
                .update({
                  avatar_url: e.target!.result as string,
                  updated_at: new Date().toISOString()
                })
                .eq('id', user!.id)
                .then(({ error: updateError }) => {
                  if (updateError) {
                    console.error('Error saving avatar URL:', updateError);
                  }
                });
            }
          };
          reader.readAsDataURL(file);
        } else {
          setErrors({ avatar: 'Failed to upload image. Please try again.' });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Validate forms
  const validatePersonalInfo = () => {
    const newErrors: any = {};
    
    if (!profile.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!profile.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!profile.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!profile.phone.trim()) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordUpdate = () => {
    const newErrors: any = {};
    
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) newErrors.newPassword = 'New password is required';
    else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save functions
  const savePersonalInfo = async () => {
    if (!validatePersonalInfo()) return;
    
    setIsLoading(true);
    setSaveStatus('saving');
    
    try {
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.firstName,
          last_name: profile.lastName,
          phone: profile.phone,
          settings: {
            personal: {
              dateOfBirth: profile.dateOfBirth,
              address: profile.address,
              bio: profile.bio,
              occupation: profile.occupation,
              company: profile.company,
              website: profile.website,
              preferredLanguage: profile.preferredLanguage,
              timezone: profile.timezone
            }
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', user!.id);

      if (error) throw error;
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error(
        'Error saving profile:',
        error,
        JSON.stringify(error),
        (error as any)?.message,
        (error as any)?.stack
      );
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const savePasswordUpdate = async () => {
    if (!validatePasswordUpdate()) return;
    
    setIsLoading(true);
    setSaveStatus('saving');
    
    try {
      // First, verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user!.email,
        password: passwordData.currentPassword
      });

      if (signInError) {
        setErrors({ currentPassword: 'Current password is incorrect' });
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
        return;
      }

      // Update password in Supabase
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error updating password:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const saveNotifications = async () => {
    setIsLoading(true);
    setSaveStatus('saving');
    
    try {
      // Update notification preferences in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          settings: {
            notifications: notifications
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', user!.id);

      if (error) throw error;
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatLastLogin = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const fields = [
      profile.firstName,
      profile.lastName,
      profile.email,
      profile.phone,
      profile.dateOfBirth,
      profile.address.street,
      profile.address.city,
      profile.address.state,
      profile.address.zipCode,
      profile.occupation,
      profile.company,
      profile.bio
    ];
    
    const completedFields = fields.filter(field => field && field.trim() !== '').length;
    const totalFields = fields.length;
    
    return Math.round((completedFields / totalFields) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  // Redirect if not authenticated
  if (authLoading) {
    return (
      <Layout>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </Layout>
    );
  }

  if (!isAuthenticated || !user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <Layout>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 pt-32">
        {/* Page Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {/* Avatar */}
                <div className="relative">
                  {profile.avatar && profile.avatar !== '/default-avatar.png' ? (
                    <img
                      src={profile.avatar}
                      alt={`${profile.firstName} ${profile.lastName}`}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                      <UserCircleIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className={`absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-lg transition-colors ${
                      isLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                  >
                    {isLoading ? (
                      <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <CameraIcon className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>

                {/* User Info */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-lg text-gray-600">{profile.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">
                      Member since {formatDate(profile.joinDate)}
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      Last login {formatLastLogin(profile.lastLogin)}
                    </span>
                    <div className="flex items-center space-x-2">
                      {profile.emailVerified && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckSolidIcon className="w-3 h-3 mr-1" />
                          Email Verified
                        </span>
                      )}
                      {profile.phoneVerified && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <CheckSolidIcon className="w-3 h-3 mr-1" />
                          Phone Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => router.push('/user')}
                  variant="outlined"
                  className="!border-gray-300 !text-gray-700 hover:!bg-gray-50"
                >
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </div>
            </div>

            {/* Error Messages */}
            {errors.avatar && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-sm text-red-700">{errors.avatar}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {[
                { id: 'personal', label: 'Personal Info', icon: UserCircleIcon },
                { id: 'password', label: 'Password & Security', icon: LockClosedIcon },
                { id: 'notifications', label: 'Notifications', icon: BellIcon },
                { id: 'privacy', label: 'Privacy & Data', icon: ShieldCheckIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Completion</span>
                    <span className="text-sm font-medium text-green-600">{profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${profileCompletion}%` }}></div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Email Verified</span>
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Phone Verified</span>
                        <span className="text-xs text-orange-600 font-medium">Pending</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Two-Factor Auth</span>
                        <span className="text-xs text-gray-500">Not Set</span>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => setActiveTab('password')}
                      className="w-full mt-4 !bg-orange-500 hover:!bg-orange-600 !text-white !text-sm"
                    >
                      Enhance Security
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Personal Info Tab */}
              {activeTab === 'personal' && (
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Update your personal details and contact information.
                    </p>
                  </div>
                  
                  <div className="p-6">
                    <form className="space-y-6">
                      {/* Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          label="First Name"
                          required
                          error={errors.firstName}
                        >
                          <Input
                            type="text"
                            value={profile.firstName}
                            onChange={(e) => handleProfileChange('firstName', e.target.value)}
                            placeholder="Enter your first name"
                            variant={errors.firstName ? 'error' : 'default'}
                            leftIcon={<UserCircleIcon className="w-4 h-4" />}
                          />
                        </FormField>

                        <FormField
                          label="Last Name"
                          required
                          error={errors.lastName}
                        >
                          <Input
                            type="text"
                            value={profile.lastName}
                            onChange={(e) => handleProfileChange('lastName', e.target.value)}
                            placeholder="Enter your last name"
                            variant={errors.lastName ? 'error' : 'default'}
                            leftIcon={<UserCircleIcon className="w-4 h-4" />}
                          />
                        </FormField>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          label="Email Address"
                          required
                          error={errors.email}
                        >
                          <Input
                            type="email"
                            value={profile.email}
                            onChange={(e) => handleProfileChange('email', e.target.value)}
                            placeholder="Enter your email address"
                            variant={errors.email ? 'error' : 'default'}
                            leftIcon={<EnvelopeIcon className="w-4 h-4" />}
                          />
                        </FormField>

                        <FormField
                          label="Phone Number"
                          required
                          error={errors.phone}
                        >
                          <Input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => handleProfileChange('phone', e.target.value)}
                            placeholder="Enter your phone number"
                            variant={errors.phone ? 'error' : 'default'}
                            leftIcon={<PhoneIcon className="w-4 h-4" />}
                          />
                        </FormField>
                      </div>

                      <FormField
                        label="Date of Birth"
                      >
                        <Input
                          type="date"
                          value={profile.dateOfBirth}
                          onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)}
                        />
                      </FormField>

                      {/* Address */}
                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                        
                        <FormField
                          label="Street Address"
                        >
                          <Input
                            type="text"
                            value={profile.address.street}
                            onChange={(e) => handleProfileChange('address.street', e.target.value)}
                            placeholder="Enter your street address"
                            leftIcon={<MapPinIcon className="w-4 h-4" />}
                          />
                        </FormField>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                          <FormField label="City">
                            <Input
                              type="text"
                              value={profile.address.city}
                              onChange={(e) => handleProfileChange('address.city', e.target.value)}
                              placeholder="City"
                            />
                          </FormField>

                          <FormField label="State/Province">
                            <Input
                              type="text"
                              value={profile.address.state}
                              onChange={(e) => handleProfileChange('address.state', e.target.value)}
                              placeholder="State"
                            />
                          </FormField>

                          <FormField label="ZIP/Postal Code">
                            <Input
                              type="text"
                              value={profile.address.zipCode}
                              onChange={(e) => handleProfileChange('address.zipCode', e.target.value)}
                              placeholder="ZIP Code"
                            />
                          </FormField>
                        </div>

                        <FormField
                          label="Country"
                          className="mt-6"
                        >
                          <Select
                            value={profile.address.country}
                            onChange={(e) => handleProfileChange('address.country', e.target.value)}
                          >
                            <option value="Philippines">Philippines</option>
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
                          </Select>
                        </FormField>
                      </div>

                      {/* Professional Info */}
                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField label="Occupation">
                            <Input
                              type="text"
                              value={profile.occupation}
                              onChange={(e) => handleProfileChange('occupation', e.target.value)}
                              placeholder="Your job title"
                            />
                          </FormField>

                          <FormField label="Company">
                            <Input
                              type="text"
                              value={profile.company}
                              onChange={(e) => handleProfileChange('company', e.target.value)}
                              placeholder="Company name"
                            />
                          </FormField>
                        </div>

                        <FormField
                          label="Website"
                          className="mt-6"
                        >
                          <Input
                            type="url"
                            value={profile.website}
                            onChange={(e) => handleProfileChange('website', e.target.value)}
                            placeholder="https://yourwebsite.com"
                            leftIcon={<GlobeAltIcon className="w-4 h-4" />}
                          />
                        </FormField>

                        <FormField
                          label="Bio"
                          className="mt-6"
                        >
                          <Textarea
                            value={profile.bio}
                            onChange={(e) => handleProfileChange('bio', e.target.value)}
                            placeholder="Tell us about yourself..."
                            rows={4}
                          />
                        </FormField>
                      </div>

                      {/* Preferences */}
                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField label="Preferred Language">
                            <Select
                              value={profile.preferredLanguage}
                              onChange={(e) => handleProfileChange('preferredLanguage', e.target.value)}
                            >
                              <option value="English">English</option>
                              <option value="Filipino">Filipino</option>
                              <option value="Spanish">Spanish</option>
                              <option value="Chinese">Chinese</option>
                            </Select>
                          </FormField>

                          <FormField label="Timezone">
                            <Select
                              value={profile.timezone}
                              onChange={(e) => handleProfileChange('timezone', e.target.value)}
                            >
                              <option value="Asia/Manila">Asia/Manila (PHT)</option>
                              <option value="America/New_York">America/New_York (EST)</option>
                              <option value="Europe/London">Europe/London (GMT)</option>
                              <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                            </Select>
                          </FormField>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {saveStatus === 'success' && (
                              <div className="flex items-center text-green-600">
                                <CheckCircleIcon className="w-5 h-5 mr-2" />
                                <span className="text-sm">Changes saved successfully!</span>
                              </div>
                            )}
                            {saveStatus === 'error' && (
                              <div className="flex items-center text-red-600">
                                <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                                <span className="text-sm">Failed to save changes. Please try again.</span>
                              </div>
                            )}
                          </div>
                          
                          <Button
                            onClick={savePersonalInfo}
                            disabled={isLoading}
                            className="!bg-orange-500 hover:!bg-orange-600 !text-white"
                          >
                            {saveStatus === 'saving' ? (
                              <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                              </div>
                            ) : (
                              'Save Changes'
                            )}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Password & Security Tab */}
              {activeTab === 'password' && (
                <div className="space-y-8">
                  {/* Password Update */}
                  <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Ensure your account is using a long, random password to stay secure.
                      </p>
                    </div>
                    
                    <div className="p-6">
                      <form className="space-y-6">
                        <FormField
                          label="Current Password"
                          required
                          error={errors.currentPassword}
                        >
                          <Input
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                            placeholder="Enter your current password"
                            variant={errors.currentPassword ? 'error' : 'default'}
                            leftIcon={<LockClosedIcon className="w-4 h-4" />}
                            rightIcon={
                              <button
                                type="button"
                                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                className="focus:outline-none"
                              >
                                {showPasswords.current ? (
                                  <EyeSlashIcon className="w-4 h-4" />
                                ) : (
                                  <EyeIcon className="w-4 h-4" />
                                )}
                              </button>
                            }
                          />
                        </FormField>

                        <FormField
                          label="New Password"
                          required
                          error={errors.newPassword}
                          hint="Must be at least 8 characters long"
                        >
                          <Input
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                            placeholder="Enter your new password"
                            variant={errors.newPassword ? 'error' : 'default'}
                            leftIcon={<LockClosedIcon className="w-4 h-4" />}
                            rightIcon={
                              <button
                                type="button"
                                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                className="focus:outline-none"
                              >
                                {showPasswords.new ? (
                                  <EyeSlashIcon className="w-4 h-4" />
                                ) : (
                                  <EyeIcon className="w-4 h-4" />
                                )}
                              </button>
                            }
                          />
                        </FormField>

                        <FormField
                          label="Confirm New Password"
                          required
                          error={errors.confirmPassword}
                        >
                          <Input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                            placeholder="Confirm your new password"
                            variant={errors.confirmPassword ? 'error' : 'default'}
                            leftIcon={<LockClosedIcon className="w-4 h-4" />}
                            rightIcon={
                              <button
                                type="button"
                                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                className="focus:outline-none"
                              >
                                {showPasswords.confirm ? (
                                  <EyeSlashIcon className="w-4 h-4" />
                                ) : (
                                  <EyeIcon className="w-4 h-4" />
                                )}
                              </button>
                            }
                          />
                        </FormField>

                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {saveStatus === 'success' && (
                                <div className="flex items-center text-green-600">
                                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                                  <span className="text-sm">Password updated successfully!</span>
                                </div>
                              )}
                              {saveStatus === 'error' && (
                                <div className="flex items-center text-red-600">
                                  <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                                  <span className="text-sm">Failed to update password. Please try again.</span>
                                </div>
                              )}
                            </div>
                            
                            <Button
                              onClick={savePasswordUpdate}
                              disabled={isLoading}
                              className="!bg-orange-500 hover:!bg-orange-600 !text-white"
                            >
                              {saveStatus === 'saving' ? (
                                <div className="flex items-center">
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Updating...
                                </div>
                              ) : (
                                'Update Password'
                              )}
                            </Button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-900">Two-Factor Authentication</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Add an extra layer of security to your account.
                      </p>
                    </div>
                    
                    <div className="p-6">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mr-2" />
                          <span className="text-sm text-yellow-700">
                            Two-factor authentication is not enabled. Enable it to secure your account.
                          </span>
                        </div>
                      </div>
                      
                      <Button
                        className="!bg-blue-500 hover:!bg-blue-600 !text-white"
                      >
                        <ShieldCheckIcon className="w-4 h-4 mr-2" />
                        Enable Two-Factor Authentication
                      </Button>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-900">Account Actions</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Manage your account and data.
                      </p>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Download Account Data</h4>
                            <p className="text-sm text-gray-500">Get a copy of all your account data</p>
                          </div>
                          <Button variant="outlined" size="sm">
                            <DocumentTextIcon className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Deactivate Account</h4>
                            <p className="text-sm text-gray-500">Temporarily disable your account</p>
                          </div>
                          <Button variant="outlined" size="sm" className="!border-yellow-500 !text-yellow-600 hover:!bg-yellow-50">
                            Deactivate
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <h4 className="text-sm font-medium text-red-900">Delete Account</h4>
                            <p className="text-sm text-red-500">Permanently delete your account and all data</p>
                          </div>
                          <Button variant="outlined" size="sm" className="!border-red-500 !text-red-600 hover:!bg-red-50">
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Manage how and when you receive notifications.
                    </p>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-8">
                      {/* Notification Frequency */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Frequency</h3>
                        <FormField label="How often would you like to receive notifications?">
                          <Select
                            value={notifications.frequency}
                            onChange={(e) => handleNotificationChange('frequency', '', e.target.value)}
                          >
                            <option value="instant">Instant (as they happen)</option>
                            <option value="daily">Daily digest</option>
                            <option value="weekly">Weekly summary</option>
                            <option value="monthly">Monthly report</option>
                          </Select>
                        </FormField>
                      </div>

                      {/* Email Notifications */}
                      <div className="border-t border-gray-200 pt-8">
                        <div className="flex items-center mb-4">
                          <EnvelopeIcon className="w-5 h-5 text-gray-500 mr-2" />
                          <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                        </div>
                        
                        <div className="space-y-4">
                          {Object.entries(notifications.emailNotifications).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <div>
                                <label className="text-sm font-medium text-gray-700 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                </label>
                                <p className="text-xs text-gray-500">
                                  {getNotificationDescription(key)}
                                </p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={value}
                                  onChange={(e) => handleNotificationChange('emailNotifications', key, e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Push Notifications */}
                      <div className="border-t border-gray-200 pt-8">
                        <div className="flex items-center mb-4">
                          <DevicePhoneMobileIcon className="w-5 h-5 text-gray-500 mr-2" />
                          <h3 className="text-lg font-medium text-gray-900">Push Notifications</h3>
                        </div>
                        
                        <div className="space-y-4">
                          {Object.entries(notifications.pushNotifications).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <div>
                                <label className="text-sm font-medium text-gray-700 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                </label>
                                <p className="text-xs text-gray-500">
                                  {getNotificationDescription(key)}
                                </p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={value}
                                  onChange={(e) => handleNotificationChange('pushNotifications', key, e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* SMS Notifications */}
                      <div className="border-t border-gray-200 pt-8">
                        <div className="flex items-center mb-4">
                          <AtSymbolIcon className="w-5 h-5 text-gray-500 mr-2" />
                          <h3 className="text-lg font-medium text-gray-900">SMS Notifications</h3>
                        </div>
                        
                        <div className="space-y-4">
                          {Object.entries(notifications.smsNotifications).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <div>
                                <label className="text-sm font-medium text-gray-700 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                </label>
                                <p className="text-xs text-gray-500">
                                  {getNotificationDescription(key)}
                                </p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={value}
                                  onChange={(e) => handleNotificationChange('smsNotifications', key, e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {saveStatus === 'success' && (
                              <div className="flex items-center text-green-600">
                                <CheckCircleIcon className="w-5 h-5 mr-2" />
                                <span className="text-sm">Notification preferences saved!</span>
                              </div>
                            )}
                            {saveStatus === 'error' && (
                              <div className="flex items-center text-red-600">
                                <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                                <span className="text-sm">Failed to save preferences. Please try again.</span>
                              </div>
                            )}
                          </div>
                          
                          <Button
                            disabled={true}
                            className="!bg-gray-400 !cursor-not-allowed"
                          >
                            Coming Soon
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy & Data Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-8">
                  {/* Privacy Settings */}
                  <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-900">Privacy Settings</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Control your privacy and data sharing preferences.
                      </p>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Profile Visibility</h4>
                            <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Contact Information Sharing</h4>
                            <p className="text-sm text-gray-500">Allow agents to contact you directly</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Analytics & Performance</h4>
                            <p className="text-sm text-gray-500">Help us improve our services with usage data</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Marketing Communications</h4>
                            <p className="text-sm text-gray-500">Receive promotional offers and updates</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Management */}
                  <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-900">Data Management</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Manage your personal data and account information.
                      </p>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-blue-900 mb-2">Data Protection</h4>
                          <p className="text-sm text-blue-700">
                            Your personal data is protected according to our Privacy Policy and applicable data protection laws.
                          </p>
                        </div>

                        <div className="space-y-4 pt-4">
                          <div className="flex items-center justify-between py-3 border-b border-gray-200">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Export Personal Data</h4>
                              <p className="text-sm text-gray-500">Download a copy of your personal data</p>
                            </div>
                            <Button variant="outlined" size="sm">
                              <DocumentTextIcon className="w-4 h-4 mr-2" />
                              Export Data
                            </Button>
                          </div>

                          <div className="flex items-center justify-between py-3 border-b border-gray-200">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Delete Saved Searches</h4>
                              <p className="text-sm text-gray-500">Remove all your saved property searches</p>
                            </div>
                            <Button variant="outlined" size="sm" className="!border-yellow-500 !text-yellow-600 hover:!bg-yellow-50">
                              Clear Searches
                            </Button>
                          </div>

                          <div className="flex items-center justify-between py-3">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Delete Browsing History</h4>
                              <p className="text-sm text-gray-500">Remove your property viewing history</p>
                            </div>
                            <Button variant="outlined" size="sm" className="!border-yellow-500 !text-yellow-600 hover:!bg-yellow-50">
                              Clear History
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Legal & Compliance */}
                  <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-900">Legal & Compliance</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Review our terms and policies.
                      </p>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Privacy Policy</h4>
                            <p className="text-sm text-gray-500">Updated February 2024</p>
                          </div>
                          <Button variant="outlined" size="sm">
                            <DocumentTextIcon className="w-4 h-4 mr-2" />
                            View Policy
                          </Button>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Terms of Service</h4>
                            <p className="text-sm text-gray-500">Updated February 2024</p>
                          </div>
                          <Button variant="outlined" size="sm">
                            <DocumentTextIcon className="w-4 h-4 mr-2" />
                            View Terms
                          </Button>
                        </div>

                        <div className="flex items-center justify-between py-3">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Cookie Policy</h4>
                            <p className="text-sm text-gray-500">Updated February 2024</p>
                          </div>
                          <Button variant="outlined" size="sm">
                            <DocumentTextIcon className="w-4 h-4 mr-2" />
                            View Cookies
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );

  // Helper function for notification descriptions
  function getNotificationDescription(key: string): string {
    const descriptions: { [key: string]: string } = {
      propertyAlerts: 'Get notified when properties matching your criteria become available',
      priceChanges: 'Receive alerts when property prices change',
      newListings: 'Be the first to know about new property listings',
      savedSearches: 'Updates on your saved property searches',
      agentMessages: 'Messages from real estate agents',
      marketReports: 'Weekly and monthly market analysis reports',
      newsletter: 'Our newsletter with tips and market insights',
      systemUpdates: 'Important updates about our platform',
      instantAlerts: 'Immediate notifications for urgent updates',
      dailyDigest: 'Daily summary of all your notifications',
      weeklyReports: 'Weekly summary and insights',
      emergencyAlerts: 'Critical security and account alerts',
      appointments: 'Reminders for scheduled appointments'
    };
    
    return descriptions[key] || 'Notification setting';
  }
};

export default ProfilePage; 