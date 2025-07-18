// src/pages/UserProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/profile/user/${id}`);
        setUser(res.data.user);
        setIsFollowing(res.data.isFollowing);
        setPosts(res.data.posts);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    fetchUser();
  }, [id]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await axios.post(`/profile/unfollow/${id}`);
      } else {
        await axios.post(`/profile/follow/${id}`);
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Follow/unfollow error:', err);
    }
  };

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <div className="flex items-center gap-4">
        <img
          src={user.profilePic || '/uploads/default.jpg'}
          alt={user.username}
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-xl font-bold">{user.username}</h2>
          <p className="text-sm text-gray-500">{user.bio || 'No bio available'}</p>
          <button
            onClick={handleFollowToggle}
            className={`mt-2 px-4 py-1 rounded-full text-white ${
              isFollowing ? 'bg-red-500' : 'bg-blue-500'
            }`}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        </div>
      </div>

      <hr className="my-6" />

      <h3 className="text-lg font-semibold mb-4">Posts</h3>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {posts.map((post) => (
            <img
              key={post._id}
              src={post.image || '/uploads/default.jpg'}
              alt={post.caption}
              className="w-full h-40 object-cover rounded"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
