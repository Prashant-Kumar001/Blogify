import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Use useNavigate for programmatic navigation
import axios from "axios";
import RedirectLoader from "../components/RedirectLoader";
import { useUserData } from "../context/UserData";
const CreateBlogPage = () => {
  const { userData } = useUserData();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isUrl, setIsUrl] = useState(false); // To toggle between image URL input and file input
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(false); // State to track loading
  const navigate = useNavigate(); // For programmatic navigation to login page
  

  useEffect(() => {
    // Check if the user is logged in by retrieving the token
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token); // Store the token in state if it exists
    } else {
      // Show an error toast and redirect to the login page if no token
      toast.error("You need to login!");
      navigate("/login"); // Redirect to login page
    }
  }, [navigate]); // Adding navigate to dependencies for the hook to work properly


  // Validation states
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    image: "",
  });

  const handleSubmit = async (e) => {

    if(!userData.username){
      alert("login first! ")
     }

    e.preventDefault();

    
    // Validation
    const newErrors = {
      title: "",
      description: "",
      image: "",
    };

    if (!title) {
      newErrors.title = "Title is required.";
    }

    if (!description) {
      newErrors.description = "Description is required.";
    }

    if (!imageUrl && !imageFile) {
      newErrors.image = "Image (URL or File) is required.";
    }

    setErrors(newErrors);

    if (newErrors.title || newErrors.description || newErrors.image) {
      return; // Prevent form submission if there are validation errors
    }

    const Data = {
      title,
      description,
      thumbnailUrl: imageUrl || 'not add', // Use imageUrl instead of thumbnailUrl
      thumbnailFile: imageFile || 'not add' // Use imageFile instead of thumbnailFile
    };


    MakeBlogReq(Data, authToken);
  };

  const MakeBlogReq = async (data, token) => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/api/blogs", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if(response.status === 201) {
        toast.success("Blog post created successfully!");
        // Reset form after successful submission
        setTitle("");
        setDescription("");
        setImageUrl("");
        setImageFile(null);
        setErrors({});
      }
    } catch (error) {
      toast.error("Error creating blog post!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(""); // Clear image URL if a file is selected
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Create a Blog Post</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title input */}
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2 text-lg">
            Title
          </label>
          <input
          disabled={userData.username ? false : true}
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
            className="input input-bordered w-full"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-2">{errors.title}</p>
          )}
        </div>

        {/* Description input */}
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2 text-lg">
            Description
          </label>
          <textarea
          disabled={userData.username ? false : true}
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter blog description"
            className="textarea f_robota textarea-bordered w-full"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-2">{errors.description}</p>
          )}
        </div>

        {/* Image URL or Image File input */}
        <div className="mb-4">
          <label className="block mb-2 text-lg">Image</label>

          <div className="flex gap-4">
            {/* Image URL Option */}
            <div>
              <input
              disabled={userData.username ? false : true}
                type="radio"
                id="imageUrl"
                name="imageSource"
                checked={!isUrl}
                onChange={() => setIsUrl(false)}
                className="mr-2"
              />
              <label htmlFor="imageUrl" className="mr-4">
                Image URL
              </label>
              <input
                type="text"
                id="imageUrlInput"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="input input-bordered w-full"
                disabled={isUrl}
              />
            </div>

            {/* Image File Upload Option */}
            <div>
              <input
              disabled={userData.username ? false : true}
                type="radio"
                id="imageFile"
                name="imageSource"
                checked={isUrl}
                onChange={() => setIsUrl(true)}
                className="mr-2"
              />
              <label htmlFor="imageFile" className="mr-4">
                Upload Image
              </label>
              <input
                type="file"
                id="imageFileInput"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full"
                disabled={!isUrl}
              />
            </div>
          </div>
          {errors.image && (
            <p className="text-red-500 text-sm mt-2">{errors.image}</p>
          )}
        </div>

        {/* Submit Button */}
        <button disabled={loading} type="submit" className="btn btn-primary w-full py-2">
          {
            loading ? "Creating Blog..." : "Create Blog"
          }
        </button>
      </form>
      {
        loading && (
          <div className="mt-8">
            <RedirectLoader />
          </div>
        )
      }
    </div>
  );
};

export default CreateBlogPage;
