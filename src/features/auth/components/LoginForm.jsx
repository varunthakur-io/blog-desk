import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLogin } from '../hooks/useLogin';
import { cn } from '@/lib/utils';

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
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="space-y-1 px-0 text-center lg:text-left">
        <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
        <CardDescription>Enter your credentials to access your workspace</CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email */}
          <div>
            <Label htmlFor="email" className="mb-2 block">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="name@example.com"
              value={credentials.email}
              onChange={handleChange}
              required
              disabled={isLoginLoading}
              autoComplete="email"
              className={cn(
                loginErrors.email && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {loginErrors.email && (
              <p className="text-sm text-destructive">{loginErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-sm leading-none text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
                required
                disabled={isLoginLoading}
                autoComplete="current-password"
                className={cn(
                  "pr-10",
                  loginErrors.password && "border-destructive focus-visible:ring-destructive"
                )}
              />
              <button
                type="button"
                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground transition-colors"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {loginErrors.password && (
              <p className="text-sm text-destructive">{loginErrors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoginLoading}
            className="w-full"
            size="lg"
          >
            {isLoginLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="px-0 justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
