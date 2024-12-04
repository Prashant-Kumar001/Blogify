import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import skeleton from "../components/Skeleton";
import CryptoJS from "crypto-js";

// Function to generate a hash
const encrypt = (text, key) => {
  return CryptoJS.AES.encrypt(text, key).toString();
};

const urlEncode = (str) => {
  return encodeURIComponent(str); // Encode the encrypted string to safely include in URLs
};


// Function to create a slug from a title
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-"); // Replace spaces with dashes

// Function to fetch posts
const fetchPosts = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You need to login!"); // Trigger redirect on missing token
  }

  const response = await axios.get("http://localhost:8000/api/blogs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response?.data?.data?.blogs; // Return the list of blogs
};

const Dashboard = () => {
  const {
    data: posts, // Query data (list of posts)
    isLoading, // Loading state
    isError, // Error state
    error, // Error details
  } = useQuery({
    queryKey: ["posts"], // Unique key for the query
    queryFn: fetchPosts, // Function to fetch data
    onError: (err) => {
      if (err.message === "You need to login!") {
        toast.error(err.message);
        window.location.href = "/login"; // Redirect on token issue
      } else {
        toast.error("Failed to load posts. Please try again.");
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <div>{error.message || "An unexpected error occurred."}</div>;
  }

  return (
    <div className="container mx-auto p-6 f_poppins">
      <h2 className="text-3xl font-bold mb-6">Your Blog Posts</h2>

      {posts.length === 0 ? (
        <p>You have not created any posts yet.</p>
      ) : (
        <div className="flex gap-4 relative flex-wrap justify-start">
          {posts.map((post) => {
            const hashedId = encrypt(post._id, "my-secret-key"); // Securely hash the ID
            const encodedEncryptedBlogId = urlEncode(hashedId);
            const slug = slugify(post.title); // Generate slug for the title
            return (
              <div
                key={post._id}
                className="card shadow-lg p-4 border rounded-lg w-60"
              >
                {post.thumbnailUrl && (
                  <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    className="mt-4 mb-2 w-full h-32 object-cover rounded-lg"
                  />
                )}
                <h3 className="text-xl font-semibold f_robota">{post.title.substring(0, 15)}...</h3>
                <p className="text-sm mt-2 h-11">
                  {post.description.substring(0, 50)}...
                </p>
                <Link
                  to={`/dashboard/blog/${slug}-${encodedEncryptedBlogId}`} // Combine slug and hashed ID
                  className="btn btn-outline mt-4 w-full sticky bottom-1"
                >
                  Read More
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
