import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import AgentChat from './components/AgentChat';
import { mockProperties, Property } from './data/mockProperties';
import { useRef } from 'react';

const App: React.FC = () => {
  const [filter, setFilter] = useState<{ location?: string; maxPrice?: number }>({});
  const filtered = mockProperties.filter((p) => {
    let ok = true;
    if (filter.location) ok = ok && p.location.toLowerCase().includes(filter.location.toLowerCase());
    if (filter.maxPrice) ok = ok && p.price <= filter.maxPrice;
    return ok;
  });

  const listingsRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);

  const handleScrollTo = (section: 'listings' | 'filters') => {
    if (section === 'listings' && listingsRef.current) {
      listingsRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'filters' && filtersRef.current) {
      filtersRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ padding: '1rem', background: '#1976d2', color: 'white' }}>
        <h1>Mock Real Estate Site</h1>
      </header>
      <main style={{ display: 'flex', flex: 1, padding: '1rem', gap: '2rem' }}>
        <aside ref={filtersRef} style={{ width: '250px', background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
          <h2>Filters (Placeholder)</h2>
          <div>Location, Price, Bedrooms, etc.</div>
        </aside>
        <section ref={listingsRef} style={{ flex: 1 }}>
          <h2>Property Listings</h2>
          <div>
            {filtered.length === 0 && <div style={{ color: '#888' }}>No properties found.</div>}
            {filtered.map((p) => (
              <div key={p.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                <strong>{p.title}</strong> - ${p.price.toLocaleString()} - {p.bedrooms} Bed, {p.bathrooms} Bath<br />
                <span style={{ color: '#1976d2' }}>{p.location}</span>
              </div>
            ))}
          </div>
        </section>
        {/* Floating AI agent */}
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
          <AgentChat onFilter={setFilter} onScrollTo={handleScrollTo} />
        </div>
      </main>
    </div>
  );
};

export default App;
