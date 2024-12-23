import Blog from "../models/Blogs.model.js";
import asyncHandler from "express-async-handler";
import ResponseHandler from "../api/Response.api.js";
import User from "../models/Users.model.js";
import Like from "../models/Like.model.js";
import Comment from "../models/Comments.model.js";
import mongoose from "mongoose";
// @desc    Create new Blog
// @route   POST /api/Blogs
// @access  Private
export const createBlog = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    videoUrl = null,
    thumbnailUrl,
    category,
  } = req.body;
  // Validate the input data
  if (!title || !description || !category || !thumbnailUrl) {
    return ResponseHandler.badRequest(
      res,
      "Invalid input data",
      "Title, description, and thumbnailUrl are required"
    );
  }

  // Create the blog
  const User_Blog = await Blog.create({
    title,
    description,
    videoUrl,
    thumbnailUrl,
    category: category,
    user: req.user._id,
  });

  if (!User_Blog) {
    return ResponseHandler.badRequest(
      res,
      "Failed to create blog",
      "Failed to create blog"
    );
  }

  // Find the user and add the new blog to their Blogs array
  const user = await User.findById(req.user._id);
  if (!user) {
    return ResponseHandler.badRequest(res, "User not found", "User not found");
  }

  user.Blogs.push(User_Blog._id);
  await user.save(); // Save the updated user with the new blog ID in Blogs array

  return ResponseHandler.created(
    res,
    {
      blog: {
        id: User_Blog._id,
        title,
        description,
        videoUrl,
        thumbnailUrl,
      },
      user: req.user._id,
    },
    "Blog created successfully"
  );
});

// @desc    Get all Blogs
// @route   GET /api/Blogs
// @access  private, admin
export const getBlogs = asyncHandler(async (req, res) => {
  const usersWithBlogData = await User.find({}).populate({
    path: "Blogs",
    populate: [
      {
        path: "comments",
        select: "content",
        populate: {
          path: "user",
          select: "username",
        },
      },
      {
        path: "likes", // Populate likes
        populate: {
          path: "user",
          select: "username",
        },
      },
    ],
  });

  // Send response with the processed data
  return ResponseHandler.success(
    res,
    usersWithBlogData,
    "Featured successfully"
  );
});

// @desc    Get all current user Blogs
// @route   GET /api/Blogs
// @access  public
export const getCurrentUserBlogs = asyncHandler(async (req, res) => {
  // Fetch the current user blogs and populate only their blogs
  const user = await Blog.find({ user: req.user._id })
    .select("")
    .populate({
      path: "comments",
      select: "content ",
      populate: {
        path: "user",
        select: "username ",
      },
    })
    .populate({
      path: "user",
      select: "username -_id",
    });
  // .populate({
  //   path: "Blogs",
  //   match: { user: req.user._id }, // Filter to populate only current user's blogs
  //   // select: "-password",
  // })
  // .populate({
  //   path: "reviews",
  //   match: { user: req.user._id },
  //   populate: ({
  //     path: "blog",
  //   })
  // })
  if (!user) {
    return ResponseHandler.notFound(res, "User not found");
  }

  return ResponseHandler.success(
    res,
    { blogs: user },
    "Blogs fetched successfully"
  );
});

// @desc    Get Blogs for users
// @route   GET /api/Blogs
// @access  public
export const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({}).populate({
    path: "user",
  });
  if (blogs) {
    ResponseHandler.success(
      res,
      { blogs, blogCount: blogs.length },
      "All blogs fetched successfully"
    );
  } else {
    ResponseHandler.serverError(res, "Failed to fetch blogs");
  }
});

// @desc    Get single Blog
// @route   GET /api/Blogs/:id
// @access  Public
export const getBlog = asyncHandler(async (req, res) => {
  const userBlog = await Blog.findById(req.params.id)
    .populate("user", "username email")
    .populate({
      path: "comments",
      select: "content createdAt",
      populate: {
        path: "user",
        select: "username profile_picture _id createdAt ",
      },
    })
    .populate({
      path: "likes",
      // populate: {
      //   path: "user",
      //   select: "username profile_picture _id createdAt ",
      // },
    });

  if (!userBlog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  return ResponseHandler.success(res, userBlog, "Blog fetched successfully");
});

// @desc    Update Blog
// @route   PUT /api/Blogs/:id
// @access  Private
export const updateBlog = asyncHandler(async (req, res) => {
  const { title, description, videoUrl, thumbnailUrl } = req.body;

  const Blog = await Blog.findById(req.params.id);

  if (!Blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  // Check user ownership or admin
  if (
    Blog.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to update this Blog");
  }

  Blog.title = title || Blog.title;
  Blog.description = description || Blog.description;
  Blog.videoUrl = videoUrl || Blog.videoUrl;
  Blog.thumbnailUrl = thumbnailUrl || Blog.thumbnailUrl;

  const updatedBlog = await Blog.save();
  return ResponseHandler.success(res, updatedBlog, "Blog updated successfully");
});

// @desc    Delete Blog
// @route   DELETE /api/Blogs/:id
// @access  Private, public
export const deleteBlog = asyncHandler(async (req, res) => {
  console.log("blog id: ", req.params.id);
  console.log("user id: ", req.user._id);

  const findUser = await User.findById(req.user._id);
  const findBlog = await Blog.findById(req.params.id);

  // if (!findBlog) {
  //   res.status(404);
  //   throw new Error("Blog not found");
  // }

  // if (!findUser) {
  //   res.status(404);
  //   throw new Error("User not found");
  // }

  // 675d11671fc3b34b7ca80311



  // 2. Delete all comments related to this blog
  await Comment.deleteMany({ blog: req.params.id }); // Same for comments' blog reference
  console.log("All comments related to the blog have been deleted.");

  // 3. Delete all likes related to this blog
  await Like.deleteMany({ content: req.params.id }); // Same for likes' blog reference
  console.log("All likes related to the blog have been deleted.");

  // 4. Delete the blog document itself
  await Blog.deleteOne({ _id: req.params.id });
  console.log("Blog document has been deleted.");

  // 1. Remove blog ID from the user's Blogs array
  await User.updateOne(
    { _id: req.user._id }, // Use 'new' to create an instance of ObjectId
    { $pull: { Blogs: req.params.id } } // Same here for the blog ID
  );
  console.log("Blog ID removed from user's Blogs array.");

  return ResponseHandler.success(res, null, "Blog deleted successfully");
});
