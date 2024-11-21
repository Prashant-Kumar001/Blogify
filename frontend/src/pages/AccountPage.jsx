import React, { useState, useEffect } from 'react';

const AccountPage = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newUserData, setNewUserData] = useState({
        name: '',
        email: '',
        avatar: '',
    });

    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [notifications, setNotifications] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false);

    // Simulate an API call to get user data
    useEffect(() => {
        const fetchedUserData = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            avatar: 'https://i.pravatar.cc/150?img=5',
            notificationsEnabled: true,
        };

        setUser(fetchedUserData);
        setNewUserData(fetchedUserData);
        setNotifications(fetchedUserData.notificationsEnabled);
    }, []);

    // Handle changes to user input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle password change
    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        alert('Password updated successfully!');
        setPassword(newPassword);
    };

    // Toggle notifications setting
    const toggleNotifications = () => {
        setNotifications((prev) => !prev);
    };

    // Handle deleting the account
    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            alert('Account deleted');
            setIsDeleting(true);
            setIsDeleteConfirmed(true);
        }
    };

    // Handle updating user data
    const handleUpdateProfile = (e) => {
        e.preventDefault();
        setUser({ ...user, ...newUserData });
        setIsEditing(false);
    };

    // Cancel profile editing
    const handleCancelProfileEdit = () => {
        setNewUserData(user);
        setIsEditing(false);
    };

    // Cancel password change
    
    // Cancel account deletion
   

    if (!user) {
        return <div>Loading...</div>; // Display loading state while fetching user data
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-semibold text-center">User Account</h1>
            <div className="mt-6 flex flex-col md:flex-row items-center gap-6">
                <div className="md:w-1/4">
                    <img src={user.avatar} alt="Avatar" className="w-32 h-32 rounded-full mx-auto md:mx-0" />
                    {isEditing && (
                        <input
                            type="file"
                            className="mt-2 border block mx-auto md:mx-0"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setNewUserData((prev) => ({
                                        ...prev,
                                        avatar: URL.createObjectURL(file),
                                    }));
                                }
                            }}
                        />
                    )}
                </div>

                <div className="flex flex-col gap-4 md:w-2/3">
                    <div className="flex gap-4">
                        <div className="w-full">
                            <h2 className="font-semibold">Name</h2>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={newUserData.name}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded mt-2 w-full"
                                />
                            ) : (
                                <p>{user.name}</p>
                            )}
                        </div>

                        <div className="w-full">
                            <h2 className="font-semibold">Email</h2>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={newUserData.email}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded mt-2 w-full"
                                />
                            ) : (
                                <p>{user.email}</p>
                            )}
                        </div>
                    </div>

                    {isEditing ? (
                        <div className="flex gap-4 mt-4">
                            <button
                                className="px-6 py-2 bg-green-500 text-white rounded w-full md:w-auto"
                                onClick={handleUpdateProfile}
                            >
                                Save Changes
                            </button>
                            <button
                                className="px-6 py-2 bg-gray-500 text-white rounded w-full md:w-auto"
                                onClick={handleCancelProfileEdit}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded w-full md:w-auto"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* Change Password Section */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="current-password" className="block text-lg">Current Password</label>
                        <input
                            type="password"
                            id="current-password"
                            value={password}
                            disabled
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label htmlFor="new-password" className="block text-lg">New Password</label>
                        <input
                            type="password"
                            id="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirm-password" className="block text-lg">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded w-full md:w-auto">
                            Change Password
                        </button>
                    </div>
                </form>
            </div>

            {/* Notifications Settings */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold">Notification Settings</h2>
                <div className="flex items-center gap-4 mt-4">
                    <label className="text-lg">Enable Notifications</label>
                    <input
                        type="checkbox"
                        checked={notifications}
                        onChange={toggleNotifications}
                        className="toggle"
                    />
                </div>
            </div>

            {/* Delete Account Section */}
            <div className="mt-8">
                <button
                    className="px-6 py-2 bg-red-500 text-white rounded w-full md:w-auto"
                    onClick={handleDeleteAccount}
                >
                    Delete Account
                </button>
                {isDeleteConfirmed && <p className="mt-4 text-red-600">Your account has been deleted.</p>}
            </div>


        </div>
    );
};

export default AccountPage;
