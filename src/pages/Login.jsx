import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { saveAuth } from '../utils/auth';

const Input = ({ label, id, type, value, onChange, placeholder, name, autoComplete }) => (
  <>
    <label htmlFor={id} className="block text-sm mb-1">{label}</label>
    <input
      id={id}
      type={type}
      name={name}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
      placeholder={placeholder}
      required
    />
  </>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (setter) => (e) => {
    setError('');
    setter(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post('/auth/login', { email, password });
      saveAuth(res.data.token, res.data.user); // ⬅️ Save using sessionStorage
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to log in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-transparent">
      <div className="w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-8 shadow-lg text-white flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Welcome back to <span className="text-purple-300">Jessify</span>
        </h2>

        <form className="space-y-5" onSubmit={handleLogin}>
          <Input label="Email" id="email" type="email" name="email" autoComplete="email" value={email} onChange={handleInputChange(setEmail)} placeholder="you@example.com" />
          <Input label="Password" id="password" type="password" name="password" autoComplete="current-password" value={password} onChange={handleInputChange(setPassword)} placeholder="••••••••" />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 transition rounded-lg font-semibold disabled:opacity-50" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don’t have an account? <Link to="/signup" className="text-purple-300 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
