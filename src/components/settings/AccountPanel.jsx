import { useState } from 'react';
import { Loader2, Eye, EyeOff, Mail, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

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
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const EyeToggle = ({ show, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
    >
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Account</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your email address and password.
        </p>
      </div>

      {/* ── Email ── */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Email Address</h3>
        </div>

        {emailError && (
          <Alert variant="destructive" className="rounded-xl">
            <AlertDescription>{emailError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 max-w-lg">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium">New Email</Label>
            <Input
              id="email"
              type="email"
              value={emailForm.email}
              onChange={(e) => setEmailForm((p) => ({ ...p, email: e.target.value }))}
              placeholder={authUser?.email || 'you@example.com'}
              className="h-10 rounded-lg"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email-password" className="text-sm font-medium">
              Current Password
              <span className="text-muted-foreground font-normal ml-1">(required to change email)</span>
            </Label>
            <div className="relative">
              <Input
                id="email-password"
                type={showEmailPassword ? 'text' : 'password'}
                value={emailForm.password}
                onChange={(e) => setEmailForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="Enter your current password"
                className="h-10 rounded-lg pr-10"
              />
              <EyeToggle show={showEmailPassword} onToggle={() => setShowEmailPassword((v) => !v)} />
            </div>
          </div>
        </div>

        <Button
          onClick={handleSaveEmail}
          disabled={isSavingEmail}
          variant="outline"
          className="gap-2 rounded-full px-5"
        >
          {isSavingEmail && <Loader2 className="h-4 w-4 animate-spin" />}
          Update Email
        </Button>
      </div>

      <Separator />

      {/* ── Password ── */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Change Password</h3>
        </div>

        {passwordError && (
          <Alert variant="destructive" className="rounded-xl">
            <AlertDescription>{passwordError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 max-w-lg">
          <div className="space-y-1.5">
            <Label htmlFor="current-password" className="text-sm font-medium">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPw ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                placeholder="Your current password"
                className="h-10 rounded-lg pr-10"
              />
              <EyeToggle show={showCurrentPw} onToggle={() => setShowCurrentPw((v) => !v)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPw ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                placeholder="Minimum 8 characters"
                className="h-10 rounded-lg pr-10"
              />
              <EyeToggle show={showNewPw} onToggle={() => setShowNewPw((v) => !v)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPw ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                placeholder="Repeat new password"
                className="h-10 rounded-lg pr-10"
              />
              <EyeToggle show={showConfirmPw} onToggle={() => setShowConfirmPw((v) => !v)} />
            </div>
          </div>
        </div>

        <Button
          onClick={handleSavePassword}
          disabled={isSavingPassword}
          variant="outline"
          className="gap-2 rounded-full px-5"
        >
          {isSavingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
          Update Password
        </Button>
      </div>
    </div>
  );
};

export default AccountPanel;
