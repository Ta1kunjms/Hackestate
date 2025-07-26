import React from 'react';
import { 
  HomeIcon, 
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { Button } from '../../ui';
import { Property } from '../types';
import { getStatusColor } from '../utils';

interface PropertiesTabProps {
  properties: Property[];
  searchTerm: string;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onPropertyAction: (propertyId: string, action: string) => void;
}

export const PropertiesTab: React.FC<PropertiesTabProps> = ({
  properties,
  searchTerm,
  isLoading,
  onSearchChange,
  onRefresh,
  onPropertyAction
}) => {
  // Filter properties based on search term
  const filteredProperties = properties.filter(property => {
    const matchesSearch = searchTerm === '' || 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.agent.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Property Management</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
            />
          </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{property.title}</div>
                        <div className="text-sm text-gray-500">{property.address}</div>
                        <div className="text-xs text-gray-500">{property.type}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium">₱{property.price.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{property.bedrooms} bed, {property.bathrooms} bath</div>
                      <div>{property.area} sqm</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.agent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{property.views} views</div>
                      <div>{property.inquiries} inquiries</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onPropertyAction(property.id, 'view')}
                          className="text-blue-600 hover:text-blue-900"
                          title="View property details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onPropertyAction(property.id, 'edit')}
                          className="text-orange-600 hover:text-orange-900"
                          title="Edit property"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onPropertyAction(property.id, 'delete')}
                          className="text-red-600 hover:text-red-900"
                          title="Delete property"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <HomeIcon className="w-12 h-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                      <p className="text-gray-500 mb-4">
                        {isLoading ? 'Loading properties...' : 
                         searchTerm ? 'No properties match your search criteria.' : 
                         'There are no properties in the system yet.'}
                      </p>
                      {!isLoading && (
                        <Button 
                          variant="outlined" 
                          onClick={onRefresh}
                          className="flex items-center"
                        >
                          <span className="mr-2">🔄</span>
                          Refresh Properties
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