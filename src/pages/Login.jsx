import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/hooks/auth';

const Login = () => {
  const {
    credentials,
    loginErrors,
    showPassword,
    isLoginLoading,
    handleChange,
    handleSubmit,
    togglePasswordVisibility,
  } = useLogin();

  return (
    <div className="auth-container bg-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-sm">
              B
            </div>
            <span className="font-bold text-xl tracking-tight">Blog Desk</span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-8 space-y-6">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Sign in to continue to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={credentials.email}
                onChange={handleChange}
                required
                disabled={isLoginLoading}
                autoComplete="email"
                className={`h-11 rounded-lg text-sm ${loginErrors.email ? 'border-destructive focus-visible:ring-destructive/40' : ''}`}
              />
              {loginErrors.email && (
                <p className="text-xs text-destructive">{loginErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Your password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  disabled={isLoginLoading}
                  autoComplete="current-password"
                  className={`h-11 rounded-lg text-sm pr-10 ${loginErrors.password ? 'border-destructive focus-visible:ring-destructive/40' : ''}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {loginErrors.password && (
                <p className="text-xs text-destructive">{loginErrors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoginLoading}
              className="w-full h-11 rounded-full font-semibold gap-2 text-sm mt-2"
            >
              {isLoginLoading ? 'Signing in…' : (
                <><span>Sign In</span> <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-semibold text-foreground underline underline-offset-4 hover:opacity-70">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
