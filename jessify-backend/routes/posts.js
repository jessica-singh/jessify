// routes/posts.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import authMiddleware from '../middleware/authMiddleware.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

const router = express.Router();

// POST /api/posts — Upload image and caption
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const imageFile = req.files.image;
    const caption = req.body.caption || '';

    // Ensure uploads folder exists
    const __dirname = path.resolve();
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    const filename = `${Date.now()}_${imageFile.name}`;
    const filepath = path.join(uploadDir, filename);

    // Move file
    await imageFile.mv(filepath);

    const imageUrl = `/uploads/${filename}`; // path to be used by frontend

    // Create post
    const post = new Post({
      imageUrl,
      caption,
      author: req.user.id,
    });

    await post.save();

    // Add post to user's posts array
    const user = await User.findById(req.user.id);
    user.posts.unshift(post._id);
    await user.save();

    res.status(201).json({ message: 'Post uploaded successfully', post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload post' });
  }
});

export default router;
