import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authService } from '../features/auth/services/auth.service';
import { Loader2, CheckCircle2, XCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const secret = searchParams.get('secret');
  const userId = searchParams.get('userId');
  
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [error, setError] = useState('');

  useEffect(() => {
    const performVerification = async () => {
      if (!secret || !userId) {
        setStatus('error');
        setError('Invalid verification link.');
        return;
      }

      try {
        await authService.verifyUser(userId, secret);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setError(err.message || 'Verification failed. The link may have expired.');
      }
    };

    performVerification();
  }, [secret, userId]);

  return (
    <div className="page-root flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border border-border bg-card shadow-sm animate-in fade-in zoom-in duration-300">
        
        {/* ICON */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
          status === 'loading' ? 'bg-muted' : 
          status === 'success' ? 'bg-green-500/10 text-green-500' : 
          'bg-destructive/10 text-destructive'
        }`}>
          {status === 'loading' && <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />}
          {status === 'success' && <CheckCircle2 className="w-8 h-8" />}
          {status === 'error' && <XCircle className="w-8 h-8" />}
        </div>

        {/* TEXT */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            {status === 'loading' && 'Verifying your email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {status === 'loading' && 'Please wait while we confirm your account.'}
            {status === 'success' && 'Your account is now fully activated. You can now post and interact with others.'}
            {status === 'error' && error}
          </p>
        </div>

        {/* ACTIONS */}
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
              <p className="text-xs text-muted-foreground">
                Need a new link? Try logging in again or check your settings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
