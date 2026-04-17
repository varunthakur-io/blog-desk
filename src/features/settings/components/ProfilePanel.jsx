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
        <h2 className="text-[16px] font-bold tracking-tight text-foreground">Public profile</h2>
        <p className="text-muted-foreground text-[12px] mt-0.5 font-medium">
          How people see you when reading your stories.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile photo */}
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="relative group size-20 shrink-0">
            <Avatar className="h-full w-full border border-border/40 shadow-sm transition-all group-hover:ring-4 group-hover:ring-primary/5">
              <AvatarImage src={avatarPreview} className="object-cover" />
              <AvatarFallback className="text-xl font-bold bg-muted text-muted-foreground">{initial}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer backdrop-blur-[2px]"
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
                className="rounded-md px-3 font-bold text-[11px] shadow-sm active:scale-95 transition-all h-8 border-border/60"
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
                className="rounded-md px-3 font-bold text-[11px] text-muted-foreground hover:text-destructive active:scale-95 transition-all h-8"
              >
                Remove
              </Button>
            </div>
            <p className="text-[10px] font-medium text-muted-foreground/40 leading-none">
              Accepts .jpg, .png or .webp. Max size 3MB.
            </p>
          </div>
        </div>

        <Separator className="opacity-40" />

        {/* Form details */}
        <div className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[13px] font-bold text-foreground tracking-tight">
                Display name
              </Label>
              <Input
                id="name"
                value={profileForm.name}
                onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Full Name"
                className={cn(
                  "rounded-md border-border/60 bg-muted/20 focus:bg-background transition-all h-9 text-[13px] font-medium",
                  profileError && "border-destructive/50 ring-destructive/10"
                )}
              />
              {profileError ? (
                <p className="text-[11px] text-destructive font-bold px-1">
                  {profileError}
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground/50 font-medium px-1">Visible on your posts and header.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-display" className="text-[13px] font-bold text-foreground">
                Email
              </Label>
              <Input
                id="email-display"
                value={authUser?.email || ''}
                readOnly
                className="rounded-md border-border/40 bg-muted text-muted-foreground/40 cursor-not-allowed h-9 text-[13px] opacity-70 border-none"
              />
              <p className="text-[11px] text-muted-foreground/40 font-medium px-1">To change, visit the <span className="text-primary/70 font-bold">Account</span> tab.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-[13px] font-bold text-foreground">
              About you
            </Label>
            <div className="relative">
              <Textarea
                id="bio"
                value={profileForm.bio}
                onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Tell us about yourself…"
                className="resize-none min-h-[90px] rounded-md border-border/60 bg-muted/20 focus:bg-background transition-all p-3 text-[13px] leading-relaxed"
                maxLength={200}
              />
            </div>
            <div className="flex justify-between items-center px-1">
              <p className="text-[11px] text-muted-foreground/40 font-medium">Keep it short and catchy.</p>
              <p className={cn(
                "text-[10px] font-bold tabular-nums tracking-tight",
                (profileForm.bio?.length || 0) > 180 ? "text-orange-500" : "text-muted-foreground/40"
              )}>
                {profileForm.bio?.length || 0} / 200
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button 
            onClick={handleSaveProfile} 
            disabled={isSavingProfile} 
            className="rounded-md px-6 h-9 font-bold text-xs shadow-sm active:scale-95 transition-all bg-foreground text-background hover:opacity-90"
          >
            {isSavingProfile ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
