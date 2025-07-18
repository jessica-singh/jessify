import React, { useEffect } from 'react'; 
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Discover from './pages/Discover';
import Feed from './pages/Feed';
import { logout, getToken } from './utils/auth';
import UserProfile from './pages/UserProfile'; 

const App = () => {
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'logout') {
        const logoutData = JSON.parse(e.newValue);
        const currentToken = getToken();
        if (logoutData?.token === currentToken) {
          logout();
          window.location.href = '/login';
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <div className="pt-20"> {/* padding top so content clears navbar */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user/:id" element={<UserProfile />} />

      </Routes>
    </div>
  );
};

export default App;
