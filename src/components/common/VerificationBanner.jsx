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
    <div className="w-full bg-primary/5 border-b border-border/50 py-2.5 px-4 animate-in slide-in-from-top duration-500">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Mail className="h-4 w-4 text-primary shrink-0" />
          <p className="text-[13px] font-semibold text-foreground/90 truncate">
            Please verify your email address (<span className="font-bold underline decoration-primary/30">{user.email}</span>). 
            <span className="hidden lg:inline ml-1 font-normal text-muted-foreground">Verification is required to access all features.</span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={handleResend}
            disabled={isLoading || isSent}
            variant={isSent ? "secondary" : "outline"}
            className={cn(
              "h-7 rounded-md text-[11px] font-bold px-3 transition-all",
              !isSent && "border-primary/20 hover:bg-primary/5 text-primary hover:text-primary"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
            ) : isSent ? (
              <CheckCircle2 className="h-3 w-3 mr-1.5" />
            ) : null}
            {isSent ? 'Sent' : 'Resend verification email'}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="h-7 w-7 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerificationBanner;
