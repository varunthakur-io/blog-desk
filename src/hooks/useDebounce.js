import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a fast-changing value (like search inputs).
 * Supports instant resetting when the value is cleared.
 * @param {*} value - The input value to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {*} The debounced value.
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  // Adjust state instantly during render if value is cleared (e.g. search reset)
  if (!value && debouncedValue !== '') {
    setDebouncedValue('');
  }

  useEffect(() => {
    if (!value) return;

    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
