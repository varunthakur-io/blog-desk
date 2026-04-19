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
    <div className="bg-background/40 border-primary/10 animate-in slide-in-from-top relative w-full border-b px-page-px py-2 backdrop-blur-xl duration-500 selection:bg-primary/20">
      {/* Premium Highlight Gradient */}
      <div className="from-primary/5 via-transparent absolute inset-0 -z-10 bg-linear-to-r to-primary/5 opacity-50" />

      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="bg-primary/10 flex size-7 items-center justify-center rounded-full">
            <Mail className="text-primary h-3.5 w-3.5" />
          </div>
          <p className="text-foreground/90 truncate text-[12px] font-semibold tracking-tight">
            Please verify your email (
            <span className="decoration-primary/30 font-bold underline">{user.email}</span>)
            <span className="text-muted-foreground ml-1.5 hidden font-medium opacity-60 lg:inline">
              — Unlock full access to your writing tools.
            </span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            onClick={handleResend}
            disabled={isLoading || isSent}
            variant={isSent ? 'secondary' : 'outline'}
            className={cn(
              'h-8 rounded-full px-4 text-[10px] font-bold tracking-tighter uppercase transition-all active:scale-95',
              !isSent && 'border-primary/20 hover:bg-primary/5 text-primary hover:text-primary',
            )}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            ) : isSent ? (
              <CheckCircle2 className="mr-2 h-3 w-3" />
            ) : null}
            {isSent ? 'Check Inbox' : 'Resend Email'}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="hover:bg-primary/10 text-muted-foreground hover:text-primary size-8 rounded-full transition-all"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerificationBanner;
