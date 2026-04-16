import { useState } from 'react';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const EyeToggle = ({ show, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors p-1"
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
    <div className="space-y-8">
      <div className="pb-2">
        <h2 className="text-[17px] font-bold tracking-tight text-foreground">Account settings</h2>
        <p className="text-muted-foreground text-[13px] mt-1 font-medium">
          Manage your email and security preferences.
        </p>
      </div>

      {/* Email Section */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-[14px] font-bold text-foreground">Email Address</h3>
          <p className="text-[12px] text-muted-foreground font-medium">
            Your current email is <span className="text-foreground font-bold">{authUser?.email}</span>
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveEmail();
          }}
          autoComplete="on"
          className="space-y-6"
        >
          <div className="grid gap-6">
            <div className="space-y-3">
              <Label htmlFor="new-email" className="text-[13px] font-bold text-foreground">New email</Label>
              <Input
                id="new-email"
                name="email"
                type="email"
                value={emailForm.email}
                onChange={(e) => setEmailForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                className={cn(
                  "rounded-md border-border/60 bg-muted/20 focus:bg-background transition-all h-10 text-[14px] font-medium tracking-tight",
                  emailError && "border-destructive/50 ring-destructive/10"
                )}
              />
              {emailError && (
                <p className="text-[11px] text-destructive font-bold px-1 animate-in fade-in duration-300">
                  {emailError}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="email-current-password" className="text-[13px] font-bold text-foreground">Current password</Label>
              <div className="relative">
                <Input
                  id="email-current-password"
                  name="current-password"
                  type={showEmailPw ? 'text' : 'password'}
                  value={emailForm.password}
                  onChange={(e) => setEmailForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="Confirm password"
                  className="rounded-md border-border/60 bg-muted/20 focus:bg-background transition-all h-10 pr-10 text-[14px] font-medium"
                />
                <EyeToggle show={showEmailPw} onToggle={() => setShowEmailPw((v) => !v)} />
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <Button
              type="submit"
              disabled={isSavingEmail}
              className="rounded-md px-6 h-9 font-bold text-xs shadow-sm bg-foreground text-background hover:opacity-90 active:scale-95 transition-all"
            >
              {isSavingEmail && <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />}
              Update email
            </Button>
          </div>
        </form>
      </section>

      <Separator className="opacity-40" />

      {/* Password Section */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-[14px] font-bold text-foreground">Change Password</h3>
          <p className="text-[12px] text-muted-foreground font-medium">
            Keep your account secure with a strong password.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSavePassword();
          }}
          autoComplete="on"
          className="space-y-6"
        >
          <div className="grid gap-6">
            <div className="space-y-3">
              <Label htmlFor="current-password-field" className="text-[13px] font-bold text-foreground">Current password</Label>
              <div className="relative">
                <Input
                  id="current-password-field"
                  name="current-password"
                  type={showCurrentPw ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))
                  }
                  placeholder="Old password"
                  className={cn(
                    "rounded-md border-border/60 bg-muted/20 focus:bg-background transition-all h-10 pr-10 text-[14px] font-medium",
                    passwordError && "border-destructive/50"
                  )}
                />
                <EyeToggle show={showCurrentPw} onToggle={() => setShowCurrentPw((v) => !v)} />
              </div>
              {passwordError && (
                <p className="text-[11px] text-destructive font-bold px-1 animate-in fade-in duration-300">
                  {passwordError}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="new-password" className="text-[13px] font-bold text-foreground">New password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    name="new-password"
                    type={showNewPw ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                    placeholder="Min. 8 characters"
                    className="rounded-md border-border/60 bg-muted/20 focus:bg-background transition-all h-10 pr-10 text-[14px] font-medium"
                  />
                  <EyeToggle show={showNewPw} onToggle={() => setShowNewPw((v) => !v)} />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="confirm-password" className="text-[13px] font-bold text-foreground">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirmPw ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))
                    }
                    placeholder="Repeat password"
                    className="rounded-md border-border/60 bg-muted/20 focus:bg-background transition-all h-10 pr-10 text-[14px] font-medium"
                  />
                  <EyeToggle show={showConfirmPw} onToggle={() => setShowConfirmPw((v) => !v)} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <Button
              type="submit"
              disabled={isSavingPassword}
              className="rounded-md px-6 h-9 font-bold text-xs shadow-sm bg-foreground text-background hover:opacity-90 active:scale-95 transition-all"
            >
              {isSavingPassword && <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />}
              Save password
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AccountPanel;
