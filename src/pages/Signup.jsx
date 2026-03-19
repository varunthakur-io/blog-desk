// src/pages/Signup.jsx
import { Link } from 'react-router-dom';

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

// Hooks
import { useSignup } from '@/hooks/auth';

const Signup = () => {
  const {
    formData,
    isLoading,
    isSubmitDisabled,
    formErrors,
    usernameStatus,
    handleChange,
    handleSubmit,
  } = useSignup();

  const getUsernameMessage = () => {
    if (usernameStatus === 'checking') return { type: 'info', text: 'Checking availability...' };
    if (usernameStatus === 'available') return { type: 'success', text: 'Username is available!' };
    if (usernameStatus === 'taken') return { type: 'error', text: 'Username is already taken.' };
    if (formErrors.username) return { type: 'error', text: formErrors.username };
    return null;
  };

  const usernameMessage = getUsernameMessage();

  return (
    <div
      className="auth-container
               bg-[radial-gradient(1200px_800px_at_80%_-10%,rgba(99,102,241,.25),transparent),radial-gradient(1000px_700px_at_-10%_110%,rgba(34,197,94,.2),transparent)]"
    >
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Blog Desk</h1>
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
                  disabled={isLoading}
                  className={`h-12 text-base rounded-lg border-border/70 focus-visible:ring-2 focus-visible:ring-primary/50 ${formErrors.name ? 'border-destructive focus-visible:ring-destructive/50' : ''}`}
                />
                {formErrors.name && (
                  <p className="text-xs text-destructive font-medium ml-1">{formErrors.name}</p>
                )}
              </div>

              {/* Username */}
              <div className="space-y-2">
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
                  disabled={isLoading}
                  className={`h-12 text-base rounded-lg border-border/70 focus-visible:ring-2 focus-visible:ring-primary/50 ${formErrors.username || usernameStatus === 'taken' ? 'border-destructive focus-visible:ring-destructive/50' : ''}`}
                />
                {usernameMessage && (
                  <p
                    className={`text-xs font-medium ml-1 ${
                      usernameMessage.type === 'success'
                        ? 'text-green-600'
                        : usernameMessage.type === 'info'
                          ? 'text-blue-600'
                          : 'text-destructive'
                    }`}
                  >
                    {usernameMessage.text}
                  </p>
                )}
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
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                  className={`h-12 text-base rounded-lg border-border/70 focus-visible:ring-2 focus-visible:ring-primary/50 ${formErrors.password ? 'border-destructive focus-visible:ring-destructive/50' : ''}`}
                />
                {formErrors.password && (
                  <p className="text-xs text-destructive font-medium ml-1">{formErrors.password}</p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-medium rounded-lg transition-[transform,shadow] hover:shadow-lg hover:-translate-y-[1px] active:translate-y-0"
                disabled={isLoading || isSubmitDisabled}
              >
                {isLoading ? 'Creating your account…' : 'Create Account'}
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
