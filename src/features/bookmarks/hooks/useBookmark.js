import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthUserId } from '@/features/auth';
import { bookmarkService } from '../services/bookmark.service';
import { addBookmark, removeBookmark, selectIsPostBookmarked } from '../store';
import toast from 'react-hot-toast';

/**
 * Hook to manage bookmark state for a single post.
 * Handles optimistic updates and server communication.
 */
export const useBookmark = (post) => {
  const dispatch = useDispatch();
  const userId = useSelector(selectAuthUserId);
  const isBookmarked = useSelector((state) => selectIsPostBookmarked(state, post.$id));
  const [isLoading, setIsLoading] = useState(false);

  const toggleBookmark = useCallback(async () => {
    if (!userId) {
      toast.error('Please login to bookmark posts');
      return;
    }

    setIsLoading(true);

    // Optimistic Update
    if (isBookmarked) {
      dispatch(removeBookmark(post.$id));
    } else {
      dispatch(addBookmark(post));
    }

    try {
      const result = await bookmarkService.toggleBookmark(userId, post.$id);

      // Sync with server if result is different (rare race condition)
      if (result !== !isBookmarked) {
        if (result) {
          dispatch(addBookmark(post));
        } else {
          dispatch(removeBookmark(post.$id));
        }
      }

      toast.success(result ? 'Added to bookmarks' : 'Removed from bookmarks', {
        icon: result ? '🔖' : '🗑️',
      });
    } catch (error) {
      // Revert optimistic update on error
      if (isBookmarked) {
        dispatch(addBookmark(post));
      } else {
        dispatch(removeBookmark(post.$id));
      }
      toast.error(error.message || 'Failed to update bookmark');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, userId, isBookmarked, post]);

  return {
    isBookmarked,
    isLoading,
    toggleBookmark,
  };
};
