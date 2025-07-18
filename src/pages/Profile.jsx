import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import PostUploader from '../components/PostUploader';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newBio, setNewBio] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data);
      setNewBio(res.data.bio || '');
      setNewUsername(res.data.username || '');
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('username', newUsername);
      formData.append('bio', newBio);
      if (newProfilePic) formData.append('profilePic', newProfilePic);

      await axios.put('/profile/update', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setEditing(false);
      setNewProfilePic(null);
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <p className="text-center text-white">Loading...</p>;
  if (error) return <p className="text-center text-red-400">{error}</p>;

  return (
    <div className="min-h-screen text-white px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
        {/* Top Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-purple-400 text-white flex items-center justify-center text-3xl font-bold">
            {userData.profilePic ? (
              <img src={`${import.meta.env.VITE_API_URL}${userData.profilePic}`} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              userData.username[0].toUpperCase()
            )}
          </div>

          <div className="text-center sm:text-left w-full">
            {editing ? (
              <>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="bg-white/10 border border-white/20 px-3 py-1 rounded-lg w-full mb-2 text-white"
                />
                <input type="file" accept="image/*" onChange={(e) => setNewProfilePic(e.target.files[0])} className="mb-2" />
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-purple-300">{userData.username}</h2>
                <p className="text-gray-400">@{userData.username}</p>
              </>
            )}

            <div className="mt-3 text-sm">
              <strong>Bio:</strong>
              {editing ? (
                <textarea
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  rows="2"
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white mt-1"
                />
              ) : (
                <p className="mt-1">{userData.bio || 'No bio yet.'}</p>
              )}
            </div>

            <div className="flex gap-6 mt-3 text-sm text-gray-300 justify-center sm:justify-start">
              <p><strong>{userData.posts.length}</strong> Posts</p>
              <p><strong>{userData.followersCount}</strong> Followers</p>
              <p><strong>{userData.followingCount}</strong> Following</p>
            </div>

            <div className="mt-4">
              {editing ? (
                <div className="space-x-2">
                  <button onClick={updateProfile} className="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded-lg">Save</button>
                  <button onClick={() => setEditing(false)} className="bg-gray-600 hover:bg-gray-700 px-4 py-1 rounded-lg">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setEditing(true)} className="text-sm text-purple-300 hover:underline">Edit Profile</button>
              )}
            </div>
          </div>
        </div>

        {/* Add Post Button */}
        <div className="text-right mb-4">
          <button
            onClick={() => setShowUploader(!showUploader)}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white font-medium"
          >
            {showUploader ? 'Cancel' : 'Add Post'}
          </button>
        </div>

        {/* Uploader */}
        {showUploader && (
          <div className="mb-6">
            <PostUploader onUploadSuccess={() => {
              fetchProfile();
              setShowUploader(false);
            }} />
          </div>
        )}

        {/* Posts Grid */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-purple-300">Posts</h3>
          {userData.posts.length === 0 ? (
            <p className="text-sm text-gray-400">You haven’t posted anything yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {userData.posts.map((post) => (
                <div key={post._id} className="aspect-square overflow-hidden rounded-md border border-white/10">
                  <img src={`${import.meta.env.VITE_API_URL}${post.imageUrl}`} alt="Post" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
