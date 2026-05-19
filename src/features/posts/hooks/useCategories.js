import { useState, useEffect } from 'react';
import { postService } from '../services/post.service';

/**
 * Hook to dynamically fetch active categories (those with published posts).
 */
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchCats = async () => {
      setIsLoading(true);
      const data = await postService.getUsedCategories();
      if (!cancelled) {
        setCategories(data);
        setIsLoading(false);
      }
    };
    fetchCats();
    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, isLoading };
};
