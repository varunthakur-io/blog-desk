import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { authService } from '@/features/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
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
    <main className="flex items-center justify-center min-h-screen bg-background p-6">
      <div className="w-full max-w-sm space-y-8">
        {/* Branding */}
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary font-bold text-sm text-primary-foreground">
              B
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-foreground">BlogDesk</span>
              <span className="text-[10px] font-medium text-muted-foreground -mt-0.5">Digital Magazine</span>
            </div>
          </Link>
        </div>

        {status === 'success' ? (
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="space-y-4 px-0 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Password updated</CardTitle>
                <CardDescription>
                  Your password has been reset successfully. Redirecting to sign in...
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="px-0">
              <Button asChild className="w-full" size="lg">
                <Link to="/login">Back to sign in</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="space-y-1 px-0 text-center">
              <CardTitle className="text-2xl font-bold tracking-tight">Reset password</CardTitle>
              <CardDescription>Enter your new password below</CardDescription>
            </CardHeader>

            <CardContent className="px-0">
              <form onSubmit={handleReset} className="space-y-4" noValidate>
                <div>
                  <Label htmlFor="password" className="mb-2 block">New password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="mb-2 block">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    'Reset password'
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="px-0 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to sign in
              </Link>
            </CardFooter>
          </Card>
        )}
      </div>
    </main>
  );
};

export default ResetPassword;
