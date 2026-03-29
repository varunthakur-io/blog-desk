import { Loader2, LogOut, Trash2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Privacy & Security</h1>
      </div>

      {/* Sessions card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Sessions</CardTitle>
          <CardDescription>
            Log out from all other devices and browsers. You'll stay signed in here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            size="sm"
            disabled={isUpdatingSession}
            onClick={() => setIsSessionsDialogOpen(true)}
            className="gap-2"
          >
            {isUpdatingSession ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <LogOut className="h-3.5 w-3.5" />
            )}
            Log out all devices
          </Button>
        </CardContent>
      </Card>

      {/* Danger zone card */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-destructive">
            <ShieldAlert className="h-4 w-4" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Permanently delete your account, posts, and all associated data.{' '}
            <span className="font-medium text-foreground">This cannot be undone.</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            size="sm"
            disabled={isUpdatingSession}
            onClick={() => setIsDeleteDialogOpen(true)}
            className="gap-2"
          >
            {isUpdatingSession ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            Delete my account
          </Button>
        </CardContent>
      </Card>

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
