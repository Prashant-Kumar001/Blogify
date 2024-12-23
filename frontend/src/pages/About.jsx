// src/components/About.js
import React from "react";

const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
      {/* Heading */}
      <h1 className="text-4xl font-bold  mb-4">
        About Us
      </h1>

      {/* Introduction Text */}
      <p className="text-lg  text-center max-w-3xl leading-relaxed mb-8">
        Welcome to <strong>Blogify</strong>! We are a dedicated team passionate about delivering quality content
        to our readers. Our mission is to inform, inspire, and connect people through engaging and insightful blog posts on
        various topics. From technology trends to lifestyle tips, our platform provides something for everyone.
      </p>

      {/* Our Values Section */}
      <div className="text-center max-w-2xl">
        <h2 className="text-2xl font-semibold  mb-3">Our Values</h2>
        <ul className="space-y-2 ">
          <li>✔️ Integrity and honesty in our content</li>
          <li>✔️ Commitment to community and reader engagement</li>
          <li>✔️ Consistency in delivering high-quality posts</li>
          <li>✔️ Respect for diverse opinions and backgrounds</li>
        </ul>
      </div>

      {/* Call to Action */}
      <div className="mt-10">
        <p className=" text-center">
          Ready to explore? Head over to our <a href="/blog" className="text-blue-600 font-medium hover:underline">Blog</a> and start reading!
        </p>
      </div>
    </div>
  );
};

export default About;
