import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays } from 'lucide-react';

const ProfileInfo = ({ displayName, displayEmail, displayBio, avatarUrl, joinedDate, isOwner, postsCount, followersCount, followingCount }) => {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-background shadow-xl">
        <AvatarImage
          src={avatarUrl}
          alt={displayName}
          className="object-cover"
        />
        <AvatarFallback className="text-4xl bg-muted">
          {displayName.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-4 min-w-0 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {displayName}
            </h1>
            <div className="flex items-center text-muted-foreground mt-1 text-sm gap-4">
              {isOwner && displayEmail && <span>{displayEmail}</span>}
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3 h-3" /> Joined {joinedDate}
              </span>
            </div>
          </div>
        </div>

        {displayBio && (
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            {displayBio}
          </p>
        )}

        <div className="flex gap-6 pt-2">
          <div className="text-sm">
            <span className="font-bold text-foreground">{postsCount}</span>{' '}
            <span className="text-muted-foreground">posts</span>
          </div>
          <div className="text-sm">
            <span className="font-bold text-foreground">{followersCount}</span>{' '}
            <span className="text-muted-foreground">followers</span>
          </div>
          <div className="text-sm">
            <span className="font-bold text-foreground">{followingCount}</span>{' '}
            <span className="text-muted-foreground">following</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
