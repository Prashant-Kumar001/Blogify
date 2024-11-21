// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen  ">
      {/* Hero Section */}
      <section className="relative  text-white py-20 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to Blogify</h1>
        <p className="text-lg mb-8">
          Explore, learn, and stay updated with the latest articles!
        </p>
        <Link
          to="/blog"
          className="inline-block  text-blue-600 px-6 py-3 rounded-full font-semibold shadow-md hover:bg-blue-100"
        >
          Read Latest Articles
        </Link>
      </section>

      {/* Featured Articles */}
      <section className="py-16 px-2 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Featured Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-8">
          <div className="card card-compact bg-base-100 w-96  shadow-lg hover:shadow-xl transition-shadow">
            <figure>
              <img
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="car!"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">Life hack</h2>
              <p>How to park your car at your garage?</p>
              <div className="card-actions justify-end">
                <Link
                  to="/blog/post-id"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Categories */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Browse Categories
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/category/technology"
            className=" btn btn-neutral"
          >
            Technology
          </Link>
          <Link
            to="/category/lifestyle"
            className=" btn btn-neutral "
          >
            Lifestyle
          </Link>
          <Link
            to="/category/health"
            className=" btn btn-neutral "
          >
            Health
          </Link>
          {/* Add more categories as needed */}
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Latest Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Example post card */}
          <div className=" rounded-lg  overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <img
              src="https://via.placeholder.com/400x200"
              alt="Post Image"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-xl">Why Mindfulness Matters</h3>
              <p className=" text-sm my-2">
                An introduction to mindfulness and how it can improve your daily
                life.
              </p>
              <Link
                to="/blog/post-id"
                className="text-blue-600 font-semibold hover:underline"
              >
                Read More →
              </Link>
            </div>
          </div>
          {/* Repeat for other posts */}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className=" text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="mb-8">
          Subscribe to our newsletter for the latest articles directly to your
          inbox.
        </p>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered input-secondary w-full max-w-xs" />
        <button className="btn join-item rounded-r-full">Subscribe</button>
      </section>

      <div className="flex justify-center mb-10">
        <div className="avatar-group -space-x-6 rtl:space-x-reverse">
          <div className="avatar">
            <div className="w-12">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <div className="avatar">
            <div className="w-12">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <div className="avatar">
            <div className="w-12">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content w-12">
              <span>+99</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
