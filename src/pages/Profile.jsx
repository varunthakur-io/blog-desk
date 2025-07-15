import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { authService } from '../services/authService';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  // Populate formData with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await authService.updateName(formData.name);
    } catch (err) {
      // Handle update  error
      setError(err.message || 'Update failed. Please try again.');
      console.error('Update Error:', err);
    } finally {
      setIsEditing(false);
    }
  };

  if (!user) {
    return <div className="text-center py-20 text-lg">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-6 sm:px-10 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
          Your Profile
        </h1>

        {/* Profile Header & Avatar Section */}
        <div className="flex flex-col items-center mb-10 pb-8 border-b border-gray-100">
          <div className="w-28 h-28 rounded-full bg-blue-500 flex items-center justify-center text-white text-5xl font-bold mb-4 shadow-md">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h2>
          <p className="text-lg text-gray-600">{user.email}</p>

          {!isEditing && (
            <button
              type="button"
              onClick={handleEdit}
              className="mt-6 px-5 py-2 rounded-lg text-blue-600 border border-blue-500 hover:bg-blue-50 transition-colors duration-200 font-semibold"
            >
              Edit Profile
            </button>
          )}
        </div>

        <form onSubmit={handleSave}>
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-lg font-semibold text-gray-700 mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-colors duration-200"
              placeholder="Your Full Name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-lg font-semibold text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-lg transition-colors duration-200"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          {/* <div className="mb-8 pt-6 border-t border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Password Security
            </h3>
            <button
              type="button"
              className="px-6 py-3 rounded-xl shadow-md bg-gray-300 text-gray-800 hover:bg-gray-400 transition-colors duration-200 font-semibold text-lg"
            >
              Change Password
            </button>
          </div> */}

          {isEditing && (
            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-xl shadow-md hover:bg-gray-400 transition-colors duration-200 font-semibold text-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-800 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out font-semibold text-lg"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
