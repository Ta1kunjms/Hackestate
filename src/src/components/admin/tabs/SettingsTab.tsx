import React, { useState, useEffect } from 'react';
import { Button, Input, Select } from '../../ui';

interface SettingsTabProps {
  onSaveSettings: (settings: any) => Promise<void>;
}

interface Settings {
  platform: {
    commissionRate: number;
    defaultCurrency: string;
    maxPropertyImages: number;
    autoApproveListings: boolean;
  };
  email: {
    sendWelcomeEmails: boolean;
    sendListingNotifications: boolean;
    sendWeeklyReports: boolean;
  };
  security: {
    requireEmailVerification: boolean;
    enableTwoFactorAuth: boolean;
    sessionTimeout: number;
  };
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ onSaveSettings }) => {
  const [settings, setSettings] = useState<Settings>({
    platform: {
      commissionRate: 8.5,
      defaultCurrency: 'PHP',
      maxPropertyImages: 20,
      autoApproveListings: false,
    },
    email: {
      sendWelcomeEmails: true,
      sendListingNotifications: true,
      sendWeeklyReports: false,
    },
    security: {
      requireEmailVerification: true,
      enableTwoFactorAuth: false,
      sessionTimeout: 30,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load settings from localStorage or API
  useEffect(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const handlePlatformChange = (field: keyof Settings['platform'], value: any) => {
    setSettings(prev => ({
      ...prev,
      platform: {
        ...prev.platform,
        [field]: value,
      },
    }));
  };

  const handleEmailChange = (field: keyof Settings['email'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      email: {
        ...prev.email,
        [field]: value,
      },
    }));
  };

  const handleSecurityChange = (field: keyof Settings['security'], value: any) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    
    try {
      await onSaveSettings(settings);
      
      // Save to localStorage
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      const defaultSettings: Settings = {
        platform: {
          commissionRate: 8.5,
          defaultCurrency: 'PHP',
          maxPropertyImages: 20,
          autoApproveListings: false,
        },
        email: {
          sendWelcomeEmails: true,
          sendListingNotifications: true,
          sendWeeklyReports: false,
        },
        security: {
          requireEmailVerification: true,
          enableTwoFactorAuth: false,
          sessionTimeout: 30,
        },
      };
      setSettings(defaultSettings);
      localStorage.removeItem('adminSettings');
      setMessage({ type: 'success', text: 'Settings reset to default values!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outlined" 
            onClick={handleReset}
            disabled={isSaving}
          >
            Reset to Default
          </Button>
          <Button 
            onClick={handleSave}
            loading={isSaving}
            disabled={isLoading}
          >
            Save Settings
          </Button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-8">
        {/* Platform Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission Rate (%)
              </label>
              <Input
                type="number"
                value={settings.platform.commissionRate}
                onChange={(e) => handlePlatformChange('commissionRate', parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Currency
              </label>
              <Select
                value={settings.platform.defaultCurrency}
                onChange={(e) => handlePlatformChange('defaultCurrency', e.target.value)}
              >
                <option value="PHP">Philippine Peso (₱)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Property Images
              </label>
              <Input
                type="number"
                value={settings.platform.maxPropertyImages}
                onChange={(e) => handlePlatformChange('maxPropertyImages', parseInt(e.target.value) || 0)}
                min="1"
                max="50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auto-approve Listings
              </label>
              <Select
                value={settings.platform.autoApproveListings.toString()}
                onChange={(e) => handlePlatformChange('autoApproveListings', e.target.value === 'true')}
              >
                <option value="false">Manual Review Required</option>
                <option value="true">Auto-approve</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Settings</h3>
          
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.email.sendWelcomeEmails}
                onChange={(e) => handleEmailChange('sendWelcomeEmails', e.target.checked)}
                className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700">Send welcome emails to new users</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.email.sendListingNotifications}
                onChange={(e) => handleEmailChange('sendListingNotifications', e.target.checked)}
                className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700">Send listing notifications to agents</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.email.sendWeeklyReports}
                onChange={(e) => handleEmailChange('sendWeeklyReports', e.target.checked)}
                className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700">Send weekly performance reports</span>
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.security.requireEmailVerification}
                    onChange={(e) => handleSecurityChange('requireEmailVerification', e.target.checked)}
                    className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Require email verification</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.security.enableTwoFactorAuth}
                    onChange={(e) => handleSecurityChange('enableTwoFactorAuth', e.target.checked)}
                    className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable two-factor authentication</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <Input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value) || 30)}
                min="5"
                max="480"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 