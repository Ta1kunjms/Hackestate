import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Notifications from './components/Notifications';
import Layout from './components/layout/Layout';
import PageWrapper from './components/layout/PageWrapper';
import Section from './components/layout/Section';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HeroSection from './components/landing/HeroSection';
import FeaturedListings from './components/landing/FeaturedListings';
import BrowseByCategory from './components/landing/BrowseByCategory';
import FeaturedAgents from './components/landing/FeaturedAgents';
import Testimonials from './components/landing/Testimonials';
import HowItWorks from './components/landing/HowItWorks';
import BlogEventTeasers from './components/landing/BlogEventTeasers';
import CallToAction from './components/landing/CallToAction';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import UserDashboard from './pages/UserDashboard';
import AgentDashboard from './pages/AgentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EventsPage from './pages/EventsPage';
import BlogTeaserPage from './pages/BlogTeaserPage';
import ProfilePage from './pages/ProfilePage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import LegalPage from './pages/LegalPage';
import NotificationDemo from './components/NotificationDemo';
// Removed LoginModal - using page-only authentication
import { Login, Register, ResetPassword, VerifyEmail, AuthCallback } from './pages/auth';
import NotFoundPage from './pages/NotFoundPage';

// Home Page Component
const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedListings />
      <BrowseByCategory />
      <FeaturedAgents />
      <Testimonials />
      <HowItWorks />
      <BlogEventTeasers />
      <CallToAction />
      <Footer />
    </div>
  );
};

// Auth Pages Layout (without navbar)
const AuthPageLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<HomePage />} />
          
          {/* Properties Route */}
          <Route path="/properties" element={<PropertiesPage />} />
          
          {/* Property Details Route */}
          <Route path="/property/:id" element={<PropertyDetailsPage />} />
          
          {/* User Dashboard Route */}
          <Route path="/dashboard" element={<UserDashboard />} />
          
          {/* Agent Dashboard Route */}
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          
          {/* Admin Dashboard Route */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Events Route */}
          <Route path="/events" element={<EventsPage />} />
          
          {/* Blog Route */}
          <Route path="/blog" element={<BlogTeaserPage />} />
          
          {/* Profile Route */}
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Contact Route */}
          <Route path="/contact" element={<ContactPage />} />
          
          {/* About Route */}
          <Route path="/about" element={<AboutPage />} />
          
          {/* Legal Routes */}
          <Route path="/legal/:docType" element={<LegalPage />} />
          <Route path="/terms" element={<LegalPage />} />
          <Route path="/privacy" element={<LegalPage />} />
          <Route path="/cookies" element={<LegalPage />} />
          <Route path="/accessibility" element={<LegalPage />} />
          
          {/* Demo Route */}
          <Route path="/demo/notifications" element={<NotificationDemo />} />
          
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
        <Notifications />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
