// controllers/profileController.js
import User from '../models/User.js';
import Post from '../models/Post.js';
import path from 'path';
import fs from 'fs';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate({ path: 'posts', model: Post });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      username: user.username,
      email: user.email,
      bio: user.bio || '',
      profilePic: user.profilePic || '',
      followersCount: user.followers.length,
      followingCount: user.following.length,
      posts: user.posts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { username, bio } = req.body;
    if (username && username !== user.username) {
      const existing = await User.findOne({ username });
      if (existing) return res.status(400).json({ message: 'Username already taken' });
      user.username = username;
    }
    user.bio = bio || '';

    if (req.files && req.files.profilePic) {
      const profilePic = req.files.profilePic;
      const uploadPath = path.join('uploads', `${Date.now()}_${profilePic.name}`);
      await profilePic.mv(uploadPath);
      user.profilePic = '/' + uploadPath.replace(/\\/g, '/');
    }

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
