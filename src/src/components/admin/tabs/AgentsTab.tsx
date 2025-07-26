import React from 'react';
import { 
  UserGroupIcon, 
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { Button } from '../../ui';
import { Agent } from '../types';
import { formatDate } from '../utils';

interface AgentsTabProps {
  agents: Agent[];
  searchTerm: string;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onAgentAction: (agentId: string, action: string) => void;
}

export const AgentsTab: React.FC<AgentsTabProps> = ({
  agents,
  searchTerm,
  isLoading,
  onSearchChange,
  onRefresh,
  onAgentAction
}) => {
  // Filter agents based on search term
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = searchTerm === '' || 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.license.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Agent Management</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search agents..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAgents.length > 0 ? (
                filteredAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                        <div className="text-sm text-gray-500">{agent.email}</div>
                        <div className="text-xs text-gray-500">License: {agent.license}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div>{agent.properties} properties</div>
                        <div>{agent.sales} sales</div>
                        <div>{agent.rating || '0'} rating</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agent.commission}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(agent.joinDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onAgentAction(agent.id, 'view')}
                          className="text-blue-600 hover:text-blue-900"
                          title="View agent details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onAgentAction(agent.id, 'edit')}
                          className="text-orange-600 hover:text-orange-900"
                          title="Edit agent commission"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onAgentAction(agent.id, 'delete')}
                          className="text-red-600 hover:text-red-900"
                          title="Delete agent"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <UserGroupIcon className="w-12 h-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
                      <p className="text-gray-500 mb-4">
                        {isLoading ? 'Loading agents...' : 
                         searchTerm ? 'No agents match your search criteria.' : 
                         'There are no agents in the system yet.'}
                      </p>
                      {!isLoading && (
                        <Button 
                          variant="outlined" 
                          onClick={onRefresh}
                          className="flex items-center"
                        >
                          <span className="mr-2">🔄</span>
                          Refresh Agents
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