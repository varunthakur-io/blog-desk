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
  const navLinkStyle = ({ isActive }) =>
    isActive
      ? 'text-blue-600 font-semibold'
      : 'text-gray-700 hover:text-blue-600';

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="text-xl font-bold text-blue-600">
          Blog Desk
        </NavLink>

        {/* Navigation Links */}
        <nav className="space-x-4">
          {isLoggedIn && (
            <>
              <NavLink to="/" className={navLinkStyle}>
                Home
              </NavLink>
              <NavLink to="/dashboard" className={navLinkStyle}>
                Dashboard
              </NavLink>
              <NavLink to="/create" className={navLinkStyle}>
                New Post
              </NavLink>
            </>
          )}
        </nav>

        {/* Auth Button */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <NavLink
            to="/login"
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Login
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Navbar;
