// src/pages/Login.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Shadcn UI components
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Store & Services
import {
  selectAuthUserId,
  setAuthLoading,
  selectAuthStatus,
  setAuthUserId,
} from '@/store/authSlice';
import { upsertProfile } from '@/store/profileSlice';
import { authService } from '@/services/authService';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authUserId = useSelector(selectAuthUserId);
  const authStatus = useSelector(selectAuthStatus);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (authStatus === 'authenticated' && authUserId) {
      navigate('/', { replace: true });
    }
  }, [authStatus, authUserId, navigate]);

  // Controlled inputs change handler
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Guard against double-submit while a request is active.
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      dispatch(setAuthLoading(true));

      // 1. Login via Appwrite
      const { user, profile } = await authService.loginUser(formData);

      // 2. Get current account (includes $id, name, email)
      const account = user;

      // 3. Fetch full profile document (bio, avatarUrl, etc.)
      // const profile = profileObj; // already destructured above

      // 4. Update auth state
      dispatch(setAuthUserId(account.$id));

      // 5. Cache full profile in profileSlice
      dispatch(upsertProfile(profile));

      toast.success(`Welcome back, ${account.name || 'friend'}!`);

      // 6. Redirect
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

  return (
    <div
      className="min-h-screen grid place-items-center p-12
                 bg-[radial-gradient(1200px_800px_at_80%_-10%,rgba(99,102,241,.25),transparent),radial-gradient(1000px_700px_at_-10%_110%,rgba(34,197,94,.2),transparent)]"
    >
      <div className="w-[520px]">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Sign in to continue your journey with us
          </p>
        </div>

        {/* Card */}
        <Card className="backdrop-blur supports-[backdrop-filter]:bg-background/70 border border-border/60 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
            <CardDescription className="text-base">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent className="px-10 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Error */}
              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
                  <p className="text-destructive text-sm text-center font-medium">
                    {error}
                  </p>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoComplete="email"
                  className="h-12 text-base rounded-lg border-border/70 focus-visible:ring-2 focus-visible:ring-primary/50"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  className="h-12 text-base rounded-lg border-border/70 focus-visible:ring-2 focus-visible:ring-primary/50"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-medium rounded-lg transition-[transform,shadow] hover:shadow-lg hover:-translate-y-[1px] active:translate-y-0"
              >
                {loading ? 'Signing you in…' : 'Sign In'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="px-10 pt-6 pb-8">
            <p className="text-center text-sm text-muted-foreground w-full">
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Create one here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
