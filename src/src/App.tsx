import React from 'react';
import './index.css'; // Updated to use Tailwind styles
import Layout from './components/layout/Layout';
import PageWrapper from './components/layout/PageWrapper';
import Section from './components/layout/Section';

const App: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <Section background="gradient" padding="lg">
        <PageWrapper>
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-bold text-blue-600 mb-6">Find Your Dream Home</h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Welcome to our real estate platform. Discover amazing properties
              with the help of our AI-powered assistant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">Browse Properties</button>
              <button className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white">List Your Property</button>
            </div>
          </div>
        </PageWrapper>
      </Section>

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
  );
};

export default App;
