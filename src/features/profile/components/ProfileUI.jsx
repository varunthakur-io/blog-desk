import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Mail } from 'lucide-react';

// ProfileInfo: detailed user identity and social statistics display

export const ProfileInfo = ({
  profile,
  isOwner,
  actionButton,
  onFollowersClick,
  onFollowingClick,
}) => {
  const name = profile?.name || 'Anonymous';
  const username = profile?.username;
  const bio = profile?.bio;
  const avatarUrl = profile?.avatarUrl;
  const followersCount = profile?.followersCount || 0;
  const followingCount = profile?.followingCount || 0;
  const postsCount = profile?.postsCount || 0;

  return (
    <div className="animate-in fade-in slide-in-from-left-4 flex flex-col items-start gap-8 duration-500 md:flex-row">
      {/* Profile header layout */}
      {/* Left: Large Avatar */}
      <div className="mx-auto shrink-0 md:mx-0">
        <div className="group relative">
          <div className="from-primary/20 to-primary/5 absolute -inset-1 rounded-full bg-gradient-to-r opacity-0 blur transition duration-500 group-hover:opacity-100"></div>
          <Avatar className="border-background relative h-32 w-32 border-4 shadow-xl md:h-40 md:w-40">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={name} className="object-cover" />}
            <AvatarFallback className="bg-muted text-muted-foreground text-4xl font-black uppercase">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Identity summary */}
      <div className="w-full flex-1 space-y-6 text-center md:text-left">
        <div className="space-y-2">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="min-w-0">
              <h1 className="text-foreground truncate text-3xl font-black tracking-tight">
                {name}
              </h1>
              <p className="text-primary text-sm font-bold tracking-wide uppercase">@{username}</p>
            </div>
            <div className="flex justify-center gap-2 md:justify-end">{actionButton}</div>
          </div>

          {bio ? (
            <p className="text-foreground/80 max-w-2xl text-[15px] leading-relaxed whitespace-pre-wrap">
              {bio}
            </p>
          ) : (
            <p className="text-muted-foreground text-sm italic">No bio provided yet.</p>
          )}
        </div>

        {/* Social statistics */}
        <div className="flex flex-wrap items-center justify-center gap-8 pt-2 md:justify-start">
          <div className="text-center md:text-left">
            <span className="text-foreground block text-xl font-black">{postsCount}</span>
            <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              Posts
            </span>
          </div>

          <button
            onClick={onFollowersClick}
            className="group text-center transition-all active:scale-95 md:text-left"
          >
            <span className="text-foreground group-hover:text-primary block text-xl font-black transition-colors">
              {followersCount}
            </span>
            <span className="text-muted-foreground group-hover:text-primary/70 text-[10px] font-bold tracking-widest uppercase transition-colors">
              Followers
            </span>
          </button>

          <button
            onClick={onFollowingClick}
            className="group text-center transition-all active:scale-95 md:text-left"
          >
            <span className="text-foreground group-hover:text-primary block text-xl font-black transition-colors">
              {followingCount}
            </span>
            <span className="text-muted-foreground group-hover:text-primary/70 text-[10px] font-bold tracking-widest uppercase transition-colors">
              Following
            </span>
          </button>
        </div>

        {/* Account metadata badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 md:justify-start">
          <div className="text-muted-foreground bg-muted/50 border-border/50 flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold">
            <CalendarDays className="h-3.5 w-3.5" />
            Joined{' '}
            {new Date(profile?.$createdAt).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </div>
          {isOwner && profile?.userId && (
            <div className="text-muted-foreground bg-muted/50 border-border/50 flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold">
              <Mail className="h-3.5 w-3.5" />
              Verified Author
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
