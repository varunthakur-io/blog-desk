import { Loader2, LogOut, Trash2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold">Privacy & Security</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your sessions and account data.
        </p>
      </div>

      {/* Sessions box */}
      <div className="rounded-lg border border-border p-4 flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-medium">Active Sessions</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Log out from all other devices. You'll stay signed in here.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={isUpdatingSession}
          onClick={() => setIsSessionsDialogOpen(true)}
          className="shrink-0 gap-1.5"
        >
          {isUpdatingSession
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : <LogOut className="h-3.5 w-3.5" />
          }
          Log out all
        </Button>
      </div>

      {/* Danger zone box */}
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-3">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="h-3.5 w-3.5 text-destructive" />
          <p className="text-sm font-semibold text-destructive">Danger Zone</p>
        </div>

        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-medium">Delete Account</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Permanently delete your account and all data.{' '}
              <span className="text-foreground font-medium">This cannot be undone.</span>
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            disabled={isUpdatingSession}
            onClick={() => setIsDeleteDialogOpen(true)}
            className="shrink-0 gap-1.5"
          >
            {isUpdatingSession
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <Trash2 className="h-3.5 w-3.5" />
            }
            Delete account
          </Button>
        </div>
      </div>

      <ConfirmationDialog
        open={isSessionsDialogOpen}
        onOpenChange={setIsSessionsDialogOpen}
        onConfirm={handleDeleteSessions}
        title="Sign out everywhere?"
        description="You'll be logged out from all other devices. You'll stay signed in on this one."
        confirmText="Confirm log out"
        isLoading={isUpdatingSession}
      />
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteAccount}
        title="Are you absolutely sure?"
        description="This will permanently delete your account, posts, and all data. This cannot be undone."
        confirmText="Delete my account"
        variant="destructive"
        isLoading={isUpdatingSession}
      />
    </div>
  );
};

export default PrivacyPanel;
