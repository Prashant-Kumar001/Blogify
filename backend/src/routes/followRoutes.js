// routes/followRoutes.js
import express from 'express';
import { followUser, unfollowUser } from '../controllers/followController.js';

const router = express.Router();

// Route to follow a user
router.post('/follow', followUser);

// Route to unfollow a user
router.post('/unfollow', unfollowUser);

export default router;
