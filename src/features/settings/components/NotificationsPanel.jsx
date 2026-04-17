import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const NotificationsPanel = ({ prefs, isPrefsLoading, handlePrefChange }) => {
  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-border/50">
        <h2 className="text-xl font-bold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Choose what you want to be notified about.
        </p>
      </div>

      <div className="space-y-4">
        {isPrefsLoading ? (
          <div className="flex items-center gap-3 p-8 rounded-xl border border-dashed border-border/60 justify-center text-sm text-muted-foreground animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Loading preferences…
          </div>
        ) : (
          <div className="divide-y divide-border/40 rounded-xl border border-border/60 bg-background/50 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-5 hover:bg-muted/5 transition-colors">
              <div className="space-y-0.5">
                <h3 className="text-[14px] font-bold">Marketing Emails</h3>
                <p className="text-xs text-muted-foreground font-medium">
                  News about features, tips, and product updates.
                </p>
              </div>
              <Switch
                checked={prefs.marketing}
                onCheckedChange={(val) => handlePrefChange('marketing', val)}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            <div className="flex items-center justify-between p-5 hover:bg-muted/5 transition-colors">
              <div className="space-y-0.5">
                <h3 className="text-[14px] font-bold">Security Alerts</h3>
                <p className="text-xs text-muted-foreground font-medium">
                  Important alerts about your account security and sign-ins.
                </p>
              </div>
              <Switch
                checked={prefs.security}
                onCheckedChange={(val) => handlePrefChange('security', val)}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;
