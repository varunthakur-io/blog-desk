import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { debounce } from '@/lib/utils';
import { authService } from '@/services/auth';
import { profileService } from '@/services/profile';
import { parseApiError } from '@/lib/error-handler';
import { setAuthStatus, setAuthUser, setAuthError } from '@/store/auth';
import { setUserProfile } from '@/store/profile';

// Strict validation logic for user registration
const validate = (formValues) => {
  const errors = {};
  if (!formValues.name?.trim()) errors.name = 'Full name is required';

  if (!formValues.username?.trim()) {
    errors.username = 'Username is required';
  } else if (formValues.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  } else if (!/^[a-zA-Z0-9_]+$/.test(formValues.username)) {
    errors.username = 'Username can only contain letters, numbers, and underscores';
  }

  if (!formValues.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!formValues.password) {
    errors.password = 'Password is required';
  } else if (formValues.password.length < 8) {
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

  const [signupStatus, setSignupStatus] = useState('idle'); // State machine for submission
  const [signupErrors, setSignupErrors] = useState({});
  const [usernameCheckStatus, setUsernameCheckStatus] = useState('idle'); // 'idle' | 'checking' | 'available' | 'taken'

  const checkUsernameAvailability = async (username) => {
    if (!username || username.length < 3) return;
    try {
      const isAvailable = await profileService.isUsernameAvailable(username);
      setUsernameCheckStatus(isAvailable ? 'available' : 'taken');

      if (!isAvailable) {
        setSignupErrors((prev) => ({
          ...prev,
          username: 'Username is already taken',
        }));
      }
    } catch (error) {
      console.error('Username check failed:', error);
      setUsernameCheckStatus('idle');
    }
  };

  // Prevent spamming the API while typing
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCheck = useCallback(
    debounce((username) => checkUsernameAvailability(username), 500),
    [],
  );

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (signupErrors[name]) {
        setSignupErrors((prev) => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }

      if (name === 'username') {
        if (value.length >= 3) {
          setUsernameCheckStatus('checking');
          debouncedCheck(value);
        } else {
          setUsernameCheckStatus('idle');
        }
      }
    },
    [signupErrors, debouncedCheck],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(formData);

    if (usernameCheckStatus === 'checking') {
      toast.error('Please wait for the username check to finish.');
      return;
    }

    if (usernameCheckStatus === 'taken') {
      validationErrors.username = 'Username is already taken';
    }

    if (Object.keys(validationErrors).length > 0) {
      setSignupErrors(validationErrors);
      return;
    }

    if (signupStatus === 'loading') return;

    setSignupStatus('loading');
    dispatch(setAuthStatus('loading'));

    try {
      const { user, profile } = await authService.createUser(formData);

      // Identity and Profile persistence
      dispatch(setAuthUser(user));
      dispatch(setUserProfile(profile));

      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      setSignupStatus('error');
      const message = parseApiError(error, 'Signup failed. Please try again.');
      dispatch(setAuthError(message));
      toast.error(message);
    } finally {
      setSignupStatus((current) => (current === 'loading' ? 'idle' : current));
    }
  };

  return {
    // form state
    formData,
    signupErrors,
    usernameCheckStatus,

    // loading states
    isSignupLoading: signupStatus === 'loading',

    // form actions
    handleChange,
    handleSubmit,

    // derived UI state
    isSubmitDisabled:
      signupStatus === 'loading' ||
      usernameCheckStatus === 'checking' ||
      usernameCheckStatus === 'taken',
  };
};
