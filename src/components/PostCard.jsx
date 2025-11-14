import { Link } from 'react-router-dom';
import { ArrowUpRight, Calendar, User } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PostCard = ({ post }) => {
  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg rounded-lg border-border/40 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold leading-tight">
          <Link
            to={`/posts/${post.$id}`}
            className="hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            <span>{post.authorName || 'Anonymous'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
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

      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-3">
          {post.content}
        </p>
      </CardContent>

      <CardFooter>
        <Link to={`/posts/${post.$id}`} className="w-full">
          <Button variant="secondary" className="w-full">
            <span>Read More</span>
            <ArrowUpRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
