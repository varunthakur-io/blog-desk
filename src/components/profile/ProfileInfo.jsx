import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Mail } from 'lucide-react';
const ProfileInfo = ({
  displayName,
  displayEmail,
  displayBio,
  avatarUrl,
  joinedDate,
  isOwner,
  postsCount,
  followersCount,
  followingCount,
  actionButton, // New prop for the Follow/Edit button
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start w-full">
      <Avatar className="w-24 h-24 border-4 border-background shadow-md shrink-0">
        <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
        <AvatarFallback className="text-3xl font-bold bg-muted text-foreground">
          {displayName?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-4 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {displayName}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm">
              {isOwner && displayEmail && (
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {displayEmail}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" /> Joined {joinedDate}
              </span>
            </div>
          </div>
          <div className="shrink-0">{actionButton}</div>
        </div>

        {displayBio && (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl whitespace-pre-wrap">
            {displayBio}
          </p>
        )}

        <div className="flex gap-6 border-t border-border/40 pt-4 w-fit">
          {[
            { label: 'posts', value: postsCount },
            { label: 'followers', value: followersCount },
            { label: 'following', value: followingCount },
          ].map(({ label, value }) => (
            <div key={label} className="text-sm">
              <span className="font-bold text-foreground">{value}</span>{' '}
              <span className="text-muted-foreground text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
