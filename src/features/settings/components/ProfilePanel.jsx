import { Camera, Loader2, Save } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const ProfilePanel = ({
  profileForm,
  setProfileForm,
  avatarPreview,
  fileInputRef,
  handleAvatarSelect,
  handleSaveProfile,
  isSavingProfile,
  profileError,
  authUser,
}) => {
  const initial =
    profileForm.name?.charAt(0).toUpperCase() || authUser?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="space-y-6">
      <div className="pb-1">
        <h2 className="text-foreground text-[16px] font-bold tracking-tight">Public profile</h2>
        <p className="text-muted-foreground mt-0.5 text-[12px] font-medium">
          How people see you when reading your stories.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile photo */}
        <div className="flex flex-col items-center gap-8 sm:flex-row">
          <div className="group relative size-20 shrink-0">
            <Avatar className="border-border/40 group-hover:ring-primary/5 h-full w-full border shadow-sm transition-all group-hover:ring-4">
              <AvatarImage src={avatarPreview} className="object-cover" />
              <AvatarFallback className="bg-muted text-muted-foreground text-xl font-bold">
                {initial}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 opacity-0 backdrop-blur-[2px] transition-all group-hover:opacity-100"
            >
              <Camera className="h-5 w-5 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarSelect}
            />
          </div>

          <div className="flex-1 space-y-2.5">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-border/60 h-8 rounded-md px-3 text-[11px] font-bold shadow-sm transition-all active:scale-95"
              >
                Upload avatar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="text-muted-foreground hover:text-destructive h-8 rounded-md px-3 text-[11px] font-bold transition-all active:scale-95"
              >
                Remove
              </Button>
            </div>
            <p className="text-muted-foreground/40 text-[10px] leading-none font-medium">
              Accepts .jpg, .png or .webp. Max size 3MB.
            </p>
          </div>
        </div>

        <Separator className="opacity-40" />

        {/* Form details */}
        <div className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-foreground text-[13px] font-bold tracking-tight"
              >
                Display name
              </Label>
              <Input
                id="name"
                value={profileForm.name}
                onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Full Name"
                className={cn(
                  'border-border/60 bg-muted/20 focus:bg-background h-9 rounded-md text-[13px] font-medium transition-all',
                  profileError && 'border-destructive/50 ring-destructive/10',
                )}
              />
              {profileError ? (
                <p className="text-destructive px-1 text-[11px] font-bold">{profileError}</p>
              ) : (
                <p className="text-muted-foreground/50 px-1 text-[11px] font-medium">
                  Visible on your posts and header.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-display" className="text-foreground text-[13px] font-bold">
                Email
              </Label>
              <Input
                id="email-display"
                value={authUser?.email || ''}
                readOnly
                className="border-border/40 bg-muted text-muted-foreground/40 h-9 cursor-not-allowed rounded-md border-none text-[13px] opacity-70"
              />
              <p className="text-muted-foreground/40 px-1 text-[11px] font-medium">
                To change, visit the <span className="text-primary/70 font-bold">Account</span> tab.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-foreground text-[13px] font-bold">
              About you
            </Label>
            <div className="relative">
              <Textarea
                id="bio"
                value={profileForm.bio}
                onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Tell us about yourself…"
                className="border-border/60 bg-muted/20 focus:bg-background min-h-[90px] resize-none rounded-md p-3 text-[13px] leading-relaxed transition-all"
                maxLength={200}
              />
            </div>
            <div className="flex items-center justify-between px-1">
              <p className="text-muted-foreground/40 text-[11px] font-medium">
                Keep it short and catchy.
              </p>
              <p
                className={cn(
                  'text-[10px] font-bold tracking-tight tabular-nums',
                  (profileForm.bio?.length || 0) > 180
                    ? 'text-orange-500'
                    : 'text-muted-foreground/40',
                )}
              >
                {profileForm.bio?.length || 0} / 200
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button
            onClick={handleSaveProfile}
            disabled={isSavingProfile}
            className="bg-foreground text-background h-9 rounded-md px-6 text-xs font-bold shadow-sm transition-all hover:opacity-90 active:scale-95"
          >
            {isSavingProfile ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
