import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/Users.model.js";
import ResponseHandler from "../api/Response.api.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // If token is not in Authorization header, check cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // If no token was found in either place, return an error
  if (!token) {
    res.status(401);
    return ResponseHandler.unauthorized(res, "Not authorized, no token");
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user to the request object
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    res.status(401);
    ResponseHandler.unauthorized(res, "Not authorized, token failed");
  }
});
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }
    if (!roles.includes(req.user.role)) {
      //   res.status(403);
      //   throw new Error(`User role '${req.user.role}' is not authorized`);
      return ResponseHandler.forbidden(res, "User role is not authorized");
    }
    next();
  };
};
