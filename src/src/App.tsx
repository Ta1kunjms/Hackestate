import React from 'react';
import HeroSection from './components/landing/HeroSection';
import FeaturedListings from './components/landing/FeaturedListings';
import BrowseByCategory from './components/landing/BrowseByCategory';
import FeaturedAgents from './components/landing/FeaturedAgents';
import Testimonials from './components/landing/Testimonials';
import HowItWorks from './components/landing/HowItWorks';
import BlogEventTeasers from './components/landing/BlogEventTeasers';
import CallToAction from './components/landing/CallToAction';
import Footer from './components/layout/Footer';

const HomePage: React.FC = () => (
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

export default HomePage;
