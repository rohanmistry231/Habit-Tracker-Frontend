import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import "./Navbar.css";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Tracks current path
  const menuRef = useRef(null); // Ref for the mobile menu container
  const menuToggleRef = useRef(null); // Ref for the hamburger/cross button

  const openMenu = () => setIsOpen(true); // Open the menu
  const closeMenu = () => setIsOpen(false); // Close the menu
  const isDarkMode = theme === "dark";

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return isActive
      ? "text-orange-500" // Active link style
      : `${
          isDarkMode ? "text-gray-300" : "text-gray-800"
        } hover:text-orange-500`;
  };

  // Close menu if click is outside the menu or the toggle button
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the menu and the toggle button
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuToggleRef.current &&
        !menuToggleRef.current.contains(event.target)
      ) {
        closeMenu(); // Close the menu if clicked outside
      }
    };

    // Add event listener for clicks outside the menu and toggle button
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } shadow-md fixed w-full top-0 z-50`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className={`${
                isDarkMode ? "text-orange-400" : "text-orange-600"
              } text-3xl font-bold`}
            >
              Habit Tracker
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link
              to="/"
              className={`transition duration-150 ${getLinkClass("/")}`}
            >
              Home
            </Link>
            <Link
              to="/habits"
              className={`transition duration-150 ${getLinkClass("/habits")}`}
            >
              Habits
            </Link>
            <Link
              to="/profile"
              className={`transition duration-150 ${getLinkClass("/profile")}`}
            >
              Profile
            </Link>
            <button
              onClick={toggleTheme}
              className={`px-3 py-1.5 rounded-lg shadow-md border focus:outline-none transition duration-300 ${
                isDarkMode
                  ? "bg-gray-900 text-white border-gray-700"
                  : "bg-gray-100 text-gray-800 border-gray-300"
              }`}
              style={{ width: "100px" }}
            >
              {isDarkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              ref={menuToggleRef} // Attach the ref to the toggle button
              onClick={isOpen ? closeMenu : openMenu} // Toggle the menu
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-800"
              } focus:outline-none`}
            >
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef} // Attach the ref to the mobile menu container
        className={`md:hidden ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } shadow-lg space-y-4 px-6 pt-4 pb-6 transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        } fixed top-14 right-0 h-screen w-64 overflow-y-auto z-40`}
      >
        {["/", "/habits", "/profile"].map((path) => (
          <Link
            key={path}
            to={path}
            className={`block ${getLinkClass(path)} text-lg py-2`}
            onClick={closeMenu} // Close menu when a link is clicked
          >
            {path === "/"
              ? "Home"
              : path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
