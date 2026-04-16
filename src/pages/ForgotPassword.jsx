import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/features/auth';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

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
    <main className="page-container flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
      <div className="w-full max-w-[400px] space-y-10 animate-in fade-in zoom-in-95 duration-700">
        <header className="flex flex-col items-center">
          <Link to="/" className="group flex items-center gap-4 transition-all">
            <div className="flex size-11 items-center justify-center rounded bg-foreground font-black text-xl text-background transition-all group-hover:opacity-90 active:scale-95 shadow-lg shadow-foreground/10">
              B
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-foreground uppercase">blogdesk</span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 -mt-1">Digital Magazine</span>
            </div>
          </Link>
        </header>

        <section className="space-y-8">
          {!submitted ? (
            <div className="space-y-8">
              <header className="text-center space-y-2">
                <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">Access Recovery</h1>
                <p className="text-muted-foreground/60 text-[13px] font-medium tracking-tight">
                  Enter your email address to receive a secure identity reset link.
                </p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                    Email Repository
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-md bg-muted/20 border-border/40 text-[14px] font-medium transition-all focus:bg-background shadow-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-md bg-foreground text-background font-black text-[12px] uppercase tracking-[0.2em] gap-2 transition-all hover:opacity-90 active:scale-[0.98] shadow-xl shadow-foreground/10"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Send Recovery Link
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <footer className="text-center pt-4">
                <Link to="/login" className="text-[11px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-all">
                  Return to entry
                </Link>
              </footer>
            </div>
          ) : (
            <div className="text-center space-y-8 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-foreground text-background rounded-md flex items-center justify-center mx-auto shadow-xl shadow-foreground/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <header className="space-y-2">
                <h2 className="text-2xl font-black tracking-tighter uppercase">Identity Link Sent</h2>
                <p className="text-muted-foreground/60 text-[13px] font-medium tracking-tight">
                  We have dispatched a secure recovery sequence to <br/>
                  <span className="font-bold text-foreground">{email}</span>
                </p>
              </header>

              <footer className="pt-4 space-y-4">
                <Button asChild className="w-full h-12 rounded-md bg-foreground text-background font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-foreground/10">
                  <Link to="/login">Proceed to Login</Link>
                </Button>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-[11px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-all"
                >
                  Request New Sequence
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
