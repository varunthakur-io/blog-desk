import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Mail } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// ─── Profile Info ───────────────────────────────────────────

export const ProfileInfo = ({ 
  profile, 
  isOwner, 
  actionButton,
  onFollowersClick,
  onFollowingClick 
}) => {
  const name = profile?.name || 'Anonymous';
  const username = profile?.username;
  const bio = profile?.bio;
  const avatarUrl = profile?.avatarUrl;
  const followersCount = profile?.followersCount || 0;
  const followingCount = profile?.followingCount || 0;
  const postsCount = profile?.postsCount || 0;

  return (
    <div className="flex flex-col md:flex-row items-start gap-8 mb-12 animate-in fade-in slide-in-from-left-4 duration-500">
      {/* Left: Large Avatar */}
      <div className="shrink-0 mx-auto md:mx-0">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/5 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-xl relative">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={name} className="object-cover" />}
            <AvatarFallback className="bg-muted text-4xl font-black text-muted-foreground uppercase">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Right: Details Container */}
      <div className="flex-1 space-y-6 w-full text-center md:text-left">
        <div className="space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="min-w-0">
              <h1 className="text-3xl font-black tracking-tight text-foreground truncate">
                {name}
              </h1>
              <p className="text-primary font-bold text-sm tracking-wide uppercase">@{username}</p>
            </div>
            <div className="flex justify-center md:justify-end gap-2">
              {actionButton}
            </div>
          </div>
          
          {bio ? (
            <p className="text-[15px] text-foreground/80 leading-relaxed max-w-2xl whitespace-pre-wrap">
              {bio}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">No bio provided yet.</p>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 pt-2">
          <div className="text-center md:text-left">
            <span className="block text-xl font-black text-foreground">{postsCount}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Posts</span>
          </div>
          
          <button 
            onClick={onFollowersClick}
            className="text-center md:text-left group transition-all active:scale-95"
          >
            <span className="block text-xl font-black text-foreground group-hover:text-primary transition-colors">
              {followersCount}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary/70 transition-colors">
              Followers
            </span>
          </button>

          <button 
            onClick={onFollowingClick}
            className="text-center md:text-left group transition-all active:scale-95"
          >
            <span className="block text-xl font-black text-foreground group-hover:text-primary transition-colors">
              {followingCount}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary/70 transition-colors">
              Following
            </span>
          </button>
        </div>

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border/50">
            <CalendarDays className="h-3.5 w-3.5" />
            Joined {new Date(profile?.$createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
          {isOwner && profile?.userId && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border/50">
              <Mail className="h-3.5 w-3.5" />
              Verified Author
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Profile Skeleton ───────────────────────────────────────

export const ProfileSkeleton = () => {
  return (
    <div className="page-wrapper py-10 space-y-12">
      {/* Info Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <Skeleton className="h-32 w-32 md:h-40 md:w-40 rounded-full shrink-0 shadow-lg" />
        <div className="flex-1 space-y-6 w-full py-2">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-2 flex flex-col items-center md:items-start">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex gap-8 justify-center md:justify-start">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="space-y-8">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4 rounded-2xl border border-border p-4 bg-card/50">
              <Skeleton className="aspect-video w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex justify-between pt-4">
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-2 w-12" />
                  </div>
                </div>
                <Skeleton className="h-8 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
