import React from 'react';
import { 
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  BellIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useNotify, useNotifications } from '../contexts/NotificationContext';
import { Button } from './ui';

const NotificationDemo: React.FC = () => {
  const notify = useNotify();
  const { clearAll, notifications } = useNotifications();

  const handleSuccessNotification = () => {
    notify.success(
      'Property Saved!', 
      'The property has been added to your favorites list.'
    );
  };

  const handleErrorNotification = () => {
    notify.error(
      'Upload Failed', 
      'Could not upload property images. Please check your connection and try again.',
      { persistent: true }
    );
  };

  const handleWarningNotification = () => {
    notify.warning(
      'Session Expiring', 
      'Your session will expire in 5 minutes. Please save your work.',
      { 
        duration: 10000,
        action: {
          label: 'Extend Session',
          onClick: () => {
            notify.success('Session Extended', 'Your session has been extended for another hour.');
          }
        }
      }
    );
  };

  const handleInfoNotification = () => {
    notify.info(
      'Market Update Available', 
      'New market analysis for Metro Manila is now available in your dashboard.',
      {
        action: {
          label: 'View Report',
          onClick: () => {
            notify.success('Redirecting...', 'Taking you to the market analysis page.');
          }
        }
      }
    );
  };

  const handlePersistentNotification = () => {
    notify.error(
      'Critical System Error', 
      'A critical error has occurred. Please contact support immediately.',
      { 
        persistent: true,
        action: {
          label: 'Contact Support',
          onClick: () => {
            window.open('/contact', '_blank');
          }
        }
      }
    );
  };

  const handleMultipleNotifications = () => {
    notify.success('Property #1', 'First property saved successfully.');
    
    setTimeout(() => {
      notify.info('Property #2', 'Second property added to comparison list.');
    }, 500);
    
    setTimeout(() => {
      notify.warning('Property #3', 'Third property price has increased since last visit.');
    }, 1000);
    
    setTimeout(() => {
      notify.success('All Done!', 'All properties have been processed.');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center mb-6">
          <BellIcon className="w-8 h-8 text-orange-500 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Notification System Demo</h2>
            <p className="text-gray-600">Test different types of notifications and features</p>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Active Notifications: {notifications.length}
            </span>
            {notifications.length > 0 && (
              <Button
                onClick={clearAll}
                size="sm"
                variant="outlined"
                className="!border-red-500 !text-red-500 hover:!bg-red-500 hover:!text-white"
              >
                <TrashIcon className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Basic Notification Types */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Notification Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={handleSuccessNotification}
              className="!bg-green-500 hover:!bg-green-600 !text-white flex items-center justify-center"
            >
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Success
            </Button>
            
            <Button
              onClick={handleErrorNotification}
              className="!bg-red-500 hover:!bg-red-600 !text-white flex items-center justify-center"
            >
              <XCircleIcon className="w-4 h-4 mr-2" />
              Error
            </Button>
            
            <Button
              onClick={handleWarningNotification}
              className="!bg-yellow-500 hover:!bg-yellow-600 !text-white flex items-center justify-center"
            >
              <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
              Warning
            </Button>
            
            <Button
              onClick={handleInfoNotification}
              className="!bg-blue-500 hover:!bg-blue-600 !text-white flex items-center justify-center"
            >
              <InformationCircleIcon className="w-4 h-4 mr-2" />
              Info
            </Button>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handlePersistentNotification}
              variant="outlined"
              className="!border-red-500 !text-red-500 hover:!bg-red-50"
            >
              Persistent Notification
            </Button>
            
            <Button
              onClick={handleMultipleNotifications}
              variant="outlined"
              className="!border-purple-500 !text-purple-500 hover:!bg-purple-50"
            >
              Multiple Notifications
            </Button>
          </div>
        </div>

        {/* Real Estate Examples */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Real Estate Use Cases</h3>
          <div className="space-y-3">
            <Button
              onClick={() => notify.success(
                'Property Inquiry Sent',
                'Your inquiry about the 3BR condo in BGC has been sent to the agent.',
                {
                  action: {
                    label: 'View Details',
                    onClick: () => notify.info('Redirecting', 'Taking you to property details...')
                  }
                }
              )}
              variant="outlined"
              className="w-full !border-orange-500 !text-orange-500 hover:!bg-orange-50"
            >
              Property Inquiry Sent
            </Button>
            
            <Button
              onClick={() => notify.warning(
                'Price Alert',
                'The property at Makati has decreased in price by ₱500,000.',
                {
                  action: {
                    label: 'View Property',
                    onClick: () => notify.success('Loading', 'Opening property details...')
                  }
                }
              )}
              variant="outlined"
              className="w-full !border-yellow-500 !text-yellow-500 hover:!bg-yellow-50"
            >
              Price Alert
            </Button>
            
            <Button
              onClick={() => notify.info(
                'New Listing Match',
                'A new 2BR apartment matching your criteria is now available.',
                {
                  duration: 8000,
                  action: {
                    label: 'View Listing',
                    onClick: () => notify.success('Opening...', 'Loading new listing details.')
                  }
                }
              )}
              variant="outlined"
              className="w-full !border-blue-500 !text-blue-500 hover:!bg-blue-50"
            >
              New Listing Match
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">How to Use</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Notifications appear in the top-right corner (desktop) or top-center (mobile)</li>
            <li>• Success and info notifications auto-dismiss after 5 seconds</li>
            <li>• Warning notifications last 7 seconds</li>
            <li>• Error notifications are persistent and must be manually dismissed</li>
            <li>• Click the X button or action buttons to dismiss notifications</li>
            <li>• Maximum of 5 notifications are shown at once</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotificationDemo; 