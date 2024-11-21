import mongoose from "mongoose";

// Define the comment schema
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Please add comment content"],
      minlength: [1, "Comment cannot be empty"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User who made the comment
      required: true,
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog", // Reference to the Blog the comment is associated with
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the Comment model based on the schema
const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
