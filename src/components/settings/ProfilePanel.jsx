import { Camera, Loader2, Save, Upload, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

      <Card className="overflow-hidden">
        {/* Cover banner */}
        <div className="h-24 bg-muted border-b border-border" />

        <CardContent className="px-6 pb-6 pt-0">
          {/* Avatar row — overlaps the banner */}
          <div className="flex items-end justify-between -mt-8 mb-6">
            <div className="relative group shrink-0">
              <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                <AvatarImage src={avatarPreview} className="object-cover" />
                <AvatarFallback className="text-xl font-bold bg-muted">
                  {profileForm.name?.charAt(0).toUpperCase() ||
                    authUser?.name?.charAt(0).toUpperCase() ||
                    '?'}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              >
                <Camera className="h-4 w-4 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarSelect}
              />
            </div>

            {/* Upload / Remove buttons sit at the bottom of the banner area */}
            <div className="flex gap-2 pb-1">
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="gap-1.5 text-xs text-muted-foreground hover:text-destructive hover:border-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </Button>
              <Button
                size="sm"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="gap-1.5 text-xs"
              >
                <Upload className="h-3.5 w-3.5" />
                Upload photo
              </Button>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-5">
            {/* Name + Username in a two-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Display name
                </Label>
                <Input
                  id="name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-display" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email-display"
                  value={authUser?.email || ''}
                  readOnly
                  className="text-muted-foreground bg-muted/40 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Bio full width */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={profileForm.bio}
                onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Write a short bio about yourself…"
                className="resize-none min-h-[90px]"
                maxLength={200}
              />
              <div className="flex justify-between">
                <p className="text-xs text-muted-foreground">
                  Visible on your public profile.
                </p>
                <p className="text-xs text-muted-foreground">
                  {profileForm.bio?.length || 0} / 200
                </p>
              </div>
            </div>

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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePanel;
