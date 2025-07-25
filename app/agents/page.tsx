import React from 'react';
import AgentCard from '../../src/src/components/AgentCard';

// Mock agents data
const agents = [
  {
    id: '1',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'Carlos Mendoza',
    location: 'Makati City',
    language: 'English, Filipino',
    experience: '8+ years',
    profileUrl: '/agents/1',
  },
  {
    id: '2',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    name: 'Maria Santos',
    location: 'Quezon City',
    language: 'English, Filipino',
    experience: '5+ years',
    profileUrl: '/agents/2',
  },
  {
    id: '3',
    avatarUrl: 'https://randomuser.me/api/portraits/men/65.jpg',
    name: 'John Lee',
    location: 'Taguig City',
    language: 'English, Chinese',
    experience: '10+ years',
    profileUrl: '/agents/3',
  },
];

const AgentsDirectoryPage: React.FC = () => (
  <div className="max-w-5xl mx-auto py-16 px-4">
    <h1 className="text-3xl font-bold mb-8">Our Agents</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {agents.map(agent => (
        <AgentCard key={agent.id} {...agent} />
      ))}
    </div>
  </div>
);

export default AgentsDirectoryPage; 