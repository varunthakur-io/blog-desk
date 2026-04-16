import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const AppearancePanel = ({ isDarkMode, handleToggleDarkMode }) => {
  return (
    <div className="space-y-6">
      <div className="pb-2">
        <h2 className="text-[17px] font-bold tracking-tight text-foreground">Appearance</h2>
        <p className="text-muted-foreground text-[13px] mt-1 font-medium">
          Customize your visual experience across the platform.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between p-4 rounded-md border border-border/40 bg-muted/20">
          <div className="space-y-0.5">
            <h3 className="text-[14px] font-bold text-foreground">Dark Mode</h3>
            <p className="text-[12px] text-muted-foreground font-medium">
              Switch between light and dark themes.
            </p>
          </div>
          <Switch 
            checked={isDarkMode} 
            onCheckedChange={handleToggleDarkMode} 
            className="data-[state=checked]:bg-foreground"
          />
        </div>
      </div>
    </div>
  );
};

export default AppearancePanel;
