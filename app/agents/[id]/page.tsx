import React from 'react';
import AgentMessages from './messages';

// Mock data fetch (replace with real fetch in production)
async function getAgent(id: string) {
  return {
    id,
    name: 'Jane Doe',
    avatarUrl: '/public/logo192.png',
    bio: 'Experienced real estate agent specializing in downtown properties.',
    location: 'New York, NY',
    language: 'English, Spanish',
    experience: '10 years',
    email: 'jane@example.com',
  };
}

async function getListings(agentId: string) {
  return [
    {
      id: '1',
      title: 'Modern Loft',
      image: '/public/logo512.png',
      price: '$1,200,000',
    },
    {
      id: '2',
      title: 'Cozy Studio',
      image: '/public/logo192.png',
      price: '$650,000',
    },
  ];
}

export default async function AgentProfilePage({ params }: { params: { id: string } }) {
  const agent = await getAgent(params.id);
  const listings = await getListings(params.id);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <img src={agent.avatarUrl} alt={agent.name} className="w-32 h-32 rounded-full" />
        <div>
          <h1 className="text-2xl font-bold">{agent.name}</h1>
          <p className="text-gray-600">{agent.bio}</p>
          <p className="mt-2 text-sm text-gray-500">{agent.location} | {agent.language}</p>
          <p className="text-xs text-gray-400">{agent.experience}</p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Contact {agent.name}</h2>
        <form className="space-y-4 max-w-md">
          <input className="w-full border p-2 rounded" placeholder="Your Name" required />
          <input className="w-full border p-2 rounded" placeholder="Your Email" type="email" required />
          <textarea className="w-full border p-2 rounded" placeholder="Your Message" required />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Send</button>
        </form>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Listings by {agent.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.map(listing => (
            <div key={listing.id} className="border rounded p-4">
              <img src={listing.image} alt={listing.title} className="w-full h-40 object-cover rounded" />
              <h3 className="mt-2 font-bold">{listing.title}</h3>
              <p className="text-gray-600">{listing.price}</p>
              <a href={`/properties/${listing.id}`} className="text-blue-600 underline">View Details</a>
            </div>
          ))}
        </div>
      </div>
      <AgentMessages />
    </div>
  );
} 