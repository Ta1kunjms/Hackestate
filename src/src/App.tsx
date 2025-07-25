import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import PageWrapper from './components/layout/PageWrapper';
import Section from './components/layout/Section';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HeroSection from './components/landing/HeroSection';
import FeaturedListings from './components/landing/FeaturedListings';
import PropertiesPage from './pages/PropertiesPage';
// Removed LoginModal - using page-only authentication
import { Login, Register, ResetPassword, VerifyEmail, AuthCallback } from './pages/auth';
import NotFoundPage from './pages/NotFoundPage';

// Home Page Component
const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedListings />
      {/* Additional landing page sections will be added here in subsequent tasks */}
      <Footer />
    </div>
  );
};

// Auth Pages Layout (without navbar)
const AuthPageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return children;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<HomePage />} />
          
          {/* Properties Route */}
          <Route path="/properties" element={<PropertiesPage />} />
          
          {/* Authentication Routes (without navbar) */}
          <Route path="/auth/login" element={<AuthPageLayout><Login /></AuthPageLayout>} />
          <Route path="/auth/register" element={<AuthPageLayout><Register /></AuthPageLayout>} />
          <Route path="/auth/reset-password" element={<AuthPageLayout><ResetPassword /></AuthPageLayout>} />
          <Route path="/auth/verify-email" element={<AuthPageLayout><VerifyEmail /></AuthPageLayout>} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Fallback Route - 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
