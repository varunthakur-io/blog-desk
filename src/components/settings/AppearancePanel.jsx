import { Sun, Moon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const AppearancePanel = ({ isDarkMode, handleToggleDarkMode }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Appearance</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Customize how Blog Desk looks on your device.
        </p>
      </div>

      <div className="max-w-lg space-y-4">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              {isDarkMode ? (
                <Moon className="h-4 w-4 text-foreground" />
              ) : (
                <Sun className="h-4 w-4 text-foreground" />
              )}
            </div>
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
    </div>
  );
};

export default AppearancePanel;
