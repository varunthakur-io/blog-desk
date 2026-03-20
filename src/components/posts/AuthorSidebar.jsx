import { Link } from 'react-router-dom';
import { Calendar, Clock, Heart, Share2, Loader2, ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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
}) => {
  const displayAuthorName = authorProfile?.name || 'Anonymous';
  const displayAuthorBio = authorProfile?.bio;
  const displayAuthorAvatar = authorProfile?.avatarUrl;

  return (
    <div className="sticky top-24 space-y-3">
      {/* Author */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 border border-border shrink-0">
            {displayAuthorAvatar && (
              <AvatarImage src={displayAuthorAvatar} alt={displayAuthorName} className="object-cover" />
            )}
            <AvatarFallback className="text-sm bg-muted font-semibold">
              {displayAuthorName?.charAt(0).toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{displayAuthorName}</p>
            <p className="text-xs text-muted-foreground">Author</p>
          </div>
        </div>

        {displayAuthorBio && (
          <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3">
            {displayAuthorBio}
          </p>
        )}

        {authorProfile?.username && (
          <Button asChild variant="outline" size="sm" className="w-full rounded-lg text-xs gap-1.5">
            <Link to={`/profile/${authorProfile.username}`}>
              <ExternalLink className="h-3 w-3" /> View Profile
            </Link>
          </Button>
        )}

        <Separator className="my-4" />

        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Published
            </span>
            <span className="font-medium">
              {new Date(createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Read time
            </span>
            <span className="font-medium">{readTime} min read</span>
          </div>
        </div>
      </div>

      {/* Like + Share */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleLike}
            variant={isLiked ? 'default' : 'outline'}
            size="sm"
            className={`w-full justify-center gap-2 rounded-lg transition-all text-xs ${
              isLiked ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-500' : ''
            }`}
            disabled={isLikedLoading || isLiking}
          >
            {isLiking ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`} />
            )}
            {likesCount}
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="w-full gap-2 rounded-lg text-xs"
          >
            <Share2 className="h-3.5 w-3.5" /> Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthorSidebar;
