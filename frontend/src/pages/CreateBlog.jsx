import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RedirectLoader from "../components/RedirectLoader";
import { useUserData } from "../context/UserData";

const CreateBlogPage = () => {
  const { userData } = useUserData();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isUrl, setIsUrl] = useState(true); // Default to URL input
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [openCustomCategory, setOpenCustomCategory] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    image: "",
    category: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    } else {
      toast.error("You need to login!");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {
      title: !title ? "Title is required." : "",
      description: !description ? "Description is required." : "",
      image: !imageUrl && !imageFile ? "Image (URL or File) is required." : "",
      category: !category && !customCategory ? "Category is required." : "",
    };

    setErrors(validationErrors);

    if (Object.values(validationErrors).some((error) => error)) {
      return; // Prevent submission if there are validation errors
    }

    const blogData = {
      title,
      description,
      thumbnailUrl: imageUrl || "",
      category: category || customCategory,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/blogs",
        blogData,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.status === 201) {
        toast.success("Blog post created successfully!");
        // Reset form
        setTitle("");
        setDescription("");
        setImageUrl("");
        setImageFile(null);
        setCategory("");
        setCustomCategory("");
        setErrors({});

        // Redirect to the blog page
        navigate("/dashboard/blog");
      }
    } catch (error) {
      toast.error("Error creating blog post!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(""); // Clear URL if a file is selected
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setOpenCustomCategory(true);
      setCategory("");
    } else {
      setOpenCustomCategory(false);
      setCategory(value);
      setCustomCategory("");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Create a Blog Post</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-lg mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
            className="input input-bordered w-full"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="description" className="block text-lg mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter blog description"
            className="textarea textarea-bordered f_poppins w-full"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm  mt-1">{errors.description}</p>
          )}
        </div>

        {/* Category Selector */}
        <div>
          <label htmlFor="category" className="block text-lg mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={handleCategoryChange}
            className="select select-accent w-full"
          >
            <option value="">Select a category</option>
            <option value="tech">Tech</option>
            <option value="health">Health</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="education">Education</option>
            <option value="custom">Custom</option>
          </select>
          {openCustomCategory && (
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter custom category"
              className="input input-bordered w-full mt-2"
            />
          )}
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        {/* Image Input */}
        <div>
          <label className="block text-lg mb-2">Image</label>
          <div className="flex gap-4 items-center">
            <div>
              <input
                type="radio"
                id="urlOption"
                name="imageOption"
                checked={isUrl}
                onChange={() => setIsUrl(true)}
              />
              <label htmlFor="urlOption" className="mr-4 w-full">
                Use URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="input input-bordered w-full"
                disabled={!isUrl}
              />
            </div>
            <div>
              <input
                type="radio"
                id="fileOption"
                name="imageOption"
                checked={!isUrl}
                onChange={() => setIsUrl(false)}
              />
              <label htmlFor="fileOption" className="mr-4 w-full">
                Upload File
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full"
                disabled={isUrl}
              />
            </div>
          </div>
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Creating Blog..." : "Create Blog"}
        </button>
      </form>

      {loading && <RedirectLoader />}
    </div>
  );
};

export default CreateBlogPage;
