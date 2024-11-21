import axios from "axios";

// Create an axios instance with a base URL
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", // Base URL for your backend API
});

// Helper function to check if the user is logged in
const fetchIsLogin = async (token) => {
  try {
    const response = await axiosInstance.post(`/api/auth/isLogin/${token}`);
    return response.data; // Return the data part of the response
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      // Server responded with a status other than 2xx
      return { success: false, message: "Server error. Please try again later." };
    } else if (error.request) {
      // Request was made but no response received
      return { success: false, message: "Network error. Please check your connection." };
    } else {
      // Other errors (e.g., request setup issues)
      return { success: false, message: "Something went wrong. Please try again." };
    }
  }
};


// Function to add a user blog post
const AddUserBlog = async (token, data) => {
  try {
    const response = await axiosInstance.post(`/api/blogs`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response; // Return the full response
  } catch (error) {
    // Handle errors similar to fetchIsLogin
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("Server Error: ", error.response);
      return { success: false, message: "Server error. Please try again later." };
    } else if (error.request) {
      // No response from the server
      console.error("Network Error: ", error.request);
      return { success: false, message: "Network error. Please check your connection." };
    } else {
      // Other errors
      console.error("Error: ", error.message);
      return { success: false, message: "Something went wrong. Please try again." };
    }
  }
};

export { fetchIsLogin, AddUserBlog };
