import { useDispatch } from 'react-redux';
import { Moon, Sun, LogOut, Trash2, Globe, Settings as SettingsIcon } from 'lucide-react';

import useDarkMode from '../hooks/useDarkMode';
import { authService } from '../services/authService';
import { clearUser } from '../store/authSlice';
import { useNavigate } from 'react-router';
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
import { Alert, AlertDescription } from '@/components/ui/alert';

const Settings = () => {
  const [isDarkMode, setDarkMode] = useDarkMode();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function to actually toggle dark mode
  const handleToggleDarkMode = () => {
    setDarkMode(!isDarkMode);
  };

  // Function to handle delete sessions
  const handleDeleteSessions = async () => {
    try {
      if (window.confirm('Areyou sure you want to log out from all devices?')) {
        await authService.deleteAllSessions();
        dispatch(clearUser());
        navigate('/login');
      }
    } catch (err) {
      console.error('Error deleting sessions:', err);
      alert('Failed to delete sessions. Please try again later.');
    }
  };

  // Function to handle delete account
  const handleDeleteAccount = async () => {
    try {
      if (
        window.confirm(
          'Are you sure you want to delete your account? This action cannot be undone.'
        )
      ) {
        await authService.deleteAccount();
        dispatch(clearUser());
        navigate('/login');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <SettingsIcon className="mr-2 h-6 w-6" />
            Settings
          </CardTitle>
          <CardDescription>
            Manage your account settings and preferences.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">General</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base cursor-pointer flex items-center">
                    {isDarkMode ? (
                      <Moon className="mr-2 h-4 w-4" />
                    ) : (
                      <Sun className="mr-2 h-4 w-4" />
                    )}
                    Dark Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={handleToggleDarkMode}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-base flex items-center">
                  <Globe className="mr-2 h-4 w-4" />
                  Language
                </Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Account & Security</h3>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="font-medium">Session Management</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Log out from all active sessions across all your devices.
                  </p>
                </div>
                <Button 
                  onClick={handleDeleteSessions}
                  variant="destructive"
                  className="w-full mt-3"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out from All Devices
                </Button>
              </div>
              
              <Alert>
                <Trash2 className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-destructive">Danger Zone</h4>
                      <p className="text-sm">
                        Permanently delete your account and all associated data. This action is irreversible.
                      </p>
                    </div>
                    <Button 
                      onClick={handleDeleteAccount}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete My Account
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
