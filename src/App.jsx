import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

// Main application entry point and router configuration
// Layout & Routing
import MainLayout from './layout/MainLayout';
import { PrivateRoute, AppSkeleton } from './components/common';
import { useAuthCheck } from '@/features/auth';

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
const About = lazy(() => import('./pages/About'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const isAuthChecked = useAuthCheck();
  const { loading } = useSelector((state) => state.auth);

  if (!isAuthChecked || loading) {
    return <AppSkeleton />;
  }

  return (
    <Suspense fallback={<AppSkeleton />}>
      <Toaster position="bottom-right" reverseOrder={false} toastOptions={{ duration: 2500 }} />
      <Routes>
        {/* Routes with layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          {/* 🔒 Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/edit/:id" element={<EditPost />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Public routes */}
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/verify" element={<VerifyEmail />} />

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Auth pages (no layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Recovery Routes */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Suspense>
  );
}

export default App;
