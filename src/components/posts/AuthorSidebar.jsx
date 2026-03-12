import { Link } from 'react-router-dom';
import { Calendar, Clock, Heart, Share2, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="sticky top-24 space-y-6">
      {/* Author Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar className="h-20 w-20 border-2 border-background shadow-sm">
              {displayAuthorAvatar ? (
                <AvatarImage src={displayAuthorAvatar} alt={displayAuthorName} />
              ) : null}
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {displayAuthorName?.charAt(0).toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-bold text-lg">{displayAuthorName}</h3>
              {displayAuthorBio && (
                <p className="text-sm text-muted-foreground max-w-[200px] line-clamp-2">
                  {displayAuthorBio}
                </p>
              )}
              <p className="text-sm text-muted-foreground">Author</p>
            </div>

            {authorProfile?.username && (
              <Button asChild variant="outline" className="w-full rounded-full mt-4">
                <Link to={`/profile/${authorProfile.username}`}>View Profile</Link>
              </Button>
            )}
          </div>

          <Separator className="my-6" />

          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Published
              </span>
              <span className="font-medium">
                {new Date(createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" /> Read time
              </span>
              <span className="font-medium">{readTime} min</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions Card */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Actions
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleLike}
              variant={isLiked ? 'default' : 'secondary'}
              className={`w-full justify-center ${isLiked ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
              disabled={isLikedLoading || isLiking}
            >
              {isLiking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Liking...
                </>
              ) : (
                <>
                  <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  {likesCount}
                </>
              )}
            </Button>
            <Button onClick={handleShare} variant="outline" className="w-full">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthorSidebar;
