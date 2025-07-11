import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  // Dummy login check — replace with actual auth state
  const isLoggedIn = true;

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
            onClick={() => {
              // You can add logout logic here
              navigate('/login');
            }}
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
