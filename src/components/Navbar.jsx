import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../services/authService';
import { clearUser } from '../store/authSlice';
import useDarkMode from '../hooks/useDarkMode';
import { setSearchTerm } from '../store/postSlice';

const Navbar = () => {
  const { user, status } = useSelector((state) => state.auth);
  const { searchTerm } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Custom hook to manage dark mode state
  const [isDarkMode, setDarkMode] = useDarkMode();

  const isLoggedIn = status;
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to actually toggle dark mode
  const handleToggleDarkMode = () => {
    setDarkMode(!isDarkMode); // Toggle the state
  };

  const handleLogout = async () => {
    try {
      await authService.logout();

      // Clear the user data from the store
      dispatch(clearUser());
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err.message);
      alert('You are already logged out or session expired.');
    }
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const getNavLinkClasses = ({ isActive }) =>
    isActive
      ? 'text-lg font-medium transition-colors duration-200 text-blue-600 border-b-2 border-blue-600 pb-1 dark:text-blue-400 dark:border-blue-400'
      : 'text-lg font-medium transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:border-b-2 hover:border-gray-300 pb-1 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:border-gray-600';

  // Classes for mobile navigation links
  const getMobileNavLinkClasses = ({ isActive }) =>
    isActive
      ? 'block px-3 py-2 rounded-md text-base font-medium text-blue-600 bg-gray-50 dark:bg-gray-700 dark:text-blue-400'
      : 'block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100';

  const navItems = [
    { name: 'Home', slug: '/', requiresAuth: false },
    { name: 'Dashboard', slug: '/dashboard', requiresAuth: true },
    { name: 'Create Post', slug: '/create', requiresAuth: true },
  ];

  const userDropdownItems = [
    { name: 'My Profile', slug: '/profile' },
    { name: 'Settings', slug: '/settings' },
  ];

  return (
    <header className="bg-white border-b border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-extrabold text-gray-900 hover:text-blue-600 transition-colors duration-200 dark:text-gray-100 dark:hover:text-blue-400"
        >
          Blog Desk
        </NavLink>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map(
            (item) =>
              (!item.requiresAuth || isLoggedIn) && (
                <NavLink
                  key={item.name}
                  to={item.slug}
                  className={getNavLinkClasses}
                >
                  {item.name}
                </NavLink>
              )
          )}
        </nav>

        {/* Right Section - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="search"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full md:w-56 px-4 py-2 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-blue-500"
            />
          </div>
          {/* Dark Mode Toggle */}
          <button
            onClick={handleToggleDarkMode} // Call the new toggle function
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              // 🌞 Sun icon — dark mode is ON
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6" // Changed class to className for React
              >
                <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
              </svg>
            ) : (
              // 🌙 Moon icon — light mode is ON
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6" // Changed class to className for React
              >
                <path
                  fillRule="evenodd" // Changed fill-rule to fillRule for React
                  d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
                  clipRule="evenodd" // Changed clip-rule to clipRule for React
                />
              </svg>
            )}
          </button>

          {/* Auth Section */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none rounded-full py-1 pr-2 pl-1 hover:bg-gray-100 transition-colors duration-200 dark:hover:bg-gray-700"
              >
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold dark:bg-blue-700 dark:text-gray-100">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-800 font-medium hidden md:block dark:text-gray-200">
                  {user?.name || user?.email || 'User'}
                </span>
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
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-20 border border-gray-100 animate-fade-in-down dark:bg-gray-700 dark:border-gray-600">
                  {userDropdownItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.slug}
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-150 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-blue-400"
                    >
                      {item.name}
                    </NavLink>
                  ))}
                  <div className="border-t border-gray-100 my-1 dark:border-gray-600"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 dark:text-red-400 dark:hover:bg-red-900 dark:hover:text-red-300"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/login"
              className="px-5 py-2 rounded-lg text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Login
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button (Hamburger) and Dark Mode Toggle for Mobile */}
        <div className="-mr-2 flex items-center md:hidden">
          {' '}
          {/* Added items-center for alignment */}
          {/* Dark Mode Toggle for Mobile */}
          <button
            onClick={handleToggleDarkMode}
            className="ml-2 p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              // Sun icon for dark mode (to switch to light)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6" // Changed class to className
              >
                <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
              </svg>
            ) : (
              // Moon icon for light mode (to switch to dark)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6" // Changed class to className
              >
                <path
                  fillRule="evenodd" // Changed fill-rule to fillRule
                  d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
                  clipRule="evenodd" // Changed clip-rule to clipRule
                />
              </svg>
            )}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700 dark:focus:ring-blue-400"
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
          >
            <span className="sr-only">Open main menu</span>
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
        <div
          className="md:hidden pb-4 pt-2 animate-fade-in-down"
          id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map(
              (item) =>
                (!item.requiresAuth || isLoggedIn) && (
                  <NavLink
                    key={item.name}
                    to={item.slug}
                    onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                    className={getMobileNavLinkClasses}
                  >
                    {item.name}
                  </NavLink>
                )
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-100 dark:border-gray-700">
            {isLoggedIn ? (
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-lg dark:bg-blue-700 dark:text-gray-100">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-5">
                <NavLink
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                  className="block w-full text-center px-4 py-2 rounded-md text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all duration-200 dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Login
                </NavLink>
              </div>
            )}
            {isLoggedIn && (
              <div className="mt-3 px-2 space-y-1">
                {userDropdownItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.slug}
                    onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                  >
                    {item.name}
                  </NavLink>
                ))}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900 dark:hover:text-red-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
