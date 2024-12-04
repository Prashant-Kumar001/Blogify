import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "./Loader";
import { GrLike } from "react-icons/gr";
import { AiFillLike } from "react-icons/ai";
import CryptoJS from "crypto-js";

// Function to decrypt the hash
const decrypt = (cipherText, key) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, key);
  return bytes.toString(CryptoJS.enc.Utf8); // return the decrypted value as a string
};

// Function to fetch a single blog post
const fetchPost = async (blogId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You need to login!");
  }

  const response = await axios.get(
    `http://localhost:8000/api/blogs/${blogId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.data.success) {
    throw new Error("Failed to load the blog data.");
  }

  return response.data.data; // return the post data
};

// Function to like a post
const likePost = async (blogId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You need to login!");
  }

  const response = await axios.post(
    `http://localhost:8000/api/like/${blogId}/like`,
    { type: "thumbs_up" },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status !== 200) {
    throw new Error("Failed to like the blog.");
  }

  return response.data; // return like response
};

// Function to check if user has liked a post
const hasUserLiked = async (blogId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You need to login!");
  }

  const res = await axios.get(
    `http://localhost:8000/api/like/${blogId}/has-liked`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// Function to add a comment
const addComment = async ({ blogId, newComment }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You need to login!");
  }

  const response = await axios.post(
    `http://localhost:8000/api/comments/${blogId}`,
    { comment: newComment },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.data.success) {
    throw new Error("Failed to add the comment.");
  }

  return response.data; // return the new comment data
};

const FullPost = () => {
  const { blogId } = useParams();
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();
  const [like, setLike] = useState(false);

  // Decrypt the hash value from blogId (last part after the dash)
  const lastDashIndex = blogId.lastIndexOf("-");
  const hash = blogId.substring(lastDashIndex + 1);
  const key = decrypt(hash, "my-secret-key");

  // Fetch post data using react-query
  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["post", key],
    queryFn: () => fetchPost(key),
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (err) => {
      toast.error(err.message || "Error loading blog post");
    },
  });

  const { data: comment } = useQuery({
    queryKey: ["comments", key],
    queryFn: () => hasUserLiked(key),
    staleTime: 1000 * 60 * 5, // 5 minutes
    onSuccess: (data) => {
        setLike(data.hasLiked);
    },
    onError: (err) => {
      toast.error(err.message || "Error fetching comments");
    },
  });
  
  console.log(comment);
  

  // Check if the user has liked the post
//   useEffect(() => {
//     const checkIfLiked = async () => {
//       try {
//         const data = await hasUserLiked(key);
//         setLike(data.hasLiked);
//       } catch (err) {
//         console.error("Error checking if liked:", err);
//       }
//     };
//     checkIfLiked();
//   }, [key]);

  // Mutation for liking a post
  const likeMutation = useMutation({
    mutationKey: ["like", key],
    mutationFn: likePost,
    onSuccess: () => {
      toast.success("Blog liked!");
      queryClient.invalidateQueries({ queryKey: ["post", key] }); // invalidate the post query to refetch data
      setLike(true); // Update the state to reflect the like
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error === "You have already liked this blog post"
          ? "You already liked this post."
          : "An error occurred while liking the post."
      );
    },
  });

  // Mutation for adding a comment
  const commentMutation = useMutation({
    mutationKey: ["comment", key],
    mutationFn: addComment,
    onSuccess: (newCommentData) => {
      toast.success("Comment added!");
      queryClient.invalidateQueries({ queryKey: ["post", key] });
      setNewComment("");
    },
    onError: (err) => {
      toast.error(err.message || "Error adding comment");
    },
  });

  // Handle the like button click
  const handleLike = () => {
    if (like) return; // Prevent liking again if already liked
    likeMutation.mutate(key);
  };

  // Handle comment form submission
  const handleCommentSubmit = () => {
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }
    commentMutation.mutate({ blogId: key, newComment });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div className="text-center text-red-500">{error.message}</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="shadow-md rounded-lg overflow-hidden">
        {/* Blog Header */}
        <div className="p-6">
          {post.thumbnailUrl && (
            <div className="p-4">
              <img
                src={post.thumbnailUrl}
                alt={post.title}
                className="w-full h-72 object-cover rounded-lg"
              />
            </div>
          )}
          <h1 className="text-4xl f_robota font-bold mb-4">{post.title}</h1>
          <p className="text-lg f_poppins">{post.description}</p>
        </div>
        {post.videoUrl && (
          <div className="p-4">
            <iframe
              className="w-full h-96 rounded-lg"
              src={post.videoUrl}
              title="Video"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {/* Actions */}
        <div className="p-6 border-t flex justify-between items-center">
          <div className="flex gap-1 justify-center items-center">
            <button
              onClick={handleLike}
              className=""
              disabled={likeMutation.isLoading}
            >
              {likeMutation.isLoading ? (
                <GrLike className={`text-xl`} />
              ) : (
                <AiFillLike className={`text-3xl ${like && "text-red-500"} `} />
              )}
            </button>
            {post?.likes.length > 0 && (
              <span className="text-lg ml-2">
                {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
              </span>
            )}
          </div>
          <span>{post.comments.length} Comments</span>
        </div>

        {/* Comments Section */}
        <div className="p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>

          {post.comments.length > 0 ? (
            <div className="space-y-6">
              {post.comments.map((comment, index) => (
                <div
                  key={index}
                  className="rounded-lg p-4 shadow-sm hover:shadow-md transition "
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={
                        comment.user.profile_picture ||
                        "https://via.placeholder.com/40"
                      }
                      alt={`${comment.user.username}'s profile`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-lg font-bold ">
                        {comment.user.username}
                      </p>
                      <p className=" mt-1">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 italic">
              No comments yet. Be the first to comment!
            </p>
          )}

          {/* Add Comment Section */}
          <div className="mt-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="textarea w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg p-3 text-gray-700"
              placeholder="Add a comment..."
              rows="4"
            ></textarea>
            <button
              onClick={handleCommentSubmit}
              className={`mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition ${
                commentMutation.isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={commentMutation.isLoading}
            >
              {commentMutation.isLoading ? "Submitting..." : "Submit Comment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullPost;
