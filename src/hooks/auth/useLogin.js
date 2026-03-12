import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth';
import {
  selectAuthUserId,
  selectAuthStatus,
  setAuthLoading,
  setAuthUserId,
} from '@/store/auth';
import { upsertProfile } from '@/store/profile';

/**
 * Pure validation logic
 */
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

  // Global State
  const authUserId = useSelector(selectAuthUserId);
  const authStatus = useSelector(selectAuthStatus);

  // Local State
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'error'
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (authStatus === 'authenticated' && authUserId) {
      navigate('/', { replace: true });
    }
  }, [authStatus, authUserId, navigate]);

  // Handlers
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear field-specific error as user types
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

    // 1. Client-side validation
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    if (status === 'loading') return;

    setStatus('loading');
    dispatch(setAuthLoading(true));

    try {
      const { user, profile } = await authService.loginUser(formData);

      // Update Global State
      dispatch(setAuthUserId(user.$id));
      dispatch(upsertProfile(profile));

      toast.success(`Welcome back, ${user.name || 'friend'}!`);
      navigate('/', { replace: true });
    } catch (err) {
      setStatus('error');
      const message = err?.message || 'Invalid email or password';
      toast.error(message);
    } finally {
      dispatch(setAuthLoading(false));
      // Reset status to idle only if we didn't redirect
      setStatus((current) => (current === 'loading' ? 'idle' : current));
    }
  };

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return {
    formData,
    formErrors,
    isLoading: status === 'loading',
    showPassword,
    handleChange,
    handleSubmit,
    togglePasswordVisibility,
    isSubmitDisabled:
      status === 'loading' || !formData.email || !formData.password,
  };
};
