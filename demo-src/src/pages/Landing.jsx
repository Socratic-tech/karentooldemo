import React from 'react';
import {
  ChevronRight,
  Sparkles,
  ClipboardList,
  BarChart3,
  Users,
  TrendingUp,
  Shield,
  ArrowRight,
} from 'lucide-react';

const SunCompassIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-white"
  >
    <circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="2" />
    <line x1="14" y1="4" x2="14" y2="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="14" y1="26" x2="14" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="24" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="2" y1="14" x2="4" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="20.5" y1="20.5" x2="21.9" y2="21.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="6.1" y1="6.1" x2="7.5" y2="7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="20.5" y1="7.5" x2="21.9" y2="6.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="6.1" y1="21.9" x2="7.5" y2="20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Landing = ({ onNavigate }) => {
  const habits = [
    { name: 'Self-Reflection', icon: '🪞' },
    { name: 'Time Management', icon: '⏱️' },
    { name: 'Organization', icon: '📋' },
    { name: 'Task Completion', icon: '✓' },
    { name: 'Attention', icon: '👁️' },
    { name: 'Follow Directions', icon: '🗺️' },
    { name: 'Problem Solving', icon: '🧩' },
    { name: 'Independence', icon: '🦅' },
    { name: 'Cooperation', icon: '🤝' },
    { name: 'Social Skills', icon: '💬' },
    { name: 'Work Quality', icon: '⭐' },
    { name: 'Work Pace', icon: '⚡' },
  ];

  const ratingScale = [
    { level: 1, label: 'Needs Improvement', color: 'bg-red-500', textColor: 'text-red-500' },
    { level: 2, label: 'Developing', color: 'bg-amber-500', textColor: 'text-amber-500' },
    { level: 3, label: 'Proficient', color: 'bg-blue-500', textColor: 'text-blue-500' },
    { level: 4, label: 'Exemplary', color: 'bg-green-500', textColor: 'text-green-500' },
  ];

  const features = [
    {
      title: 'Daily Habit Tracking',
      description: 'Record 12 key work habits for each student with our intuitive 1-4 rating scale.',
      icon: ClipboardList,
    },
    {
      title: 'Visual Analytics',
      description: 'Beautiful charts and graphs that reveal patterns and trends in student behavior.',
      icon: BarChart3,
    },
    {
      title: 'Student Management',
      description: 'Easily manage your student roster with support for multiple classes and grade levels.',
      icon: Users,
    },
    {
      title: 'Progress Monitoring',
      description: 'Track improvement over time with monthly trends and historical comparisons.',
      icon: TrendingUp,
    },
    {
      title: 'Privacy First',
      description: 'Your data stays yours. Each teacher\'s data is completely isolated and secure.',
      icon: Shield,
    },
    {
      title: 'Easy to Use',
      description: 'Designed by educators, for educators. Get started in minutes, not hours.',
      icon: Sparkles,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <SunCompassIcon />
            <span className="text-white font-bold text-xl">Imagine</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('signin')}
              className="px-6 py-2 text-white border border-white rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate('signup')}
              className="px-6 py-2 bg-white text-slate-900 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 rounded-full px-4 py-2 mb-8">
          <Sparkles size={16} className="text-purple-300" />
          <span className="text-sm font-medium text-purple-200">Built for Educators</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
          Track Student Work Habits with Confidence
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
          Empower your classroom with data-driven insights into student work habits. Track progress, identify patterns, and support growth — all in one simple tool.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('signup')}
            className="px-8 py-4 bg-white text-slate-900 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Get Started Free
            <ArrowRight size={20} />
          </button>
          <button
            onClick={() => {
              const element = document.getElementById('features');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 border border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-200"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Everything You Need</h2>
          <p className="text-gray-400 text-lg">
            Comprehensive tools designed for modern educators
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-6 rounded-lg border border-purple-500/30 bg-slate-800/40 hover:bg-slate-800/60 hover:border-purple-400/50 transition-all duration-300 backdrop-blur-sm"
              >
                {/* Gradient border effect on hover */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500/0 via-transparent to-purple-500/0 group-hover:from-purple-500/10 group-hover:to-purple-500/10 transition-all duration-300" />

                <div className="relative">
                  <Icon className="text-purple-400 mb-4" size={32} />
                  <h3 className="text-white font-semibold text-lg mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 12 Habits Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">12 Essential Work Habits</h2>
          <p className="text-gray-400 text-lg">
            Track progress using our intuitive 1-4 rating scale
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {habits.map((habit, index) => (
            <div
              key={index}
              className="group p-5 rounded-lg border border-purple-500/20 bg-slate-800/30 hover:bg-slate-800/50 hover:border-purple-400/40 transition-all duration-300 text-center cursor-pointer"
            >
              <div className="text-4xl mb-2">{habit.icon}</div>
              <p className="text-white font-medium text-sm leading-snug">{habit.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Rating Scale Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Rating Scale</h2>
          <p className="text-gray-400 text-lg">
            A simple 1-4 scale helps you consistently evaluate student progress
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ratingScale.map((rating) => (
            <div
              key={rating.level}
              className="group p-6 rounded-lg border border-white/10 bg-slate-800/40 hover:bg-slate-800/60 transition-all duration-300 text-center"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${rating.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-white font-bold text-2xl">{rating.level}</span>
              </div>
              <h3 className="text-white font-semibold mb-2">{rating.label}</h3>
              <p className={`text-sm ${rating.textColor}`}>Level {rating.level}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>© 2025 Imagine - Work Habits Tracker</p>
          <p className="mt-2">Built with love for Berrien RESA</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
