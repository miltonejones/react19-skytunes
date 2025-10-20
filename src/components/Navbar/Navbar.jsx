// NavBar.jsx

import React, { useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Drawer from "../Drawer/Drawer";
import Logo from "../Logo/Logo";

function NavBar() {
  const [searchValue, setSearchValue] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  // Define your navigation links
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Library", path: "/library" },
    { name: "Artists", path: "/artist" },
    { name: "Albums", path: "/album" },
    { name: "Genres", path: "/genre" },
    { name: "Playlists", path: "/playlist" },
  ];

  // Check if a link is active
  const isActiveLink = (path) => {
    // For the dashboard, exact match
    if (path === "/") {
      return location.pathname === "/";
    }
    // For other routes, check if current path starts with the item path
    return location.pathname.startsWith(path);
  };

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  // Search handler with debounce
  const handleSearch = useCallback(
    debounce((value) => {
      if (value.trim()) {
        navigate(`/search/${encodeURIComponent(value)}`);
      }
    }, 300),
    [navigate]
  );

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    handleSearch(value);
  };

  return (
    <>
      <nav className="bg-gray-600 p-3 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            onClick={handleDrawerToggle}
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M4 18L20 18"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
              ></path>
              <path
                d="M4 12L20 12"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
              ></path>
              <path
                d="M4 6L20 6"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
              ></path>
            </g>
          </svg>

          {/* Logo or App Name */}
          <div className="text-white text-xl font-bold flex align-middle">
            <Logo className="logo-dt" />
            <Link to="/">Skytunes</Link>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-md mx-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-600 transition duration-150 ease-in-out"
            />
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-4 mobile-off">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${
                  isActiveLink(item.path)
                    ? "bg-gray-900 text-white font-bold"
                    : "text-gray-300"
                } hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <Logo className="logo-dt phone" />
        </div>
      </nav>

      <Drawer
        title="Navigation"
        drawerOpen={drawerOpen}
        onDrawerToggle={handleDrawerToggle}
      >
        <ul class="list-none p-0 border border-gray-300 rounded-lg max-w-sm mx-auto shadow-md">
          {navItems.map((item) => (
            <li
              key={item.path}
              className={`p-1 bg-white text-gray-800 hover:bg-gray-100 cursor-pointer first:rounded-t-lg last:border-b-0 last:rounded-b-lg ${
                isActiveLink(item.path) ? "font-bold bg-gray-200" : ""
              }`}
            >
              <Link to={item.path} onClick={handleDrawerToggle}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </Drawer>
    </>
  );
}

export default NavBar;
