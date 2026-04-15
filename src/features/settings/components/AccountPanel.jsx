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
    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors p-1"
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
    <div className="space-y-12 max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="pb-4 border-b border-border/50">
        <h2 className="text-xl font-bold tracking-tight">Account settings</h2>
        <p className="text-muted-foreground text-sm mt-1 font-medium">
          Manage your email address and security preferences.
        </p>
      </div>

      {/* Email Section */}
      <section className="space-y-8">
        <div className="space-y-1">
          <h3 className="text-[15px] font-black uppercase tracking-wider text-foreground/80">Email Address</h3>
          <p className="text-xs text-muted-foreground font-medium italic">
            Your current email is <span className="text-primary font-bold">{authUser?.email}</span>
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
            <div className="space-y-2.5">
              <Label htmlFor="new-email" className="text-[12px] font-bold text-foreground/80">New email</Label>
              <Input
                id="new-email"
                name="email"
                type="email"
                value={emailForm.email}
                onChange={(e) => setEmailForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                className={cn(
                  "rounded-xl border-border/60 bg-background/50 focus:bg-background transition-all h-11 text-sm font-medium",
                  emailError && "border-destructive/50 ring-destructive/10"
                )}
              />
              {emailError && (
                <p className="text-[11px] text-destructive font-bold uppercase tracking-wider px-1 animate-in fade-in duration-300">
                  {emailError}
                </p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="email-current-password" className="text-[12px] font-bold text-foreground/80">Current password</Label>
              <div className="relative">
                <Input
                  id="email-current-password"
                  name="current-password"
                  type={showEmailPw ? 'text' : 'password'}
                  value={emailForm.password}
                  onChange={(e) => setEmailForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="Confirm with your password"
                  className="rounded-xl border-border/60 bg-background/50 focus:bg-background transition-all h-11 pr-10 text-sm font-medium"
                />
                <EyeToggle show={showEmailPw} onToggle={() => setShowEmailPw((v) => !v)} />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSavingEmail}
              className="rounded-full px-8 font-black text-[11px] uppercase tracking-widest shadow-md h-10 active:scale-95 transition-all bg-primary"
            >
              {isSavingEmail && <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />}
              Update email
            </Button>
          </div>
        </form>
      </section>

      <Separator className="opacity-40" />

      {/* Password Section */}
      <section className="space-y-8">
        <div className="space-y-1">
          <h3 className="text-[15px] font-black uppercase tracking-wider text-foreground/80">Change Password</h3>
          <p className="text-xs text-muted-foreground font-medium italic">
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
            <div className="space-y-2.5">
              <Label htmlFor="current-password-field" className="text-[12px] font-bold text-foreground/80">Current password</Label>
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
                    "rounded-xl border-border/60 bg-background/50 focus:bg-background transition-all h-11 pr-10 text-sm font-medium",
                    passwordError && "border-destructive/50"
                  )}
                />
                <EyeToggle show={showCurrentPw} onToggle={() => setShowCurrentPw((v) => !v)} />
              </div>
              {passwordError && (
                <p className="text-[11px] text-destructive font-bold uppercase tracking-wider px-1 animate-in fade-in duration-300">
                  {passwordError}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label htmlFor="new-password" className="text-[12px] font-bold text-foreground/80">New password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    name="new-password"
                    type={showNewPw ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                    placeholder="Min. 8 characters"
                    className="rounded-xl border-border/60 bg-background/50 focus:bg-background transition-all h-11 pr-10 text-sm font-medium"
                  />
                  <EyeToggle show={showNewPw} onToggle={() => setShowNewPw((v) => !v)} />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="confirm-password" className="text-[12px] font-bold text-foreground/80">Confirm password</Label>
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
                    className="rounded-xl border-border/60 bg-background/50 focus:bg-background transition-all h-11 pr-10 text-sm font-medium"
                  />
                  <EyeToggle show={showConfirmPw} onToggle={() => setShowConfirmPw((v) => !v)} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSavingPassword}
              className="rounded-full px-8 font-black text-[11px] uppercase tracking-widest shadow-md h-10 active:scale-95 transition-all bg-primary"
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
