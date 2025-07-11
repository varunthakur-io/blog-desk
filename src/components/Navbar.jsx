import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
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

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          Blog Desk
        </Link>

        {/* Navigation Links */}
        <nav className="space-x-4">
          {isLoggedIn && (
            <>
              <Link to="/" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-600"
              >
                Dashboard
              </Link>
              <Link to="/create" className="text-gray-700 hover:text-blue-600">
                New Post
              </Link>
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
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
