import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../../ui';
import { User, Role } from '../types';
import { formatDate } from '../utils';

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

interface UserEditModalProps {
  user: User | null;
  roles: Role[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, roleId: string) => Promise<void>;
}

interface UserDeleteModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (userId: string) => Promise<void>;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, isOpen, onClose }) => {
  if (!user) return null;

  return (
    <div className={`fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">User Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <p className="text-gray-900">{user.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <p className="text-gray-900">{user.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <p className="text-gray-900">{user.status}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Joined</label>
            <p className="text-gray-900">{formatDate(user.joinDate)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Last Active</label>
            <p className="text-gray-900">{formatDate(user.lastActive)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Saved Properties</label>
            <p className="text-gray-900">{user.savedProperties}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Inquiries</label>
            <p className="text-gray-900">{user.inquiries}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export const UserEditModal: React.FC<UserEditModalProps> = ({ user, roles, isOpen, onClose, onSave }) => {
  const [selectedRoleId, setSelectedRoleId] = React.useState(user?.role_id || '');

  React.useEffect(() => {
    setSelectedRoleId(user?.role_id || '');
  }, [user]);

  if (!user) return null;

  return (
    <div className={`fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit User</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
            >
              <option value="">Select role</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button onClick={async () => {
            await onSave(user.id, selectedRoleId);
            onClose();
          }}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export const UserDeleteModal: React.FC<UserDeleteModalProps> = ({ user, isOpen, onClose, onDelete }) => {
  if (!user) return null;

  return (
    <div className={`fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-red-600">Delete User</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-700 mb-4">Are you sure you want to delete this user?</p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">
              <strong>Name:</strong> {user.name}<br/>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
          <p className="text-sm text-red-600 mt-3">This action cannot be undone.</p>
        </div>
        <div className="flex justify-end space-x-3">
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button 
            className="!bg-red-600 hover:!bg-red-700 !text-white"
            onClick={() => onDelete(user.id)}
          >
            Delete User
          </Button>
        </div>
      </div>
    </div>
  );
}; 