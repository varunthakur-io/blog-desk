import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Heart,
  Share2,
  Loader2,
  Tag,
  MessageSquare,
  ArrowLeft,
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FollowButton } from '@/features/follows';
import { useProfileIdentity } from '@/features/profile';

const AuthorSidebar = ({
  authorProfile: initialProfile,
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
  const { profile: authorProfile } = useProfileIdentity({ userId: initialProfile?.$id });

  const authorName = authorProfile?.name || 'Anonymous';
  const authorBio = authorProfile?.bio;
  const authorAvatar = authorProfile?.avatarUrl;
  const authorUsername = authorProfile?.username;

  return (
    <aside className="flex flex-col gap-6">
      {/* back button — same style as settings nav items */}
      <button
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" />
        Back to posts
      </button>

      {/* ── Author ─────────────────────────────────── */}
      <div>
        <p className="text-muted-foreground mb-2 px-3 text-xs font-semibold tracking-wider uppercase">
          Author
        </p>
        <div className="space-y-3 px-3">
          <div className="flex items-center gap-3">
            <Avatar className="border-border h-9 w-9 shrink-0 border">
              {authorAvatar && (
                <AvatarImage src={authorAvatar} alt={authorName} className="object-cover" />
              )}
              <AvatarFallback className="bg-muted text-xs font-semibold">
                {authorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-foreground truncate text-sm font-medium">{authorName}</p>
              {authorBio && (
                <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs leading-relaxed">
                  {authorBio}
                </p>
              )}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {authorUsername && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-8 w-full gap-1.5 rounded-md px-2 text-[11px] font-bold"
              >
                <Link to={`/profile/${authorUsername}`}>
                  <User className="h-3.5 w-3.5" /> View
                </Link>
              </Button>
            )}
            <FollowButton
              userId={authorProfile?.$id}
              className="h-8 w-full rounded-md px-2 text-[11px] font-bold"
            />
          </div>
        </div>
      </div>

      {/* ── Post Info ──────────────────────────────── */}
      <div>
        <p className="text-muted-foreground mb-2 px-3 text-xs font-semibold tracking-wider uppercase">
          Post Info
        </p>
        <nav className="space-y-0.5">
          <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm">
            <span className="text-muted-foreground flex items-center gap-3">
              <Calendar className="h-4 w-4 shrink-0" /> Published
            </span>
            <span className="text-foreground text-xs font-medium">
              {new Date(createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm">
            <span className="text-muted-foreground flex items-center gap-3">
              <Clock className="h-4 w-4 shrink-0" /> Read time
            </span>
            <span className="text-foreground text-xs font-medium">{readTime} min</span>
          </div>
          {category && (
            <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm">
              <span className="text-muted-foreground flex items-center gap-3">
                <Tag className="h-4 w-4 shrink-0" /> Category
              </span>
              <span className="text-foreground text-xs font-medium">{category}</span>
            </div>
          )}
          <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm">
            <span className="text-muted-foreground flex items-center gap-3">
              <Heart className="h-4 w-4 shrink-0" /> Likes
            </span>
            <span className="text-foreground text-xs font-medium">{likesCount}</span>
          </div>
          <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm">
            <span className="text-muted-foreground flex items-center gap-3">
              <MessageSquare className="h-4 w-4 shrink-0" /> Comments
            </span>
            <span className="text-foreground text-xs font-medium">{commentsCount}</span>
          </div>
        </nav>
      </div>

      {/* ── Actions ────────────────────────────────── */}
      <div>
        <p className="text-muted-foreground mb-2 px-3 text-xs font-semibold tracking-wider uppercase">
          Actions
        </p>
        <nav className="space-y-0.5">
          <button
            onClick={handleLike}
            disabled={isLikedLoading || isLiking || !authUserId}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
              isLiked
                ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            {isLiking ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            ) : (
              <Heart className={`h-4 w-4 shrink-0 ${isLiked ? 'fill-current' : ''}`} />
            )}
            {isLiked ? 'Liked' : 'Like'} · {likesCount}
          </button>
          <button
            onClick={handleShare}
            className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors"
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
