import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import Skeleton from "../components/Skeleton";
import axios from "axios";
import toast from "react-hot-toast";
import { useUserData } from "../context/UserData";
import FollowUnfollowButton from "../components/FollowUnfollowButton";
import { useQuery } from "@tanstack/react-query";

const ProfilePage = () => {
  const { userData } = useUserData();
  const { userid } = useParams(); // Get the user ID from the URL params
  const [profile, setProfile] = useState(null); // Initialize as null for better checks
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);
  const [followUnfollowButton, setFollowUnfollowButton] = useState(false);
  const [newProfileData, setNewProfileData] = useState({
    username: "",
    bio: "",
    avatar: "",
  });

  // Determine if the user is viewing their own profile
  useEffect(() => {
    setCurrentUser(userid === userData?.username);
  }, [userid, userData]);

  // Fetch user profile data
  const getUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/auth/profile/${userid}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      console.log(response.data?.following);
      // const data = response?.data?.followers?.find((user) => {
      //   return user?.followee?._id == userData?.id;
      // });
      // console.log(data);
      console.log(response.data.following);
      setProfile(response.data);
    } catch (error) {
      toast.error("Failed to fetch profile data. Please try again.");
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    const response = await axios.get(
      `http://localhost:8000/api/auth/profile/${userid}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data; // Assume response contains `data`
  };

  // // Fetch Followers Data
  // const fetchFollowers = async (userid) => {
  //   const response = await axios.get(
  //     `http://localhost:8000/api/follow/getFollowers/${userid}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     }
  //   );
  //   return response.data; // Assume response contains followers array
  // };

  // Fetch Profile Data with React Query
  // const { data, isError, error, refetch } = useQuery({
  //   queryKey: ["userId"], // Query key
  //   queryFn: fetchUserProfile, // Fetch function
  //   refetchOnWindowFocus: true, // Automatically refetch when the user focuses back on the window
  //   staleTime: 1000 * 60 * 5, // 5 minutes
  //   cacheTime: 1000 * 60 * 5, // 5 minutes
  // });

  useEffect(() => {
    if (userid) {
      getUser();
    }
  }, [userid]);

  // Toggle editing mode
  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
    if (!isEditing && profile) {
      setNewProfileData({
        username: profile.data.username || "",
        bio: profile.data.profile_bio || "",
        avatar: profile.data.profile_picture || "",
      });
    }
  };

  // Handle input changes for the edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Update profile data
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !newProfileData.username ||
      !newProfileData.bio ||
      !newProfileData.avatar
    ) {
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
      getUser(); // Refresh the profile data
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error("Error updating profile:", error);
    }
  };

  const handleFollowToggle = async (followerId) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/follow`,
        { follower: followerId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setFollowUnfollowButton(!followUnfollowButton);
        getUser(); // Refresh profile data
      }
    } catch (error) {
      toast.error("Failed to update follow state.");
      console.error("Error updating follow state:", error);
    }
  };

  const getFollower = async (userid) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/follow/getFollowers/${userid}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const isTrue = res?.data?.followers?.find((user) => {
        return user?.followee?._id == userData?.id;
      });
      if (isTrue) {
        setFollowUnfollowButton(true);
      }
    } catch (error) {
      toast.error("Failed to update follow state.");
      console.error("Error updating follow state:", error);
    }
  };

  useEffect(() => {
    getFollower(userid);
  }, []);

  return (
    <div className="container mx-auto p-6">
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton />
        </div>
      ) : profile ? (
        <>
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
              <div className="mt-4 flex gap-4 text-gray-700">
                <div className="flex items-center">
                  <span className="font-semibold">
                    {profile?.data?.followers.length || 0}
                  </span>{" "}
                  Followers
                </div>
                <div className="flex items-center">
                  <span className="font-semibold">
                    {profile?.data?.following.length || 0}
                  </span>{" "}
                  Following
                </div>
              </div>

              {!currentUser && (
                <div className="mt-4">
                  <FollowUnfollowButton
                    handler={() => handleFollowToggle(profile.data._id)}
                    isFollowed={profile?.data?.isFollowed}
                    initialState={followUnfollowButton}
                  />
                </div>
              )}

              {currentUser && (
                <button
                  onClick={toggleEditMode}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              )}
            </div>
          </div>

          {currentUser && isEditing && (
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

          {currentUser && (
            <div className="mt-8 flex gap-3 justify-end">
              <NavLink
                to="/create-blog"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Create New Blog
              </NavLink>
              <NavLink
                to="/dashboard/blog"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Dashboard
              </NavLink>
            </div>
          )}
        </>
      ) : (
        <p>Profile not found. Please try again.</p>
      )}
    </div>
  );
};

export default ProfilePage;
