import { useRef } from 'react';
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
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">
          This is how others will see you on Blog Desk.
        </p>
      </div>

      {profileError && (
        <Alert variant="destructive" className="rounded-xl">
          <AlertDescription>{profileError}</AlertDescription>
        </Alert>
      )}

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative group">
          <Avatar className="w-20 h-20 border-2 border-border">
            <AvatarImage src={avatarPreview} className="object-cover" />
            <AvatarFallback className="text-xl font-bold bg-muted">
              {profileForm.name?.charAt(0).toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
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
        <div>
          <p className="text-sm font-medium">{profileForm.name || authUser?.name}</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors mt-0.5"
          >
            Change avatar
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-5 max-w-lg">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium">Display Name</Label>
          <Input
            id="name"
            value={profileForm.name}
            onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Your name"
            className="h-10 rounded-lg"
          />
          <p className="text-xs text-muted-foreground">This is your public display name.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
          <Textarea
            id="bio"
            value={profileForm.bio}
            onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))}
            placeholder="Tell others a bit about yourself…"
            className="resize-none rounded-lg min-h-24"
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
        className="gap-2 rounded-full px-6"
      >
        {isSavingProfile ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        Save Profile
      </Button>
    </div>
  );
};

export default ProfilePanel;
