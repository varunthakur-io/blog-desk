import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
    <Card className="border-0 bg-transparent shadow-none">
      <CardHeader className="space-y-1 px-0 text-center lg:text-left">
        <CardTitle className="text-2xl font-black tracking-tighter">Welcome back</CardTitle>
        <CardDescription>Enter your credentials to access your workspace</CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email */}
          <div>
            <Label htmlFor="email" className="mb-2 block">
              Email
            </Label>
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
                loginErrors.email && 'border-destructive focus-visible:ring-destructive',
              )}
            />
            {loginErrors.email && <p className="text-destructive text-sm">{loginErrors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-muted-foreground hover:text-primary text-sm leading-none underline-offset-4 transition-colors hover:underline"
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
                  'pr-10',
                  loginErrors.password && 'border-destructive focus-visible:ring-destructive',
                )}
              />
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground absolute top-0 right-0 h-full px-3 transition-colors"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {loginErrors.password && (
              <p className="text-destructive text-sm">{loginErrors.password}</p>
            )}
          </div>

          <Button type="submit" disabled={isLoginLoading} className="w-full" size="lg">
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

      <CardFooter className="justify-center px-0">
        <p className="text-muted-foreground text-sm">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
