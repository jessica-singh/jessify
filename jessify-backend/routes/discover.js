// routes/discover.js
import express from 'express';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/discover?search=...
router.get('/', authMiddleware, async (req, res) => {
  try {
    const search = req.query.search || '';
    const regex = new RegExp(search, 'i');

    const users = await User.find({
      username: { $regex: regex },
      _id: { $ne: req.user.id }, // exclude logged-in user
    }).select('username profilePic followers'); // Send profilePic and followers

    const currentUser = await User.findById(req.user.id).select('following');

    const modifiedUsers = users.map(user => ({
      _id: user._id,
      username: user.username,
      profilePic: user.profilePic || '/uploads/default.jpg',
      isFollowing: currentUser.following.includes(user._id),
      followerCount: user.followers.length,
    }));

    res.status(200).json(modifiedUsers);
  } catch (err) {
    console.error('❌ Discover route error:', err);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

export default router;
