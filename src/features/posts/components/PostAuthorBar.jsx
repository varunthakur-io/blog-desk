import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Share2, Pencil } from 'lucide-react';
import { FollowButton } from '@/features/follows';
import { BookmarkButton } from '@/features/bookmarks';

const PostAuthorBar = ({
  authorProfile,
  authUserId,
  post,
  isBookmarked,
  toggleBookmark,
  isBookmarkLoading,
  onShareClick,
}) => {
  const authorName = authorProfile?.name || 'Anonymous';
  const authorAvatar = authorProfile?.avatarUrl;
  const authorUsername = authorProfile?.username;

  return (
    <div className="flex items-center justify-between border-y border-border/20 py-8">
      <div className="flex items-center gap-4">
        <Link to={`/profile/${authorUsername}`} className="shrink-0">
          <Avatar className="size-10 border-none bg-muted ring-1 ring-border/20 shadow-sm transition-all hover:ring-primary/20">
            {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} className="object-cover" />}
            <AvatarFallback className="bg-muted text-sm font-bold uppercase text-muted-foreground">
              {authorName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col gap-0">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${authorUsername}`} className="text-[15px] font-bold text-foreground hover:text-primary transition-colors tracking-tight">
              {authorName}
            </Link>
            <FollowButton 
              userId={authorProfile?.$id} 
              size="sm" 
              variant="ghost" 
              showIcon={false}
              className="h-6 border border-border/40 px-3 text-[10px] font-bold uppercase tracking-tight rounded-md hover:bg-foreground hover:text-background transition-all" 
            />
          </div>
          <span className="text-[11px] font-medium text-muted-foreground/50 tracking-tight">
            Author · {authorProfile?.bio?.substring(0, 40) || 'Verified Writer'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <BookmarkButton 
          isBookmarked={isBookmarked} 
          onClick={toggleBookmark} 
          isLoading={isBookmarkLoading}
          className="size-9 rounded-md border-none bg-transparent hover:bg-muted/50"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={onShareClick}
          className="size-9 rounded-md text-muted-foreground hover:bg-muted/50"
          aria-label="Share story"
        >
          <Share2 className="size-4" />
        </Button>
        {authUserId === post.authorId && (
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="size-9 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Edit story"
          >
            <Link to={`/edit/${post.$id}`}>
              <Pencil className="size-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default PostAuthorBar;
