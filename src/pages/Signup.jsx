import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignup } from '@/hooks/auth';

const Signup = () => {
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
    if (usernameCheckStatus === 'available') return { type: 'success', text: 'Username is available!' };
    if (usernameCheckStatus === 'taken') return { type: 'error', text: 'Username is already taken.' };
    if (signupErrors.username) return { type: 'error', text: signupErrors.username };
    return null;
  };

  const usernameMessage = getUsernameMessage();

  return (
    <div className="auth-container bg-[radial-gradient(900px_600px_at_70%_-5%,hsl(var(--accent))_0%,transparent_70%),radial-gradient(700px_500px_at_-5%_100%,hsl(var(--accent))_0%,transparent_70%)]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-sm">
              B
            </div>
            <span className="font-bold text-xl tracking-tight">Blog Desk</span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border/60 bg-card/90 backdrop-blur shadow-xl p-8 space-y-6">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
            <p className="text-muted-foreground text-sm">Join Blog Desk and start writing today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
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
              <Label htmlFor="username" className="text-sm font-medium">Username</Label>
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
                  signupErrors.username || usernameCheckStatus === 'taken' ? 'border-destructive' : ''
                }`}
              />
              {usernameMessage && (
                <p className={`text-xs font-medium ${
                  usernameMessage.type === 'success' ? 'text-green-600 dark:text-green-400' :
                  usernameMessage.type === 'info' ? 'text-blue-500' : 'text-destructive'
                }`}>
                  {usernameMessage.text}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
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
              {signupErrors.email && <p className="text-xs text-destructive">{signupErrors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
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
              {signupErrors.password && <p className="text-xs text-destructive">{signupErrors.password}</p>}
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-full font-semibold gap-2 text-sm mt-2"
              disabled={isSignupLoading || isSubmitDisabled}
            >
              {isSignupLoading ? 'Creating account…' : (
                <><span>Create Account</span> <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
