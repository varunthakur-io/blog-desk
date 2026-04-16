import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { authService } from '@/features/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | success

  const userId = searchParams.get('userId');
  const secret = searchParams.get('secret');

  useEffect(() => {
    if (!userId || !secret) {
      toast.error('Invalid or expired reset link');
      navigate('/login');
    }
  }, [userId, secret, navigate]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!password) return;
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(userId, secret, password);
      setStatus('success');
      toast.success('Password reset successfully!');
      
      // Auto redirect after a brief delay
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
      <div className="w-full max-w-[400px] space-y-10 animate-in fade-in zoom-in-95 duration-700">
        {/* Logo/Branding Header */}
        <header className="flex flex-col items-center">
          <Link to="/" className="group flex flex-col items-center gap-4 transition-all">
            <div className="flex size-11 items-center justify-center rounded bg-foreground font-black text-xl text-background transition-all group-hover:opacity-90 active:scale-95 shadow-lg shadow-foreground/10">
              B
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black tracking-tighter text-foreground uppercase">blogdesk</span>
              <div className="h-0.5 w-4 bg-primary/20 mt-0.5" />
            </div>
          </Link>
        </header>

        <section className="space-y-8">
          {status === 'success' ? (
            <div className="text-center space-y-8 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-foreground text-background rounded-md flex items-center justify-center mx-auto shadow-xl shadow-foreground/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <header className="space-y-2">
                <h1 className="text-2xl font-black tracking-tighter uppercase">Identity Verified</h1>
                <p className="text-muted-foreground/60 text-[13px] font-medium tracking-tight">
                  Your credentials have been updated. Redirecting to entry sequence...
                </p>
              </header>
              <footer className="pt-2">
                <Button asChild className="w-full h-12 rounded-md bg-foreground text-background font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-foreground/10">
                  <Link to="/login">Go to Login</Link>
                </Button>
              </footer>
            </div>
          ) : (
            <div className="space-y-8">
              <header className="text-center space-y-2">
                <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">New Credentials</h1>
                <p className="text-muted-foreground/60 text-[13px] font-medium tracking-tight">Establish a secure secondary access key for your account.</p>
              </header>

              <form onSubmit={handleReset} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">New security key</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="h-12 rounded-md bg-muted/20 border-border/40 text-[14px] font-medium transition-all focus:bg-background shadow-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Confirm key</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-12 rounded-md bg-muted/20 border-border/40 text-[14px] font-medium transition-all focus:bg-background shadow-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-md bg-foreground text-background font-black text-[12px] uppercase tracking-[0.2em] gap-2 transition-all hover:opacity-90 active:scale-[0.98] shadow-xl shadow-foreground/10"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? 'Updating Identity...' : 'Update Credentials'}
                </Button>
              </form>

              <footer className="text-center pt-4">
                <Link to="/login" className="text-[11px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-all">
                  Back to entry
                </Link>
              </footer>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ResetPassword;
