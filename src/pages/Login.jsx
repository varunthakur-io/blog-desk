import { useState } from 'react';
import { authService } from '../services/authService';

const Login = () => {
  // Initial form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // State for loading, error, and success messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
    setSuccess(false);

    try {
      await authService.loginUser(formData);
      setSuccess(true);
      setFormData({
        email: '',
        password: '',
      }); // Reset form
    } catch (err) {
      // Handle login error
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-md space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Log In</h2>

        {/* Input fields for email and password */}
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-150"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        {/* Display success or error messages */}
        {success && (
          <p className="text-sm text-green-500 text-center">
            Login successful!
          </p>
        )}
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
