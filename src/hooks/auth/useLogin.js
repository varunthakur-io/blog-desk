import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth';
import { parseApiError } from '@/lib/error-handler';
import {
  selectAuthUserId,
  selectAuthStatus,
  selectIsAuthLoading,
  setAuthStatus,
  setAuthUser,
  setAuthError,
} from '@/store/auth';
import { setUserProfile } from '@/store/profile';

// Pure validation logic for credentials
const validate = (formValues) => {
  const errors = {};
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

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux Selectors
  const authUserId = useSelector(selectAuthUserId);
  const authStatus = useSelector(selectAuthStatus);
  const isAuthLoading = useSelector(selectIsAuthLoading);

  // Local State
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loginStatus, setLoginStatus] = useState('idle');
  const [loginErrors, setLoginErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (authStatus === 'authenticated' && authUserId) {
      navigate('/', { replace: true });
    }
  }, [authStatus, authUserId, navigate]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setCredentials((prev) => ({ ...prev, [name]: value }));

      // Clear error immediately when user starts fixing the field
      if (loginErrors[name]) {
        setLoginErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [loginErrors],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(credentials);
    if (Object.keys(validationErrors).length > 0) {
      setLoginErrors(validationErrors);
      return;
    }

    if (loginStatus === 'loading' || isAuthLoading) return;

    setLoginStatus('loading');
    dispatch(setAuthStatus('loading'));

    try {
      const { user, profile } = await authService.loginUser(credentials);

      // Populate global store with full identity and domain data
      dispatch(setAuthUser(user));
      dispatch(setUserProfile(profile));

      toast.success(`Welcome back, ${user.name || 'friend'}!`);
      navigate('/', { replace: true });
    } catch (error) {
      setLoginStatus('error');
      const message = parseApiError(error, 'Invalid email or password');
      dispatch(setAuthError(message));
      toast.error(message);
    } finally {
      setLoginStatus((current) => (current === 'loading' ? 'idle' : current));
    }
  };

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return {
    // form state
    credentials,
    loginErrors,
    showPassword,

    // loading states
    isLoginLoading: loginStatus === 'loading' || isAuthLoading,

    // form actions
    handleChange,
    handleSubmit,
    togglePasswordVisibility,

    // derived UI state
    isSubmitDisabled:
      loginStatus === 'loading' || isAuthLoading || !credentials.email || !credentials.password,
  };
};
