import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { IoCreateSharp } from "react-icons/io5";
import { useUserData } from "../context/UserData";
import RedirectLoader from "./RedirectLoader";

const Header = () => {
  const { userData, clearUserData } = useUserData(); // Access userData and logout function from context
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controls mobile menu visibility
  const [loading, isLoading] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen); // Toggle mobile menu
  // Logout Handler
  const handleLogout = () => {
    isLoading(true); // Show loading spinner
    setTimeout(() => {
      clearUserData(); // Clear user data from context
      localStorage.removeItem("token"); // Clear token from localStorage
      isLoading(false); // Hide loading spinner after 2 seconds
    }, 2000);
  };

  return (
    <header className="sticky top-0 z-50 p-4 bg_blur shadow-md">
      <nav className="flex items-center justify-between mx-auto">
        {/* Logo */}
        <div className="flex gap-6 items-center justify-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-700 f_montserrat">
              S<span className="text-xl text-gray-400 font-light">blogify</span>
            </h1>
          </div>
          {/* Profile Dropdown */}
          <div className="mt-2">
            <div className="hidden md:block">
              <div className="dropdown dropdown-hover">
                <div className="avatar">
                  <div className="ring-primary ring-offset-base-100 w-6 rounded-full ring ring-offset-2">
                    <img
                      src={
                        `${userData?.profile || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" }`}
                      alt="User Avatar"
                    />
                  </div>
                </div>
                <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                  <li>
                    <NavLink to={`/profile/${userData?.username}`}>Profile</NavLink>
                  </li>
                  <li>
                    <NavLink to="/account">Account</NavLink>
                  </li>
                  <li>
                    <NavLink to="/setting">Setting</NavLink>
                  </li>
                  {userData?.username && (
                    <li>
                      <span className="text-gray-700 font-semibold">
                        {userData?.username}
                      </span>
                    </li>
                  )}
                  {userData?.email && (
                    <li>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  )}
                  {userData?.role == "admin" && (
                    <li>
                      <span className="text-gray-200 font-semibold">
                        {userData?.role}
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex gap-6 text-lg">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:underline ${
                  isActive ? "font-semibold underline text-blue-600" : ""
                }`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `hover:underline ${
                  isActive ? "font-semibold underline text-blue-600" : ""
                }`
              }
            >
              Blog
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `hover:underline ${
                  isActive ? "font-semibold underline text-blue-600" : ""
                }`
              }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `hover:underline ${
                  isActive ? "font-semibold underline text-blue-600" : ""
                }`
              }
            >
              Contact
            </NavLink>
          </li>
        </ul>

        {/* Right Side (Search, Profile, Login/Logout) */}
        <div className="flex items-center justify-center gap-4">
          <NavLink to="/create-blog">
            <IoCreateSharp size={22} />
          </NavLink>
          {/* Search Input (Hidden on Mobile) */}
          <div className="hidden md:block w-60">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered rounded-3xl h-9 w-full px-3 py-1 "
            />
          </div>

          {/* Login/Signup */}
          {!userData.email ? (
            <>
              <button className="hidden md:block px-4 py-2 text-black font-medium rounded-3xl bg-gray-300 hover:bg-gray-400 transition">
                <NavLink to="/login">Login</NavLink>
              </button>
              <button className="hidden md:block px-4 py-2 text-gray-100 font-medium rounded-3xl bg-black hover:bg-gray-900 transition">
                <NavLink to="/register">Signup</NavLink>
              </button>
            </>
          ) : (
            <button
              className="hidden md:block px-4 py-2 text-red-600 font-medium rounded-3xl bg-gray-300 hover:bg-gray-400 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}

          {/* Hamburger Menu for Mobile */}
          <label
            className={`rounded-s-full h-6 w-6 swap swap-rotate md:hidden `}
          >
            <input type="checkbox" onClick={toggleMenu} />

            {/* Hamburger Icon */}
            <svg
              className="swap-off fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
            </svg>

            {/* Close Icon */}
            <svg
              className="swap-on fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
            </svg>
          </label>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col gap-4 p-4 bg-white shadow-lg">
          <NavLink
            to="/"
            onClick={toggleMenu}
            className={({ isActive }) =>
              `hover:underline ${
                isActive
                  ? "font-semibold underline text-blue-600"
                  : "text-gray-700"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/blog"
            onClick={toggleMenu}
            className={({ isActive }) =>
              `hover:underline ${
                isActive
                  ? "font-semibold underline text-blue-600"
                  : "text-gray-700"
              }`
            }
          >
            Blog
          </NavLink>
          <NavLink to="/profile" onClick={toggleMenu}>
            Profile
          </NavLink>
          {!userData.email ? (
            <NavLink
              to="/login"
              onClick={toggleMenu}
              className="text-gray-700 hover:underline"
            >
              Login
            </NavLink>
          ) : (
            <button
              className="text-red-600 hover:underline"
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
            >
              Logout
            </button>
          )}
        </div>
      )}
      {loading && <RedirectLoader />}
    </header>
  );
};

export default Header;
