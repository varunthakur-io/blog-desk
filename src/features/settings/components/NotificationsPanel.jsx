import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const NotificationsPanel = ({ prefs, isPrefsLoading, handlePrefChange }) => {
  return (
    <div className="space-y-8">
      <div className="border-border/50 border-b pb-4">
        <h2 className="text-xl font-bold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Choose what you want to be notified about.
        </p>
      </div>

      <div className="space-y-4">
        {isPrefsLoading ? (
          <div className="border-border/60 text-muted-foreground flex animate-pulse items-center justify-center gap-3 rounded-xl border border-dashed p-8 text-sm">
            <Loader2 className="text-primary h-4 w-4 animate-spin" />
            Loading preferences…
          </div>
        ) : (
          <div className="divide-border/40 border-border/60 bg-background/50 divide-y overflow-hidden rounded-xl border shadow-sm">
            <div className="hover:bg-muted/5 flex items-center justify-between p-5 transition-colors">
              <div className="space-y-0.5">
                <h3 className="text-[14px] font-bold">Marketing Emails</h3>
                <p className="text-muted-foreground text-xs font-medium">
                  News about features, tips, and product updates.
                </p>
              </div>
              <Switch
                checked={prefs.marketing}
                onCheckedChange={(val) => handlePrefChange('marketing', val)}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            <div className="hover:bg-muted/5 flex items-center justify-between p-5 transition-colors">
              <div className="space-y-0.5">
                <h3 className="text-[14px] font-bold">Security Alerts</h3>
                <p className="text-muted-foreground text-xs font-medium">
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
