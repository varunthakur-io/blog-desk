import './App.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from './store/authSlice';
import { authService } from './services/authService';

import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import Home from './pages/Home';

import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await authService.getAccount();
        dispatch(setUser(user));
      } catch (error) {
        dispatch(clearUser());
        console.error('No user found, clearing user state:', error.message);
      }
    };

    checkUser();
  }, [dispatch]);

  return (
    <Routes>
      {/* Routes wrapped with MainLayout (Navbar visible) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreatePost />} />
      </Route>

      {/* Auth routes with no Navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
