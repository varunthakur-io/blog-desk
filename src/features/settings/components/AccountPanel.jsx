import { useState } from 'react';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

const EyeToggle = ({ show, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
  >
    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
  </button>
);

const AccountPanel = ({
  authUser,
  emailForm,
  setEmailForm,
  emailError,
  handleSaveEmail,
  isSavingEmail,
  passwordForm,
  setPasswordForm,
  passwordError,
  handleSavePassword,
  isSavingPassword,
}) => {
  const [showEmailPw, setShowEmailPw] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Account</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Update your email address and password.
        </p>
      </div>

      {/* Email card — its own <form> so password managers scope it separately */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Email Address</CardTitle>
          <CardDescription>
            Current email: <span className="font-medium text-foreground">{authUser?.email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEmail();
            }}
            autoComplete="on"
            className="space-y-4"
          >
            {emailError && (
              <Alert variant="destructive">
                <AlertDescription>{emailError}</AlertDescription>
              </Alert>
            )}

            <input type="hidden" autoComplete="username" value={authUser?.email || ''} readOnly />

            <div className="space-y-2">
              <Label htmlFor="new-email">New email</Label>
              <Input
                id="new-email"
                name="email"
                type="email"
                value={emailForm.email}
                onChange={(e) => setEmailForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                autoComplete="off"
              />
            </div>

            {/* Current password FIRST — managers see password → new email = change flow */}
            <div className="space-y-2">
              <Label htmlFor="email-current-password">Current password</Label>
              <div className="relative">
                <Input
                  id="email-current-password"
                  name="current-password"
                  type={showEmailPw ? 'text' : 'password'}
                  value={emailForm.password}
                  onChange={(e) => setEmailForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="Your current password"
                  className="pr-10"
                  autoComplete="current-password"
                />
                <EyeToggle show={showEmailPw} onToggle={() => setShowEmailPw((v) => !v)} />
              </div>
              <p className="text-xs text-muted-foreground">Required to confirm the email change.</p>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSavingEmail}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                {isSavingEmail && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Update email
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password card — separate <form> so managers don't mix up current vs new */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Password</CardTitle>
          <CardDescription>
            Keep it safe — use a strong password you don't use elsewhere.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSavePassword();
            }}
            autoComplete="on"
            className="space-y-4"
          >
            {passwordError && (
              <Alert variant="destructive">
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}

            <input
              type="text"
              autoComplete="username"
              name="username"
              value={authUser?.email || ''}
              readOnly
              style={{ display: 'none' }}
            />

            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  name="current-password"
                  type={showCurrentPw ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))
                  }
                  placeholder="Your current password"
                  className="pr-10"
                  autoComplete="current-password"
                />
                <EyeToggle show={showCurrentPw} onToggle={() => setShowCurrentPw((v) => !v)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  name="new-password"
                  type={showNewPw ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                  placeholder="Minimum 8 characters"
                  className="pr-10"
                  autoComplete="off"
                />
                <EyeToggle show={showNewPw} onToggle={() => setShowNewPw((v) => !v)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPw ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))
                  }
                  placeholder="Repeat new password"
                  className="pr-10"
                  autoComplete="new-password"
                />
                <EyeToggle show={showConfirmPw} onToggle={() => setShowConfirmPw((v) => !v)} />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSavingPassword}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                {isSavingPassword && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Update password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountPanel;
