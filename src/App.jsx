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

import PrivateRoute from './components/PrivateRoute';

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
      {/* Routes with layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        {/* 🔒 Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreatePost />} />
        </Route>
      </Route>

      {/* Auth pages (no layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
