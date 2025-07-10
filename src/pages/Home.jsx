import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black flex items-center justify-center px-4">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 text-white rounded-xl p-10 shadow-2xl max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to <span className="text-purple-300">Jessify</span>
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Capture, create, and connect — all in your own vibe 🌟
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-6 py-2 bg-white/10 border border-white/30 text-purple-300 hover:bg-white/20 rounded-lg font-semibold transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
