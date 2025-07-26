import React from 'react';
import { 
  UsersIcon, 
  UserGroupIcon, 
  HomeIcon, 
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Button } from '../../ui';
import { PlatformStats, User, Event, AdminTab } from '../types';
import { formatDate, formatCurrency, getStatusColor } from '../utils';

interface OverviewTabProps {
  platformStats: PlatformStats;
  users: User[];
  events: Event[];
  onTabChange: (tab: AdminTab) => void;
  onRecentUserClick: (userId: string) => void;
  onRecentEventClick: (eventId: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  platformStats,
  users,
  events,
  onTabChange,
  onRecentUserClick,
  onRecentEventClick
}) => {
  return (
    <div className="space-y-8">
      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <UsersIcon className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{platformStats.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-xs text-green-600">{platformStats.activeUsers} active</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <UserGroupIcon className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{platformStats.totalAgents}</p>
              <p className="text-sm text-gray-600">Total Agents</p>
              <p className="text-xs text-green-600">{platformStats.verifiedAgents} verified</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <HomeIcon className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{platformStats.totalProperties.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Properties</p>
              <p className="text-xs text-green-600">{platformStats.activeListings} active</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <ChartBarIcon className="w-8 h-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(platformStats.monthlyRevenue)}</p>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-xs text-green-600">{platformStats.conversionRate}% conversion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
            <Button variant="outlined" size="sm" onClick={() => onTabChange('users')}>
              View All ({users.length})
            </Button>
          </div>
          
          <div className="space-y-4">
            {users.length > 0 ? (
              users.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => onRecentUserClick(user.id)}>
                  <div>
                    <h4 className="font-medium text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">Joined {formatDate(user.joinDate)}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <UsersIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No users found</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Events</h2>
            <Button variant="outlined" size="sm" onClick={() => onTabChange('events')}>
              View All ({events.length})
            </Button>
          </div>
          
          <div className="space-y-4">
            {events.length > 0 ? (
              events.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => onRecentEventClick(event.id)}>
                  <div>
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.location}</p>
                    <p className="text-xs text-gray-500">{formatDate(event.date)} at {event.time}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No events found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 