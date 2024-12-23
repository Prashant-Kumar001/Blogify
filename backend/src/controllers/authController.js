import ms from "ms";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/Users.model.js";
import ResponseHandler from "../api/Response.api.js";
// import { cache } from "../utils/cache.js";

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return ResponseHandler.badRequest(
      res,
      "Email already exists",
      "User with this email already exists"
    );
  }

  // Check if username exists
  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    return ResponseHandler.badRequest(
      res,
      "Username already exists",
      "User with this username already exists"
    );
  }

  // Create new user
  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    ResponseHandler.created(
      res,
      {
        id: user._id, // MongoDB stores the unique identifier as `_id`
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      "User account created successfully"
    );
  } else {
    ResponseHandler.serverError(res, "Failed to create user");
  }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email and verify password
  const user = await User.findOne({ email }).select("+password");

  if (user && (await user.matchPassword(password))) {
    // Create and send JW
    // Convert `1d` or similar to milliseconds
    const jwtCookieExpiresIn = ms(process.env.JWT_COOKIE_EXPIRES_IN || "7d");
    res.cookie("token", generateToken(user._id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none", // Enable secure cookies for HTTPS
      expires: new Date(Date.now() + jwtCookieExpiresIn),
    });
    // Return user data and JWT token
    ResponseHandler.success(
      res,
      {
        id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      },
      "User logged in successfully"
    );
  } else {
    return ResponseHandler.unauthorized(res, "Invalid email or password");
  }
});

//desc      get current user profile
//route     GET /api/auth/profile
//access    public
export const userProfile = asyncHandler(async (req, res) => {
  const userName = req.params.user;
  const user = await User.findOne({
    username: userName,
  }).populate({
    path: "following",
    select: "username",
  }).populate({
    path: 'Blogs'
  })
  if (user) {
    ResponseHandler.success(res, user, "get user successfully");
  } else {
    return ResponseHandler.notFound(res, "User not found");
  }
});

//desc      update user profile
//route     PUT /api/auth/update-profile
//access    public
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return ResponseHandler.notFound(res, "User not found");
  }
  const { avatar, bio, username } = req.body;
  if (!avatar || !bio || !username) {
    return ResponseHandler.badRequest(res, "Missing required fields");
  }
  user.profile_picture = avatar;
  user.profile_bio = bio;
  user.profile_name = username;
  await user.save();
  ResponseHandler.success(res, user, "User profile updated successfully");
});

// @desc    Authenticate a user
// @route   POST /api/auth/logout
// @access  Public
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  ResponseHandler.success(res, null, "User logged out successfully");
});

// @desc    Authenticate a user
// @route   POST /api/auth/admin/get-all-users
// @access  private
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  console.log(req.user);
  if(!req.user){
    return ResponseHandler.unauthorized(res, "Not authorized as admin");
  }
  if(req.user.role!=='admin'){
    return ResponseHandler.unauthorized(res, "Not authorized as admin");
  }
   
  
  if (users) {
    ResponseHandler.success(
      res,
      {
        users,
        totalUsers: users.length,
        success: true,
        message: "All users fetched successfully",
      },
      "All users fetched successfully"
    );
  } else {
    ResponseHandler.serverError(res, "Failed to fetch users");
  }
});
// @desc    Authenticate a user
// @route   POST /api/auth/admin/get-all-users
// @access  initial call public
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select({
    username: 1,
    email: 1,
    profile_picture: 1,
  });
  if (users) {
    ResponseHandler.success(
      res,
      {
        users,
        totalUsers: users.length,
        success: true,
        message: "All users fetched successfully",
      },
      "All users fetched successfully"
    );
  } else {
    ResponseHandler.serverError(res, "Failed to fetch users");
  }
});

// @desc    Authenticate a user
// @route   POST /api/auth/admin/delete-user
// @access  public [ runs when app loaded]

export const isloggedIn = asyncHandler(async (req, res) => {
  try {
    const token = req.params.token;

    // Verify the token
    const decoded = verifyToken(token);

    // If `verifyToken` returns nothing or is invalid
    if (!decoded || !decoded.id) {
      return ResponseHandler.unauthorized(
        res,
        "Invalid or expired token. Please login again."
      );
    }

    const user = await User.findById(decoded.id);

    if (user) {
      ResponseHandler.success(
        res,
        {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            img: user.profile_picture,
            role: user.role,
            following: user.following,
            followers: user.followers,
          },
          success: true,
          message: "User is logged in",
        },
        "User is logged in"
      );
    } else {
      ResponseHandler.success(
        res,
        {
          user: null,
          success: false,
          message: "User not found. Please login again.",
        },
        "User not found"
      );
    }
  } catch (error) {
    console.error("Error verifying token or fetching user:", error);
    ResponseHandler.error(res, "An error occurred. Please try again.");
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const verifyToken = (token) => {
  if (!token) {
    return null;
  }
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
