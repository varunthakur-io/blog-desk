import { Loader2, LogOut, Trash2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ConfirmationDialog } from '@/components/common';

const PrivacyPanel = ({
  isUpdatingSession,
  isSessionsDialogOpen,
  setIsSessionsDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  handleDeleteSessions,
  handleDeleteAccount,
}) => {
  return (
    <div className="space-y-10 max-w-2xl">
      <div className="pb-4 border-b border-border/50">
        <h2 className="text-xl font-bold tracking-tight">Privacy & Security</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your active sessions and account permanent actions.
        </p>
      </div>

      {/* Sessions section */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-[15px] font-bold">Active Sessions</h3>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            You're currently signed in on this device. You can log out of all other sessions 
            across different browsers and devices to stay secure.
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          disabled={isUpdatingSession}
          onClick={() => setIsSessionsDialogOpen(true)}
          className="rounded-full px-6 font-bold text-xs h-10 border-border/60 hover:bg-muted/50 transition-all active:scale-95"
        >
          {isUpdatingSession ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
          ) : (
            <LogOut className="h-3.5 w-3.5 mr-2" />
          )}
          Sign out all other sessions
        </Button>
      </section>

      <Separator className="opacity-50" />

      {/* Danger zone section */}
      <section className="p-6 rounded-2xl border border-destructive/20 bg-destructive/[0.02] space-y-6">
        <div className="space-y-1">
          <h3 className="text-[15px] font-bold text-destructive flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            Danger Zone
          </h3>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            Deleting your account is permanent. All your posts, likes, and profile data will be 
            wiped from our servers. <span className="text-destructive font-bold underline decoration-destructive/20">This action cannot be undone.</span>
          </p>
        </div>

        <Button
          variant="destructive"
          size="sm"
          disabled={isUpdatingSession}
          onClick={() => setIsDeleteDialogOpen(true)}
          className="rounded-full px-8 font-bold text-xs h-10 shadow-sm shadow-destructive/10 hover:shadow-xl hover:shadow-destructive/20 active:scale-95 transition-all"
        >
          {isUpdatingSession ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
          ) : (
            <Trash2 className="h-3.5 w-3.5 mr-2" />
          )}
          Delete Account Permanently
        </Button>
      </section>

      <ConfirmationDialog
        open={isSessionsDialogOpen}
        onOpenChange={setIsSessionsDialogOpen}
        onConfirm={handleDeleteSessions}
        title="Sign out everywhere?"
        description="This will log you out from all other devices. You will need to sign back in there if you wish to use them."
        confirmText="Yes, sign them out"
        isLoading={isUpdatingSession}
      />
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteAccount}
        title="Delete account permanently?"
        description="We're sorry to see you go. This will delete all your data forever. Are you absolutely sure?"
        confirmText="Delete my account"
        variant="destructive"
        isLoading={isUpdatingSession}
      />
    </div>
  );
};

export default PrivacyPanel;
