import React from 'react';
import './App.css';
import AgentChat from './components/AgentChat';
import { ToastProvider } from './components/ToastProvider';

const App: React.FC = () => {
  return (
    <ToastProvider>
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header style={{ padding: '1rem', background: '#1976d2', color: 'white' }}>
          <h1>Real Estate Website</h1>
        </header>
        <main style={{ flex: 1, padding: '2rem', textAlign: 'center' }}>
          <section style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>
              Find Your Dream Home
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
              Welcome to our real estate platform. We're building something amazing for you.
            </p>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '2rem', 
              borderRadius: '8px', 
              marginBottom: '2rem' 
            }}>
              <h3 style={{ color: '#1976d2', marginBottom: '1rem' }}>Coming Soon</h3>
              <p>Our full real estate website is under development. In the meantime, try our AI assistant!</p>
            </div>
          </section>
        </main>
        
        {/* Floating AI Chat Assistant */}
        <AgentChat />
      </div>
    </ToastProvider>
  );
};

export default App;
