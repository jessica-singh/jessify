import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// GET /api/profile — Get logged-in user's profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('posts')
      .select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePic: user.profilePic || '/uploads/default.jpg',
      followersCount: user.followers.length,
      followingCount: user.following.length,
      posts: user.posts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

// PUT /api/profile/update — Update username, bio, or profile pic
router.put('/update', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { username, bio } = req.body;

    if (username) {
      const existing = await User.findOne({ username });
      if (existing && existing._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      user.username = username;
    }

    if (bio) user.bio = bio;

    if (req.files && req.files.profilePic) {
      const profilePic = req.files.profilePic;
      const filename = `profile_${Date.now()}_${profilePic.name}`;
      const filepath = path.join('uploads', filename);
      await profilePic.mv(filepath);
      user.profilePic = `/uploads/${filename}`;
    }

    await user.save();
    res.json({ message: 'Profile updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /api/profile/user/:id — Public profile with posts & follow status
('/user/:id', authMiddleware, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id)
      .populate('posts')
      .select('username bio profilePic followers');

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentUser = await User.findById(req.user.id).select('following');

    const isFollowing = currentUser.following.includes(targetUser._id);

    res.status(200).json({
      user: {
        _id: targetUser._id,
        username: targetUser.username,
        bio: targetUser.bio,
        profilePic: targetUser.profilePic || '/uploads/default.jpg',
      },
      posts: targetUser.posts,
      isFollowing,
    });
  } catch (err) {
    console.error('Error fetching public user profile:', err);
    res.status(500).json({ error: 'Failed to load user profile' });
  }
});

// POST /api/profile/follow/:id
router.post('/follow/:id', authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(req.params.id);

    if (!targetUser || currentUser.following.includes(targetUser._id)) {
      return res.status(400).json({ message: 'Already following or user not found' });
    }

    currentUser.following.push(targetUser._id);
    targetUser.followers.push(currentUser._id);

    await currentUser.save();
    await targetUser.save();

    res.json({ message: 'Followed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

// POST /api/profile/unfollow/:id
router.post('/unfollow/:id', authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(req.params.id);

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUser._id.toString()
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await targetUser.save();

    res.json({ message: 'Unfollowed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
});

export default router;