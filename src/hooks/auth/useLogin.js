import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth';
import { selectAuthUserId, selectAuthStatus, setAuthLoading, setAuthUserId } from '@/store/auth';
import { upsertProfile } from '@/store/profile';

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authUserId = useSelector(selectAuthUserId);
  const authStatus = useSelector(selectAuthStatus);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (authStatus === 'authenticated' && authUserId) {
      navigate('/', { replace: true });
    }
  }, [authStatus, authUserId, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      dispatch(setAuthLoading(true));
      const { user, profile } = await authService.loginUser(formData);
      dispatch(setAuthUserId(user.$id));
      dispatch(upsertProfile(profile));
      toast.success(`Welcome back, ${user.name || 'friend'}!`);
      navigate('/', { replace: true });
    } catch (err) {
      const message = err?.message || 'Invalid email or password';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      dispatch(setAuthLoading(false));
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return {
    formData,
    loading,
    error,
    showPassword,
    handleChange,
    handleSubmit,
    togglePasswordVisibility,
  };
};
