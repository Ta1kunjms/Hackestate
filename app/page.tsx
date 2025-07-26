'use client';
import React from 'react';
import HeroSection from '../src/src/components/landing/HeroSection';
import FeaturedListings from '../src/src/components/landing/FeaturedListings';
import BrowseByCategory from '../src/src/components/landing/BrowseByCategory';
import FeaturedAgents from '../src/src/components/landing/FeaturedAgents';
import Testimonials from '../src/src/components/landing/Testimonials';
import HowItWorks from '../src/src/components/landing/HowItWorks';
import BlogEventTeasers from '../src/src/components/landing/BlogEventTeasers';
import CallToAction from '../src/src/components/landing/CallToAction';
import Footer from '../src/src/components/layout/Footer';

const HomePage: React.FC = () => (
  <div className="bg-background text-foreground">
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
