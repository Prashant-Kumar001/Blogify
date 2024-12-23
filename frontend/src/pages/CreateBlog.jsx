import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserData } from "../context/UserData";

const CreateBlogPage = () => {
  const { userData } = useUserData();
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
      category: "",
      imgUrl: "",
      image: null,
      checkBoxForImg: false,
      checkBoxForImgUrl: false,
    },
  });

  const watchImage = watch("checkBoxForImg");
  const watchImgUrl = watch("checkBoxForImgUrl");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    } else {
      toast.error("You need to login!");
      navigate("/login");
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    if (!data.title || !data.content || (!data.imgUrl && !data.image) || !data.category) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const blogData = {
      title: data.title,
      description: data.content,
      thumbnailUrl: data.imgUrl || "",
      category: data.category,
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
        reset();
        navigate("/dashboard/blog");
      }
    } catch (error) {
      toast.error("Error creating blog post!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h2 className="text-3xl font-bold mb-6">Create a Blog Post</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-lg font-medium mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter blog title"
            className={`input input-bordered w-full ${errors.title ? "border-red-500" : ""}`}
            {...register("title", { required: "Title is required." })}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        {/* Content Editor */}
        <div>
          <label htmlFor="content" className="block text-lg font-medium mb-2">
            Content
          </label>
          <Controller
            name="content"
            control={control}
            rules={{ required: "Content is required." }}
            render={({ field }) => (
              <Editor
                apiKey="jqxj13yjsahmec5481c5lyfm71uwts1rohvnrm11f9ni1y5q"
                initialValue="<p>Write your content here...</p>"
                init={{
                  height: 450,
                  menubar: false,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | help",
                }}
                onEditorChange={(content) => field.onChange(content)}
              />
            )}
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
        </div>

        {/* Category Selector */}
        <div>
          <label htmlFor="category" className="block text-lg font-medium mb-2">
            Category
          </label>
          <select
            id="category"
            className={`select select-accent w-full ${errors.category ? "border-red-500" : ""}`}
            {...register("category", { required: "Category is required." })}
          >
            <option value="">Select a category</option>
            <option value="tech">Tech</option>
            <option value="health">Health</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="education">Education</option>
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>

        {/* Image Options */}
        <div>
          <label className="block text-lg font-medium mb-2">Image</label>
          <div className="flex items-center gap-4">
            <div>
              <input
                type="checkbox"
                id="checkBoxForImgUrl"
                className="mr-2"
                {...register("checkBoxForImgUrl")}
                disabled={watchImage}
              />
              <label htmlFor="checkBoxForImgUrl" className="mr-4">
                Use URL
              </label>
              <input
                type="text"
                placeholder="Enter image URL"
                className="input input-bordered w-full"
                {...register("imgUrl", { required: watchImgUrl && "Image URL is required." })}
                disabled={!watchImgUrl}
              />
            </div>
            <div>
              <input
                type="checkbox"
                id="checkBoxForImg"
                className="mr-2"
                {...register("checkBoxForImg")}
                disabled={watchImgUrl}
              />
              <label htmlFor="checkBoxForImg" className="mr-4">
                Upload File
              </label>
              <input
                type="file"
                className="file-input file-input-bordered w-full"
                {...register("image", { required: watchImage && "Image is required." })}
                disabled={!watchImage}
              />
            </div>
          </div>
          {errors.imgUrl && <p className="text-red-500 text-sm mt-1">{errors.imgUrl.message}</p>}
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
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
    </div>
  );
};

export default CreateBlogPage;
