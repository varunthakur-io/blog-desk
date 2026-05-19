// VerifyEmail: account verification flow and success handling
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authService, setAuthUser } from '@/features/auth';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const secret = searchParams.get('secret');
  const userId = searchParams.get('userId');

  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const performVerification = async () => {
      if (!secret || !userId) {
        setStatus('error');
        setError('Invalid verification link.');
        return;
      }

      try {
        const updatedUser = await authService.verifyUser(userId, secret);

        // Handle Redux dispatch here instead of in the service
        if (updatedUser) {
          dispatch(setAuthUser(updatedUser));
        }

        setStatus('success');
      } catch (err) {
        setStatus('error');
        setError(err.message || 'Verification failed. The link may have expired.');
      }
    };

    performVerification();
  }, [secret, userId, dispatch]);

  return (
    <main className="page-container flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <section className="border-border bg-card animate-in fade-in zoom-in w-full max-w-md space-y-8 rounded-2xl border p-8 text-center shadow-sm duration-300">
        {/* Status icon */}
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
            status === 'loading'
              ? 'bg-muted'
              : status === 'success'
                ? 'bg-green-500/10 text-green-500'
                : 'bg-destructive/10 text-destructive'
          }`}
        >
          {status === 'loading' && (
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          )}
          {status === 'success' && <CheckCircle2 className="h-8 w-8" />}
          {status === 'error' && <XCircle className="h-8 w-8" />}
        </div>

        {/* Content */}
        <header className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            {status === 'loading' && 'Verifying your email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {status === 'loading' && 'Please wait while we confirm your account.'}
            {status === 'success' &&
              'Your account is now fully activated. You can now post and interact with others.'}
            {status === 'error' && error}
          </p>
        </header>

        {/* Actions */}
        <div className="pt-4">
          {status === 'success' && (
            <Button asChild className="w-full rounded-full">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          )}
          {status === 'error' && (
            <div className="space-y-3">
              <Button asChild variant="outline" className="w-full rounded-full">
                <Link to="/">Back to Home</Link>
              </Button>
              <p className="text-muted-foreground text-xs">
                Need a new link? Try logging in again or check your settings.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default VerifyEmail;
