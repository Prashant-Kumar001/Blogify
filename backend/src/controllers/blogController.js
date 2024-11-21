import Blog from "../models/Blogs.model.js";
import asyncHandler from "express-async-handler";
import ResponseHandler from "../api/Response.api.js";
import User from "../models/Users.model.js";

// @desc    Create new Blog
// @route   POST /api/Blogs
// @access  Private
export const createBlog = asyncHandler(async (req, res) => {
  const { title, description, videoUrl = null, thumbnailUrl} = req.body;

  // Validate the input data
  if (!title ||!description) {
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
  const usersWithBlogData = await User.aggregate([
    // Lookup and embed blogs data into each user
    {
      $lookup: {
        from: "blogs", // Assuming the collection for blogs is named 'blogs'
        localField: "Blogs", // Field in User model that contains blog IDs
        foreignField: "_id", // Field in Blog model that matches User's Blogs field
        as: "blogsData", // The new field in output that will contain populated blogs
      },
    },
    // Add fields for the blog count and only required fields of each blog
    {
      $addFields: {
        blogCount: { $size: "$blogsData" }, // Count number of blogs
        blogs: {
          $map: {
            input: "$blogsData",
            as: "blog",
            in: {
              _id: "$$blog._id",
              title: "$$blog.title",
              description: "$$blog.description",
              videoUrl: "$$blog.videoUrl",
              thumbnailUrl: "$$blog.thumbnailUrl",
              createdAt: "$$blog.createdAt",
              updatedAt: "$$blog.updatedAt",
              comments: "$$blog.comments", // Keep the comment IDs for now
            },
          },
        },
      },
    },
    // Lookup and populate comments for each blog
    {
      $lookup: {
        from: "comments", // The name of the collection that holds the comments
        localField: "blogs.comments", // The blog's comments field, which contains an array of comment IDs
        foreignField: "_id", // The field in the "comments" collection that corresponds to comment IDs
        as: "populatedComments", // New field containing full comment details
      },
    },
    // Add populated comments to each blog entry
    {
      $addFields: {
        blogs: {
          $map: {
            input: "$blogs",
            as: "blog",
            in: {
              _id: "$$blog._id",
              title: "$$blog.title",
              description: "$$blog.description",
              videoUrl: "$$blog.videoUrl",
              thumbnailUrl: "$$blog.thumbnailUrl",
              createdAt: "$$blog.createdAt",
              updatedAt: "$$blog.updatedAt",
              comments: {
                $map: {
                  input: "$populatedComments",
                  as: "comment",
                  in: {
                    _id: "$$comment._id",
                    text: "$$comment.content", // Assuming the comment has a `content` field
                    user: "$$comment.user", // The comment's author user ID
                    createdAt: "$$comment.createdAt", // Assuming there's a createdAt field in the comment
                  },
                },
              },
            },
          },
        },
      },
    },
    // Lookup and populate user details for each comment's author (user)
    {
      $lookup: {
        from: "users", // The collection holding the users (who authored comments)
        localField: "populatedComments.user", // The `user` field in each populated comment
        foreignField: "_id", // Match the user _id
        as: "authorDetails", // This will populate user data for each comment
      },
    },
    // Add user details to comments (for each comment's author)
    {
      $addFields: {
        blogs: {
          $map: {
            input: "$blogs",
            as: "blog",
            in: {
              _id: "$$blog._id",
              title: "$$blog.title",
              description: "$$blog.description",
              videoUrl: "$$blog.videoUrl",
              thumbnailUrl: "$$blog.thumbnailUrl",
              createdAt: "$$blog.createdAt",
              updatedAt: "$$blog.updatedAt",
              comments: {
                $map: {
                  input: "$$blog.comments",
                  as: "comment",
                  in: {
                    _id: "$$comment._id",
                    text: "$$comment.text", // Assuming the comment has a `text` field
                    user: {
                      $arrayElemAt: [
                        "$authorDetails", // Get the user details for this comment
                        { $indexOfArray: ["$$blog.comments.user", "$$comment.user"] }
                      ],
                    },
                    createdAt: "$$comment.createdAt", // Assuming there's a createdAt field in the comment
                  },
                },
              },
            },
          },
        },
      },
    },
    // Project only the fields you want in the final output
    {
      $project: {
        _id: 1,
        username: 1,
        email: 1,
        role: 1,
        createdAt: 1,
        updatedAt: 1,
        blogs: 1, // The blogs now have fully populated comments and user details
        blogCount: 1, // Include the count of blogs
      },
    },
  ]);


  // Send response with the processed data
  return ResponseHandler.success(res, usersWithBlogData, "Featured successfully");
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
})

// @desc    Get single Blog
// @route   GET /api/Blogs/:id
// @access  Public
export const getBlog = asyncHandler(async (req, res) => {
  const userBlog = await Blog.findById(req.params.id).populate(
    "user",
    "username email"
  );

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
// @access  Private
export const deleteBlog = asyncHandler(async (req, res) => {
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
    throw new Error("Not authorized to delete this Blog");
  }

  await Blog.remove();
  return ResponseHandler.success(res, null, "Blog deleted successfully");
});
