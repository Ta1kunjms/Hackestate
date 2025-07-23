import React, { useState } from 'react';

const locations = ['New York', 'San Francisco', 'London', 'Berlin'];
const languages = ['English', 'Spanish', 'German', 'French'];
const experiences = ['1-3 years', '3-5 years', '5+ years'];

export default function AgentDirectory() {
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('');
  const [experience, setExperience] = useState('');

  return (
    <div className="p-6 bg-white rounded shadow max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Agent Directory Filters</h2>
      <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={location}
            onChange={e => setLocation(e.target.value)}
          >
            <option value="">All</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Language</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={language}
            onChange={e => setLanguage(e.target.value)}
          >
            <option value="">All</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Experience</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={experience}
            onChange={e => setExperience(e.target.value)}
          >
            <option value="">All</option>
            {experiences.map(exp => (
              <option key={exp} value={exp}>{exp}</option>
            ))}
          </select>
        </div>
      </form>
    </div>
  );
} 