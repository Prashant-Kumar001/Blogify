// routes/followRoutes.js
import express from 'express';
import { followUser, unfollowUser, getFollowers } from '../controllers/followController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to follow a user
router.post('/', protect, followUser);

// route for user is following 
router.get('/getFollowers/:user', getFollowers);

// Route to unfollow a user
router.post('/unfollow', unfollowUser);

export default router;
