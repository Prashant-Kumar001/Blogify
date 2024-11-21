import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

// Mock data for the profile (you can replace this with actual API calls)
const mockProfileData = {
    username: 'john_doe',
    bio: 'A passionate blogger and tech enthusiast.',
    avatar: 'https://i.pravatar.cc/150?img=3', // Placeholder avatar
    blogs: [
        { id: 1, title: 'My First Blog Post', description: 'This is a description of my first blog post.' },
        { id: 2, title: 'Another Interesting Post', description: 'Here is another post I wrote about technology.' },
    ],
    followers: 125,
    following: 50,
    likes: 230,
};

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newProfileData, setNewProfileData] = useState({
        username: '',
        bio: '',
        avatar: '',
    });

    const [newBlogData, setNewBlogData] = useState({
        title: '',
        description: '',
    });

    // Simulating an API call
    useEffect(() => {
        // Here you would fetch real data from an API, but for now, we use mock data
        setProfile(mockProfileData);
    }, []);

    // Function to toggle edit mode
    const toggleEditMode = () => {
        setIsEditing((prev) => !prev);
        setNewProfileData({
            username: profile?.username || '',
            bio: profile?.bio || '',
            avatar: profile?.avatar || '',
        });
    };

    // Handle the form submission for updating profile
    const handleProfileUpdate = (e) => {
        e.preventDefault();
        setProfile({ ...profile, ...newProfileData });
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle the form submission for creating a new blog post
    const handleBlogCreate = (e) => {
        e.preventDefault();
        const newBlog = { ...newBlogData, id: profile.blogs.length + 1 };
        setProfile({ ...profile, blogs: [...profile.blogs, newBlog] });
        setIsCreatingBlog(false);
        setNewBlogData({ title: '', description: '' });
    };

    const handleBlogInputChange = (e) => {
        const { name, value } = e.target;
        setNewBlogData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    if (!profile) {
        return <div>Loading...</div>; // Show loading state while profile data is being fetched
    }

    return (
        <div className="container mx-auto p-6">
            {/* Profile Section */}
            <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                    <img src={profile.avatar} alt="Profile" className="rounded-full w-32 h-32" />
                </div>

                {/* Profile Info */}
                <div>
                    <h1 className="text-3xl font-bold">{profile.username}</h1>
                    <p className="text-gray-600 mt-2">{profile.bio}</p>

                    {/* Follow, Following, and Likes */}
                    <div className="mt-4 flex gap-4 text-gray-700">
                        <div className="flex items-center">
                            <span className="font-semibold">{profile.followers}</span> Followers
                        </div>
                        <div className="flex items-center">
                            <span className="font-semibold">{profile.following}</span> Following
                        </div>
                        <div className="flex items-center">
                            <span className="font-semibold">{profile.likes}</span> Likes
                        </div>
                    </div>

                    {/* Edit Profile Button */}
                    <button
                        onClick={toggleEditMode}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>
            </div>

            {/* Edit Profile Form */}
            {isEditing && (
                <div className="mt-6">
                    <h2 className="text-2xl font-bold">Edit Profile</h2>
                    <form onSubmit={handleProfileUpdate} className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-lg">Username</label>
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
                            <label htmlFor="bio" className="block text-lg">Bio</label>
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
                            <label htmlFor="avatar" className="block text-lg">Avatar URL</label>
                            <input
                                type="text"
                                id="avatar"
                                name="avatar"
                                value={newProfileData.avatar}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                placeholder="Enter avatar image URL"
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

            {/* Create Blog Button */}
            <div className="mt-8 flex gap-3 justify-end">
                <NavLink to="/create-blog" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                    Create New Blog
                </NavLink>
                <NavLink to="/dashboard/blog" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                    Dashboard
                </NavLink>
            </div>

            {/* Blogs Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold">My Blogs</h2>
                <div className="space-y-6 mt-4">
                    {profile.blogs.map((blog) => (
                        <div key={blog.id} className="border p-4 rounded-lg">
                            <h3 className="text-xl font-semibold">{blog.title}</h3>
                            <p className="text-gray-600 mt-2">{blog.description}</p>
                            <button className="mt-2 text-blue-500">Read More</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
