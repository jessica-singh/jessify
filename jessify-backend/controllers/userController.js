// controllers/userController.js
import User from '../models/User.js';

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('followers following posts');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};
