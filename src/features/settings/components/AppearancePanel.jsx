import { Switch } from '@/components/ui/switch';

// AppearancePanel: UI theme and visual customization settings
const AppearancePanel = ({ isDarkMode, handleToggleDarkMode }) => {
  return (
    <div className="space-y-6">
      {/* Panel Header */}
      <div className="pb-2">
        <h2 className="text-foreground text-[17px] font-bold tracking-tight">Appearance</h2>
        <p className="text-muted-foreground mt-1 text-[13px] font-medium">
          Customize your visual experience across the platform.
        </p>
      </div>

      {/* Theme selection controls */}
      <div className="space-y-2">
        <div className="border-border/40 bg-muted/20 flex items-center justify-between rounded-md border p-4">
          <div className="space-y-0.5">
            <h3 className="text-foreground text-[14px] font-bold">Dark Mode</h3>
            <p className="text-muted-foreground text-[12px] font-medium">
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
