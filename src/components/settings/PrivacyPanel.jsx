import { Loader2, LogOut, Trash2, Laptop, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Privacy & Security</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your sessions and account data.
        </p>
      </div>

      {/* Active Sessions */}
      <div className="max-w-lg space-y-3">
        <h3 className="text-sm font-semibold">Active Sessions</h3>
        <div className="rounded-xl border border-border p-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-muted rounded-lg shrink-0">
              <Laptop className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Sign out everywhere</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Log out from all other devices and browsers. You'll stay signed in here.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={isUpdatingSession}
            onClick={() => setIsSessionsDialogOpen(true)}
            className="shrink-0 gap-1.5 rounded-lg text-xs"
          >
            {isUpdatingSession ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <LogOut className="h-3.5 w-3.5" />
            )}
            Log Out All
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="max-w-lg space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-destructive" />
          <h3 className="text-sm font-semibold text-destructive">Danger Zone</h3>
        </div>

        <Alert
          variant="destructive"
          className="border-destructive/25 bg-destructive/5 rounded-xl"
        >
          <Trash2 className="h-4 w-4" />
          <AlertTitle className="text-sm font-semibold">Delete Account</AlertTitle>
          <AlertDescription className="mt-1.5 space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Permanently delete your account, all your posts, comments, and associated data.
              This action <strong className="text-foreground">cannot be undone</strong>.
            </p>
            <Button
              variant="destructive"
              size="sm"
              disabled={isUpdatingSession}
              onClick={() => setIsDeleteDialogOpen(true)}
              className="rounded-lg text-xs gap-1.5"
            >
              {isUpdatingSession ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              Delete My Account
            </Button>
          </AlertDescription>
        </Alert>
      </div>

      {/* Dialogs */}
      <ConfirmationDialog
        open={isSessionsDialogOpen}
        onOpenChange={setIsSessionsDialogOpen}
        onConfirm={handleDeleteSessions}
        title="Sign out everywhere?"
        description="You'll be logged out from all other devices. You'll stay signed in on this one."
        confirmText="Confirm Log Out"
        isLoading={isUpdatingSession}
      />
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteAccount}
        title="Are you absolutely sure?"
        description="This will permanently delete your account, posts, and all data. This cannot be undone."
        confirmText="Delete My Account"
        variant="destructive"
        isLoading={isUpdatingSession}
      />
    </div>
  );
};

export default PrivacyPanel;
