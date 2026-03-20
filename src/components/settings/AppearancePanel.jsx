import { Sun, Moon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const AppearancePanel = ({ isDarkMode, handleToggleDarkMode }) => {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-medium">Appearance</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Customize how Blog Desk looks on your device.
        </p>
      </div>

      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          {isDarkMode
            ? <Moon className="h-4 w-4 text-muted-foreground shrink-0" />
            : <Sun  className="h-4 w-4 text-muted-foreground shrink-0" />
          }
          <div>
            <Label htmlFor="dark-mode" className="text-sm font-medium cursor-pointer">
              Dark Mode
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Switch between light and dark themes.
            </p>
          </div>
        </div>
        <Switch
          id="dark-mode"
          checked={isDarkMode}
          onCheckedChange={handleToggleDarkMode}
        />
      </div>
    </div>
  );
};

export default AppearancePanel;
