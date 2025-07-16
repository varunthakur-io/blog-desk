import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/authSlice';
import { authService } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get the current user from your Redux state
  const currentUser = useSelector((state) => state.auth.user);

  // Redirect if user is logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.loginUser(formData);
      const account = await authService.getAccount();
      dispatch(setUser(account)); // Set user in Redux state
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      console.error('Login Error:', err); // Log error for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-6 sm:px-10
                    dark:bg-gray-950 dark:from-gray-900 dark:to-gray-950"> {/* Dark mode background */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100
                      dark:bg-gray-800 dark:border-gray-700"> {/* Dark mode card background and border */}
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center
                       dark:text-gray-100"> {/* Dark mode heading text */}
          Log In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="text-red-500 text-center text-sm mb-4 dark:text-red-400">{error}</p> 
          )}

          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-colors duration-200
                         bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400" 
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-colors duration-200
                         bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400" 
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl shadow-lg
                       hover:from-blue-700 hover:to-indigo-800 transform hover:-translate-y-0.5
                       transition-all duration-300 ease-in-out font-semibold text-lg
                       disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
          <p className="text-md text-center text-gray-700 mt-4 dark:text-gray-300"> {/* Dark mode text */}
            {' '}
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-blue-600 font-semibold hover:underline hover:text-blue-700 transition-colors duration-200
                         dark:text-blue-400 dark:hover:text-blue-300" 
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;