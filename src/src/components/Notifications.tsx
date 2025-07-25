import React, { useEffect, useState } from 'react';
import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useNotifications, Notification } from '../contexts/NotificationContext';
import { Button } from './ui';

interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
  index: number;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRemove, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const enterTimer = setTimeout(() => setIsVisible(true), 50 + index * 100);
    return () => clearTimeout(enterTimer);
  }, [index]);

  const handleRemove = () => {
    setIsRemoving(true);
    // Wait for exit animation before removing
    setTimeout(() => onRemove(notification.id), 300);
  };

  const getNotificationStyles = () => {
    const baseStyles = 'relative max-w-sm w-full bg-white rounded-lg shadow-lg border overflow-hidden transition-all duration-300 transform';
    
    if (isRemoving) {
      return `${baseStyles} translate-x-full opacity-0`;
    }
    
    if (!isVisible) {
      return `${baseStyles} translate-x-full opacity-0`;
    }

    return `${baseStyles} translate-x-0 opacity-100`;
  };

  const getIconAndColors = () => {
    switch (notification.type) {
      case 'success':
        return {
          icon: CheckCircleIcon,
          iconColor: 'text-green-500',
          borderColor: 'border-l-green-500',
          bgColor: 'bg-green-50'
        };
      case 'error':
        return {
          icon: XCircleIcon,
          iconColor: 'text-red-500',
          borderColor: 'border-l-red-500',
          bgColor: 'bg-red-50'
        };
      case 'warning':
        return {
          icon: ExclamationTriangleIcon,
          iconColor: 'text-yellow-500',
          borderColor: 'border-l-yellow-500',
          bgColor: 'bg-yellow-50'
        };
      case 'info':
      default:
        return {
          icon: InformationCircleIcon,
          iconColor: 'text-blue-500',
          borderColor: 'border-l-blue-500',
          bgColor: 'bg-blue-50'
        };
    }
  };

  const { icon: Icon, iconColor, borderColor, bgColor } = getIconAndColors();

  return (
    <div className={`${getNotificationStyles()} ${borderColor} border-l-4`}>
      <div className={`p-4 ${bgColor}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          
          <div className="ml-3 flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">
                  {notification.title}
                </h4>
                {notification.message && (
                  <p className="mt-1 text-sm text-gray-700">
                    {notification.message}
                  </p>
                )}
              </div>
              
              <button
                onClick={handleRemove}
                className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Dismiss notification"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
            
            {notification.action && (
              <div className="mt-3">
                <Button
                  onClick={() => {
                    notification.action!.onClick();
                    handleRemove();
                  }}
                  size="sm"
                  variant="outlined"
                  className="!text-xs !py-1 !px-3"
                >
                  {notification.action.label}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Progress bar for auto-dismiss */}
      {!notification.persistent && notification.duration && (
        <ProgressBar 
          duration={notification.duration} 
          type={notification.type}
          onComplete={handleRemove}
        />
      )}
    </div>
  );
};

interface ProgressBarProps {
  duration: number;
  type: Notification['type'];
  onComplete: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ duration, type, onComplete }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = 50; // Update every 50ms
    const decrement = (interval / duration) * 100;
    
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - decrement;
        if (newProgress <= 0) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration, onComplete]);

  const getProgressColor = () => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': default: return 'bg-blue-500';
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
      <div 
        className={`h-full transition-all duration-50 linear ${getProgressColor()}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

const Notifications: React.FC = () => {
  const { notifications, removeNotification, clearAll } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <>
      {/* Notification Container */}
      <div 
        className="fixed top-4 right-4 z-50 space-y-4 max-h-screen overflow-hidden"
        role="region"
        aria-label="Notifications"
        aria-live="polite"
      >
        {notifications.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
            index={index}
          />
        ))}
        
        {/* Clear All Button */}
        {notifications.length > 1 && (
          <div className="flex justify-end pt-2">
            <button
              onClick={clearAll}
              className="text-xs text-gray-500 hover:text-gray-700 underline transition-colors"
              aria-label="Clear all notifications"
            >
              Clear All ({notifications.length})
            </button>
          </div>
        )}
      </div>

      {/* Mobile Notification Container */}
      <div 
        className="fixed top-4 left-4 right-4 z-50 space-y-4 max-h-screen overflow-hidden sm:hidden"
        role="region"
        aria-label="Notifications"
        aria-live="polite"
      >
        {notifications.map((notification, index) => (
          <NotificationItem
            key={`mobile-${notification.id}`}
            notification={notification}
            onRemove={removeNotification}
            index={index}
          />
        ))}
      </div>
    </>
  );
};

export default Notifications; 