import React, { createContext, useContext, useState } from 'react';

// Create the context
const UserDataContext = createContext();

// Custom hook to use the UserDataContext
export const useUserData = () => useContext(UserDataContext);

// Context provider component
export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    email: '',
    username: '',
    role: ''
  });

  // Function to update user data
  const updateUserData = (newData) => {
    setUserData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };
  // Function to clear user data
  const clearUserData = () => {
    setUserData({
      email: '',
      username: '',
      role: ''
    });
  };

  return (
    <UserDataContext.Provider value={{ userData, updateUserData, clearUserData }}>
      {children}
    </UserDataContext.Provider>
  );
};
