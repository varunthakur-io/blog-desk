import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

// Auth service and Redux actions
import { setUser } from '../store/authSlice';
import { authService } from '../services/authService';

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

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local form state
  const [formData, setFormData] = useState({ email: '', password: '' });

  // Local UI state flags
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pull auth state from Redux
  const currentUser = useSelector((state) => state.auth.user);
  const isAuthenticated = Boolean(currentUser);

  // Redirect if already authenticated.
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

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
      // EXPECTATION: authService.loginUser throws on error OR returns a user object.
      const user = await authService.loginUser(formData);

      // Defensive check in case the service returns falsy without throwing.
      if (!user) throw new Error('Invalid credentials.');

      // Update Redux auth state
      dispatch(setUser(user));

      // Immediate navigation avoids flicker; the effect above will also redirect on refresh.
      // NOTE: Doing both is fine; only one navigation will effectively apply.
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
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
