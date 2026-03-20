import { Camera, Loader2, Save, Upload, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Personal information</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Update your photo and personal details.
        </p>
      </div>

      {profileError && (
        <Alert variant="destructive">
          <AlertDescription>{profileError}</AlertDescription>
        </Alert>
      )}

      {/* Avatar card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Profile photo</CardTitle>
          <CardDescription>
            This will be displayed on your profile and across the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-5">
            {/* Avatar with hover overlay */}
            <div className="relative group shrink-0">
              <Avatar className="h-20 w-20 border-2 border-border shadow-sm">
                <AvatarImage src={avatarPreview} className="object-cover" />
                <AvatarFallback className="text-2xl font-bold bg-muted">
                  {profileForm.name?.charAt(0).toUpperCase() || authUser?.name?.charAt(0).toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
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

            {/* Info + actions */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {profileForm.name || authUser?.name || 'Your name'}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                JPG, PNG or WebP. Max size 3 MB.
              </p>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-1.5"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload photo
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={() => {
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="gap-1.5 text-muted-foreground hover:text-destructive hover:border-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Profile details</CardTitle>
          <CardDescription>
            This information will be visible to other users.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Display name</Label>
            <Input
              id="name"
              value={profileForm.name}
              onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Your full name"
            />
            <p className="text-xs text-muted-foreground">
              This is the name that will appear on your posts and profile.
            </p>
          </div>

          <Separator />

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
            <Textarea
              id="bio"
              value={profileForm.bio}
              onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))}
              placeholder="Write a short bio about yourself…"
              className="resize-none min-h-[100px]"
              maxLength={200}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Brief description for your profile.
              </p>
              <p className="text-xs text-muted-foreground">
                {profileForm.bio?.length || 0} / 200
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end pt-1">
            <Button
              onClick={handleSaveProfile}
              disabled={isSavingProfile}
              className="gap-2"
            >
              {isSavingProfile
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Save className="h-4 w-4" />
              }
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePanel;
