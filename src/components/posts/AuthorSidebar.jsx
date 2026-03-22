import { Link } from 'react-router-dom';
import { Calendar, Clock, Heart, Share2, Loader2, ArrowUpRight, Tag, MessageSquare, ArrowLeft, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const AuthorSidebar = ({
  authorProfile,
  createdAt,
  readTime,
  likesCount,
  isLiked,
  isLikedLoading,
  isLiking,
  handleLike,
  handleShare,
  category,
  commentsCount,
  authUserId,
  onBack,
}) => {
  const authorName     = authorProfile?.name     || 'Anonymous';
  const authorBio      = authorProfile?.bio;
  const authorAvatar   = authorProfile?.avatarUrl;
  const authorUsername = authorProfile?.username;

  return (
    <aside className="flex flex-col gap-6">

      {/* back button — same style as settings nav items */}
      <button
        onClick={onBack}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-left text-muted-foreground hover:text-foreground hover:bg-secondary/50"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" />
        Back to posts
      </button>

      {/* ── Author ─────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
          Author
        </p>
        <div className="px-3 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border shrink-0">
              {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} className="object-cover" />}
              <AvatarFallback className="text-xs font-semibold bg-muted">
                {authorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{authorName}</p>
              {authorBio && (
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-0.5">
                  {authorBio}
                </p>
              )}
            </div>
          </div>

          {authorUsername && (
            <Button asChild variant="outline" size="sm" className="w-full rounded-md text-xs gap-1.5 h-8">
              <Link to={`/profile/${authorUsername}`}>
                <User className="h-3.5 w-3.5" /> View Profile
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* ── Post Info ──────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
          Post Info
        </p>
        <nav className="space-y-0.5">
          <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm">
            <span className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" /> Published
            </span>
            <span className="font-medium text-foreground text-xs">
              {new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm">
            <span className="flex items-center gap-3 text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0" /> Read time
            </span>
            <span className="font-medium text-foreground text-xs">{readTime} min</span>
          </div>
          {category && (
            <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm">
              <span className="flex items-center gap-3 text-muted-foreground">
                <Tag className="h-4 w-4 shrink-0" /> Category
              </span>
              <span className="font-medium text-foreground text-xs">{category}</span>
            </div>
          )}
          <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm">
            <span className="flex items-center gap-3 text-muted-foreground">
              <Heart className="h-4 w-4 shrink-0" /> Likes
            </span>
            <span className="font-medium text-foreground text-xs">{likesCount}</span>
          </div>
          <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm">
            <span className="flex items-center gap-3 text-muted-foreground">
              <MessageSquare className="h-4 w-4 shrink-0" /> Comments
            </span>
            <span className="font-medium text-foreground text-xs">{commentsCount}</span>
          </div>
        </nav>
      </div>

      {/* ── Actions ────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
          Actions
        </p>
        <nav className="space-y-0.5">
          <button
            onClick={handleLike}
            disabled={isLikedLoading || isLiking || !authUserId}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-left ${
              isLiked
                ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            {isLiking
              ? <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              : <Heart className={`h-4 w-4 shrink-0 ${isLiked ? 'fill-current' : ''}`} />
            }
            {isLiked ? 'Liked' : 'Like'} · {likesCount}
          </button>
          <button
            onClick={handleShare}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-left text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          >
            <Share2 className="h-4 w-4 shrink-0" />
            Share post
          </button>
        </nav>
      </div>

    </aside>
  );
};

export default AuthorSidebar;
