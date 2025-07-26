import React, { useState } from 'react';
import { Modal, Button, Input, Textarea, Select } from '../ui';

interface EventFormData {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
}

interface EventCreateModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: EventFormData) => void;
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

const EventCreateModal: React.FC<EventCreateModalProps> = ({ open, onClose, onCreate }) => {
  const [form, setForm] = useState<EventFormData>({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: '',
  });
  const [errors, setErrors] = useState<Partial<EventFormData>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Partial<EventFormData> = {};
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await onCreate(form);
    setSubmitting(false);
    setForm({ title: '', date: '', time: '', location: '', description: '', category: '' });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Create New Event">
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
        <div className="flex space-x-2">
          <div className="flex-1">
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
          <div className="flex-1">
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
          <Button type="button" variant="outlined" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Create Event
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EventCreateModal; 