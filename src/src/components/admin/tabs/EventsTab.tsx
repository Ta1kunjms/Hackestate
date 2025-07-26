import React, { useState } from 'react';
import { Button, Input, Textarea, Select } from '../../ui';
import { Event } from '../types';
import { formatDate } from '../utils';

interface EventsTabProps {
  events: Event[];
  isLoading: boolean;
  onRefresh: () => void;
  onEventAction: (eventId: string, action: string) => void;
  onCreateEvent: (data: any) => void;
  onUpdateEvent: (eventId: string, data: any) => void;
}

const categories = [
  'Expo',
  'Seminar',
  'Workshop',
  'Tour',
  'Webinar',
  'Networking',
  'Other',
];

export const EventsTab: React.FC<EventsTabProps> = ({
  events,
  isLoading,
  onRefresh,
  onEventAction,
  onCreateEvent,
  onUpdateEvent
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: '',
    imageUrl: '',
    price: '',
    maxCapacity: '',
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const validate = () => {
    const newErrors: Partial<typeof form> = {};
    if (!form.title) newErrors.title = 'Title is required';
    if (!form.date) newErrors.date = 'Date is required';
    if (!form.time) newErrors.time = 'Time is required';
    if (!form.location) newErrors.location = 'Location is required';
    if (!form.description) newErrors.description = 'Description is required';
    if (!form.category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, GIF, etc.)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size must be less than 5MB');
        return;
      }

      setUploadedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear URL input when file is uploaded
      setForm({ ...form, imageUrl: '' });
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, imageUrl: e.target.value });
    // Clear uploaded file when URL is entered
    setUploadedFile(null);
    setImagePreview(null);
  };

  const uploadImageToServer = async (file: File): Promise<string> => {
    // For now, we'll use a simple approach - convert to base64
    // In a real app, you'd upload to a cloud service like AWS S3, Cloudinary, etc.
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setUploading(true);

    try {
      let finalImageUrl = form.imageUrl;

      // If a file was uploaded, process it
      if (uploadedFile) {
        finalImageUrl = await uploadImageToServer(uploadedFile);
      }

      const eventData = {
        ...form,
        imageUrl: finalImageUrl
      };

      if (editingEventId) {
        // Update existing event
        await onUpdateEvent(editingEventId, eventData);
      } else {
        // Create new event
        await onCreateEvent(eventData);
      }

      // Reset form
      setForm({ title: '', date: '', time: '', location: '', description: '', category: '', imageUrl: '', price: '', maxCapacity: '' });
      setImagePreview(null);
      setUploadedFile(null);
      setShowCreateForm(false);
      setEditingEventId(null);
    } catch (error) {
      console.error('Error saving event:', error);
      alert(`Failed to ${editingEventId ? 'update' : 'create'} event. Please try again.`);
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEventId(event.id);
    setForm({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description || '',
      category: event.type,
      imageUrl: event.imageUrl || '',
      price: event.price?.toString() || '',
      maxCapacity: event.maxCapacity.toString(),
    });
    setImagePreview(event.imageUrl || null);
    setShowCreateForm(true);
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingEventId(null);
    setForm({ title: '', date: '', time: '', location: '', description: '', category: '', imageUrl: '', price: '', maxCapacity: '' });
    setImagePreview(null);
    setUploadedFile(null);
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outlined" 
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center"
          >
            <span className="mr-2">🔄</span>
            Refresh
          </Button>
          <Button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center"
          >
            {showCreateForm ? 'Cancel' : 'Create New Event'}
          </Button>
        </div>
      </div>

      {/* Create Event Form */}
      {showCreateForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingEventId ? 'Edit Event' : 'Create New Event'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <Input
                id="event-title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="event-date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <Input
                  id="event-date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
                {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
              </div>
              <div>
                <label htmlFor="event-time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <Input
                  id="event-time"
                  name="time"
                  type="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                />
                {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="event-location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <Input
                id="event-location"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
              />
              {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
            </div>
            <div>
              <label htmlFor="event-category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <Select
                id="event-category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="event-price" className="block text-sm font-medium text-gray-700 mb-1">Price (₱)</label>
                <Input
                  id="event-price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.price}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 mt-1">Enter 0 for free events</p>
              </div>
              <div>
                <label htmlFor="event-max-capacity" className="block text-sm font-medium text-gray-700 mb-1">Max Capacity</label>
                <Input
                  id="event-max-capacity"
                  name="maxCapacity"
                  type="number"
                  min="1"
                  placeholder="50"
                  value={form.maxCapacity}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 mt-1">Maximum number of attendees</p>
              </div>
            </div>
            <div>
              <label htmlFor="event-image" className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
              <div className="space-y-4">
                {/* File Upload Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors">
                  <input
                    type="file"
                    id="event-image-file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="event-image-file" className="cursor-pointer">
                    <div className="space-y-2">
                      <div className="text-2xl">📁</div>
                      <div className="text-sm font-medium text-gray-700">
                        {uploadedFile ? uploadedFile.name : 'Click to upload image'}
                      </div>
                      <div className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </div>
                    </div>
                  </label>
                </div>

                {/* OR Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                {/* URL Input Section */}
                <div className="space-y-2">
                  <Input
                    id="event-image-url"
                    name="imageUrl"
                    type="url"
                    placeholder="https://example.com/event-image.jpg"
                    value={form.imageUrl}
                    onChange={handleImageUrlChange}
                  />
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-500">Enter a URL for the event image</p>
                    {form.imageUrl && !imagePreview && (
                      <button
                        type="button"
                        onClick={() => setImagePreview(form.imageUrl)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Preview
                      </button>
                    )}
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Hide Preview
                      </button>
                    )}
                  </div>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Event preview" 
                      className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                      onError={() => setImagePreview(null)}
                    />
                  </div>
                )}

                {/* Upload Status */}
                {uploading && (
                  <div className="text-xs text-orange-600">
                    ⏳ Uploading image...
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  💡 Tip: You can upload an image file or use a URL from services like Imgur, Unsplash, etc.
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="event-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <Textarea
                id="event-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outlined" onClick={handleCancel} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" loading={submitting}>
                {editingEventId ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </form>
        </div>
      )}
      
      {/* Events List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-4 mb-4">
                {event.imageUrl && (
                  <img 
                    src={event.imageUrl} 
                    alt={event.title}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>📅 {event.date} at {event.time}</p>
                        <p>📍 {event.location}</p>
                        <p>🎫 {event.attendees}/{event.maxCapacity} attendees</p>
                        <p>💰 {event.price ? `₱${event.price.toLocaleString()}` : 'Free'}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {event.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEventAction(event.id, 'view')}
                  className="text-blue-600 hover:text-blue-900 text-sm"
                >
                  View
                </button>
                <button
                  onClick={() => handleEditEvent(event)}
                  className="text-orange-600 hover:text-orange-900 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => onEventAction(event.id, 'delete')}
                  className="text-red-600 hover:text-red-900 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 bg-white rounded-xl p-12 text-center">
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-4">📅</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-500 mb-4">
                {isLoading ? 'Loading events...' : 'There are no events in the system yet.'}
              </p>
              {!isLoading && (
                <Button 
                  variant="outlined" 
                  onClick={onRefresh}
                  className="flex items-center"
                >
                  <span className="mr-2">🔄</span>
                  Refresh Events
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 