import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const FeaturedPost = ({ post }) => {
  if (!post) return null;

  const readTime = Math.max(
    1,
    Math.ceil((post.content || '').split(' ').length / 200)
  );

  const plainContent = DOMPurify.sanitize(post.content || '', { USE_PROFILES: { html: false } });

  return (
    <div className="relative overflow-hidden rounded-3xl border bg-background/50 backdrop-blur-sm transition-all hover:shadow-md">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-0">
        {/* Content Side */}
        <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium capitalize">
              {post.category || 'Featured'}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1.5 h-4 w-4" />
              {readTime} min read
            </div>
          </div>

          <Link to={`/posts/${post.$id}`} className="group block mb-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight group-hover:text-primary transition-colors">
              {post.title}
            </h2>
          </Link>

          <p className="text-muted-foreground text-lg leading-relaxed mb-8 line-clamp-3">
            {plainContent}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {post.authorName?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex flex-col text-sm">
                <span className="font-semibold text-foreground">
                  {post.authorName || 'Anonymous'}
                </span>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-1.5 h-3.5 w-3.5" />
                  <time dateTime={post.$createdAt}>
                    {new Date(post.$createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </div>
              </div>
            </div>

            <Button asChild className="rounded-full px-6">
              <Link to={`/posts/${post.$id}`}>
                Read Story <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Visual Side (Placeholder for Image) */}
        <div className="relative min-h-[300px] bg-muted/30 lg:min-h-full">
           {/* Gradient / Abstract Pattern Placeholder since we don't have real images yet */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-muted/50" />
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
            {/* Abstract decorative shape */}
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="opacity-50">
               <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
            </svg>
          </div>
          
          {/* If you had an imageURL: 
            <img src={post.imageUrl} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
          */}
        </div>
      </div>
    </div>
  );
};

export default FeaturedPost;
