import express from 'express';
import { addLike, getLikeCount, hasUserLiked } from '../controllers/LikeController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Add a like to a blog post
router.post('/:id/like', protect, addLike);

// Get the like count of a blog post
router.get('/:id/like-count', getLikeCount);

// Check if the user has already liked the blog post
router.get('/:id/has-liked', protect, hasUserLiked);

export default router;
