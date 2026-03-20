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
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start">
      <div className="relative shrink-0">
        <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-background shadow-lg ring-2 ring-border">
          <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
          <AvatarFallback className="text-3xl font-bold bg-accent text-primary">
            {displayName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 space-y-3 min-w-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{displayName}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground mt-1 text-xs">
            {isOwner && displayEmail && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" /> {displayEmail}
              </span>
            )}
            <span className="flex items-center gap-1">
              <CalendarDays className="w-3 h-3" /> Joined {joinedDate}
            </span>
          </div>
        </div>

        {displayBio && (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">{displayBio}</p>
        )}

        <div className="flex gap-5 pt-1">
          {[
            { label: 'posts', value: postsCount },
            { label: 'followers', value: followersCount },
            { label: 'following', value: followingCount },
          ].map(({ label, value }) => (
            <div key={label} className="text-sm">
              <span className="font-bold text-foreground">{value}</span>{' '}
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
