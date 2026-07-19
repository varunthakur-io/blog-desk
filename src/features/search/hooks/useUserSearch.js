import { useState, useEffect, useCallback } from 'react';
import { profileService } from '@/features/profile';
import { useDebounce } from '@/hooks';

/**
 * Hook to manage global user search with debouncing.
 * Returns search state and handlers.
 */
export const useUserSearch = (debounceMs = 500) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  // 1. Define the actual search logic
  const performSearch = useCallback(async (term) => {
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
  }, []);

  // 2. Trigger search whenever searchTerm or debouncedSearchTerm changes
  useEffect(() => {
    // Immediate visual feedback: if input is cleared, clear results instantly
    if (!searchTerm.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true); // Show loading immediately for better UX
    performSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, searchTerm, performSearch]);

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
