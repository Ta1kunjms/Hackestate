import React from 'react';
import AgentCard from '../../src/src/components/AgentCard';

// Agents data - in real app, this would come from API
const agents: any[] = [];

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