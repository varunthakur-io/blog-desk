import { Heart, MessageSquare, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const PostFloatingActions = ({
  isLiked,
  likesCount,
  commentsCount,
  handleLike,
  isLiking,
  onShareClick,
  onCommentsClick,
}) => {
  return (
    <nav className="fixed bottom-8 left-1/2 z-40 flex -translate-x-1/2 items-center gap-6 rounded-lg border border-border/40 bg-background/80 px-6 py-3 shadow-2xl shadow-primary/10 backdrop-blur-xl transition-all duration-300 lg:hidden group">
      <button 
        onClick={handleLike} 
        disabled={isLiking} 
        className={cn("flex items-center gap-2 transition-all active:scale-125", isLiked ? "text-rose-500" : "text-muted-foreground hover:text-foreground")}
        aria-label="Like"
      >
        <Heart className={cn("size-5", isLiked && "fill-current")} />
        <span className="text-sm font-bold tabular-nums">{likesCount}</span>
      </button>
      <div className="h-4 w-px bg-border/40" aria-hidden="true" />
      <button 
        onClick={onCommentsClick} 
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all"
        aria-label="Comments"
      >
        <MessageSquare className="size-5" />
        <span className="text-sm font-bold tabular-nums">{commentsCount}</span>
      </button>
      <div className="h-4 w-px bg-border/40" aria-hidden="true" />
      <button 
        onClick={onShareClick} 
        className="text-muted-foreground hover:text-foreground transition-all"
        aria-label="Share"
      >
        <Share2 className="size-5" />
      </button>
    </nav>
  );
};

export default PostFloatingActions;
