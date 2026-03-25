import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Mail } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// ─── Profile Info ────────────────────────────────────────────────────

export const ProfileInfo = ({
  displayName,
  displayEmail,
  displayBio,
  avatarUrl,
  joinedDate,
  isOwner,
  postsCount,
  followersCount,
  followingCount,
  actionButton,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start w-full text-left">
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

// ─── Profile Skeleton ────────────────────────────────────────────────

export const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-background text-foreground text-left">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
          <div className="flex items-center gap-6 w-full md:w-auto">
            <Skeleton className="h-28 w-28 rounded-full" />
            <div className="flex-1 min-w-0 space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-40" />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
            <div className="hidden md:flex items-center gap-4">
              <Skeleton className="h-10 w-20 rounded-full" />
              <Skeleton className="h-10 w-20 rounded-full" />
              <Skeleton className="h-10 w-20 rounded-full" />
            </div>
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
        </div>

        <div className="max-w-2xl mb-8 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 border-b pb-4">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>

          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border border-border/50 bg-card/50 p-4">
                <div className="space-y-3 mb-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
