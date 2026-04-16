import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignup } from '../hooks/useSignup';

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

  const getUsernameMessage = () => {
    if (usernameCheckStatus === 'checking') return { type: 'info', text: 'Checking availability…' };
    if (usernameCheckStatus === 'available')
      return { type: 'success', text: 'Username is available!' };
    if (usernameCheckStatus === 'taken')
      return { type: 'error', text: 'Username is already taken.' };
    if (signupErrors.username) return { type: 'error', text: signupErrors.username };
    return null;
  };

  const usernameMessage = getUsernameMessage();

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      <header className="space-y-1 text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="text-muted-foreground text-sm">Join Blog Desk and start writing today</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Name */}
        <div className="space-y-1.5">
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
            disabled={isSignupLoading}
            className={`h-11 rounded-lg text-sm ${signupErrors.name ? 'border-destructive' : ''}`}
          />
          {signupErrors.name && <p className="text-xs text-destructive">{signupErrors.name}</p>}
        </div>

        {/* Username */}
        <div className="space-y-1.5">
          <Label htmlFor="username" className="text-sm font-medium">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            name="username"
            placeholder="johndoe"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={isSignupLoading}
            className={`h-11 rounded-lg text-sm ${
              signupErrors.username || usernameCheckStatus === 'taken'
                ? 'border-destructive'
                : ''
            }`}
          />
          {usernameMessage && (
            <p
              className={`text-xs font-medium mt-1.5 ${
                usernameMessage.type === 'success'
                  ? 'text-green-600 dark:text-green-400'
                  : usernameMessage.type === 'info'
                    ? 'text-blue-500'
                    : 'text-destructive'
              }`}
            >
              {usernameMessage.text}
            </p>
          )}
        </div>

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
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isSignupLoading}
            autoComplete="email"
            className={`h-11 rounded-lg text-sm ${signupErrors.email ? 'border-destructive' : ''}`}
          />
          {signupErrors.email && (
            <p className="text-xs text-destructive">{signupErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
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
            disabled={isSignupLoading}
            autoComplete="new-password"
            className={`h-11 rounded-lg text-sm ${signupErrors.password ? 'border-destructive' : ''}`}
          />
          {signupErrors.password && (
            <p className="text-xs text-destructive">{signupErrors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded-full font-semibold gap-2 text-sm mt-2 focus-visible:ring-offset-1"
          disabled={isSignupLoading || isSubmitDisabled}
        >
          {isSignupLoading ? (
            'Creating account…'
          ) : (
            <>
              <span>Create Account</span> <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <footer className="text-center text-sm text-muted-foreground pt-6">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-bold text-primary hover:underline focus-visible:rounded focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Sign in
        </Link>
      </footer>
    </div>
  );
};
