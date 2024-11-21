import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RedirectLoader from "../components/RedirectLoader";

const BlogLayout = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  ];

  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/blogs/users/blogs"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const result = await response.json();

        if (result.success) {
          setBlogs(result.data.blogs);
        } else {
          throw new Error(result.message || "Error fetching blogs");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div > <RedirectLoader /></div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Blog List */}
      <div className="lg:col-span-2 space-y-8">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="flex items-start gap-4 p-4 border-gray-200"
          >
            <div className="flex-1 ">
              <div className="flex gap-2 items-center ">
                <div className="avatar">
                  <div className="w-7 rounded-full">
                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                  </div>
                </div>
                <p className="text-sm f_robota text-gray-200">
                  {blog.user.username} @{" "}
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
              <h2 className="text-lg font-semibold text-gray-200">
                {
                  <Link to={`/dashboard/blog/${blog._id}`} className="hover:underline">
                    {blog.title}
                  </Link>
                }
              </h2>
              <p className="text-sm text-gray-100 f_montserrat">
                {truncateText(blog.description, 150)}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-xs font-medium text-gray-200 px-2 py-1 border border-gray-300 rounded-full">
                  {blog.category || "General"}
                </span>
                <span className="text-xs text-gray-500 flex items-center">
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
        ))}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Interests Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-200">
            Stories from all interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {interests.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm border border-gray-300 rounded-full text-gray-100"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Trending Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-100">Trending</h3>
          <ul className="space-y-2">
            {trending.map((trend, index) => (
              <li
                key={index}
                className="flex items-center text-sm text-gray-200"
              >
                <span className="font-bold text-gray-100 mr-2">
                  {trend.rank}
                </span>
                {trend.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BlogLayout;
