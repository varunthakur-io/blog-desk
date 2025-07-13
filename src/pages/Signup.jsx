import { useState } from 'react';
import { authService } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';

const Signup = () => {
  // Initial form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // State for loading, error, and success messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true);
    setError('');

    try {
      // Create user using Appwrite auth service
      await authService.createUser(formData);

      // After successful creation, log the user in to create a session
      await authService.loginUser({
        email: formData.email,
        password: formData.password,
      });

      // Get the current user's account data
      const account = await authService.getAccount();

      // Set user in Redux state
      dispatch(setUser(account));

      // Navigate to the homepage on successful login
      navigate('/');
    } catch (err) {
      // Handle signup error
      setError(err.message || 'Signup failed. Please try again.');
      console.error('Signup Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Center the form on screen with updated background gradient and padding
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-6 sm:px-10">
      <div
        // Form card with updated styling
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
      >
        {/* Form heading */}
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name input */}
          <div>
            <label htmlFor="name" className="sr-only">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-colors duration-200"
              required
              disabled={loading}
            />
          </div>

          {/* Email input */}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-colors duration-200"
              required
              disabled={loading}
            />
          </div>

          {/* Password input */}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-colors duration-200"
              required
              disabled={loading}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl shadow-lg
                       hover:from-blue-700 hover:to-indigo-800 transform hover:-translate-y-0.5
                       transition-all duration-300 ease-in-out font-semibold text-lg
                       disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>

          <p className="text-md text-center text-gray-700 mt-4">
            Have an account ?{' '}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline hover:text-blue-700 transition-colors duration-200"
            >
              Login
            </Link>
          </p>

          {/* Error message */}
          {error && (
            <p className="text-red-500 text-center text-sm mb-4">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
