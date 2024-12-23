import express from "express";
import {
  getBlogs, // only for admin (admin only get all blog posts)
} from "../controllers/blogController.js";
import { getAllUsers } from "../controllers/authController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Define routes
router.get("/", protect, authorize("admin"), getBlogs); // Admin-only route to get all blogs
router.get("/users", protect, authorize("admin"), getAllUsers); // Admin-only route to get all users

export default router;
