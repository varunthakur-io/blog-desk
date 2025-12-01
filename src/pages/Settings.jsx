import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Moon,
  Sun,
  LogOut,
  Trash2,
  Globe,
  Settings as SettingsIcon,
  Laptop,
  ShieldAlert,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import useDarkMode from '../hooks/useDarkMode';
import { authService } from '../services/authService';
import { clearUser } from '../store/authSlice';

// UI Components
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const Settings = () => {
  const [isDarkMode, setDarkMode] = useDarkMode();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // --- Sync Logic ---
  // This ensures the Switch stays in sync if the theme is changed from the Navbar
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          const isDarkNow = document.documentElement.classList.contains('dark');
          if (isDarkNow !== isDarkMode) {
            setDarkMode(isDarkNow);
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true, // Configure it to listen to attribute changes
      attributeFilter: ['class'], // Filter it to only look at the class attribute
    });

    return () => observer.disconnect();
  }, [isDarkMode, setDarkMode]);

  // Toggle Dark Mode
  const handleToggleDarkMode = (checked) => {
    setDarkMode(checked);
    toast.success(`Theme switched to ${checked ? 'Dark' : 'Light'}`);
  };

  // Handle Delete Sessions
  const handleDeleteSessions = async () => {
    setIsLoading(true);
    try {
      await authService.deleteAllSessions();
      dispatch(clearUser());
      navigate('/login');
      toast.success('Logged out from all devices!');
    } catch (err) {
      console.error('Error deleting sessions:', err);
      toast.error('Failed to delete sessions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Delete Account
  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      await authService.deleteAccount();
      dispatch(clearUser());
      navigate('/login');
      toast.success('Account deleted successfully!');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences and security settings.
        </p>
      </div>

      <div className="space-y-6">
        {/* General Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              General Preferences
            </CardTitle>
            <CardDescription>
              Customize your interface experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-muted rounded-full">
                  {isDarkMode ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
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

            <Separator />

            {/* Language Select */}
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-muted rounded-full">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <Label className="text-base font-medium">Language</Label>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred language.
                  </p>
                </div>
              </div>
              <Select defaultValue="en">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings Card */}
        <Card className="border-destructive/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Manage sensitive account actions. Proceed with caution.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Session Management */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-background">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-muted rounded-full mt-1">
                  <Laptop className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-medium">Active Sessions</h4>
                  <p className="text-sm text-muted-foreground max-w-[250px] sm:max-w-md">
                    Log out from all other devices where you are currently
                    signed in.
                  </p>
                </div>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={isLoading}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sign out everywhere?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will log you out from all devices, including this
                      one. You will need to log in again.
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

            {/* Delete Account Alert */}
            <Alert
              variant="destructive"
              className="border-destructive/50 bg-destructive/5"
            >
              <Trash2 className="h-4 w-4" />
              <AlertTitle>Delete Account</AlertTitle>
              <AlertDescription className="mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-sm text-destructive-foreground/80">
                  Permanently remove your account and all associated data. This
                  action is irreversible.
                </p>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isLoading}
                    >
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
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
  );
};

export default Settings;
