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
    <div className="sticky top-24 space-y-4">
      {/* Author Card */}
      <div className="rounded-xl border border-border/50 bg-card shadow-sm p-6">
        <div className="flex flex-col items-center text-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-background shadow-md ring-2 ring-border">
            {displayAuthorAvatar && (
              <AvatarImage src={displayAuthorAvatar} alt={displayAuthorName} className="object-cover" />
            )}
            <AvatarFallback className="text-xl bg-accent text-primary font-bold">
              {displayAuthorName?.charAt(0).toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-bold text-base">{displayAuthorName}</h3>
            {displayAuthorBio && (
              <p className="text-xs text-muted-foreground max-w-[200px] line-clamp-2 leading-relaxed">
                {displayAuthorBio}
              </p>
            )}
          </div>

          {authorProfile?.username && (
            <Button asChild variant="outline" size="sm" className="w-full rounded-full text-xs gap-1.5">
              <Link to={`/profile/${authorProfile.username}`}>
                <ExternalLink className="h-3 w-3" /> View Profile
              </Link>
            </Button>
          )}
        </div>

        <Separator className="my-5" />

        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center gap-2 text-xs">
              <Calendar className="h-3.5 w-3.5" /> Published
            </span>
            <span className="font-medium text-xs">
              {new Date(createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center gap-2 text-xs">
              <Clock className="h-3.5 w-3.5" /> Read time
            </span>
            <span className="font-medium text-xs">{readTime} min</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="rounded-xl border border-border/50 bg-card shadow-sm p-5 space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Actions
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleLike}
            variant={isLiked ? 'default' : 'secondary'}
            size="sm"
            className={`w-full justify-center gap-2 rounded-lg transition-all ${
              isLiked ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-500' : ''
            }`}
            disabled={isLikedLoading || isLiking}
          >
            {isLiking ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`} />
            )}
            <span className="text-xs font-semibold">{likesCount}</span>
          </Button>
          <Button onClick={handleShare} variant="outline" size="sm" className="w-full gap-2 rounded-lg text-xs">
            <Share2 className="h-3.5 w-3.5" /> Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthorSidebar;
