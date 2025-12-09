import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSelector } from 'react-redux';
import { selectProfileById } from '@/store/profileSlice';

const PostCard = ({ post }) => {
  const authorName = useSelector((state) =>
    selectProfileById(state, post.authorId),
  )?.name;
  // Calculate read time (rough estimate: 200 words per minute)
  const readTime = Math.max(
    1,
    Math.ceil((post.content || '').split(' ').length / 200),
  );

  const plainContent = DOMPurify.sanitize(post.content || '', {
    USE_PROFILES: { html: false },
  });

  // Get post image URL if available
  const postImageURL = post.postImageURL ? post.postImageURL : null;

  return (
    <Card className="group h-auto flex flex-col overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
      {postImageURL && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={postImageURL}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <CardHeader className="pb-3 pt-6 px-6">
        {/* Meta Top Row */}
        <div className="flex items-center justify-between mb-3">
          <Badge
            variant="outline"
            className="font-normal text-xs text-muted-foreground border-border/60 bg-background/50 capitalize"
          >
            {post.category || 'Article'}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground/80">
            <Clock className="mr-1.5 h-3 w-3" />
            {readTime} min read
          </div>
        </div>

        {/* Title */}
        <CardTitle className="text-xl font-bold leading-tight tracking-tight mb-2 group-hover:text-primary transition-colors">
          <Link to={`/posts/${post.$id}`} className="line-clamp-2">
            {post.title}
          </Link>
        </CardTitle>

        {/* Author & Date */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span className="font-medium text-foreground/80">
              {authorName || 'Anonymous'}
            </span>
          </div>
          <span className="h-1 w-1 rounded-full bg-border" />
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <time dateTime={post.$createdAt}>
              {post.$createdAt
                ? new Date(post.$createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : '—'}
            </time>
          </div>
        </div>
      </CardHeader>

      {/* Content Excerpt */}
      <CardContent className="flex-grow px-6 pb-2">
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
          {plainContent}
        </p>
      </CardContent>

      {/* Footer Action */}
      <CardFooter className="px-6 pb-6 pt-4">
        <Link to={`/posts/${post.$id}`} className="w-full">
          <Button
            variant="secondary"
            className="w-full justify-between group/btn bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            <span className="font-medium">Read Article</span>
            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
