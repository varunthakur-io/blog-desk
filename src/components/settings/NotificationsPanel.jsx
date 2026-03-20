import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const NotificationsPanel = ({ prefs, isPrefsLoading, handlePrefChange }) => {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-medium">Notifications</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Choose what you want to be notified about.
        </p>
      </div>

      {isPrefsLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading preferences…
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-8">
            <div>
              <Label htmlFor="marketing" className="text-sm font-medium cursor-pointer">
                Marketing Emails
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                News about features, tips, and product updates.
              </p>
            </div>
            <Switch
              id="marketing"
              checked={prefs.marketing}
              onCheckedChange={(val) => handlePrefChange('marketing', val)}
            />
          </div>

          <Separator />

          <div className="flex items-start justify-between gap-8">
            <div>
              <Label htmlFor="security" className="text-sm font-medium cursor-pointer">
                Security Alerts
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Important alerts about your account security.
              </p>
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
