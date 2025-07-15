import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../services/authService';
import { clearUser } from '../store/authSlice';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = !!user;
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile hamburger menu

  const handleLogout = async () => {
    try {
      await authService.deleteSession('current');
      dispatch(clearUser());
      navigate('/login');
      setIsProfileDropdownOpen(false); // Close dropdown
      setIsMobileMenuOpen(false); // Close mobile menu if open
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Dynamically applies Tailwind classes for navigation links based on active state (from your original code)
  const getNavLinkClasses = ({ isActive }) =>
    isActive
      ? 'text-lg font-medium transition-colors duration-200 text-blue-600 border-b-2 border-blue-600 pb-1'
      : 'text-lg font-medium transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:border-b-2 hover:border-gray-300 pb-1';

  // Define refined navigation items (functional update, retaining UI from original getNavLinkClasses)
  const navItems = [
    {
      name: 'Home',
      slug: '/',
      requiresAuth: false, // Accessible by anyone
    },
    {
      name: 'Dashboard', // New, more specific link
      slug: '/dashboard',
      requiresAuth: true, // Only for logged-in users
    },
    {
      name: 'Create Post', // Renamed for clarity
      slug: '/create',
      requiresAuth: true, // Only for logged-in users
    },
  ];

  // User-specific dropdown items remain the same
  const userDropdownItems = [
    {
      name: 'My Profile',
      slug: '/profile',
    },
    {
      name: 'Settings',
      slug: '/settings',
    },
  ];

  return (
    <header className="bg-white border-b border-gray-100">
      {' '}
      {/* Original header UI */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {' '}
        {/* Original container UI */}
        {/* Blog Logo/Brand Name */}
        <div className="flex-shrink-0">
          <NavLink
            to="/"
            className="text-2xl font-extrabold text-gray-900 hover:text-blue-600 transition-colors duration-200"
          >
            Blog Desk
          </NavLink>
        </div>
        {/* Primary Navigation Links (Desktop) */}
        {/* Note: In your original code, this <nav> was only rendered if isLoggedIn.
            Now it's always rendered, but items inside are conditional.
            The space-x-6 is from your original code. */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) =>
            // Render if no auth required OR if auth required AND user is logged in
            !item.requiresAuth || isLoggedIn ? (
              <NavLink
                key={item.name}
                to={item.slug}
                className={getNavLinkClasses} // Using your original class function
              >
                {item.name}
              </NavLink>
            ) : null
          )}
        </nav>
        {/* Authentication Button or User Profile Section (Desktop) */}
        <div className="hidden md:flex items-center">
          {' '}
          {/* Hidden for mobile, flex for desktop */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none rounded-full py-1 pr-2 pl-1 hover:bg-gray-100 transition-colors duration-200"
              >
                {/* User Avatar */}
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                    {' '}
                    {/* Original fallback avatar UI */}
                    {user?.name
                      ? user.name.charAt(0).toUpperCase()
                      : user?.email
                      ? user.email.charAt(0).toUpperCase()
                      : 'U'}
                  </div>
                )}
                {/* User Name/Email (visible on medium screens and up) */}
                <span className="text-gray-800 font-medium hidden md:block">
                  {user?.name || user?.email || 'User'}
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
                  {' '}
                  {/* Original dropdown UI */}
                  {userDropdownItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.slug}
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-150"
                    >
                      {item.name}
                    </NavLink>
                  ))}
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
            // Login button if not logged in (from your original code)
            <NavLink
              to="/login"
              className="px-5 py-2 rounded-lg text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              Login
            </NavLink>
          )}
        </div>
        {/* Mobile Menu Button (Hamburger) */}
        <div className="-mr-2 flex md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
          >
            <span className="sr-only">Open main menu</span>
            {/* Hamburger icon */}
            {!isMobileMenuOpen ? (
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              // Close icon
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) =>
              !item.requiresAuth || isLoggedIn ? (
                <NavLink
                  key={item.name}
                  to={item.slug}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                    ${isActive ? 'bg-blue-50 text-blue-600 font-bold' : ''}`
                  }
                >
                  {item.name}
                </NavLink>
              ) : null
            )}

            {/* Mobile Auth/User Links */}
            {isLoggedIn ? (
              <>
                {userDropdownItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.slug}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    {item.name}
                  </NavLink>
                ))}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left bg-red-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-red-700 transition-colors duration-200 mt-2"
                >
                  Logout
                </button>
              </>
            ) : (
              // Only Login button in mobile for logged out users, matching original desktop behavior
              <NavLink
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-left bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors duration-200 mt-2"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
