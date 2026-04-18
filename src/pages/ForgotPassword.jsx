import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
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
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        {/* Branding */}
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg text-sm font-bold">
              B
            </div>
            <div className="flex flex-col">
              <span className="text-foreground text-lg font-bold tracking-tight">BlogDesk</span>
              <span className="text-muted-foreground -mt-0.5 text-[10px] font-medium">
                Digital Magazine
              </span>
            </div>
          </Link>
        </div>

        {!submitted ? (
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="space-y-1 px-0 text-center">
              <CardTitle className="text-2xl font-black tracking-tighter">Forgot password?</CardTitle>
              <CardDescription>
                Enter your email and we&apos;ll send you a reset link
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <Label htmlFor="email" className="mb-2 block">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send reset link <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="justify-center px-0">
              <Link
                to="/login"
                className="text-muted-foreground hover:text-primary inline-flex items-center gap-1 text-sm transition-colors"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to sign in
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="space-y-4 px-0 text-center">
              <div className="bg-primary/10 mx-auto flex size-12 items-center justify-center rounded-full">
                <CheckCircle2 className="text-primary h-6 w-6" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-black tracking-tighter">
                  Check your email
                </CardTitle>
                <CardDescription>
                  We sent a password reset link to <br />
                  <span className="text-foreground font-medium">{email}</span>
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 px-0">
              <Button asChild className="w-full" size="lg">
                <Link to="/login">Back to sign in</Link>
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setSubmitted(false)}>
                Didn&apos;t receive it? Try again
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

export default ForgotPassword;
