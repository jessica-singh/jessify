import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFeed = async () => {
    try {
      const token = sessionStorage.getItem('auth_token');
      const res = await axios.get('/feed', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts(res.data.posts);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load feed');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  if (loading) return <p className="text-center text-white">Loading feed...</p>;
  if (error) return <p className="text-center text-red-400">{error}</p>;

  return (
    <div className="min-h-screen py-10 px-4 text-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-purple-300">Your Feed</h2>

        {posts.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <p className="text-lg">You're not following anyone yet.</p>
            <p className="text-sm">Follow users to see their posts here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-white/10 border border-white/20 rounded-lg overflow-hidden shadow-md">
                <div className="flex items-center gap-3 p-4 border-b border-white/10">
                  <div className="w-10 h-10 rounded-full bg-purple-400 flex items-center justify-center text-lg font-bold">
                    {post.author.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{post.author.username}</p>
                  </div>
                </div>
                <img
                src={`${import.meta.env.VITE_API_URL}${post.imageUrl}`}
                alt="Post"
                className="w-64 h-64 object-cover rounded-lg shadow-md"
                />

                <div className="p-4">
                  <p className="text-sm mb-1 text-gray-300">
                    <strong>{post.author.username}:</strong> {post.caption}
                  </p>
                  <button className="mt-2 text-sm text-purple-400 hover:underline">❤️ Like</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
