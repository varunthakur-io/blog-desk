import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../services/authService';
import { clearUser } from '../store/authSlice';
import useDarkMode from '../hooks/useDarkMode';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // isDarkMode is the current state, setDarkMode is the function to update it
  const [isDarkMode, setDarkMode] = useDarkMode();

  const isLoggedIn = !!user;
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to actually toggle dark mode
  const handleToggleDarkMode = () => {
    setDarkMode(!isDarkMode); // Toggle the state
  };

  const handleLogout = async () => {
    try {
      await authService.deleteSession('current');
      dispatch(clearUser());
      navigate('/login');
      setIsProfileDropdownOpen(false);
      setIsMobileMenuOpen(false);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const getNavLinkClasses = ({ isActive }) =>
    isActive
      ? 'text-lg font-medium transition-colors duration-200 text-blue-600 border-b-2 border-blue-600 pb-1 dark:text-blue-400 dark:border-blue-400'
      : 'text-lg font-medium transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:border-b-2 hover:border-gray-300 pb-1 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:border-gray-600';

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
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between it~ems-center">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-extrabold text-gray-900 hover:text-blue-600 transition-colors duration-200 dark:text-gray-100 dark:hover:text-blue-400"
        >
          Blog Desk
        </NavLink>

        {/* Navigation */}
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

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
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
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v1.5m0 15V21m9-9h-1.5M4.5 12H3m15.364-6.364l-1.06 1.06M6.696 17.303l-1.06 1.06m12.728 0l-1.06-1.06M6.696 6.696l-1.06-1.06M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z"
                />
              </svg>
            ) : (
              // 🌙 Moon icon — light mode is ON
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0112.75 21c-5.385 0-9.75-4.365-9.75-9.75 0-4.126 2.635-7.626 6.348-9.066a.75.75 0 01.908.46c.236.62.387 1.279.444 1.964a7.5 7.5 0 0010.003 10.003c.685.057 1.344.208 1.964.444a.75.75 0 01.46.908z"
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

        {/* Mobile Menu Button (Hamburger) */}
        <div className="-mr-2 flex md:hidden">
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
          {/* Dark Mode Toggle for Mobile */}
          <button
            onClick={handleToggleDarkMode} // Call the new toggle function
            className="ml-2 p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              // Sun icon for dark mode (to switch to light)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.106a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.06l1.591-1.59ZM21.75 12h-2.25a.75.75 0 0 0 0 1.5h2.25a.75.75 0 0 0 0-1.5ZM17.106 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.59a.75.75 0 0 0-1.061 1.06l1.59 1.59ZM12 18.75a.75.75 0 0 1-.75.75v2.25a.75.75 0 0 1 1.5 0v-2.25a.75.75 0 0 1-.75-.75ZM5.003 16.893a.75.75 0 0 0-.707.038l-1.591 1.59a.75.75 0 0 0 1.06 1.06l1.591-1.59a.75.75 0 0 0-.353-1.098ZM3 12.75a.75.75 0 0 0 0-1.5H.75a.75.75 0 0 0 0 1.5H3ZM6.106 5.003a.75.75 0 0 0 1.06-1.06l-1.59-1.59a.75.75 0 1 0-1.061 1.06l1.59 1.59Z" />
              </svg>
            ) : (
              // Moon icon for light mode (to switch to dark)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9c.252 0 .498-.009.746-.027a.75.75 0 0 1 .819.162.75.75 0 0 0 .804-.076 9 9 0 0 1-.494 10.154 9 9 0 0 1-13.687-8.636 9 9 0 0 1 8.636-13.687.75.75 0 0 0-.076-.804Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      )
    </header>
  );
};

export default Navbar;
