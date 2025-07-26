'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon, UserIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';

const TopPixNavbar: React.FC = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'Agents', path: '/agents' },
    { name: 'Events', path: '/events' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
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
                className="text-card-foreground hover:text-orange-500 transition-colors font-medium text-sm whitespace-nowrap"
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
        {isAuthenticated ? (
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-2 text-card-foreground hover:text-orange-500 transition-colors font-medium"
            >
              <UserIcon className="h-5 w-5" />
              <span>{user?.firstName || 'Profile'}</span>
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Profile Dropdown */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg py-2 z-50 border border-border">
                <Link 
                  href="/profile"
                  className="block px-4 py-2 text-card-foreground hover:text-primary transition-colors"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  Profile
                </Link>
                <Link 
                  href="/user"
                  className="block px-4 py-2 text-card-foreground hover:text-primary transition-colors"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  User Dashboard
                </Link>
                {isAdmin && (
                  <Link 
                    href="/admin"
                    className="block px-4 py-2 text-card-foreground hover:text-primary transition-colors"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <hr className="my-1 border-border" />
                <button
                  onClick={() => {
                    handleLogout();
                    setIsProfileDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link 
              href="/auth/login"
              className="text-card-foreground hover:text-orange-500 transition-colors font-medium"
            >
              Login
            </Link>
            <Link 
              href="/auth/register"
              className="px-4 py-2 rounded-full transition-colors font-medium inline-block bg-primary text-primary-foreground hover:opacity-90"
            >
              Sign up
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden text-card-foreground hover:text-orange-500 transition-colors"
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
              {isAuthenticated ? (
                <>
                  <div className="space-y-2">
                    <Link 
                      href="/user"
                      className="flex items-center space-x-2 text-card-foreground hover:text-primary transition-colors font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserIcon className="h-5 w-5" />
                      <span>{user?.firstName || 'Profile'}</span>
                    </Link>
                    <Link 
                      href="/user"
                      className="block pl-7 text-card-foreground hover:text-primary transition-colors font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      User Dashboard
                    </Link>
                    <Link 
                      href="/user/settings"
                      className="block pl-7 text-card-foreground hover:text-primary transition-colors font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    {isAdmin && (
                      <Link 
                        href="/admin"
                        className="block pl-7 text-card-foreground hover:text-primary transition-colors font-medium py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left pl-7 text-card-foreground hover:text-primary transition-colors font-medium py-2"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopPixNavbar; 