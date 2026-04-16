import React from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Bookmark Button component to toggle saving a post.
 */
const BookmarkButton = ({ isBookmarked, onClick, isLoading, className }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      disabled={isLoading}
      className={cn(
        "h-8 w-8 p-0 rounded-full transition-all duration-200 active:scale-90",
        isBookmarked 
          ? "text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted",
        className
      )}
    >
      <Bookmark 
        className={cn(
          "h-[1.1rem] w-[1.1rem]",
          isBookmarked && "fill-current"
        )} 
      />
    </Button>
  );
};

export default BookmarkButton;
