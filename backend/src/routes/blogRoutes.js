import express from "express";
import {
  createBlog,
  getBlog,  
  updateBlog,
  deleteBlog,
  getCurrentUserBlogs,
  getAllBlogs
} from "../controllers/blogController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getCurrentUserBlogs)
  .post(protect, authorize("user", "admin"), createBlog);

router
    .route("/Users/blogs")
    .get(getAllBlogs); 

router
  .route("/:id")
  .get( getBlog)
  .put(protect, authorize("user", "admin"), updateBlog)
  .delete(protect, authorize("admin"), deleteBlog);

export default router;
