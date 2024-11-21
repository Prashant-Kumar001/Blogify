import Like, { LikeTypes } from "../models/Like.model.js";
import Blog from "../models/Blogs.model.js";

// Add a like to a blog post
const addLike = async (req, res) => {
  const { id } = req.params; // Blog post ID
  const { type } = req.body; // Like type (thumbs_up, heart, etc.)
  const userId = req.user.id; // User ID from authentication

  try {
    // Ensure the like type is valid
    if (!Object.values(LikeTypes).includes(type)) {
      return res.status(400).json({ error: "Invalid like type" });
    }

    // Check if the user has already liked this blog post
    const existingLike = await Like.findOne({ user: userId, content: id });
    if (existingLike) {
      return res
        .status(200)
        .json({ error: "You have already liked this blog post" });
    }

    // Create a new like
    const newLike = new Like({
      user: userId,
      content: id,
      type: type,
    });
    const user = await Blog.findOne({ _id: id });
    user.likes.push(userId);
    await user.save(); // Save the updated user with the new blog ID in Blogs array
    await newLike.save();

    // Return a success response
    return res
      .status(200)
      .json({ message: "Blog post liked successfully", newLike });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get the like count for a blog post
const getLikeCount = async (req, res) => {
  const { id } = req.params; // Blog post ID

  try {
    // Get the count of likes for the specified blog post
    const likeCount = await Like.countDocuments({ content: id });
    res.status(200).json({ likeCount });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Check if the user has already liked a blog post
const hasUserLiked = async (req, res) => {
  const { id } = req.params; // Blog post ID
  const userId = req.user.id; // User ID from authentication

  try {
    // Check if the user has already liked the blog post
    const hasLiked = await Like.exists({ user: userId, content: id });
    if (!hasLiked) {
      return res
        .status(201)
        .json({ message: "You have not liked this blog post" });
    }
    return res.status(200).json({ hasLiked });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

export { addLike, getLikeCount, hasUserLiked };
