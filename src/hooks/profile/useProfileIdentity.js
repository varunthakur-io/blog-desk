import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { profileService } from '@/services/profile';
import { selectAuthUserId } from '@/store/auth';
import { selectProfileById, setUserProfile } from '@/store/profile';

/**
 * Hook to handle profile identification and core data fetching.
 */
export const useProfileIdentity = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const authUserId = useSelector(selectAuthUserId);

  const [profileId, setProfileId] = useState(null);
  const [usernameFetchStatus, setUsernameFetchStatus] = useState('idle');
  const [usernameFetchError, setUsernameFetchError] = useState('');

  // Fetch from normalized store if already available
  const profile = useSelector((state) => selectProfileById(state, profileId));
  const isOwner = authUserId && profileId === authUserId;

  // 1. Resolve username to profileId
  useEffect(() => {
    // If no username in URL, try to use the logged-in user's ID
    if (!username) {
      if (authUserId) {
        setProfileId(authUserId);
        setUsernameFetchStatus('success');
      } else {
        // Not logged in and no username — wait or fail
        setUsernameFetchStatus('idle');
      }
      return;
    }

    let cancelled = false;
    const fetchId = async () => {
      setUsernameFetchStatus('loading');
      try {
        const found = await profileService.getProfileByUsername(username);
        if (!cancelled) {
          if (found) {
            setProfileId(found.$id);
            dispatch(setUserProfile(found));
            setUsernameFetchStatus('success');
          } else {
            setUsernameFetchError('User not found.');
            setUsernameFetchStatus('error');
          }
        }
      } catch (err) {
        if (!cancelled) {
          setUsernameFetchError(err?.message || 'Failed to fetch user.');
          setUsernameFetchStatus('error');
        }
      }
    };

    fetchId();
    return () => {
      cancelled = true;
    };
  }, [username, dispatch]);

  return {
    profileId,
    profile,
    isOwner,
    usernameFetchStatus,
    usernameFetchError,
    authUserId,
  };
};
