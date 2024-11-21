// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../components/Loader";
import RedirectLoader from "../components/RedirectLoader";
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, isLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Form validation
  const validate = () => {
    const errors = {};
    if (!formData.password) errors.password = "Password is required";
    if (!formData.email) errors.email = "Email is required";
    else if (!validateEmail(formData.email))
      errors.email = "Please enter a valid email address";
    return errors;
  };

  function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // Handle login request
  const loginRequest = async (data) => {
    isLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        data
      );
      if (response.status === 200) {
        setApiError("");
        setErrors({});
        toast.success("Login successful");
        console.log(response.data);
        localStorage.setItem("token", response.data.data.token);
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    } catch (error) {
      setErrors({});
      console.log(error);
      setApiError(error?.response?.data?.message || "An error occurred");
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setTimeout(() => {
        isLoading(false);
      }, 2000);
    }
  };
  // Handle form submit with animation
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      loginRequest(formData);
      setFormData({ email: "", password: "" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md p-8  rounded-md shadow-lg  duration-300 B_order">
        <h2 className="text-3xl font-bold text-center text-gray-300 mb-6 animate-fadeInDown">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 animate-fadeInUp">
          {/* Email Input */}
          <div className="animate-fadeIn delay-75">
            <label htmlFor="email" className="block text-gray-200">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="animate-fadeIn delay-150">
            <label htmlFor="password" className="block text-gray-200">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300"
            >
              Login
            </button>
            <div>
              {apiError && (
                <div className="text-red-500 text-sm mt-5 text-center">
                  {apiError}
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Redirect to Signup */}
        <p className="text-center text-gray-200 mt-4">
          Don't have an account?{" "}
          <NavLink to="/register" className="text-blue-600 hover:underline">
            Sign Up
          </NavLink>
        </p>
        {loading && <RedirectLoader />}
      </div>
    </div>
  );
};

export default Login;
