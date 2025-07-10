import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/10 border-b border-white/20 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-2xl font-bold text-purple-300 tracking-wider">
        Jessify
      </Link>

      <div className="space-x-4 hidden sm:block">
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
      </div>
    </nav>
  );
};

export default Navbar;
