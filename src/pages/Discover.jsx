import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const Discover = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (search.trim().length === 0) {
        setResults([]);
        return;
      }

      try {
        const res = await axios.get(`/discover?search=${search}`); // ✅ match backend param
        setResults(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  return (
    <div className="min-h-screen py-10 px-6 text-white">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-purple-300">Discover Users</h1>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username..."
          className="w-full px-4 py-2 mb-4 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none"
        />

        {results.length > 0 ? (
          <ul className="space-y-3">
            {results.map((user) => (
              <li
                key={user._id}
                onClick={() => navigate(`/user/${user._id}`)} // ✅ clickable
                className="cursor-pointer flex items-center gap-4 bg-white/10 p-4 rounded-lg border border-white/20 hover:bg-white/20 transition"
              >
                {user.profilePic && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${user.profilePic}`}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <span className="font-semibold">{user.username}</span>
              </li>
            ))}
          </ul>
        ) : search.trim() !== '' ? (
          <p className="text-gray-400">No matching users found.</p>
        ) : null}
      </div>
    </div>
  );
};

export default Discover;
