import express from 'express';
import { createComment, getCommentsForBlog, updateComment, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middlewares/authMiddleware.js'; // Assuming you have an authentication middleware to protect routes

const router = express.Router();

// Route to create a comment
router.post('/:blogId', protect, createComment); // Protect this route with the 'protect' middleware to ensure the user is logged in

// Route to get all comments for a specific blog
router.get('/:blogId', getCommentsForBlog); // No protection as it's just fetching public data

// Route to update a comment (only by the user who made the comment)
router.put('/:commentId', protect, updateComment); // Protect this route so only the user who made the comment can update it

// Route to delete a comment (only by the user who made the comment or an admin)
router.delete('/:commentId', protect, deleteComment); // Protect this route to allow deletion by the comment author or an admin

export default router;
