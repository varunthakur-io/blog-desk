import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { clearUser } from '../store/authSlice';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = !!user;

  const handleLogout = async () => {
    try {
      await authService.deleteSession('current');
      dispatch(clearUser());
      navigate('/login'); // Redirect after logout
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Utility function for nav link styling
  const getNavLinkClasses = ({ isActive }) =>
    isActive
      ? 'text-lg font-medium transition-colors duration-200 text-blue-600 border-b-2 border-blue-600 pb-1'
      : 'text-lg font-medium transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:border-b-2 hover:border-gray-300 pb-1';

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-extrabold text-gray-900 hover:text-blue-600 transition-colors duration-200"
        >
          Blog Desk
        </NavLink>

        {/* Navigation Links */}
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

        {/* Auth Button */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-lg text-lg font-semibold bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg transition-all duration-200"
          >
            Logout
          </button>
        ) : (
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
