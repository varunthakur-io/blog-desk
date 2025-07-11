import { useState } from 'react';
import { authService } from '../lib/appwrite';

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
      // Create user using Appwrite auth service
      await authService.createUser(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', password: '' }); // Reset form
    } catch (err) {
      // Handle signup error
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Center the form on screen
    <div className="min-h-screen flex items-center justify-center bg-gray-800 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-md space-y-4"
      >
        {/* Form heading */}
        <h2 className="text-xl font-semibold text-center">Create Account</h2>

        {/* Name input */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        {/* Email input */}
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        {/* Password input */}
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-150"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Sign Up'}
        </button>

        {/* Error message */}
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        {/* Success message */}
        {success && (
          <p className="text-sm text-green-600 text-center">
            Signup successful!
          </p>
        )}
      </form>
    </div>
  );
};

export default Signup;
