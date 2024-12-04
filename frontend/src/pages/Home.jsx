// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CryptoJS from "crypto-js"; // Don't forget to import CryptoJS

// Fetch function for posts
const fetchPosts = async () => {
  const response = await axios.get(
    "http://localhost:8000/api/blogs/users/blogs"
  );
  return response?.data?.data?.blogs;
};

// const fetchUsers = async () => {
//   const response = await axios.get(
//     "http://localhost:8000/api/auth/get-all-users"
//   );
//   return response?.data?.data;
// };

const encrypt = (text, key) => {
  return CryptoJS.AES.encrypt(text, key).toString();
};

// URL encoding function
const urlEncode = (str) => {
  return encodeURIComponent(str); // Encode the encrypted string to safely include in URLs
};

// Slugify function to generate a valid URL slug
const slugify = (text) => text?.toString()?.trim().replace(/\s+/g, "-"); // Replace spaces with dashes

const Home = () => {
  // Use the `useQuery` hook at the top level
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts"], // Unique key for the query
    queryFn: fetchPosts, // Function to fetch data
    staleTime: 1000 * 60 * 50, // 5 minutes
  });

  const Users = posts
    ?.map((post) => ({
      profile_picture: post?.user?.profile_picture,
      username: post?.user?.username,
      id: post?.user?._id,
    }))
    .filter(
      (user) => user?.profile_picture !== null && user?.username !== null
    ); // Remove undefined/null entries if needed

  // Deduplicate based on profile_picture and username
  const uniqueValues = Array.from(
    new Map(Users?.map((user) => [user?.profile_picture, user])).values()
  );


  // Use the `useQuery` hook at the top level
  // const { data: users } = useQuery({
  //   queryKey: ["users"], // Unique key for the query
  //   queryFn: fetchUsers, // Function to fetch data
  //   staleTime: 1000 * 60 * 5, // 5 minutes
  // });

  // Error handling
  if (isLoading) return <div>Loading posts...</div>;
  if (isError) return <div>Error loading posts: {error.message}</div>;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to Blogify</h1>
        <p className="text-lg mb-8">
          Explore, learn, and stay updated with the latest articles!
        </p>
        <Link
          to="/blog"
          className="inline-block text-blue-600 px-6 py-3 rounded-full font-semibold shadow-md hover:bg-blue-100"
        >
          Read Latest Articles
        </Link>
      </section>

      {/* Featured Articles */}
      <section className="py-16 px-2 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Featured Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.slice(0, 3)?.map((post) => {
            // Securely hash the blog ID and encode it
            const blogHashedId = encrypt(post._id, "my-secret-key"); // Assuming `encrypt` is defined
            const encodedEncryptedBlogId = urlEncode(blogHashedId); // Proper URL encoding
            const postSlug = slugify(post.title); // Generate slug for the title

            return (
              <div
                key={post._id}
                className="card card-compact bg-base-100 w-full shadow-lg hover:shadow-xl transition-shadow"
              >
                <figure>
                  <img
                    src={
                      post.thumbnailUrl || "https://via.placeholder.com/400x200"
                    }
                    alt={post.title}
                    className="object-cover w-full h-48"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-lg font-semibold">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-600">{post.excerpt}</p>
                  <div className="card-actions justify-end">
                    <Link
                      to={`/blog/${postSlug}-${encodedEncryptedBlogId}`}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Blog Categories */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Browse Categories
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/category/technology" className="btn btn-neutral">
            Technology
          </Link>
          <Link to="/category/lifestyle" className="btn btn-neutral">
            Lifestyle
          </Link>
          <Link to="/category/health" className="btn btn-neutral">
            Health
          </Link>
          {/* Add more categories as needed */}
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-16 px-2 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Featured Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.map((post) => {
            // Securely hash the blog ID and encode it
            const blogHashedId = encrypt(post._id, "my-secret-key"); // Assuming `encrypt` is defined
            const encodedEncryptedBlogId = urlEncode(blogHashedId); // Proper URL encoding
            const postSlug = slugify(post.title); // Generate slug for the title

            return (
              <div
                key={post._id}
                className="card card-compact bg-base-100 w-full shadow-lg hover:shadow-xl transition-shadow"
              >
                <figure>
                  <img
                    src={
                      post.thumbnailUrl || "https://via.placeholder.com/400x200"
                    }
                    alt={post.title}
                    className="object-cover w-full h-48"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-lg font-semibold">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-600">{post.excerpt}</p>
                  <div className="card-actions justify-end">
                    <Link
                      to={`/blog/${postSlug}-${encodedEncryptedBlogId}`}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="mb-8">
          Subscribe to our newsletter for the latest articles directly to your
          inbox.
        </p>
        <div className="flex justify-center gap-2">
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered input-secondary w-full max-w-xs"
          />
          <button className="btn join-item rounded-r-full">Subscribe</button>
        </div>
      </section>

      <div className="flex justify-center mb-10">
        <div className="avatar-group -space-x-6 rtl:space-x-reverse">
          {uniqueValues?.slice(0, 4)?.map((data, index) => (
            <div key={data.id || index} className="avatar">
              <div className="w-12 sm:w-16 rounded-full  overflow-hidden">
                <img
                  src={
                    data.profile_picture || "https://via.placeholder.com/150"
                  }
                  alt={data.name || "User Avatar"}
                  className="object-cover"
                />
              </div>
            </div>
          ))}
          {/* Display the "+N" avatar */}
          {Users?.length >= 4 && (
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content w-12 sm:w-16 h-12 sm:h-16 rounded-full flex items-center justify-center">
                <span className="text-sm sm:text-md font-medium">
                  +{Users.length}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
