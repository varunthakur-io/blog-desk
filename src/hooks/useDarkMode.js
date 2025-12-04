import { useEffect, useState } from 'react';

/**
 * Custom hook to manage dark mode preference using LocalStorage and Tailwind CSS.
 *
 * It persists the preference in 'localStorage' under the key 'theme'.
 * It also toggles the 'dark' class on the document root element.
 *
 * @returns {[boolean, Function]} [darkMode, setDarkMode]
 */
const useDarkMode = () => {
  // Initialize state based on localStorage value
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('theme') === 'dark';
    } catch (error) {
      // Fallback for environments where localStorage is inaccessible
      console.warn('useDarkMode :: localStorage access failed', error);
      return false;
    }
  });

  // Effect to apply the theme class and save to localStorage
  useEffect(() => {
    const root = window.document.documentElement;

    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return [darkMode, setDarkMode];
};

export default useDarkMode;