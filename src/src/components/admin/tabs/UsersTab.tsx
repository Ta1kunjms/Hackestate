import React from 'react';
import { 
  UsersIcon, 
  MagnifyingGlassIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { Button } from '../../ui';
import { User, Role } from '../types';
import { formatDate, getStatusColor } from '../utils';

interface UsersTabProps {
  users: User[];
  roles: Role[];
  searchTerm: string;
  selectedFilter: string;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onRefresh: () => void;
  onUserAction: (userId: string, action: string) => void;
  onChangeUserRole: (userId: string, newRoleId: string) => Promise<void>;
}

export const UsersTab: React.FC<UsersTabProps> = ({
  users,
  roles,
  searchTerm,
  selectedFilter,
  isLoading,
  onSearchChange,
  onFilterChange,
  onRefresh,
  onUserAction,
  onChangeUserRole
}) => {
  // Filter users based on search term and status filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
      user.status.toLowerCase() === selectedFilter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button 
            variant="outlined" 
            onClick={onRefresh}
            className="flex items-center"
          >
            <span className="mr-2">🔄</span>
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{user.savedProperties} saved properties</div>
                      <div>{user.inquiries} inquiries sent</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.joinDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <select
                        value={user.role_id || ''}
                        onChange={e => onChangeUserRole(user.id, e.target.value)}
                        className="border rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-2 focus:border-orange-500"
                      >
                        <option value="">Select role</option>
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          disabled
                          className="text-yellow-600 border border-yellow-400 rounded px-2 py-1 text-xs font-semibold opacity-50 cursor-not-allowed"
                          title="Suspend user (coming soon)"
                        >
                          Suspend
                        </button>
                        <button
                          onClick={() => onUserAction(user.id, 'delete')}
                          className="text-red-600 hover:text-red-900"
                          title="Delete user"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <UsersIcon className="w-12 h-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                      <p className="text-gray-500 mb-4">
                        {isLoading ? 'Loading users...' : 'There are no users in the system yet.'}
                      </p>
                      {!isLoading && (
                        <Button 
                          variant="outlined" 
                          onClick={onRefresh}
                          className="flex items-center"
                        >
                          <span className="mr-2">🔄</span>
                          Refresh Users
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 