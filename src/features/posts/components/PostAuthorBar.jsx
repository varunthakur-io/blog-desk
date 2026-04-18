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
    <div className="border-border/20 flex items-center justify-between border-y py-8">
      <div className="flex items-center gap-4">
        <Link to={`/profile/${authorUsername}`} className="shrink-0">
          <Avatar className="bg-muted ring-border/20 hover:ring-primary/20 size-10 border-none shadow-sm ring-1 transition-all">
            {authorAvatar && (
              <AvatarImage src={authorAvatar} alt={authorName} className="object-cover" />
            )}
            <AvatarFallback className="bg-muted text-muted-foreground text-sm font-bold uppercase">
              {authorName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col gap-0">
          <div className="flex items-center gap-3">
            <Link
              to={`/profile/${authorUsername}`}
              className="text-foreground hover:text-primary text-[15px] font-bold tracking-tight transition-colors"
            >
              {authorName}
            </Link>
            <FollowButton
              userId={authorProfile?.$id}
              size="sm"
              variant="ghost"
              showIcon={false}
              className="border-border/40 hover:bg-foreground hover:text-background h-6 rounded-md border px-3 text-[10px] font-bold tracking-tight uppercase transition-all"
            />
          </div>
          <span className="text-muted-foreground/50 text-[11px] font-medium tracking-tight">
            Author · {authorProfile?.bio?.substring(0, 40) || 'Verified Writer'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <BookmarkButton
          isBookmarked={isBookmarked}
          onClick={toggleBookmark}
          isLoading={isBookmarkLoading}
          className="hover:bg-muted/50 size-9 rounded-md border-none bg-transparent"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={onShareClick}
          className="text-muted-foreground hover:bg-muted/50 size-9 rounded-md"
          aria-label="Share story"
        >
          <Share2 className="size-4" />
        </Button>
        {authUserId === post.authorId && (
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-muted-foreground hover:bg-muted hover:text-foreground size-9 rounded-md"
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
