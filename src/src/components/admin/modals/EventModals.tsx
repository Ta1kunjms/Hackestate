import React, { useState } from 'react';
import { Modal } from '../../ui';
import { Button, Input, Textarea, Select } from '../../ui';
import { Event } from '../types';
import { supabase } from '../../../lib/supabase';

interface EventDetailsModalProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  open,
  onClose
}) => {
  if (!event) return null;

  return (
    <Modal open={open} onClose={onClose} title="Event Details">
      <div className="space-y-6">
        {event.imageUrl && (
          <div className="flex justify-center">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-64 h-48 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <p className="text-gray-900">{event.title}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <p className="text-gray-900">{event.type}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <p className="text-gray-900">{event.date}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <p className="text-gray-900">{event.time}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <p className="text-gray-900">{event.location}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <p className="text-gray-900">{event.price ? `₱${event.price.toLocaleString()}` : 'Free'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
            <p className="text-gray-900">{event.attendees}/{event.maxCapacity} attendees</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              event.status === 'Published' ? 'bg-green-100 text-green-800' :
              event.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {event.status}
            </span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <p className="text-gray-900 whitespace-pre-wrap">{event.description}</p>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

interface EventEditModalProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
  onSave: (eventId: string, updates: any) => Promise<void>;
}

export const EventEditModal: React.FC<EventEditModalProps> = ({
  event,
  open,
  onClose,
  onSave
}) => {
  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    type: '',
    price: '',
    maxCapacity: '',
    status: '',
    imageUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (event) {
      setForm({
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        description: event.description || '',
        type: event.type,
        price: event.price?.toString() || '',
        maxCapacity: event.maxCapacity.toString(),
        status: event.status,
        imageUrl: event.imageUrl || ''
      });
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    setIsSubmitting(true);
    try {
      await onSave(event.id, {
        title: form.title,
        event_date: form.date,
        event_time: form.time,
        location: form.location,
        description: form.description,
        event_type: form.type,
        price: parseFloat(form.price) || 0,
        max_capacity: parseInt(form.maxCapacity) || 0,
        status: form.status,
        image_url: form.imageUrl
      });
      onClose();
    } catch (error) {
      console.error('Error updating event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!event) return null;

  return (
    <Modal open={open} onClose={onClose} title="Edit Event">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <Input
            id="edit-title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <Input
              id="edit-date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="edit-time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <Input
              id="edit-time"
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="edit-location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <Input
            id="edit-location"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="edit-type" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <Select
            id="edit-type"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            <option value="Open House">Open House</option>
            <option value="Property Tour">Property Tour</option>
            <option value="Real Estate Seminar">Real Estate Seminar</option>
            <option value="Investment Workshop">Investment Workshop</option>
            <option value="Networking Event">Networking Event</option>
            <option value="Auction">Auction</option>
            <option value="Other">Other</option>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 mb-1">Price (₱)</label>
            <Input
              id="edit-price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500 mt-1">Enter 0 for free events</p>
          </div>
          
          <div>
            <label htmlFor="edit-max-capacity" className="block text-sm font-medium text-gray-700 mb-1">Max Capacity</label>
            <Input
              id="edit-max-capacity"
              name="maxCapacity"
              type="number"
              min="1"
              value={form.maxCapacity}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <Select
            id="edit-status"
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Cancelled">Cancelled</option>
          </Select>
        </div>

        <div>
          <label htmlFor="edit-image-url" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <Input
            id="edit-image-url"
            name="imageUrl"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={form.imageUrl}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <Textarea
            id="edit-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outlined" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

interface EventDeleteModalProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
  onDelete: (eventId: string) => Promise<void>;
}

export const EventDeleteModal: React.FC<EventDeleteModalProps> = ({
  event,
  open,
  onClose,
  onDelete
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!event) return;
    
    setIsDeleting(true);
    try {
      await onDelete(event.id);
      onClose();
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!event || !open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Full width modal container */}
      <div className="w-full max-w-4xl mx-4 bg-white rounded-xl border-2 border-gray-200 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Delete Event</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete the event <strong>"{event.title}"</strong>?
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Warning</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>This action cannot be undone. All event data, including registrations, will be permanently deleted.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-2 p-6 border-t border-gray-200">
          <Button type="button" variant="outlined" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="filled"
            color="red"
            onClick={handleDelete} 
            loading={isDeleting}
          >
            Delete Event
          </Button>
        </div>
      </div>
    </div>
  );
}; 