import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../../ui';
import { Property } from '../types';
import { formatDate } from '../utils';

interface PropertyDetailsModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

interface PropertyEditModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (propertyId: string, updates: Partial<Property>) => Promise<void>;
}

interface PropertyDeleteModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (propertyId: string) => Promise<void>;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({ property, isOpen, onClose }) => {
  if (!property) return null;

  return (
    <div className={`fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Property Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <p className="text-gray-900">{property.title}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Address</label>
            <p className="text-gray-900">{property.address}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Price</label>
            <p className="text-gray-900">₱{property.price.toLocaleString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Type</label>
            <p className="text-gray-900">{property.type}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <p className="text-gray-900">{property.status}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Agent</label>
            <p className="text-gray-900">{property.agent}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Bedrooms</label>
            <p className="text-gray-900">{property.bedrooms}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Bathrooms</label>
            <p className="text-gray-900">{property.bathrooms}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Area</label>
            <p className="text-gray-900">{property.area} sqm</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Views</label>
            <p className="text-gray-900">{property.views}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Inquiries</label>
            <p className="text-gray-900">{property.inquiries}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Created</label>
            <p className="text-gray-900">{formatDate(property.created_at)}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export const PropertyEditModal: React.FC<PropertyEditModalProps> = ({ property, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = React.useState({
    title: property?.title || '',
    price: property?.price || 0,
    status: property?.status || 'Active'
  });

  React.useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        price: property.price,
        status: property.status
      });
    }
  }, [property]);

  if (!property) return null;

  return (
    <div className={`fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Property</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Sold">Sold</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button onClick={async () => {
            await onSave(property.id, formData);
            onClose();
          }}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export const PropertyDeleteModal: React.FC<PropertyDeleteModalProps> = ({ property, isOpen, onClose, onDelete }) => {
  if (!property) return null;

  return (
    <div className={`fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-red-600">Delete Property</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-700 mb-4">Are you sure you want to delete this property?</p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">
              <strong>Title:</strong> {property.title}<br/>
              <strong>Address:</strong> {property.address}<br/>
              <strong>Price:</strong> ₱{property.price.toLocaleString()}
            </p>
          </div>
          <p className="text-sm text-red-600 mt-3">This action cannot be undone.</p>
        </div>
        <div className="flex justify-end space-x-3">
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button 
            className="!bg-red-600 hover:!bg-red-700 !text-white"
            onClick={() => onDelete(property.id)}
          >
            Delete Property
          </Button>
        </div>
      </div>
    </div>
  );
}; 