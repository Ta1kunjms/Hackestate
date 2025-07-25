'use client';
import React from 'react';

const AgentDashboardPage: React.FC = () => (
  <div className="max-w-3xl mx-auto py-16 px-4">
    <h1 className="text-3xl font-bold mb-6">Agent Dashboard</h1>
    <p className="text-lg text-gray-600 mb-8">Welcome to your private dashboard. Here you can manage your listings, view messages, and update your profile.</p>
    {/* Add agent-specific dashboard widgets/components here */}
    <div className="bg-white rounded-lg shadow p-6 text-gray-500 text-center">
      <span>Dashboard widgets coming soon...</span>
    </div>
  </div>
);

export default AgentDashboardPage; 