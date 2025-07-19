import { useDispatch } from 'react-redux';
import useDarkMode from '../hooks/useDarkMode';
import { authService } from '../services/authService';
import { clearUser } from '../store/authSlice';
import { useNavigate } from 'react-router';

const Settings = () => {
  const [isDarkMode, setDarkMode] = useDarkMode();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function to actually toggle dark mode
  const handleToggleDarkMode = () => {
    setDarkMode(!isDarkMode);
  };

  // Function to handle delete sessions
  const handleDeleteSessions = async () => {
    try {
      if (window.confirm('Areyou sure you want to log out from all devices?')) {
        await authService.deleteAllSessions();
        dispatch(clearUser());
        navigate('/login');
      }
    } catch (err) {
      console.error('Error deleting sessions:', err);
      alert('Failed to delete sessions. Please try again later.');
    }
  };

  // Function to handle delete account
  const handleDeleteAccount = async () => {
    try {
      if (
        window.confirm(
          'Are you sure you want to delete your account? This action cannot be undone.'
        )
      ) {
        await authService.deleteAccount();
        dispatch(clearUser());
        navigate('/login');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-6 sm:px-10 font-sans dark:bg-gray-950 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center dark:text-gray-100">
          Settings
        </h1>

        <div className="mb-10 pb-8 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 dark:text-gray-200">
            General
          </h2>

          <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-700 dark:shadow-none">
            <label
              htmlFor="darkModeToggle"
              className="text-lg font-medium text-gray-700 cursor-pointer dark:text-gray-300"
            >
              Dark Mode
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="darkModeToggle"
                className="sr-only peer"
                checked={isDarkMode}
                onChange={handleToggleDarkMode}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-700 dark:shadow-none">
            <label
              htmlFor="languageSelect"
              className="block text-lg font-medium text-gray-700 mb-2 dark:text-gray-300"
            >
              Language
            </label>
            <select
              id="languageSelect"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg bg-white appearance-none pr-8 transition-colors duration-200 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
              defaultValue="en"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>

        <div className="mb-10 pb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 dark:text-gray-200">
            Account & Security
          </h2>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-700 dark:shadow-none">
            <button
              type="button"
              onClick={handleDeleteSessions}
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors duration-200 font-semibold text-lg shadow-md cursor-pointer"
            >
              Log Out from All Devices
            </button>
            <p className="text-sm text-gray-500 mt-2 text-center dark:text-gray-400">
              This will log you out of all active sessions across all your
              devices.
            </p>
          </div>

          <div className="p-4 bg-red-50 rounded-lg border border-red-200 shadow-sm dark:bg-red-900 dark:border-red-700">
            <h3 className="text-xl font-bold text-red-800 mb-3 dark:text-white">
              Delete Account
            </h3>
            <p className="text-gray-700 mb-4 text-md dark:text-gray-300">
              Permanently delete your account and all associated data. This
              action is irreversible.
            </p>
            <button
              type="button"
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold text-lg shadow-md cursor-pointer"
              onClick={handleDeleteAccount}
            >
              Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
