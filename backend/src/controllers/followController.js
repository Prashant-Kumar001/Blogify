// controllers/followController.js
import Follow from '../models/Follow.model.js';
import User from '../models/Users.model.js';

// Follow a user
export const followUser = async (req, res) => {
  const { followerId, followeeId } = req.body;

  if (followerId === followeeId) {
    return res.status(400).json({ message: "You cannot follow yourself." });
  }

  try {
    // Check if the follow relationship already exists
    const existingFollow = await Follow.findOne({ follower: followerId, followee: followeeId });

    if (existingFollow) {
      return res.status(400).json({ message: "You are already following this user." });
    }

    // Create a new follow relationship
    const newFollow = new Follow({ follower: followerId, followee: followeeId });
    await newFollow.save();

    res.status(200).json({ message: "Successfully followed the user." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  const { followerId, followeeId } = req.body;

  try {
    // Find and remove the follow relationship
    const follow = await Follow.findOneAndDelete({ follower: followerId, followee: followeeId });

    if (!follow) {
      return res.status(404).json({ message: "You are not following this user." });
    }

    res.status(200).json({ message: "Successfully unfollowed the user." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};
