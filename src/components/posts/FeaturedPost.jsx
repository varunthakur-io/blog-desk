import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { selectProfileById } from '@/store/profile';

const FeaturedPost = ({ post }) => {
  const authorName = useSelector((state) =>
    selectProfileById(state, post.authorId),
  )?.name;

  if (!post) return null;

  const readTime = Math.max(
    1,
    Math.ceil((post.content || '').split(' ').length / 200),
  );

  const plainContent = DOMPurify.sanitize(post.content || '', {
    USE_PROFILES: { html: false },
  });

  return (
    <div className="relative overflow-hidden rounded-3xl border h-[420px] group">
      {/* Background Layer */}
      {post.coverImageUrl ? (
        <img
          src={post.coverImageUrl}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-slate-900 to-slate-900" />
      )}

      {/* Modern Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-8 sm:p-10 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Badge className="bg-white/90 text-black capitalize">
            {post.category || 'Featured'}
          </Badge>

          <div className="flex items-center text-sm text-white/80">
            <Clock className="mr-1.5 h-4 w-4" />
            {readTime} min read
          </div>
        </div>

        <Link to={`/posts/${post.$id}`} className="group block">
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-3 group-hover:underline">
            {post.title}
          </h2>
        </Link>

        <p className="text-white/80 line-clamp-2 mb-6 max-w-2xl">
          {plainContent}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
              {authorName?.charAt(0).toUpperCase() || 'A'}
            </div>

            <div className="flex flex-col text-sm">
              <span className="font-semibold">{authorName || 'Anonymous'}</span>

              <div className="flex items-center text-white/70">
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

          <Button
            asChild
            className="rounded-full bg-white text-black hover:bg-white/90"
          >
            <Link to={`/posts/${post.$id}`}>
              Read Story <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPost;
