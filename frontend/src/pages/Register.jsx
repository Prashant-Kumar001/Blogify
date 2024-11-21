import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import axios from "axios";
import toast from 'react-hot-toast';
import Loader from "../components/Loader";  // Assuming you have a Loader component
import RedirectLoader from "../components/RedirectLoader";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false); // State to track loading
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Form validation
  const validate = () => {
    const errors = {};

    // Username validation
    if (!formData.username) errors.username = "Username is required";
    else if (formData.username.length < 3) errors.username = "Username must be at least 3 characters";

    // Email validation
    if (!formData.email) errors.email = "Email is required";
    else if (!validateEmail(formData.email)) errors.email = "Please enter a valid email address";

    // Password validation
    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 6) errors.password = "Password must be at least 6 characters";

    return errors;
  };

  // Helper function to validate the email format
  function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  const RegisterRequest = async (data) => {
    setLoading(true); // Show the loader when the request starts
    try {
      const response = await axios.post("http://localhost:8000/api/auth/register", data);
      if (response.status === 201) {
        setApiError('');
        toast.success("Registration successful");

        // Reset the form after success
        setFormData({
          username: "",
          email: "",
          password: ""
        });

        // Set a 2-second delay before redirecting to the login page
        setTimeout(() => {
          navigate("/login");
        }, 2000); // Redirect after 2 seconds
      }
    } catch (error) {
      setLoading(false); // Show the loader when
      setApiError(error.response?.data?.errors || 'An error occurred');
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      // Ensure the loader is hidden after 2 seconds even if an error occurs
      setTimeout(() => setLoading(false), 2000); // Hide loader after 2 seconds
    }
  }

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors('');
      if (!formData) {
        toast.error("Form is empty");
      }
      RegisterRequest(formData); // Submit the registration request
    }
  };

  return (
    <div className="flex card items-center justify-center min-h-screen shrink-0 shadow-2xl B_order">
      <div className="w-full max-w-md p-8 space-y-4 rounded-md shadow-lg B_order">
        <h2 className="text-2xl font-semibold text-center text-gray-200">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-gray-300">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 btn text-white bg-blue-600 rounded-md hover:bg-blue-700"
              disabled={loading} // Disable the button during loading
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
            <div>
              {apiError && <p className="text-red-500 text-sm mt-4 text-center">{apiError}</p>}
            </div>
          </div>
        </form>

        {/* Redirect to Login */}
        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <NavLink to="/login" className="text-blue-600 hover:underline">Login</NavLink>
        </p>

        {/* Show Loader when loading */}
        {loading && <RedirectLoader />}
      </div>
    </div>
  );
};

export default Register;
