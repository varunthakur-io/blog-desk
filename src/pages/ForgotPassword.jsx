import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/features/auth';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await authService.createRecovery(email);
      setSubmitted(true);
      toast.success('Reset link sent to your email');
    } catch (error) {
      toast.error(error.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <header className="flex justify-center">
          <Link to="/" className="flex items-center gap-2.5 group transition-transform hover:scale-105 active:scale-95">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-lg font-black text-primary-foreground shadow-md ring-2 ring-primary/20">
              B
            </div>
            <span className="text-2xl font-black tracking-tight text-foreground">Blog Desk</span>
          </Link>
        </header>

        <section className="rounded-2xl border bg-card p-8 shadow-sm">
          {!submitted ? (
            <div className="space-y-6">
              <header className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                  <Mail className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Forgot Password</h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-lg"
                  />
                </div>

                <Button type="submit" className="w-full rounded-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <footer className="text-sm text-center text-muted-foreground">
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Back to login
                </Link>
              </footer>
            </div>
          ) : (
            <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <header className="space-y-2">
                <h2 className="text-xl font-bold">Check your email</h2>
                <p className="text-sm text-muted-foreground px-2">
                  We have sent a password reset link to <br/>
                  <span className="font-semibold text-foreground">{email}</span>
                </p>
              </header>

              <footer className="pt-4 space-y-3">
                <Button asChild className="w-full rounded-full">
                  <Link to="/login">Back to Login</Link>
                </Button>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Didn't receive the email? Try again
                </button>
              </footer>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ForgotPassword;
