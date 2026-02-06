import { useState, useEffect } from 'react';
import './App.css';
import { MOCK_STUDENTS, MOCK_ENTRIES } from './mock-data.js';

// Page components
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import Entry from './pages/Entry';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

// UI components
import Navigation from './components/Navigation';
import Toast from './components/Toast';

const VALID_PAGES = ['landing', 'signin', 'signup', 'entry', 'dashboard', 'admin'];

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [entries, setEntries] = useState(MOCK_ENTRIES);
  const [toast, setToast] = useState(null);

  // Read hash on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1) || 'landing';
    if (VALID_PAGES.includes(hash)) {
      setCurrentPage(hash);
    }
  }, []);

  // Update URL hash when page changes
  useEffect(() => {
    window.location.hash = currentPage;
  }, [currentPage]);

  // Redirect logic
  useEffect(() => {
    if (!isAuthenticated && ['entry', 'dashboard', 'admin'].includes(currentPage)) {
      setCurrentPage('landing');
    }
    if (isAuthenticated && ['landing', 'signin', 'signup'].includes(currentPage)) {
      setCurrentPage('entry');
    }
  }, [isAuthenticated, currentPage]);

  const navigate = (page) => {
    if (VALID_PAGES.includes(page)) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  const handleAuth = () => {
    setIsAuthenticated(true);
    setUser({
      name: 'John Phillips',
      email: 'john.phillips@berrienresa.org',
    });
    showToast('Successfully signed in! Welcome back.', 'success');
    setCurrentPage('entry');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('landing');
    showToast('You have been signed out.', 'info');
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Entry handlers
  const handleAddEntry = (newEntry) => {
    setEntries(prev => [...prev, newEntry]);
  };

  // Admin: batch update students (and optionally entries)
  const handleUpdateStudents = (newStudents, newEntries) => {
    setStudents(newStudents);
    if (newEntries !== undefined) {
      setEntries(newEntries);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      {isAuthenticated && (
        <Navigation
          currentPage={currentPage}
          onNavigate={navigate}
          user={user}
          onSignOut={handleSignOut}
        />
      )}

      {/* Pages */}
      {currentPage === 'landing' && !isAuthenticated && (
        <Landing onNavigate={navigate} />
      )}

      {(currentPage === 'signin' || currentPage === 'signup') && !isAuthenticated && (
        <SignIn
          onNavigate={navigate}
          onAuth={handleAuth}
          isSignUp={currentPage === 'signup'}
        />
      )}

      {isAuthenticated && currentPage === 'entry' && (
        <Entry
          students={students}
          entries={entries}
          onAddEntry={handleAddEntry}
          onNavigate={navigate}
          showToast={showToast}
        />
      )}

      {isAuthenticated && currentPage === 'dashboard' && (
        <Dashboard
          students={students}
          entries={entries}
          onNavigate={navigate}
        />
      )}

      {isAuthenticated && currentPage === 'admin' && (
        <Admin
          students={students}
          entries={entries}
          onUpdateStudents={handleUpdateStudents}
          onNavigate={navigate}
          showToast={showToast}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default App;
