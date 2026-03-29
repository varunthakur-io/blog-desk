import React from 'react';
import { Loader2, UserPlus, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFollow } from '@/features/profile';
import { cn } from '@/lib/utils';

/**
 * A universal Follow/Unfollow button.
 * Handles its own state, optimistic updates, and loading logic.
 */
const FollowButton = ({ userId, className, size = "sm", variant = "default" }) => {
  const { 
    isFollowing, 
    toggleFollow, 
    isLoading, 
    isOwner, 
    isAuthenticated 
  } = useFollow(userId);

  // Don't show follow button for the logged-in user themselves
  if (isOwner || !userId) return null;

  return (
    <Button
      size={size}
      variant={isFollowing ? "outline" : variant}
      onClick={toggleFollow}
      disabled={isLoading}
      className={cn(
        "rounded-full font-bold transition-all duration-300 active:scale-95",
        isFollowing ? "hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30" : "shadow-sm",
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
      ) : isFollowing ? (
        <UserMinus className="h-3.5 w-3.5 mr-2" />
      ) : (
        <UserPlus className="h-3.5 w-3.5 mr-2" />
      )}
      
      {isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
};

export default FollowButton;
