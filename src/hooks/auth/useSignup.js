import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { debounce } from '@/lib/utils';
import { authService } from '@/services/auth';
import { profileService } from '@/services/profile';
import { setAuthUserId } from '@/store/auth';
import { upsertProfile } from '@/store/profile';

/**
 * Pure validation logic for Signup
 */
const validate = (data) => {
  const errors = {};
  if (!data.name?.trim()) errors.name = 'Full name is required';

  if (!data.username?.trim()) {
    errors.username = 'Username is required';
  } else if (data.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
    errors.username =
      'Username can only contain letters, numbers, and underscores';
  }

  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  return errors;
};

export const useSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    username: '',
  });

  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'error'
  const [formErrors, setFormErrors] = useState({});
  const [usernameStatus, setUsernameStatus] = useState('idle'); // 'idle' | 'checking' | 'available' | 'taken'

  /**
   * Async username availability check
   */
  const checkUsernameAvailability = async (username) => {
    if (!username || username.length < 3) return;

    setUsernameStatus('checking');
    try {
      const isAvailable = await profileService.isUsernameAvailable(username);
      setUsernameStatus(isAvailable ? 'available' : 'taken');

      if (!isAvailable) {
        setFormErrors((prev) => ({
          ...prev,
          username: 'Username is already taken',
        }));
      }
    } catch (err) {
      console.error('Username check failed:', err);
      setUsernameStatus('idle');
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCheck = useCallback(
    debounce((username) => checkUsernameAvailability(username), 500),
    [],
  );

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear validation errors
      if (formErrors[name]) {
        setFormErrors((prev) => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }

      // Special handling for username
      if (name === 'username') {
        setUsernameStatus('idle');
        if (value.length >= 3) {
          debouncedCheck(value);
        }
      }
    },
    [formErrors, debouncedCheck],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Client-side validation
    const validationErrors = validate(formData);

    // 2. Check if username was already marked as taken
    if (usernameStatus === 'taken') {
      validationErrors.username = 'Username is already taken';
    }

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    if (status === 'loading') return;

    setStatus('loading');

    try {
      const { user, profile } = await authService.createUser(formData);

      dispatch(setAuthUserId(user));
      dispatch(upsertProfile(profile));

      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      setStatus('error');
      const message = err?.message || 'Signup failed. Please try again.';
      toast.error(message);
    } finally {
      setStatus((current) => (current === 'loading' ? 'idle' : current));
    }
  };

  return {
    formData,
    formErrors,
    isLoading: status === 'loading',
    usernameStatus,
    handleChange,
    handleSubmit,
    isSubmitDisabled:
      status === 'loading' ||
      usernameStatus === 'checking' ||
      usernameStatus === 'taken',
  };
};
