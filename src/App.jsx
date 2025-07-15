import './App.css';

// React & Libraries
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// Redux & Services
import { setUser, clearUser } from './store/authSlice';
import { authService } from './services/authService';

// Layout & Routing
import MainLayout from './layout/MainLayout';
import PrivateRoute from './components/PrivateRoute';

// Pages
import CreatePost from './pages/CreatePost';
import Dashboard from './pages/Dashboard';
import EditPost from './pages/EditPost';
import Home from './pages/Home';
import Login from './pages/Login';
import PostDetails from './pages/PostDetails';
import Signup from './pages/Signup';
import Profile from './pages/Profile';


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
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Auth pages (no layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
