import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

// auth service and Redux actions
import { authService } from '../services/authService';
import { setUser } from '../store/authSlice';

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

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await authService.createUser(formData);
      dispatch(setUser(user));
      toast.success('Account created and logged in!');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
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
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to Blog Desk
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            Join us and start your blogging journey today
          </p>
        </div>

        <Card className="backdrop-blur supports-[backdrop-filter]:bg-background/70 border border-border/60 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold">Sign Up</CardTitle>
            <CardDescription className="text-base">
              Create your account to get started
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

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="h-12 text-base rounded-lg border-border/70 focus-visible:ring-2 focus-visible:ring-primary/50"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
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
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoComplete="new-password"
                  className="h-12 text-base rounded-lg border-border/70 focus-visible:ring-2 focus-visible:ring-primary/50"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-medium rounded-lg transition-[transform,shadow] hover:shadow-lg hover:-translate-y-[1px] active:translate-y-0"
                disabled={loading}
              >
                {loading ? 'Creating your account…' : 'Create Account'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="px-10 pt-6 pb-8">
            <p className="text-center text-sm text-muted-foreground w-full">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
