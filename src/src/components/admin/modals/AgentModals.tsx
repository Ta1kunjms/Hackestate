import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../../ui';
import { Agent } from '../types';
import { formatDate } from '../utils';

interface AgentDetailsModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
}

interface AgentEditModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (agentId: string, commission: number) => Promise<void>;
}

interface AgentDeleteModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (agentId: string) => Promise<void>;
}

export const AgentDetailsModal: React.FC<AgentDetailsModalProps> = ({ agent, isOpen, onClose }) => {
  if (!agent) return null;

  return (
    <div className={`fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Agent Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <p className="text-gray-900">{agent.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <p className="text-gray-900">{agent.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <p className="text-gray-900">{agent.phone}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">License</label>
            <p className="text-gray-900">{agent.license}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Properties</label>
            <p className="text-gray-900">{agent.properties}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Sales</label>
            <p className="text-gray-900">{agent.sales}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Rating</label>
            <p className="text-gray-900">{agent.rating || '0'} rating</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Commission</label>
            <p className="text-gray-900">{agent.commission}%</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Joined</label>
            <p className="text-gray-900">{formatDate(agent.joinDate)}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export const AgentEditModal: React.FC<AgentEditModalProps> = ({ agent, isOpen, onClose, onSave }) => {
  const [commission, setCommission] = React.useState(agent?.commission || 0);

  React.useEffect(() => {
    setCommission(agent?.commission || 0);
  }, [agent]);

  if (!agent) return null;

  return (
    <div className={`fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Agent</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate (%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-orange-500"
              value={commission}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                setCommission(value);
              }}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button onClick={async () => {
            await onSave(agent.id, commission);
            onClose();
          }}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export const AgentDeleteModal: React.FC<AgentDeleteModalProps> = ({ agent, isOpen, onClose, onDelete }) => {
  if (!agent) return null;

  return (
    <div className={`fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-red-600">Delete Agent</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-700 mb-4">Are you sure you want to delete this agent?</p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">
              <strong>Name:</strong> {agent.name}<br/>
              <strong>Email:</strong> {agent.email}<br/>
              <strong>License:</strong> {agent.license}
            </p>
          </div>
          <p className="text-sm text-red-600 mt-3">This action cannot be undone.</p>
        </div>
        <div className="flex justify-end space-x-3">
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button 
            className="!bg-red-600 hover:!bg-red-700 !text-white"
            onClick={() => onDelete(agent.id)}
          >
            Delete Agent
          </Button>
        </div>
      </div>
    </div>
  );
}; 