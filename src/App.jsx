import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
import Settings from './pages/Settings';
import useAuthCheck from './hooks/useAuthCheck';

function App() {
  const isAuthChecked = useAuthCheck();
  const { loading } = useSelector((state) => state.auth);

  if (!isAuthChecked || loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-semibold bg-white dark:bg-gray-800 dark:text-white">
        Loading...
      </div>
    );
  }

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
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Public route for viewing articles */}
        <Route path="/posts/:id" element={<PostDetails />} />
      </Route>

      {/* Auth pages (no layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
