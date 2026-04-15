import { Camera, Loader2, Save, Upload } from 'lucide-react';
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
    <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="pb-4 border-b border-border/50">
        <h2 className="text-xl font-bold tracking-tight">Public profile</h2>
        <p className="text-muted-foreground text-sm mt-1 font-medium">
          This is how others will see you on the site.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile photo */}
        <div className="flex flex-col sm:flex-row items-start gap-8 py-2">
          <div className="space-y-2">
            <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Profile photo</Label>
            <div className="relative group size-24">
              <Avatar className="h-full w-full border-2 border-border shadow-sm transition-all group-hover:ring-4 group-hover:ring-primary/5">
                <AvatarImage src={avatarPreview} className="object-cover" />
                <AvatarFallback className="text-2xl font-black bg-muted text-muted-foreground">{initial}</AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer backdrop-blur-[2px]"
              >
                <Camera className="h-6 w-6 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarSelect}
              />
            </div>
          </div>

          <div className="flex-1 space-y-4 pt-8">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full px-4 font-bold text-[11px] shadow-sm active:scale-95 transition-all uppercase tracking-wider h-8"
              >
                <Upload className="h-3.5 w-3.5 mr-2" />
                Upload new image
              </Button>
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="rounded-full px-4 font-bold text-[11px] text-muted-foreground hover:text-destructive hover:border-destructive active:scale-95 transition-all uppercase tracking-wider h-8 border-border/60"
              >
                Remove
              </Button>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground/50 leading-relaxed uppercase tracking-widest">
              JPG, PNG or WebP. Max 3MB.
            </p>
          </div>
        </div>

        <Separator className="opacity-40" />

        {/* Form details */}
        <div className="space-y-8">
          <div className="grid gap-8">
            <div className="space-y-2.5">
              <Label htmlFor="name" className="text-[12px] font-bold text-foreground/80">
                Display name
              </Label>
              <Input
                id="name"
                value={profileForm.name}
                onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Your full name"
                className={cn(
                  "rounded-xl border-border/60 bg-background/50 focus:bg-background transition-all h-11 text-sm font-medium",
                  profileError && "border-destructive/50 ring-destructive/10"
                )}
              />
              {profileError ? (
                <p className="text-[11px] text-destructive font-bold uppercase tracking-wider px-1 animate-in fade-in duration-300">
                  {profileError}
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground/60 font-medium px-1">Your name as it will appear on your posts and profile.</p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="email-display" className="text-[12px] font-bold text-foreground/80">
                Email address
              </Label>
              <Input
                id="email-display"
                value={authUser?.email || ''}
                readOnly
                className="rounded-xl border-border/40 bg-muted/20 text-muted-foreground/60 cursor-not-allowed h-11 text-sm opacity-70"
              />
              <p className="text-[11px] text-muted-foreground/50 font-medium px-1 italic">Email cannot be changed here. Go to <span className="text-primary font-bold">Account</span> to update it.</p>
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="bio" className="text-[12px] font-bold text-foreground/80">
              Bio
            </Label>
            <div className="relative">
              <Textarea
                id="bio"
                value={profileForm.bio}
                onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Write a short bio about yourself…"
                className="resize-none min-h-[120px] rounded-xl border-border/60 bg-background/50 focus:bg-background transition-all p-4 text-sm leading-relaxed"
                maxLength={200}
              />
            </div>
            <div className="flex justify-between items-center px-1">
              <p className="text-[11px] text-muted-foreground/50 font-medium italic">Brief description for your profile.</p>
              <p className={cn(
                "text-[10px] font-black tabular-nums tracking-widest",
                (profileForm.bio?.length || 0) > 180 ? "text-orange-500" : "text-muted-foreground/40"
              )}>
                {profileForm.bio?.length || 0} / 200
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <Button 
            onClick={handleSaveProfile} 
            disabled={isSavingProfile} 
            className="rounded-full px-10 h-11 font-black text-xs uppercase tracking-widest shadow-md hover:shadow-xl active:scale-95 transition-all bg-primary"
          >
            {isSavingProfile ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
