import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthUserId } from '@/features/auth';
import { bookmarkService } from '../services/bookmark.service';
import {
  setBookmarks,
  setBookmarksStatus,
  setBookmarksError,
} from '../store';

/**
 * Hook to initialize bookmarks for the logged-in user.
 * Should be called once at the app/layout level.
 */
export const useBookmarksInit = () => {
  const dispatch = useDispatch();
  const authUserId = useSelector(selectAuthUserId);

  const fetchInitialBookmarks = useCallback(async () => {
    if (!authUserId) return;

    dispatch(setBookmarksStatus('loading'));
    try {
      const data = await bookmarkService.getBookmarkedPostsByUserId(authUserId);
      dispatch(setBookmarks(data));
    } catch (error) {
      dispatch(setBookmarksError(error.message));
    }
  }, [authUserId, dispatch]);

  useEffect(() => {
    if (authUserId) {
      fetchInitialBookmarks();
    }
  }, [authUserId, fetchInitialBookmarks]);

  return {
    fetchInitialBookmarks,
  };
};
