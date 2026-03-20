import { useState } from 'react';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const EyeToggle = ({ show, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
  >
    {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
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
  const [showEmailPw,   setShowEmailPw]   = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw,     setShowNewPw]     = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  return (
    <div className="space-y-5">
      {/* Heading */}
      <div>
        <h2 className="text-base font-semibold">Account</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your email address and password.
        </p>
      </div>

      {/* Email box */}
      <div className="rounded-lg border border-border p-4 space-y-4">
        <div>
          <p className="text-sm font-medium">Email Address</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Current: <span className="font-medium text-foreground">{authUser?.email}</span>
          </p>
        </div>

        {emailError && (
          <Alert variant="destructive">
            <AlertDescription className="text-sm">{emailError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium">New Email</Label>
            <Input
              id="email"
              type="email"
              value={emailForm.email}
              onChange={(e) => setEmailForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="you@example.com"
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email-password" className="text-sm font-medium">
              Confirm with password
            </Label>
            <div className="relative">
              <Input
                id="email-password"
                type={showEmailPw ? 'text' : 'password'}
                value={emailForm.password}
                onChange={(e) => setEmailForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="Your current password"
                className="h-9 text-sm pr-10"
              />
              <EyeToggle show={showEmailPw} onToggle={() => setShowEmailPw(v => !v)} />
            </div>
          </div>
        </div>

        <Button
          onClick={handleSaveEmail}
          disabled={isSavingEmail}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          {isSavingEmail && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Update email
        </Button>
      </div>

      {/* Password box */}
      <div className="rounded-lg border border-border p-4 space-y-4">
        <div>
          <p className="text-sm font-medium">Change Password</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Use a strong password you don't use elsewhere.
          </p>
        </div>

        {passwordError && (
          <Alert variant="destructive">
            <AlertDescription className="text-sm">{passwordError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="current-password" className="text-sm font-medium">Current password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPw ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                placeholder="Your current password"
                className="h-9 text-sm pr-10"
              />
              <EyeToggle show={showCurrentPw} onToggle={() => setShowCurrentPw(v => !v)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-password" className="text-sm font-medium">New password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPw ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                placeholder="Minimum 8 characters"
                className="h-9 text-sm pr-10"
              />
              <EyeToggle show={showNewPw} onToggle={() => setShowNewPw(v => !v)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm new password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPw ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                placeholder="Repeat new password"
                className="h-9 text-sm pr-10"
              />
              <EyeToggle show={showConfirmPw} onToggle={() => setShowConfirmPw(v => !v)} />
            </div>
          </div>
        </div>

        <Button
          onClick={handleSavePassword}
          disabled={isSavingPassword}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          {isSavingPassword && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Update password
        </Button>
      </div>
    </div>
  );
};

export default AccountPanel;
