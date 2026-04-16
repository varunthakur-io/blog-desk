import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    <div className="space-y-8">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">Welcome back</h1>
        <p className="text-muted-foreground/60 text-[13px] font-medium tracking-tight">Enter your credentials to access your workspace</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="name@email.com"
            value={credentials.email}
            onChange={handleChange}
            required
            disabled={isLoginLoading}
            autoComplete="email"
            className={cn(
              "h-12 rounded-md bg-muted/20 border-border/40 text-[14px] font-medium transition-all focus:bg-background shadow-none",
              loginErrors.email && "border-destructive focus-visible:ring-destructive/20"
            )}
          />
          {loginErrors.email && <p className="text-[11px] font-bold text-destructive tracking-tight">{loginErrors.email}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" name="password" className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Security Key
            </Label>
            <Link
              to="/forgot-password"
              className="text-[11px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-all"
            >
              Lost Access?
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
                "h-12 rounded-md bg-muted/20 border-border/40 text-[14px] font-medium pr-12 transition-all focus:bg-background shadow-none",
                loginErrors.password && "border-destructive focus-visible:ring-destructive/20"
              )}
            />
            <button
              type="button"
              className="absolute right-0 top-0 h-full px-4 text-muted-foreground/40 hover:text-foreground transition-colors outline-none"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {loginErrors.password && (
            <p className="text-[11px] font-bold text-destructive tracking-tight">{loginErrors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoginLoading}
          className="w-full h-12 rounded-md bg-foreground text-background font-black text-[12px] uppercase tracking-[0.2em] gap-2 transition-all hover:opacity-90 active:scale-[0.98] shadow-xl shadow-foreground/10"
        >
          {isLoginLoading ? (
            'Verifying Identity…'
          ) : (
            <>
              Sign In <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <footer className="text-center pt-4">
        <p className="text-[13px] font-medium text-muted-foreground/40 tracking-tight">
          New here?{' '}
          <Link
            to="/signup"
            className="font-black text-foreground hover:text-primary transition-all underline decoration-primary/20 underline-offset-4"
          >
            Create an identity
          </Link>
        </p>
      </footer>
    </div>
  );
};
