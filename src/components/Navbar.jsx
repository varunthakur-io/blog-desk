import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { clearUser } from '../store/authSlice';
import { useState } from 'react';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = !!user;
  // State to control the visibility of the user profile dropdown
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.deleteSession('current');
      dispatch(clearUser());
      navigate('/login');
      setIsProfileDropdownOpen(false); // Close dropdown after logout
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Dynamically applies Tailwind classes for navigation links based on active state
  const getNavLinkClasses = ({ isActive }) =>
    isActive
      ? 'text-lg font-medium transition-colors duration-200 text-blue-600 border-b-2 border-blue-600 pb-1'
      : 'text-lg font-medium transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:border-b-2 hover:border-gray-300 pb-1';

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Blog Logo/Brand Name */}
        <NavLink
          to="/"
          className="text-2xl font-extrabold text-gray-900 hover:text-blue-600 transition-colors duration-200"
        >
          Blog Desk
        </NavLink>

        {/* Primary Navigation Links (only visible if logged in) */}
        <nav className="flex items-center space-x-6">
          {isLoggedIn && (
            <>
              <NavLink to="/" className={getNavLinkClasses}>
                Home
              </NavLink>
              <NavLink to="/dashboard" className={getNavLinkClasses}>
                Dashboard
              </NavLink>
              <NavLink to="/create" className={getNavLinkClasses}>
                New Post
              </NavLink>
            </>
          )}
        </nav>

        {/* Authentication Button or User Profile Section */}
        {isLoggedIn ? (
          <div className="relative">
            {' '}
            {/* 'relative' positioning is crucial for the dropdown */}
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none rounded-full py-1 pr-2 pl-1 hover:bg-gray-100 transition-colors duration-200"
            >
              {/* User Avatar: Displays profile picture or a fallback initial */}
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                  {/* Fallback to first initial of name or email */}
                  {user.name
                    ? user.name.charAt(0).toUpperCase()
                    : user.email
                    ? user.email.charAt(0).toUpperCase()
                    : 'U'}
                </div>
              )}
              {/* User Name/Email (visible on medium screens and up) */}
              <span className="text-gray-800 font-medium hidden md:block">
                {user.name || user.email}
              </span>
              {/* Dropdown Arrow Icon, rotates when dropdown is open */}
              <svg
                className={`ml-1 w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  isProfileDropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            {/* Profile Dropdown Content, conditionally rendered */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-20 border border-gray-100 animate-fade-in-down">
                <NavLink
                  to="/profile"
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-150"
                >
                  My Profile
                </NavLink>
                <NavLink
                  to="/settings"
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-150"
                >
                  Account Settings
                </NavLink>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // Login button if not logged in
          <NavLink
            to="/login"
            className="px-5 py-2 rounded-lg text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
          >
            Login
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Navbar;
