import React, { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ThemeToggle } from '../ui/ThemeToggle';

const TopPixNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'Agents', path: '/agents' },
    { name: 'Events', path: '/events' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'User Dashboard', path: '/user' }
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex justify-between items-start pt-6 px-6 lg:px-12" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <div className="w-10 h-10 bg-card rounded-lg flex items-center justify-center mr-3 shadow-lg border border-border">
          <div className="text-2xl">🏘️</div>
        </div>
        <span className="text-2xl font-bold">
          <span style={{ color: '#2ECC71' }}>TOP</span>
          <span style={{ color: '#8B4513' }}>PIX</span>
        </span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center">
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl px-8 py-2 border border-border">
          <div className="flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link 
                key={item.name}
                href={item.path}
                className="text-card-foreground hover:text-primary transition-colors font-medium text-sm whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Right side controls */}
      <div className="hidden lg:flex items-center space-x-4">
        {/* Theme Toggle */}
        <ThemeToggle />
        
        {/* Auth Buttons */}
        <Link 
          href="/auth/login"
          className="text-card-foreground hover:text-primary transition-colors font-medium"
        >
          Login
        </Link>
        <Link 
          href="/auth/register"
          className="px-4 py-2 rounded-full transition-colors font-medium inline-block bg-primary text-primary-foreground hover:opacity-90"
        >
          Sign up
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden text-card-foreground hover:text-primary transition-colors"
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-card/95 backdrop-blur-sm lg:hidden border-b border-border">
          <div className="px-6 py-4 space-y-4">
            {/* Theme Toggle for Mobile */}
            <div className="flex justify-end">
              <ThemeToggle />
            </div>
            
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="block text-card-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-border space-y-3">
              <Link 
                href="/auth/login"
                className="block w-full text-left text-card-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                href="/auth/register"
                className="block w-full px-4 py-2 rounded-full transition-colors font-medium text-center bg-primary text-primary-foreground hover:opacity-90"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopPixNavbar; 