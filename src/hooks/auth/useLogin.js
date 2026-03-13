import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth';
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
const validate = (data) => {
  const errors = {};
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

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux Selectors
  const authUserId = useSelector(selectAuthUserId);
  const authStatus = useSelector(selectAuthStatus);
  const isAuthLoading = useSelector(selectIsAuthLoading);

  // Local State
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('idle');
  const [formErrors, setFormErrors] = useState({});
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
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear error immediately when user starts fixing the field
      if (formErrors[name]) {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [formErrors],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    if (status === 'loading' || isAuthLoading) return;

    setStatus('loading');
    dispatch(setAuthStatus('loading'));

    try {
      const { user, profile } = await authService.loginUser(formData);

      // Populate global store with full identity and domain data
      dispatch(setAuthUser(user));
      dispatch(setUserProfile(profile));

      toast.success(`Welcome back, ${user.name || 'friend'}!`);
      navigate('/', { replace: true });
    } catch (err) {
      setStatus('error');
      const message = err?.message || 'Invalid email or password';
      dispatch(setAuthError(message));
      toast.error(message);
    } finally {
      setStatus((current) => (current === 'loading' ? 'idle' : current));
    }
  };

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return {
    formData,
    formErrors,
    isLoading: status === 'loading' || isAuthLoading,
    showPassword,
    handleChange,
    handleSubmit,
    togglePasswordVisibility,
    isSubmitDisabled:
      status === 'loading' || isAuthLoading || !formData.email || !formData.password,
  };
};
