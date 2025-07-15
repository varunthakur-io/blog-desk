const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-6 sm:px-10 font-sans ">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
          Settings
        </h1>

        {/* General Settings Section */}
        <div className="mb-10 pb-8 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">General</h2>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
            <label
              htmlFor="darkModeToggle"
              className="text-lg font-medium text-gray-700 cursor-pointer"
            >
              Dark Mode
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="darkModeToggle"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Language Selection */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
            <label
              htmlFor="languageSelect"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Language
            </label>
            <select
              id="languageSelect"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg bg-white appearance-none pr-8 transition-colors duration-200"
              defaultValue="en"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>

        {/* Notifications Section */}
        {/* <div className="mb-10 pb-8 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Notifications
          </h2> */}

        {/* Email Notifications Toggle */}
        {/* <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
            <label
              htmlFor="emailNotificationsToggle"
              className="text-lg font-medium text-gray-700 cursor-pointer"
            >
              Email Notifications
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="emailNotificationsToggle"
                className="sr-only peer"
                defaultChecked
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div> */}

        {/* Push Notifications Toggle */}
        {/* <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
            <label
              htmlFor="pushNotificationsToggle"
              className="text-lg font-medium text-gray-700 cursor-pointer"
            >
              Push Notifications
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="pushNotificationsToggle"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div> */}
        {/* </div> */}

        {/* Account & Security Section */}
        <div className="mb-10 pb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Account & Security
          </h2>

          {/* Two-Factor Authentication Status */}
          {/* <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
            <span className="text-lg font-medium text-gray-700">
              Two-Factor Authentication
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-red-600">
                Disabled
              </span>{' '}
              Placeholder status
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-blue-600 border border-blue-500 hover:bg-blue-50 transition-colors duration-200 font-semibold text-sm"
              >
                Enable
              </button>
            </div>
          </div> */}

          {/* Log Out from All Devices */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
            <button
              type="button"
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors duration-200 font-semibold text-lg shadow-md"
            >
              Log Out from All Devices
            </button>
            <p className="text-sm text-gray-500 mt-2 text-center">
              This will log you out of all active sessions across all your
              devices.
            </p>
          </div>

          {/* Delete Account */}
          <div className="p-4 bg-red-50 rounded-lg border border-red-200 shadow-sm">
            <h3 className="text-xl font-bold text-red-800 mb-3">
              Delete Account
            </h3>
            <p className="text-gray-700 mb-4 text-md">
              Permanently delete your account and all associated data. This
              action is irreversible.
            </p>
            <button
              type="button"
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold text-lg shadow-md"
            >
              Delete My Account
            </button>
          </div>
        </div>

        {/* Save/Cancel Buttons - Optional for settings pages with instant changes or per-section saves */}
        {/* If settings are applied instantly (like toggles), these might not be needed.
            If there's a form for multiple changes, then these are essential. */}
        {/*
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
          <button
            type="button"
            className="bg-gray-300 text-gray-800 px-6 py-3 rounded-xl shadow-md
                       hover:bg-gray-400 transition-colors duration-200 font-semibold text-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg
                       hover:from-blue-700 hover:to-indigo-800 transform hover:-translate-y-0.5
                       transition-all duration-300 ease-in-out font-semibold text-lg"
          >
            Save Settings
          </button>
        </div>
        */}
      </div>
    </div>
  );
};

export default Settings;
