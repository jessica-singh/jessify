// controllers/feedController.js
import User from '../models/User.js';
import Post from '../models/Post.js';

export const getUserFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('following');

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.following.length === 0) {
      return res.status(200).json({ message: 'Follow people to update your feed', posts: [] });
    }

    // Get posts from followed users
    const posts = await Post.find({ author: { $in: user.following } })
      .populate('author', 'username profilePic')
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({ posts });
  } catch (err) {
    console.error('🔥 Feed error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
