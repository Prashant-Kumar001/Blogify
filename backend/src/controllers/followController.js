// controllers/followController.js
import Follow from "../models/Follow.model.js";
import User from "../models/Users.model.js";

// Follow a user
export const followUser = async (req, res) => {
  const { follower } = req.body;
  const followeeId = req.user._id;


  if (follower === followeeId) {
    return res.status(400).json({ message: "You cannot follow yourself." });
  }

  try {
    // Check if the follow relationship already exists
    const existingFollow = await Follow.findOne({
      follower: follower,
      followee: followeeId,
    });

    if (existingFollow) {
      return res
        .status(200)
        .json({ message: "You are already following this user." });
    }

    // Create a new follow relationship
    const newFollow = new Follow({
      follower: follower,
      followee: followeeId,
    });

    const followerUser = await User.findById(follower);
    followerUser.followers.push(followeeId);

    const followeeUser = await User.findById(followeeId);
    followeeUser.following.push(follower);

    await followeeUser.save();
    await followerUser.save();
    await newFollow.save();

    return res.status(200).json({ message: "Successfully followed the user." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const isFollowing = async (req, res) => {
  const { follower } = req.body;
  const followee = req.user._id;
  try {
    const follow = await Follow.findOne({
      follower: follower,
      followee: followee,
    });
    if (follow) {
      return res.status(200).json({ isFollowing: true });
    } else {
      return res.status(200).json({ isFollowing: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getFollowers = async (req, res) => {
  const id = req.params.user
  const user = await User.findOne({ username: id });
  if(!user){
    return res.status(404).json({ message: "User not found." });
  }
  try {
    const following = await Follow.find({ followee: user._id }).populate({
      path: "follower",
      select: "username profile_name",
    })
    const followers = await Follow.find({ follower: user._id }).populate({
      path: "followee",
      select: "username profile_name",
    })
    return res.status(200).json({ following, followers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  const { followerId, followeeId } = req.body;

  try {
    // Find and remove the follow relationship
    const follow = await Follow.findOneAndDelete({
      follower: followerId,
      followee: followeeId,
    });

    if (!follow) {
      return res
        .status(404)
        .json({ message: "You are not following this user." });
    }

    res.status(200).json({ message: "Successfully unfollowed the user." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};
