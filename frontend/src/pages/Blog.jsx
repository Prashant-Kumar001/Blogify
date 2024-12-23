import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios"; // Import Axios
import RedirectLoader from "../components/RedirectLoader";
import CryptoJS from "crypto-js"; // Import CryptoJS
import parse from "html-react-parser";
import { RiHome5Fill } from "react-icons/ri";
import { RiBloggerFill } from "react-icons/ri";

// Function to encrypt text
const encrypt = (text, key) => {
  return CryptoJS.AES.encrypt(text, key).toString();
};

// URL encoding function
const urlEncode = (str) => {
  return encodeURIComponent(str); // Encode the encrypted string to safely include in URLs
};

// Slugify function to generate a valid URL slug
const slugify = (text) => text?.toString()?.trim().replace(/\s+/g, "-"); // Replace spaces with dashes

// Helper function to truncate text
const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

// API call to fetch blogs using Axios
const fetchBlogs = async () => {
  const response = await axios.get(
    "http://localhost:8000/api/blogs/users/blogs"
  );
  if (response.data?.success) {
    return response.data.data.blogs; // Extract blogs from the response
  } else {
    throw new Error(response.data?.message || "Error fetching blogs");
  }
};

const BlogLayout = () => {
  const { category } = useParams();

  // Use React Query to fetch blogs
  const {
    data: blogs = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts"], // Unique key for the query
    queryFn: fetchBlogs, // Function to fetch data
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const Categories = [...new Set(blogs.map((blog) => blog.category))];

  // Filter blogs based on category
  const filteredBlogs = category
    ? blogs.filter((blog) => blog.category === category)
    : blogs;

  // Mock Data for Trending and Interests
  const trending = [
    { rank: "01", title: "The Brightest Stars in the Darkest Sky" },
    { rank: "02", title: "What Is Apple's Vision Pro Really For?" },
    { rank: "03", title: "Change These 12 iOS 17 Settings Right Now" },
  ];

  const interests = [
    "Programming",
    "Hollywood",
    "Film Making",
    "Social Media",
    "Cooking",
    "Technology",
    "Finances",
    "Travel",
    "health",
  ];

  // Handle loading state
  if (isLoading) {
    return (
      <div>
        <RedirectLoader />
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }

  // If no blogs are found
  if (filteredBlogs.length === 0) {
    return (
      <div className="text-center">
        No blogs found. Please check back later.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="breadcrumbs text-sm">
            <ul>
          <li><NavLink to="/"> <RiHome5Fill className="mr-2" /> Home</NavLink></li>
          <li><NavLink to="/documents"> <RiBloggerFill className="mr-2" /> post</NavLink></li>
            </ul>
          </div>
          {filteredBlogs.map((blog) => {
          // Encrypt and encode the blog ID
          const blogHashedId = encrypt(blog?._id, "my-secret-key"); // Securely hash the ID
          const encodedEncryptedBlogId = urlEncode(blogHashedId);
          const postSlug = slugify(blog?.title); // Generate slug for the title

          return (
            <div
              key={blog?._id}
              className="flex items-start gap-4 p-4 border-gray-200"
            >
              <div className="flex-1">
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-7 rounded-full">
                      <Link to={`/profile/${blog.user.username}`}>
                        <img
                          src={
                            blog.user.profile_picture ||
                            "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                          }
                          alt={blog.user.username}
                        />
                      </Link>
                    </div>
                  </div>
                  <p className="text-sm">
                    {blog.user.username} @{" "}
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <h2 className="text-lg font-semibold">
                  <Link
                    to={`/blog/${postSlug}-${encodedEncryptedBlogId}`}
                    className="hover:underline"
                  >
                    {blog.title}
                  </Link>
                </h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: parse(truncateText(blog.description, 150)),
                  }}
                />
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-xs font-medium px-2 py-1 border border-gray-300 rounded-full">
                    {blog.category || "General"}
                  </span>
                  <span className="text-xs flex items-center">
                    ❤️ {blog.likes.length}
                  </span>
                </div>
              </div>
              <img
                src={blog.thumbnailUrl || "https://via.placeholder.com/150"}
                alt={blog.title}
                className="w-24 h-24 object-cover rounded-md"
              />
            </div>
          );
        })}
      </div>

      {/* Sidebar Section */}
      <div className="space-y-6">
        {/* Interests Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Stories from all interests</h3>
          <div className="flex flex-wrap gap-2">
            {Categories?.map((tag) => (
              <Link
                to={`/blog/category/${tag}`}
                key={tag}
                className="btn btn-neutral px-3 py-1 text-sm border border-gray-300 rounded-full"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Trending Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Trending</h3>
          <ul className="space-y-2">
            {trending.map((trend, index) => (
              <li key={index} className="flex items-center text-sm">
                <span className="font-bold mr-2">{trend.rank}</span>
                {trend.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Posts Section */}
        <div>
          <h3 className="text-lg font-semibold">Recent Posts</h3>
          <ul className="space-y-2">
            {blogs
              .slice(-3)
              .reverse()
              .map((blog) => (
                <li key={blog?._id} className="flex items-center text-sm">
                  <img
                    src={blog?.thumbnailUrl}
                    alt={blog?.title}
                    className="w-10 h-10 object-cover rounded mr-3"
                  />
                  {blog?.title}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BlogLayout;
