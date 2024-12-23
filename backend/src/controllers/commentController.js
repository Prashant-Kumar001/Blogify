import Comment from "../models/Comments.model.js";
import Blog from "../models/Blogs.model.js";
import User from "../models/Users.model.js";
import ResponseHandler from "../api/Response.api.js"; // A custom response handler, assumed to be already implemented
import asyncHandler from "express-async-handler"; // To handle async requests
import mongoose from "mongoose";

// Create a comment
export const createComment = asyncHandler(async (req, res) => {
    const { blogId } = req.params; // Get blogId from URL params
    const { comment } = req.body; // Get the content of the comment from the request body
    const userId = req.user._id; // Assuming you use authentication middleware to get the logged-in user
    console.log(req.body); //



    // Check if the blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
        return ResponseHandler.notFound(res, "Blog not found");
    }

    // Create the new comment
    const newComment = await Comment.create({
        content: comment,
        user: userId, // Associate the comment with the logged-in user
        blog: blogId, // Associate the comment with the blog
    });

    if (!newComment) {
        return ResponseHandler.serverError(res, "Failed to create comment");
    }

    // Associate the updated blog with the comment
    blog.comments.push(newComment._id);
    await blog.save();

    // const user = await User.findByIdAndUpdate(userId, {
    //     $push: { reviews: newComment._id },
    // });

    // Return the created comment
    return ResponseHandler.created(
        res,
        newComment,
        "Comment created successfully"
    );
});

// Get comments for a specific blog
export const getCommentsForBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params;

    // Updated aggregation pipeline to retrieve comments for the specified blog, along with user details and blog title
    const commentsData = await Comment.aggregate([
        // Match comments for the specific blog ID
        { $match: { blog: new mongoose.Types.ObjectId(blogId) } },

        // Sort comments by creation date (most recent first)
        { $sort: { createdAt: -1 } },

        // Lookup user details for each comment
        {
            $lookup: {
                from: "users", // User collection
                localField: "user",
                foreignField: "_id",
                as: "userDetails",
            },
        },

        // Unwind userDetails to make it a single object rather than an array
        { $unwind: "$userDetails" },

        // Lookup blog details (like title) for each comment
        {
            $lookup: {
                from: "blogs", // Blog collection
                localField: "blog",
                foreignField: "_id",
                as: "blogDetails",
            },
        },

        // Unwind blogDetails to make it a single object rather than an array
        { $unwind: "$blogDetails" },

        // Project necessary fields, including user info and blog title
        {
            $project: {
                _id: 1,
                content: 1,
                createdAt: 1,
                "userDetails.username": 1,
                "userDetails.email": 1,
                "blogDetails.title": 1,
                "blogDetails._id": 1,
            },
        },
    ]);


    // Check if any comments were retrieved
    if (!commentsData.length) {
        return ResponseHandler.notFound(res, "No comments found for this blog");
    }

    // Structure the response to include comment details and blog metadata
    const responseData = {
        comments: commentsData.map(comment => ({
            _id: comment._id,
            content: comment.content,
            createdAt: comment.createdAt,
            user: {
                username: comment.userDetails.username,
                email: comment.userDetails.email,
            },
            blog: {
                _id: comment.blogDetails._id,
            },
        })),
        totalComments: commentsData.length,
        title: commentsData[0].blogDetails.title,
    };

    // Send structured response
    return ResponseHandler.success(
        res,
        responseData,
        "Comments retrieved successfully"
    );
});
// Update a comment
export const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id; // Assuming you use authentication middleware to get the logged-in user

    // Find the comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
        return ResponseHandler.notFound(res, "Comment not found");
    }

    // Ensure that the comment was made by the logged-in user
    if (comment.user.toString() !== userId.toString()) {
        return ResponseHandler.forbidden(
            res,
            "You can only edit your own comments"
        );
    }

    // Update the comment content
    comment.content = content;
    await comment.save();

    return ResponseHandler.success(res, comment, "Comment updated successfully");
});

// Delete a comment
export const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id; // Assuming you use authentication middleware to get the logged-in user

    // Find the comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
        return ResponseHandler.notFound(res, "Comment not found");
    }

    // Ensure that the comment was made by the logged-in user or the user is an admin
    if (
        comment.user.toString() !== userId.toString() &&
        req.user.role !== "admin"
    ) {
        return ResponseHandler.forbidden(
            res,
            "You can only delete your own comments or be an admin"
        );
    }

    // Delete the comment
    await comment.remove();

    return ResponseHandler.success(res, null, "Comment deleted successfully");
});
