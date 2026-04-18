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
    className="text-muted-foreground/50 hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 p-1 transition-colors"
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
        <h2 className="text-foreground text-[17px] font-bold tracking-tight">Account settings</h2>
        <p className="text-muted-foreground mt-1 text-[13px] font-medium">
          Manage your email and security preferences.
        </p>
      </div>

      {/* Email Section */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-foreground text-[14px] font-bold">Email Address</h3>
          <p className="text-muted-foreground text-[12px] font-medium">
            Your current email is{' '}
            <span className="text-foreground font-bold">{authUser?.email}</span>
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
              <Label htmlFor="new-email" className="text-foreground text-[13px] font-bold">
                New email
              </Label>
              <Input
                id="new-email"
                name="email"
                type="email"
                value={emailForm.email}
                onChange={(e) => setEmailForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                className={cn(
                  'border-border/60 bg-muted/20 focus:bg-background h-10 rounded-md text-[14px] font-medium tracking-tight transition-all',
                  emailError && 'border-destructive/50 ring-destructive/10',
                )}
              />
              {emailError && (
                <p className="text-destructive animate-in fade-in px-1 text-[11px] font-bold duration-300">
                  {emailError}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="email-current-password"
                className="text-foreground text-[13px] font-bold"
              >
                Current password
              </Label>
              <div className="relative">
                <Input
                  id="email-current-password"
                  name="current-password"
                  type={showEmailPw ? 'text' : 'password'}
                  value={emailForm.password}
                  onChange={(e) => setEmailForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="Confirm password"
                  className="border-border/60 bg-muted/20 focus:bg-background h-10 rounded-md pr-10 text-[14px] font-medium transition-all"
                />
                <EyeToggle show={showEmailPw} onToggle={() => setShowEmailPw((v) => !v)} />
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <Button
              type="submit"
              disabled={isSavingEmail}
              className="bg-foreground text-background h-9 rounded-md px-6 text-xs font-bold shadow-sm transition-all hover:opacity-90 active:scale-95"
            >
              {isSavingEmail && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
              Update email
            </Button>
          </div>
        </form>
      </section>

      <Separator className="opacity-40" />

      {/* Password Section */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-foreground text-[14px] font-bold">Change Password</h3>
          <p className="text-muted-foreground text-[12px] font-medium">
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
              <Label
                htmlFor="current-password-field"
                className="text-foreground text-[13px] font-bold"
              >
                Current password
              </Label>
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
                    'border-border/60 bg-muted/20 focus:bg-background h-10 rounded-md pr-10 text-[14px] font-medium transition-all',
                    passwordError && 'border-destructive/50',
                  )}
                />
                <EyeToggle show={showCurrentPw} onToggle={() => setShowCurrentPw((v) => !v)} />
              </div>
              {passwordError && (
                <p className="text-destructive animate-in fade-in px-1 text-[11px] font-bold duration-300">
                  {passwordError}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="new-password" className="text-foreground text-[13px] font-bold">
                  New password
                </Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    name="new-password"
                    type={showNewPw ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
                    }
                    placeholder="Min. 8 characters"
                    className="border-border/60 bg-muted/20 focus:bg-background h-10 rounded-md pr-10 text-[14px] font-medium transition-all"
                  />
                  <EyeToggle show={showNewPw} onToggle={() => setShowNewPw((v) => !v)} />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="confirm-password" className="text-foreground text-[13px] font-bold">
                  Confirm password
                </Label>
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
                    className="border-border/60 bg-muted/20 focus:bg-background h-10 rounded-md pr-10 text-[14px] font-medium transition-all"
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
              className="bg-foreground text-background h-9 rounded-md px-6 text-xs font-bold shadow-sm transition-all hover:opacity-90 active:scale-95"
            >
              {isSavingPassword && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
              Save password
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AccountPanel;
