// src/components/Contact.js
import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 ">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-100 mb-4">Contact Us</h1>
      <p className="text-lg text-gray-100 text-center max-w-2xl mb-8">
        Have questions or want to get in touch? Fill out the form below, and we’ll get back to you as soon as possible.
      </p>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="  w-full max-w-lg space-y-6 B_order p-5 rounded-md">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-gray-200 mb-1">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-gray-600 mb-1">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Message Input */}
        <div>
          <label htmlFor="message" className="block text-gray-600 mb-1">Message</label>
          <textarea
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Send Message
        </button>

        {/* Submission Confirmation */}
        {submitted && (
          <p className="text-green-600 text-center mt-4">Thank you! Your message has been sent.</p>
        )}
      </form>
    </div>
  );
};

export default Contact;
