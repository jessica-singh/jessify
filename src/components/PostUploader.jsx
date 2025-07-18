import React, { useState } from 'react';
import axios from '../utils/axios';

const PostUploader = ({ onUploadSuccess }) => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      setError('Please select an image to upload.');
      return;
    }

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', image);
    formData.append('caption', caption);

    try {
      setUploading(true);
      setError('');

      const res = await axios.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setCaption('');
      setImage(null);
      setUploading(false);

      if (onUploadSuccess) onUploadSuccess(res.data.post);
    } catch (err) {
      setUploading(false);
      setError('Failed to upload post.');
      console.error(err);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-lg text-white shadow-lg max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4 text-purple-300">Create a Post</h2>

      <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4 text-white" />

      <textarea
        placeholder="Write a caption (optional)"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full mb-4 p-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        rows="3"
      />

      {error && <p className="text-red-400 mb-2">{error}</p>}

      <button onClick={handleUpload} disabled={uploading} className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold">
        {uploading ? 'Uploading...' : 'Upload Post'}
      </button>
    </div>
  );
};

export default PostUploader;
