import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const NotificationsPanel = ({ prefs, isPrefsLoading, handlePrefChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Notifications</h1>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {isPrefsLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading preferences…
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Marketing Emails</h3>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    News about features, tips, and product updates.
                  </p>
                </div>
                <Switch
                  checked={prefs.marketing}
                  onCheckedChange={(val) => handlePrefChange('marketing', val)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Security Alerts</h3>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    Important alerts about your account security and sign-ins.
                  </p>
                </div>
                <Switch
                  checked={prefs.security}
                  onCheckedChange={(val) => handlePrefChange('security', val)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPanel;
