import React from 'react';

interface AgentCardProps {
  avatarUrl: string;
  name: string;
  location: string;
  language: string;
  experience: string;
  profileUrl: string;
}

const AgentCard: React.FC<AgentCardProps> = ({
  avatarUrl,
  name,
  location,
  language,
  experience,
  profileUrl,
}) => (
  <div className="flex flex-col items-center border rounded-lg p-4 shadow hover:shadow-lg transition">
    <img src={avatarUrl} alt={name} className="w-20 h-20 rounded-full mb-2 object-cover" />
    <h3 className="text-lg font-semibold">{name}</h3>
    <div className="text-sm text-gray-500 mb-1">{location}</div>
    <div className="text-xs text-gray-400 mb-1">{language}</div>
    <div className="text-xs text-gray-400 mb-2">{experience}</div>
    <a href={profileUrl} className="text-blue-600 hover:underline text-sm">View Profile</a>
  </div>
);

export default AgentCard; 