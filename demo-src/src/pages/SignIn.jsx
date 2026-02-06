import React, { useState } from 'react';
import { Compass } from 'lucide-react';

export default function SignIn({ onNavigate, onAuth, isSignUp }) {
  const [fullName, setFullName] = useState('John Phillips');
  const [email, setEmail] = useState('john.phillips@berrienresa.org');
  const [password, setPassword] = useState('••••••••');
  const [confirmPassword, setConfirmPassword] = useState('••••••••');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuth();
  };

  const toggleAuthMode = () => {
    onNavigate(isSignUp ? 'signin' : 'signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Demo Banner */}
      <div className="bg-amber-100 border-b border-amber-200 px-4 py-3">
        <p className="text-center text-sm font-medium text-amber-900">
          Demo Mode - Click sign in to explore the app
        </p>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-60px)] px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          {/* Logo Area */}
          <div className="flex flex-col items-center mb-8">
            <div className="mb-3 p-3 bg-indigo-100 rounded-lg">
              <Compass className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Imagine</h1>
          </div>

          {/* Title and Subtitle */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600">
              {isSignUp ? 'Get started for free' : 'Sign in to continue'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field - Only for Sign Up */}
            {isSignUp && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="John Phillips"
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="john.phillips@berrienresa.org"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {/* Confirm Password Field - Only for Sign Up */}
            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 mt-6"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={toggleAuthMode}
                className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          {/* Back to Home Link */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => onNavigate('landing')}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
