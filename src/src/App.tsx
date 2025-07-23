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
// Removed LoginModal - using page-only authentication
import { Login, Register, ResetPassword, VerifyEmail, AuthCallback } from './pages/auth';
import NotFoundPage from './pages/NotFoundPage';

// Home Page Component
const HomePage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Layout>
        {/* Coming Soon Section */}
        <Section background="white" padding="md">
          <PageWrapper>
            <div className="text-center">
              <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">Coming Soon</h3>
                <p className="text-gray-600 mb-6">
                  Our full real estate website is under development. In the
                  meantime, try our AI assistant in the bottom-right corner!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300">Get Notified</button>
                  <button className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white">Learn More</button>
                </div>
              </div>
            </div>
          </PageWrapper>
        </Section>

        {/* Features Preview Section */}
        <Section background="gray" padding="md">
          <PageWrapper>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">What's Coming</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our platform will feature everything you need to find, buy, or
                sell properties.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-xl">🏠</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-3">Property Search</h4>
                <p className="text-gray-600">
                  Advanced filters and AI-powered search to find your perfect
                  home.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-xl">🤖</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-3">AI Assistant</h4>
                <p className="text-gray-600">
                  Get personalized recommendations and instant answers to your
                  questions.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-xl">📱</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-3">Modern Experience</h4>
                <p className="text-gray-600">
                  Beautiful, responsive design that works perfectly on all
                  devices.
                </p>
              </div>
            </div>
          </PageWrapper>
        </Section>
      </Layout>
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
