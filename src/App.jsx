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

import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';

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
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreatePost />} />
      </Routes>
    </>
  );
}

export default App;
