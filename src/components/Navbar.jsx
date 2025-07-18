import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getToken, logout } from '../utils/auth'; // use your auth utils

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());

  useEffect(() => {
    // Update auth state on route change
    setIsLoggedIn(!!getToken());

    // Also listen for cross-tab logout (storage event)
    const handleStorage = (e) => {
      if (e.key === 'logout') {
        const logoutData = JSON.parse(e.newValue);
        if (logoutData?.token === getToken()) {
          logout();
          setIsLoggedIn(false);
          navigate('/login');
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [location, navigate]);

  const handleLogout = () => {
    logout(); // from utils/auth.js
    setIsLoggedIn(false);
    navigate('/login');

    // Notify other tabs
    const token = getToken();
    if (token) {
      localStorage.setItem('logout', JSON.stringify({ token, timestamp: Date.now() }));
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/10 border-b border-white/20 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Logo on left */}
      <Link to="/" className="text-2xl font-bold text-purple-300 tracking-wider">
        Jessify
      </Link>

      {/* Navigation links */}
      {isLoggedIn && (
        <div className="flex gap-6 ml-6">
          <Link to="/feed" className="hover:text-purple-300 transition font-medium">
            Feed
          </Link>
          <Link to="/discover" className="hover:text-purple-300 transition font-medium">
            Discover
          </Link>
          <Link to="/profile" className="hover:text-purple-300 transition font-medium">
            Profile
          </Link>
        </div>
      )}

      {/* Auth buttons (right) */}
      <div className="space-x-4">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="text-white hover:text-purple-300 transition font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-purple-600 hover:bg-purple-700 transition text-white px-4 py-2 rounded-lg font-semibold"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
