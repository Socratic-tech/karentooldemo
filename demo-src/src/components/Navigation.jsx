import React, { useState } from 'react';
import { Compass, ClipboardList, BarChart3, Users, LogOut, Menu, X } from 'lucide-react';

export default function Navigation({ currentPage, onNavigate, user, onSignOut }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { id: 'entry', label: 'Daily Entry', icon: ClipboardList },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'admin', label: 'Manage Students', icon: Users },
  ];

  const handleNavigate = (pageId) => {
    onNavigate(pageId);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT SIDE - Logo and Nav Links */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <button
              onClick={() => handleNavigate('entry')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              aria-label="Go to home"
            >
              <Compass className="w-5 h-5 text-indigo-600" />
              <span className="text-lg font-semibold text-gray-900">Imagine</span>
            </button>

            {/* Nav Links - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleNavigate(id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    currentPage === id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE - Demo Badge, User Info, and Actions */}
          <div className="flex items-center gap-4">
            {/* Demo Badge */}
            <div className="hidden sm:block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
              Demo Mode
            </div>

            {/* User Info */}
            <div className="hidden sm:block text-sm text-gray-600">
              {user?.name}
            </div>

            {/* Sign Out Button */}
            <button
              onClick={onSignOut}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-4 space-y-2">
              {navLinks.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleNavigate(id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}

              {/* Mobile User Info and Actions */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="px-3 py-2 text-sm text-gray-600 font-medium">
                  {user?.name}
                </div>
                <button
                  onClick={onSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Mobile Demo Badge */}
              <div className="px-3 py-2 text-center">
                <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  Demo Mode
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
