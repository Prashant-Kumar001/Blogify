import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import Skeleton from "../components/Skeleton";
import axios from "axios";
import toast from "react-hot-toast";
import { useUserData } from "../context/UserData";
import { useQuery } from "@tanstack/react-query";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaRegPenToSquare } from "react-icons/fa6";
import { CiRead } from "react-icons/ci";
import parse from "html-react-parser";

const ProfilePage = () => {
  const { userData } = useUserData();
  const { userid } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [update, isUpdate] = useState(false);
  const [newProfileData, setNewProfileData] = useState({
    username: "",
    bio: "",
    avatar: "",
  });
  const [followUnfollowButton, setFollowUnfollowButton] = useState(false);

  const isCurrentUser = userid === userData?.username;

  // Fetch user profile data
  const fetchUserProfile = async () => {
    const response = await axios.get(
      `http://localhost:8000/api/auth/profile/${userid}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  };

  // React Query to manage profile data fetching
  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["profile", userid],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (err) => {
      toast.error(err.message || "Error loading profile");
    },
  });

  const deleteBlog = (id) => {
    console.log('blog id', id)
  }

  // Fetch follow status
  const fetchFollowStatus = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/follow/getFollowers/${userid}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const isFollowing = res?.data?.followers?.some(
        (user) => user?.followee?._id === userData?.id
      );
      setFollowUnfollowButton(isFollowing);
    } catch (error) {
      toast.error("Failed to check follow status.");
    }
  };

  // useEffect(() => {
  //   if (userid) {
  //     fetchFollowStatus();
  //   }
  // }, [userid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!newProfileData.username || !newProfileData.bio || !newProfileData.avatar) {
      toast.error("All fields are required.");
      return;
    }

    try {
      await axios.put(
        "http://localhost:8000/api/auth/update-profile",
        newProfileData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Profile updated successfully!");
      refetch();
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  const handleFollowToggle = async () => {
    try {
      const endpoint = followUnfollowButton
        ? `http://localhost:8000/api/unfollow`
        : `http://localhost:8000/api/follow`;
      const response = await axios.post(
        endpoint,
        { follower: userid },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setFollowUnfollowButton(!followUnfollowButton);
        refetch();
      }
    } catch (error) {
      toast.error("Failed to update follow state.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton />
      </div>
    );
  }

  if (isError || !profile) {
    return <p>Profile not found. Please try again.</p>;
  }

  const blogs = profile?.data?.Blogs || [];

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <img
            src={profile.data.profile_picture || "default-avatar.png"}
            alt={profile.data.username || "Avatar"}
            className="rounded-full w-32 h-32"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold">
            {profile.data.username || "Username"}
          </h1>
          <p className="mt-2">{profile.data.profile_bio || "Add a bio"}</p>

          {isCurrentUser && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          )}

          {/* {!isCurrentUser && (
            // <button
            //   onClick={handleFollowToggle}
            //   className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            // >
            //   {followUnfollowButton ? "Unfollow" : "Follow"}
            // </button>
          )} */}
        </div>
      </div>

      {isCurrentUser && isEditing && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <form onSubmit={handleProfileUpdate} className="mt-4 space-y-4">
            <div>
              <label htmlFor="username" className="block text-lg">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={newProfileData.username}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="bio" className="block text-lg">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={newProfileData.bio}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="avatar" className="block text-lg">
                Avatar URL
              </label>
              <input
                type="text"
                id="avatar"
                name="avatar"
                value={newProfileData.avatar}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {blogs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Blogs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogs.map((blog,) => (
              <BlogCard key={blog._id} blog={blog} refetch={refetch} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const BlogCard = ({ blog, refetch }) => {
  const [updateBlog, setIsUpdate] = useState(false);
  const [deleteBlog, setIsDelete] = useState(false);
  const [error, setError] = useState(false);


  const handlerDelete = (id) => {
    setIsDelete(true);
    axios
     .delete(`http://localhost:8000/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
     .then(() => {  
        setIsDelete(false);
        toast.success("Blog deleted successfully!");
        refetch();
      })
     .catch((err) => {
        setIsDelete(false);
        setError(true);
        toast.error("Failed to delete blog.");
      });

  }

  


  return (
    <div className="card bg-base-100 image-full w-96 shadow-xl">
      <figure>
        <img src={blog?.thumbnailUrl} alt="Blog Thumbnail" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{blog?.title.slice(0, 25)}...</h2>
        <div dangerouslySetInnerHTML={{ __html: parse(blog?.description.slice(0, 100)) }} />
        <div className="card-actions justify-end">
          <button className="btn btn-outline btn-info btn-sm border-t-cyan-200 "><CiRead size={20} /></button>
          <button className="btn-outline btn btn-warning btn-sm border-t-cyan-200  ">                                             
            {
              updateBlog && (
                <span className="loading loading-spinner"></span>
              )
            }
            <FaRegPenToSquare size={20} />
          </button>
          <button onClick={() => handlerDelete(blog._id)} className="btn btn-outline btn-error btn-sm border-t-cyan-200 "><MdOutlineDeleteOutline size={20} /></button>
          {
            deleteBlog && (
              <span className="loading loading-spinner"></span>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
