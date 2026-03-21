import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

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

// Hooks
import { useLogin } from '@/hooks/auth';

const Login = () => {
  const {
    // form state
    formData,
    formErrors,
    showPassword,

    // loading state
    isLoading,

    // actions
    handleChange,
    handleSubmit,
    togglePasswordVisibility,
  } = useLogin();

  return (
    <div
      className="auth-container
                 bg-[radial-gradient(1200px_800px_at_80%_-10%,rgba(99,102,241,.25),transparent),radial-gradient(1000px_700px_at_-10%_110%,rgba(34,197,94,.2),transparent)]"
    >
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Sign in to continue your journey with us
          </p>
        </div>

        <Card className="backdrop-blur supports-[backdrop-filter]:bg-background/70 border border-border/60 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
            <CardDescription className="text-base">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent className="px-10 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                  disabled={isLoading}
                  autoComplete="email"
                  className={`h-12 text-base rounded-lg border-border/70 focus-visible:ring-2 focus-visible:ring-primary/50 ${formErrors.email ? 'border-destructive focus-visible:ring-destructive/50' : ''}`}
                />
                {formErrors.email && (
                  <p className="text-xs text-destructive font-medium ml-1">{formErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                    className={`h-12 text-base rounded-lg border-border/70 focus-visible:ring-2 focus-visible:ring-primary/50 pr-10 ${formErrors.password ? 'border-destructive focus-visible:ring-destructive/50' : ''}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </Button>
                </div>
                {formErrors.password && (
                  <p className="text-xs text-destructive font-medium ml-1">{formErrors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-medium rounded-lg transition-[transform,shadow] hover:shadow-lg hover:-translate-y-[1px] active:translate-y-0"
              >
                {isLoading ? 'Signing you in…' : 'Sign In'}
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
