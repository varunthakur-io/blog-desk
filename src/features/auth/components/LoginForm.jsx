import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '../hooks/useLogin';

export const LoginForm = () => {
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
    <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      <header className="space-y-1 text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">Sign in to continue to your account</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
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
          {loginErrors.email && <p className="text-xs text-destructive">{loginErrors.email}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" name="password" className="text-sm font-medium">
              Password
            </Label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-primary hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>
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
          className="w-full h-11 rounded-full font-semibold gap-2 text-sm mt-2 focus-visible:ring-offset-1"
        >
          {isLoginLoading ? (
            'Signing in…'
          ) : (
            <>
              <span>Sign In</span> <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <footer className="text-center text-sm text-muted-foreground pt-6">
        Don&apos;t have an account?{' '}
        <Link
          to="/signup"
          className="font-bold text-primary hover:underline focus-visible:rounded focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Sign up for free
        </Link>
      </footer>
    </div>
  );
};
