import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';

const AppearancePanel = ({ isDarkMode, handleToggleDarkMode }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Appearance</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Dark Mode</h3>
              <p className="text-muted-foreground text-sm mt-0.5">
                Switch between light and dark themes.
              </p>
            </div>
            <Switch
              checked={isDarkMode}
              onCheckedChange={handleToggleDarkMode}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearancePanel;
