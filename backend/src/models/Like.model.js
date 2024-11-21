import mongoose, { Schema } from "mongoose";

// Define the types of likes (e.g., thumbs_up, heart, clap, etc.)
export const LikeTypes = {
  THUMBS_UP: "thumbs_up",
  HEART: "heart",
  CLAP: "clap",
  LAUGH: "laugh",
};

const LikeSchema = new Schema(
  {
    user: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      index: true,  // Index to optimize queries looking for likes by a user
    }, // The user who liked
    content: { 
      type: Schema.Types.ObjectId, 
      ref: "Blog", 
      required: true, 
      index: true,  // Index to optimize queries looking for likes on a specific blog post
    }, // The content (e.g., Blog or Post) being liked
    type: { 
      type: String, 
      enum: Object.values(LikeTypes), 
      required: true, 
    }, // Type of like (e.g., thumbs_up, heart)
    createdAt: { 
      type: Date, 
      default: Date.now, 
    }, // Timestamp of when the like was created
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Prevent multiple likes by the same user on the same content (user can like only once)
LikeSchema.index({ user: 1, content: 1 }, { unique: true }); 

// Create the Like model from the schema
const Like = mongoose.model("Like", LikeSchema);

export default Like;
