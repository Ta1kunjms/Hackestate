import React, { useState, useEffect } from 'react';
import { Button } from './ui';
import { EventRegistrationService } from '../services/eventRegistrationService';
import { useAuth } from '../contexts/AuthContext';

interface EventRegistrationButtonProps {
  eventId: string;
  maxCapacity: number;
  currentAttendees: number;
  price: number;
  onRegistrationChange?: () => void;
}

export const EventRegistrationButton: React.FC<EventRegistrationButtonProps> = ({
  eventId,
  maxCapacity,
  currentAttendees,
  price,
  onRegistrationChange
}) => {
  const { user } = useAuth();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const isEventFull = currentAttendees >= maxCapacity;
  const spotsRemaining = maxCapacity - currentAttendees;

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (!user?.id) {
        setIsChecking(false);
        return;
      }

      try {
        const registered = await EventRegistrationService.isUserRegistered(eventId, user.id);
        setIsRegistered(registered);
      } catch (error) {
        console.error('Error checking registration status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkRegistrationStatus();
  }, [eventId, user?.id]);

  const handleRegister = async () => {
    if (!user?.id) {
      alert('Please log in to register for events');
      return;
    }

    setIsLoading(true);
    try {
      const response = await EventRegistrationService.registerForEvent(eventId, user.id);
      
      if (response.success) {
        setIsRegistered(true);
        onRegistrationChange?.();
        alert('Successfully registered for event!');
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to register for event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!user?.id) return;

    if (!confirm('Are you sure you want to cancel your registration?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await EventRegistrationService.cancelRegistration(eventId, user.id);
      
      if (response.success) {
        setIsRegistered(false);
        onRegistrationChange?.();
        alert('Registration cancelled successfully');
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error('Unregistration error:', error);
      alert('Failed to cancel registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <Button disabled className="w-full">
        Loading...
      </Button>
    );
  }

  if (isEventFull) {
    return (
      <Button disabled className="w-full bg-gray-400 text-white">
        Event Full
      </Button>
    );
  }

  if (isRegistered) {
    return (
      <div className="space-y-2">
        <Button 
          onClick={handleUnregister}
          disabled={isLoading}
          variant="outlined"
          className="w-full text-red-600 border-red-600 hover:bg-red-50"
        >
          {isLoading ? 'Cancelling...' : 'Cancel Registration'}
        </Button>
        <p className="text-xs text-green-600 text-center">✓ You're registered!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button 
        onClick={handleRegister}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Registering...' : `Register ${price > 0 ? `(₱${price.toLocaleString()})` : '(Free)'}`}
      </Button>
      <p className="text-xs text-gray-500 text-center">
        {spotsRemaining} spots remaining
      </p>
    </div>
  );
}; 