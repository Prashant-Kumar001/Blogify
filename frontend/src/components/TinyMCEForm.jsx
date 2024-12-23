import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";

const TinyMCEForm = () => {
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
      checkBoxForImg: false,
      checkBoxForImgUrl: false,
    },
  });

  const watchImage = watch("checkBoxForImg");
  const watchImgUrl = watch("checkBoxForImgUrl");

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    localStorage.setItem("editorContent", JSON.stringify(data));
    reset();
  };

  return (
    <div className="w-full mx-auto p-8 bg-gradient-to-br from-gray-50 to-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">Create a New Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 flex-col md:flex gap-5 w-full">
        <div className="flex-col gap-3 ">
          {/* Title Field */}
          <div className="flex-col">
            <label htmlFor="title" className="block text-lg font-medium text-gray-800 mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter the title"
              className={`block w-full rounded-lg border border-gray-300 p-3 text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none ${
                errors.title ? "border-red-500" : ""
              }`}
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 5,
                  message: "Title must be at least 5 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Title cannot exceed 100 characters",
                },
              })}
            />
            {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          {/* Image URL Field */}
          <div className="col-span-1">
            <label htmlFor="checkBoxForImgUrl" className="block text-lg font-medium text-gray-800 mb-2">
              Use Image URL
            </label>
            <input
              id="checkBoxForImgUrl"
              type="checkbox"
              className="mr-2"
              {...register("checkBoxForImgUrl")}
              disabled={watchImage}
            />

            <label htmlFor="imgUrlField" className="block text-lg font-medium text-gray-800 mb-2">
              Image URL
            </label>
            <input
              id="imgUrlField"
              type="text"
              placeholder="Enter the image URL"
              className={`block w-full rounded-lg border border-gray-300 p-3 text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none ${
                errors.imgUrl ? "border-red-500" : ""
              }`}
              {...register("imgUrl", {
                required: watchImgUrl && "Image URL is required",
              })}
              disabled={!watchImgUrl}
            />
            {errors.imgUrl && <p className="mt-2 text-sm text-red-600">{errors.imgUrl.message}</p>}
          </div>

          {/* Image Upload Field */}
          <div className="col-span-1">
            <label htmlFor="checkBoxForImg" className="block text-lg font-medium text-gray-800 mb-2">
              Upload Image
            </label>
            <input
              id="checkBoxForImg"
              type="checkbox"
              className="mr-2"
              {...register("checkBoxForImg")}
              disabled={watchImgUrl}
            />

            <label htmlFor="image" className="block text-lg font-medium text-gray-800 mb-2">
              Upload Image
            </label>
            <input
              id="image"
              type="file"
              className="block w-full rounded-lg border border-gray-300 p-3 text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              {...register("image", {
                required: watchImage && "Image is required",
              })}
              disabled={!watchImage}
            />
            {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image.message}</p>}
          </div>

          {/* Category Dropdown */}
          <div className="col-span-1">
            <label htmlFor="category" className="block text-lg font-medium text-gray-800 mb-2">
              Category
            </label>
            <select
              id="category"
              className="block w-full rounded-lg border border-gray-200 p-3 text-gray-800 focus:ring-2 focus:ring-black focus:outline-none"
              {...register("category", { required: "Category is required" })}
            >
              <option value="">Select Category</option>
              <option value="1">Category 1</option>
              <option value="2">Category 2</option>
              <option value="3">Category 3</option>
            </select>
            {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>}
          </div>
        </div>

        {/* Content Editor and Other Fields Layout */}
        <div className=" flex flex-col gap-3 text-center justify-center items-center space-x-6 w-full">
          <div className="w-full">
            <Controller
              name="content"
              control={control}
              rules={{ required: "Content is required" }}
              render={({ field }) => (
                <Editor
                  apiKey="jqxj13yjsahmec5481c5lyfm71uwts1rohvnrm11f9ni1y5q"
                  initialValue="<p>Write your content here...</p>"
                  init={{
                    height: 450,
                    width: "100%",
                    menubar: false,
                    plugins: [
                      "image",
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                  }}
                  onEditorChange={(content) => field.onChange(content)}
                />
              )}
            />
            {errors.content && <p className="mt-2 text-sm text-red-600">{errors.content.message}</p>}
          </div>

          <div className="">
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg mt-6 md:mt-0"
              >
                Submit Post
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TinyMCEForm;
