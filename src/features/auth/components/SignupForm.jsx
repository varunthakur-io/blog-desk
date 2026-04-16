import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSignup } from '../hooks/useSignup';
import { cn } from '@/lib/utils';

export const SignupForm = () => {
  const {
    formData,
    signupErrors,
    usernameCheckStatus,
    isSignupLoading,
    handleChange,
    handleSubmit,
    isSubmitDisabled,
  } = useSignup();

  const getUsernameHint = () => {
    if (usernameCheckStatus === 'checking') return { className: 'text-muted-foreground', text: 'Checking availability...' };
    if (usernameCheckStatus === 'available') return { className: 'text-green-600 dark:text-green-400', text: 'Username is available' };
    if (usernameCheckStatus === 'taken') return { className: 'text-destructive', text: 'Username is taken' };
    if (signupErrors.username) return { className: 'text-destructive', text: signupErrors.username };
    return null;
  };

  const usernameHint = getUsernameHint();

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="space-y-1 px-0 text-center lg:text-left">
        <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
        <CardDescription>Enter your details to get started</CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Name */}
          <div>
            <Label htmlFor="name" className="mb-2 block">Name</Label>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSignupLoading}
              className={cn(
                signupErrors.name && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {signupErrors.name && (
              <p className="text-sm text-destructive">{signupErrors.name}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <Label htmlFor="username" className="mb-2 block">Username</Label>
            <Input
              id="username"
              type="text"
              name="username"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isSignupLoading}
              className={cn(
                (signupErrors.username || usernameCheckStatus === 'taken') && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {usernameHint && (
              <p className={cn("text-sm", usernameHint.className)}>
                {usernameHint.text}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="mb-2 block">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isSignupLoading}
              autoComplete="email"
              className={cn(
                signupErrors.email && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {signupErrors.email && (
              <p className="text-sm text-destructive">{signupErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="mb-2 block">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isSignupLoading}
              autoComplete="new-password"
              className={cn(
                signupErrors.password && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {signupErrors.password && (
              <p className="text-sm text-destructive">{signupErrors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSignupLoading || isSubmitDisabled}
          >
            {isSignupLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create account <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="px-0 justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
