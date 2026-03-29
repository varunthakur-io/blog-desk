import { useState, useEffect, useCallback } from 'react';
import { profileService } from '@/features/profile';
import { debounce } from '@/lib/utils';

/**
 * Hook to manage global user search with debouncing.
 * Returns search state and handlers.
 */
export const useUserSearch = (debounceMs = 500) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Define the actual search logic
  const performSearch = async (term) => {
    const cleanTerm = term?.trim();

    // Don't search for empty or very short strings to save API calls
    if (!cleanTerm || cleanTerm.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await profileService.searchProfiles(cleanTerm);
      setResults(data);
    } catch (err) {
      console.error('User Search Error:', err);
      setError(err.message || 'Failed to find users');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Memoize the debounced version so it doesn't get recreated on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((term) => performSearch(term), debounceMs),
    [debounceMs],
  );

  // 3. Trigger search whenever searchTerm changes
  useEffect(() => {
    // Immediate visual feedback: if input is cleared, clear results instantly
    if (!searchTerm.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true); // Show loading immediately for better UX
    debouncedSearch(searchTerm);

    // Cleanup if component unmounts
    return () => {
      if (debouncedSearch.cancel) debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setResults([]);
    setError(null);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    results,
    isLoading,
    error,
    clearSearch,
  };
};
