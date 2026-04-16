import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

  const getUsernameMessage = () => {
    if (usernameCheckStatus === 'checking') return { type: 'info', text: 'Verifying Availability…' };
    if (usernameCheckStatus === 'available')
      return { type: 'success', text: 'Username Available' };
    if (usernameCheckStatus === 'taken')
      return { type: 'error', text: 'Username Unavailable' };
    if (signupErrors.username) return { type: 'error', text: signupErrors.username };
    return null;
  };

  const usernameMessage = getUsernameMessage();

  return (
    <div className="space-y-8">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">Create an identity</h1>
        <p className="text-muted-foreground/60 text-[13px] font-medium tracking-tight">Join the network and start sharing your perspective</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Name */}
        <div className="space-y-3">
          <Label htmlFor="name" className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
            Legal Name
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
            className={cn(
              "h-12 rounded-md bg-muted/20 border-border/40 text-[14px] font-medium transition-all focus:bg-background shadow-none",
              signupErrors.name && "border-destructive focus-visible:ring-destructive/20"
            )}
          />
          {signupErrors.name && <p className="text-[11px] font-bold text-destructive tracking-tight">{signupErrors.name}</p>}
        </div>

        {/* Username */}
        <div className="space-y-3">
          <Label htmlFor="username" className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
            Unique Handle
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
            className={cn(
              "h-12 rounded-md bg-muted/20 border-border/40 text-[14px] font-medium transition-all focus:bg-background shadow-none",
              (signupErrors.username || usernameCheckStatus === 'taken') && "border-destructive focus-visible:ring-destructive/20"
            )}
          />
          {usernameMessage && (
            <p
              className={cn(
                "text-[10px] font-black uppercase tracking-widest mt-1.5",
                usernameMessage.type === 'success' ? 'text-green-600 dark:text-green-400' : 
                usernameMessage.type === 'info' ? 'text-blue-500' : 'text-destructive'
              )}
            >
              {usernameMessage.text}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-3">
          <Label htmlFor="email" className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
            Email Path
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="name@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isSignupLoading}
            autoComplete="email"
            className={cn(
              "h-12 rounded-md bg-muted/20 border-border/40 text-[14px] font-medium transition-all focus:bg-background shadow-none",
              signupErrors.email && "border-destructive focus-visible:ring-destructive/20"
            )}
          />
          {signupErrors.email && (
            <p className="text-[11px] font-bold text-destructive tracking-tight">{signupErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-3">
          <Label htmlFor="password" className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="Create a phrase..."
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isSignupLoading}
            autoComplete="new-password"
            className={cn(
              "h-12 rounded-md bg-muted/20 border-border/40 text-[14px] font-medium transition-all focus:bg-background shadow-none",
              signupErrors.password && "border-destructive focus-visible:ring-destructive/20"
            )}
          />
          {signupErrors.password && (
            <p className="text-[11px] font-bold text-destructive tracking-tight">{signupErrors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-md bg-foreground text-background font-black text-[12px] uppercase tracking-[0.2em] gap-2 transition-all hover:opacity-90 active:scale-[0.98] shadow-xl shadow-foreground/10"
          disabled={isSignupLoading || isSubmitDisabled}
        >
          {isSignupLoading ? (
            'Initializing Account…'
          ) : (
            <>
              Generate Identity <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <footer className="text-center pt-4">
        <p className="text-[13px] font-medium text-muted-foreground/40 tracking-tight">
          Already registered?{' '}
          <Link
            to="/login"
            className="font-black text-foreground hover:text-primary transition-all underline decoration-primary/20 underline-offset-4"
          >
            Sign in to access
          </Link>
        </p>
      </footer>
    </div>
  );
};
