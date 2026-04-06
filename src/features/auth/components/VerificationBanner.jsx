import React, { useState } from 'react';
import { Mail, Loader2, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authService } from '../services/auth.service';
import toast from 'react-hot-toast';

const VerificationBanner = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Only show if user is logged in but NOT verified
  if (!user || user.emailVerification) return null;

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await authService.createVerification();
      setIsSent(true);
      toast.success('Verification email sent!');
    } catch (error) {
      toast.error(error.message || 'Failed to send email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-primary/5 border-b border-primary/10 py-2 px-4 animate-in slide-in-from-top duration-500">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="hidden sm:flex h-7 w-7 rounded-full bg-primary/10 items-center justify-center shrink-0 text-primary">
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
          <p className="text-[13px] font-medium text-foreground/80 truncate">
            Your email <span className="font-bold text-foreground">{user.email}</span> is not
            verified.
            <span className="hidden md:inline ml-1 opacity-70">Verify it using the button.</span>
          </p>
        </div>

        <Button
          onClick={handleResend}
          disabled={isLoading || isSent}
          variant="ghost"
          size="sm"
          className="h-8 rounded-full text-xs font-bold text-primary hover:text-primary hover:bg-primary/10 transition-all shrink-0"
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
          ) : isSent ? (
            <CheckCircle2 className="h-3 w-3 mr-1.5" />
          ) : (
            <Mail className="h-3 w-3 mr-1.5" />
          )}
          {isSent ? 'Sent!' : 'Send Verification Link'}
          {!isSent && !isLoading && <ArrowRight className="h-3 w-3 ml-1.5 opacity-50" />}
        </Button>
      </div>
    </div>
  );
};

export default VerificationBanner;
