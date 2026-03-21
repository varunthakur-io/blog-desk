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
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitStatus, setSubmitStatus] = useState('idle');
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

    if (submitStatus === 'loading' || isAuthLoading) return;

    setSubmitStatus('loading');
    dispatch(setAuthStatus('loading'));

    try {
      const { user, profile } = await authService.loginUser(formData);

      // Populate global store with full identity and domain data
      dispatch(setAuthUser(user));
      dispatch(setUserProfile(profile));

      toast.success(`Welcome back, ${user.name || 'friend'}!`);
      navigate('/', { replace: true });
    } catch (error) {
      setSubmitStatus('error');
      const message = error?.message || 'Invalid email or password';
      dispatch(setAuthError(message));
      toast.error(message);
    } finally {
      setSubmitStatus((current) => (current === 'loading' ? 'idle' : current));
    }
  };

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return {
    // form state
    formData,
    formErrors,
    showPassword,

    // loading states
    isLoading: submitStatus === 'loading' || isAuthLoading,

    // form actions
    handleChange,
    handleSubmit,
    togglePasswordVisibility,

    // derived UI state
    isSubmitDisabled:
      submitStatus === 'loading' || isAuthLoading || !formData.email || !formData.password,
  };
};
