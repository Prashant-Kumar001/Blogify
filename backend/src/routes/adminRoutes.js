import express from "express";
import {
  getBlogs, // only for admin (admin only get all blog posts)
} from "../controllers/blogController.js";
import { getAllUsers } from "../controllers/authController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getBlogs);
router.route("/users").get(getAllUsers);
export default router;
