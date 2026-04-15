import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const AppearancePanel = ({ isDarkMode, handleToggleDarkMode }) => {
  return (
    <div className="space-y-8 max-w-2xl">
      <div className="pb-4 border-b border-border/50">
        <h2 className="text-xl font-bold tracking-tight">Appearance</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Customize how Blog Desk looks on your device.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-background/50">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold">Dark Mode</h3>
            <p className="text-xs text-muted-foreground font-medium">
              Toggle between light and dark themes.
            </p>
          </div>
          <Switch 
            checked={isDarkMode} 
            onCheckedChange={handleToggleDarkMode} 
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default AppearancePanel;
