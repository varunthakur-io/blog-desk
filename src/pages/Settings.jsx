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

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Hooks
import { useSettings } from '@/hooks/profile';

const Settings = () => {
  const {
    // loading states
    isSettingsUpdating,
    isPrefsLoading,

    // settings values
    isDarkMode,
    prefs,

    // actions
    handleToggleDarkMode,
    handlePrefChange,
    handleDeleteSessions,
    handleDeleteAccount,
  } = useSettings();

  return (
    <div className="py-2 max-w-6xl animate-in fade-in duration-500 mx-auto">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-lg">
          Manage your account preferences and security settings.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="space-y-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-md">
                  <SettingsIcon className="h-5 w-5 text-primary" />
                </div>
                Appearance
              </CardTitle>
              <CardDescription>Customize how the application looks on your device.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-muted rounded-full">
                    {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  </div>
                  <div>
                    <Label htmlFor="theme-mode" className="text-base font-medium">
                      Dark Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark themes.
                    </p>
                  </div>
                </div>
                <Switch
                  id="theme-mode"
                  checked={isDarkMode}
                  onCheckedChange={handleToggleDarkMode}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-md">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                Notifications
              </CardTitle>
              <CardDescription>Choose what you want to be notified about.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isPrefsLoading ? (
                <div className="py-4 flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between space-x-4">
                    <div>
                      <Label htmlFor="marketing" className="text-base font-medium">
                        Marketing Emails
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about new features.
                      </p>
                    </div>
                    <Switch
                      id="marketing"
                      checked={prefs.marketing}
                      onCheckedChange={(val) => handlePrefChange('marketing', val)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between space-x-4">
                    <div>
                      <Label htmlFor="security" className="text-base font-medium">
                        Security Alerts
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about security events.
                      </p>
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
        </div>

        <div className="space-y-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-md">
                  <UserCog className="h-5 w-5 text-primary" />
                </div>
                Account
              </CardTitle>
              <CardDescription>Update your profile details.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-base font-medium">Profile Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Change your name, bio, and avatar.
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/profile">Go to Profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 hover:border-destructive/40 transition-all shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <div className="p-2 bg-destructive/10 rounded-md">
                  <ShieldAlert className="h-5 w-5 text-destructive" />
                </div>
                Danger Zone
              </CardTitle>
              <CardDescription>Manage sensitive actions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-background/50 hover:bg-background transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-muted rounded-full mt-1">
                    <Laptop className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium">Active Sessions</h4>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Log out from all other devices.
                    </p>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" disabled={isSettingsUpdating}>
                      <LogOut className="mr-2 h-4 w-4" /> Log Out All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Sign out everywhere?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You will need to log in again.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteSessions}>
                        Confirm Log Out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
                <Trash2 className="h-4 w-4" />
                <AlertTitle>Delete Account</AlertTitle>
                <AlertDescription className="mt-2 flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground">Permanently remove your account.</p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" disabled={isSettingsUpdating}>
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete My Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
