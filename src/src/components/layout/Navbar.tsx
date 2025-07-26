'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon, UserIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const TopPixNavbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
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
    { name: 'Contact', path: '/contact' },
    { name: 'User Dashboard', path: '/user' }
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex justify-between items-start pt-6 px-6 lg:px-12" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 shadow-lg">
          <div className="text-2xl">🏘️</div>
        </div>
        <span className="text-2xl font-bold">
          <span style={{ color: '#2ECC71' }}>TOP</span>
          <span style={{ color: '#8B4513' }}>PIX</span>
        </span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center">
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl px-8 py-2">
          <div className="flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link 
                key={item.name}
                href={item.path}
                className="text-white hover:text-orange-400 transition-colors font-medium text-sm whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden text-white hover:text-orange-400 transition-colors"
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Auth Buttons - Desktop */}
      <div className="hidden lg:flex items-center space-x-4">
        {isAuthenticated ? (
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors font-medium"
            >
              <UserIcon className="h-5 w-5" />
              <span>{user?.firstName || 'Profile'}</span>
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Profile Dropdown */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <Link 
                  href="/user"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  My Profile
                </Link>
                <Link 
                  href="/user/settings"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  Settings
                </Link>
                <hr className="my-1" />
                <button
                  onClick={() => {
                    handleLogout();
                    setIsProfileDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
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
              className="text-white hover:text-orange-400 transition-colors font-medium"
            >
              Login
            </Link>
            <Link 
              href="/auth/register"
              className="px-4 py-2 rounded-full transition-colors font-medium inline-block"
              style={{ backgroundColor: '#F5A623', color: '#ffffff' }}
            >
              Sign up
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-sm lg:hidden">
          <div className="px-6 py-4 space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="block text-white hover:text-orange-400 transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-600 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="space-y-2">
                    <Link 
                      href="/user"
                      className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserIcon className="h-5 w-5" />
                      <span>{user?.firstName || 'Profile'}</span>
                    </Link>
                    <Link 
                      href="/user/settings"
                      className="block pl-7 text-white hover:text-orange-400 transition-colors font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left pl-7 text-white hover:text-orange-400 transition-colors font-medium py-2"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/login"
                    className="block w-full text-left text-white hover:text-orange-400 transition-colors font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/auth/register"
                    className="block w-full px-4 py-2 rounded-full transition-colors font-medium text-center"
                    style={{ backgroundColor: '#F5A623', color: '#ffffff' }}
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