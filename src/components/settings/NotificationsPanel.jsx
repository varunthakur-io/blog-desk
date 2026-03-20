import { Loader2, Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const NotificationsPanel = ({ prefs, isPrefsLoading, handlePrefChange }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Notifications</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose what you want to be notified about.
        </p>
      </div>

      {isPrefsLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading preferences…
        </div>
      ) : (
        <div className="max-w-lg space-y-1 rounded-xl border border-border overflow-hidden">
          {/* Marketing */}
          <div className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-muted rounded-md mt-0.5 shrink-0">
                <Bell className="h-3.5 w-3.5 text-foreground" />
              </div>
              <div>
                <Label htmlFor="marketing" className="text-sm font-medium cursor-pointer">
                  Marketing Emails
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  News about features, tips, and product updates.
                </p>
              </div>
            </div>
            <Switch
              id="marketing"
              checked={prefs.marketing}
              onCheckedChange={(val) => handlePrefChange('marketing', val)}
            />
          </div>

          <Separator />

          {/* Security */}
          <div className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-muted rounded-md mt-0.5 shrink-0">
                <Bell className="h-3.5 w-3.5 text-foreground" />
              </div>
              <div>
                <Label htmlFor="security" className="text-sm font-medium cursor-pointer">
                  Security Alerts
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Important alerts about your account security.
                </p>
              </div>
            </div>
            <Switch
              id="security"
              checked={prefs.security}
              onCheckedChange={(val) => handlePrefChange('security', val)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;
