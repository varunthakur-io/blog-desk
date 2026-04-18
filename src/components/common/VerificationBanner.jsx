import React, { useState } from 'react';
import { Mail, Loader2, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authService } from '@/features/auth';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const VerificationBanner = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Only show if user is logged in but NOT verified
  if (!user || user.emailVerification || !isVisible) return null;

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
    <div className="bg-primary/5 border-border/50 animate-in slide-in-from-top w-full border-b px-4 py-2.5 duration-500">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Mail className="text-primary h-4 w-4 shrink-0" />
          <p className="text-foreground/90 truncate text-[13px] font-semibold">
            Please verify your email address (
            <span className="decoration-primary/30 font-bold underline">{user.email}</span>).
            <span className="text-muted-foreground ml-1 hidden font-normal lg:inline">
              Verification is required to access all features.
            </span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            onClick={handleResend}
            disabled={isLoading || isSent}
            variant={isSent ? 'secondary' : 'outline'}
            className={cn(
              'h-7 rounded-md px-3 text-[11px] font-bold transition-all',
              !isSent && 'border-primary/20 hover:bg-primary/5 text-primary hover:text-primary',
            )}
          >
            {isLoading ? (
              <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
            ) : isSent ? (
              <CheckCircle2 className="mr-1.5 h-3 w-3" />
            ) : null}
            {isSent ? 'Sent' : 'Resend verification email'}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="hover:bg-primary/10 text-muted-foreground hover:text-primary h-7 w-7 rounded-md transition-all"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerificationBanner;
