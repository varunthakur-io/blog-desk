import { Camera, Loader2, Save } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  return (
    <div className="space-y-5">
      {/* Heading */}
      <div>
        <h2 className="text-base font-semibold">Profile</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          This is how others will see you on Blog Desk.
        </p>
      </div>

      {profileError && (
        <Alert variant="destructive">
          <AlertDescription className="text-sm">{profileError}</AlertDescription>
        </Alert>
      )}

      {/* Avatar box */}
      <div className="rounded-lg border border-border p-4 flex items-center gap-4">
        <div className="relative group shrink-0">
          <Avatar className="w-14 h-14 border border-border">
            <AvatarImage src={avatarPreview} className="object-cover" />
            <AvatarFallback className="text-base font-bold bg-muted">
              {profileForm.name?.charAt(0).toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <Camera className="h-3.5 w-3.5 text-white" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarSelect}
          />
        </div>
        <div>
          <p className="text-sm font-medium leading-none">
            {profileForm.name || authUser?.name}
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors mt-1 block"
          >
            Change avatar
          </button>
        </div>
      </div>

      {/* Name + Bio box */}
      <div className="rounded-lg border border-border p-4 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium">Display Name</Label>
          <Input
            id="name"
            value={profileForm.name}
            onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Your name"
            className="h-9 text-sm"
          />
          <p className="text-xs text-muted-foreground">Your public display name.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
          <Textarea
            id="bio"
            value={profileForm.bio}
            onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))}
            placeholder="A short bio about yourself…"
            className="resize-none text-sm min-h-[80px]"
            maxLength={200}
          />
          <p className="text-xs text-muted-foreground text-right">
            {profileForm.bio?.length || 0} / 200
          </p>
        </div>
      </div>

      <Button
        onClick={handleSaveProfile}
        disabled={isSavingProfile}
        size="sm"
        className="gap-2"
      >
        {isSavingProfile
          ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
          : <Save className="h-3.5 w-3.5" />
        }
        Save changes
      </Button>
    </div>
  );
};

export default ProfilePanel;
