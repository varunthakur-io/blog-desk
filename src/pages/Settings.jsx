import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Moon,
  Sun,
  LogOut,
  Trash2,
  Bell,
  UserCog,
  Settings as SettingsIcon,
  Laptop,
  ShieldAlert,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { useSettings } from '@/hooks/profile';

const SectionIcon = ({ icon: Icon, variant = 'default' }) => (
  <div className={`p-1.5 rounded-md ${variant === 'destructive' ? 'bg-destructive/10' : 'bg-muted'}`}>
    <Icon className={`h-4 w-4 ${variant === 'destructive' ? 'text-destructive' : 'text-foreground'}`} />
  </div>
);

const Settings = () => {
  const {
    isSettingsUpdating,
    isPrefsLoading,
    isDarkMode,
    prefs,
    handleToggleDarkMode,
    handlePrefChange,
    handleDeleteSessions,
    handleDeleteAccount,
  } = useSettings();

  const [isSessionsDialogOpen, setIsSessionsDialogOpen] = useState(false);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);

  return (
    <div className="py-2 max-w-3xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-header-title">Settings</h1>
        <p className="page-header-subtitle">Manage your account preferences and security.</p>
      </div>

      <div className="space-y-4">
        {/* Appearance */}
        <Card className="border-border shadow-sm rounded-xl">
          <CardHeader className="pb-3 pt-5 px-6">
            <CardTitle className="flex items-center gap-2.5 text-sm font-semibold">
              <SectionIcon icon={isDarkMode ? Moon : Sun} />
              Appearance
            </CardTitle>
            <CardDescription className="text-xs">Customize how the app looks on your device.</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor="theme-mode" className="text-sm font-medium">Dark Mode</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Switch between light and dark themes.</p>
              </div>
              <Switch id="theme-mode" checked={isDarkMode} onCheckedChange={handleToggleDarkMode} />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border shadow-sm rounded-xl">
          <CardHeader className="pb-3 pt-5 px-6">
            <CardTitle className="flex items-center gap-2.5 text-sm font-semibold">
              <SectionIcon icon={Bell} />
              Notifications
            </CardTitle>
            <CardDescription className="text-xs">Choose what you want to be notified about.</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-5 space-y-5">
            {isPrefsLoading ? (
              <div className="py-3 flex justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label htmlFor="marketing" className="text-sm font-medium">Marketing Emails</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Receive emails about new features and updates.</p>
                  </div>
                  <Switch
                    id="marketing"
                    checked={prefs.marketing}
                    onCheckedChange={(val) => handlePrefChange('marketing', val)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label htmlFor="security" className="text-sm font-medium">Security Alerts</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Get notified about account security events.</p>
                  </div>
                  <Switch
                    id="security"
                    checked={prefs.security}
                    onCheckedChange={(val) => handlePrefChange('security', val)}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Account */}
        <Card className="border-border shadow-sm rounded-xl">
          <CardHeader className="pb-3 pt-5 px-6">
            <CardTitle className="flex items-center gap-2.5 text-sm font-semibold">
              <SectionIcon icon={UserCog} />
              Account
            </CardTitle>
            <CardDescription className="text-xs">Update your profile information.</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Profile Information</p>
                <p className="text-xs text-muted-foreground mt-0.5">Change your name, bio, and avatar.</p>
              </div>
              <Button variant="outline" size="sm" asChild className="rounded-lg shrink-0 text-xs">
                <Link to="/profile">Edit Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/30 shadow-sm rounded-xl">
          <CardHeader className="pb-3 pt-5 px-6">
            <CardTitle className="flex items-center gap-2.5 text-sm font-semibold text-destructive">
              <SectionIcon icon={ShieldAlert} variant="destructive" />
              Danger Zone
            </CardTitle>
            <CardDescription className="text-xs">These actions are permanent and cannot be undone.</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-5 space-y-4">
            {/* Sessions */}
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4 bg-muted/20">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-muted rounded-md shrink-0">
                  <Laptop className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Active Sessions</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Log out from all other devices and browsers.</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={isSettingsUpdating}
                onClick={() => setIsSessionsDialogOpen(true)}
                className="shrink-0 gap-1.5 rounded-lg text-xs"
              >
                <LogOut className="h-3.5 w-3.5" /> Log Out All
              </Button>
            </div>

            {/* Delete Account */}
            <Alert variant="destructive" className="border-destructive/25 bg-destructive/5 rounded-lg">
              <Trash2 className="h-4 w-4" />
              <AlertTitle className="text-sm font-semibold">Delete Account</AlertTitle>
              <AlertDescription className="mt-1.5 flex flex-col gap-3">
                <p className="text-xs text-muted-foreground">
                  Permanently delete your account, posts, comments, and all associated data.
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isSettingsUpdating}
                  onClick={() => setIsAccountDialogOpen(true)}
                  className="w-fit rounded-lg text-xs"
                >
                  Delete My Account
                </Button>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog
        open={isSessionsDialogOpen}
        onOpenChange={setIsSessionsDialogOpen}
        onConfirm={handleDeleteSessions}
        title="Sign out everywhere?"
        description="You will need to sign in again on all other devices."
        confirmText="Confirm Log Out"
        isLoading={isSettingsUpdating}
      />
      <ConfirmationDialog
        open={isAccountDialogOpen}
        onOpenChange={setIsAccountDialogOpen}
        onConfirm={handleDeleteAccount}
        title="Are you absolutely sure?"
        description="This action cannot be undone. All your posts, comments, and profile data will be permanently removed."
        confirmText="Delete My Account"
        variant="destructive"
        isLoading={isSettingsUpdating}
      />
    </div>
  );
};

export default Settings;
