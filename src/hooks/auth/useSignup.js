import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { debounce } from '@/lib/utils';
import { authService } from '@/services/auth';
import { profileService } from '@/services/profile';
import { setAuthUserId } from '@/store/auth';
import { upsertProfile } from '@/store/profile';

export const useSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    username: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usernameMessage, setUsernameMessage] = useState({ type: '', text: '' });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'username') {
      setUsernameMessage({ type: '', text: '' });
      handleUsernameCheckDebounce(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError('');

    try {
      const { user, profile } = await authService.createUser(formData);
      dispatch(setAuthUserId(user.$id));
      dispatch(upsertProfile(profile));
      toast.success('Account created and logged in!');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkUsername = async (username) => {
    if (!username || username.length < 3) {
      setUsernameMessage({
        type: 'error',
        text: 'Username must be at least 3 characters.',
      });
      return;
    }

    try {
      const isAvailable = await profileService.isUsernameAvailable(username);
      if (!isAvailable) {
        setUsernameMessage({
          type: 'error',
          text: 'Username is already taken.',
        });
      } else {
        setUsernameMessage({
          type: 'success',
          text: 'Username is available!',
        });
      }
    } catch (err) {
      console.error('Username check failed:', err);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleUsernameCheckDebounce = useCallback(
    debounce((username) => {
      checkUsername(username);
    }, 500),
    [],
  );

  return {
    formData,
    loading,
    error,
    usernameMessage,
    handleChange,
    handleSubmit,
  };
};
