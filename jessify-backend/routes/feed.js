import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getUserFeed } from '../controllers/feedController.js';

const router = express.Router();

// GET /api/feed
router.get('/', authMiddleware, getUserFeed);

export default router;
