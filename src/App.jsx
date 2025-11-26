import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

// Layout & Routing
import MainLayout from './layout/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import useAuthCheck from './hooks/useAuthCheck';
import SkeletonLoader from './components/SkeletonLoader';

// Pages (Lazy Loaded)
const CreatePost = lazy(() => import('./pages/CreatePost'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const EditPost = lazy(() => import('./pages/EditPost'));
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const PostDetails = lazy(() => import('./pages/PostDetails'));
const Signup = lazy(() => import('./pages/Signup'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  const isAuthChecked = useAuthCheck();
  const { loading } = useSelector((state) => state.auth);

  if (!isAuthChecked || loading) {
    return <SkeletonLoader />;
  }

  return (
    <Suspense fallback={<SkeletonLoader />}>
      <Routes>
        {/* Routes with layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          {/* 🔒 Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/edit/:id" element={<EditPost />} />
            {/* <Route path="/profile" element={<Profile />} /> */}
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Public route for viewing articles */}
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Auth pages (no layout) */}
        <Route
          path="/login"
          element={
            <div>
              <Toaster position="top-right" reverseOrder={false} />
              <Login />
            </div>
          }
        />
        <Route
          path="/signup"
          element={
            <div>
              <Toaster position="top-right" reverseOrder={false} />
              <Signup />
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
