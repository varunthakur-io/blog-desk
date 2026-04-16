import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Share2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import BookmarkButton from '@/features/bookmarks/components/BookmarkButton';
import { useBookmark } from '@/features/bookmarks/hooks/useBookmark';
import { selectProfileById } from '@/features/profile';
import { setActiveCategory } from '@/features/posts';
import { useLike } from '@/features/posts';
import { ShareDialog } from '@/components/common';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { formatDate, calculateReadTime, generateExcerpt } from '@/utils/formatters';

/**
 * A Premium, Asymmetric Editorial Post Card.
 * Designed for high-end digital magazines with a focus on typography and geometric balance.
 */
const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isShareOpen, setIsShareOpen] = useState(false);

  const authorProfile = useSelector((state) => selectProfileById(state, post.authorId));
  const authorName = authorProfile?.name || 'Anonymous';
  const readTime = calculateReadTime(post.content);

  const { likesCount, isLiked, isLiking, toggleLike } = useLike(post);
  const { isBookmarked, isLoading: isBookmarkLoading, toggleBookmark } = useBookmark(post);

  const excerpt = generateExcerpt(post.content, post.title, 140);
  const coverImageUrl = post.coverImageUrl || null;
  const category = post.category || null;

  const handleCategoryClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setActiveCategory(category));
    navigate('/');
  };

  return (
    <article className="group relative border-b border-border/40 py-10 last:border-0 hover:bg-muted/30 px-4 -mx-4 transition-all duration-500 first:pt-0 overflow-hidden hover:rounded-2xl">
      <ShareDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        url={`/posts/${post.slug}`}
        title={post.title}
      />

      <div className="flex flex-col sm:flex-row items-center gap-8 md:gap-12 justify-between">
        
        {/* ── Content Section ── */}
        <div className="flex-1 min-w-0 order-2 sm:order-1 space-y-4">
          
          {/* Top Metadata Row */}
          <div className="flex items-center gap-2 mb-1">
             <Link to={`/profile/${authorProfile?.username}`} className="flex items-center gap-2 shrink-0 group/meta">
              <Avatar className="size-5 border-none bg-muted ring-1 ring-border/20 transition-all group-hover/meta:ring-primary/20">
                {authorProfile?.avatarUrl && <AvatarImage src={authorProfile.avatarUrl} className="object-cover" />}
                <AvatarFallback className="text-[8px] font-bold bg-muted uppercase text-muted-foreground/60">
                  {authorName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-[12px] font-bold text-foreground hover:text-primary transition-colors truncate tracking-tight">{authorName}</span>
            </Link>
            <span className="text-muted-foreground/40 text-[10px]">•</span>
            <time className="text-muted-foreground/60 font-medium text-[12px]" dateTime={post.$createdAt}>
              {formatDate(post.$createdAt, { month: 'short', day: 'numeric' })}
            </time>
          </div>

          {/* Title & Excerpt Area */}
          <div className="space-y-2">
            <Link to={`/posts/${post.$id}`} className="block group/title">
              <h2 className="text-xl md:text-2xl font-black leading-[1.2] tracking-tighter text-foreground group-hover/title:text-primary transition-all duration-300">
                {post.title}
              </h2>
            </Link>
            <p className="text-[14px] leading-relaxed text-muted-foreground/80 line-clamp-2 font-medium tracking-tight">
              {excerpt}
            </p>
          </div>

          {/* Bottom Metric & Action Bar */}
          <div className="flex items-center justify-between pt-3">
             <div className="flex items-center gap-4">
              {category && (
                <button 
                  onClick={handleCategoryClick}
                  className="px-2 py-0.5 rounded-md bg-muted/60 border border-border/40 text-muted-foreground text-[10px] font-bold uppercase tracking-tight hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all"
                >
                  {category}
                </button>
              )}
              <span className="text-[11px] font-bold text-muted-foreground/40 tabular-nums">
                {readTime} min read
              </span>
            </div>

            <div className="flex items-center gap-1">
               <button 
                  onClick={toggleLike}
                  disabled={isLiking}
                  className={cn(
                    "h-8 px-2 flex items-center justify-center gap-1.5 transition-all rounded-md hover:bg-rose-500/5 group/like",
                    isLiked ? "text-rose-500" : "text-muted-foreground/40 hover:text-rose-500"
                  )}
                >
                  <Heart className={cn("size-3.5 transition-transform group-active/like:scale-125", isLiked && "fill-current")} />
                  {likesCount > 0 && <span className="text-[11px] font-bold tabular-nums">{likesCount}</span>}
                </button>

                <div className="h-4 w-px bg-border/20 mx-1" />

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsShareOpen(true);
                  }}
                  className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground/40 hover:bg-muted/50 hover:text-foreground transition-all"
                  aria-label="Share"
                >
                  <Share2 className="size-3.5" />
                </button>

                <BookmarkButton
                  isBookmarked={isBookmarked}
                  onClick={toggleBookmark}
                  isLoading={isBookmarkLoading}
                  className="size-8 border-none bg-transparent hover:bg-muted/50 rounded-md"
                />
            </div>
          </div>
        </div>

        {/* ── Visual Section (Asymmetric Right) ── */}
        {coverImageUrl && (
          <Link to={`/posts/${post.$id}`} className="shrink-0 order-1 sm:order-2">
            <div className="relative aspect-square w-24 sm:w-32 md:w-40 rounded-md overflow-hidden bg-muted border border-border/40 transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-primary/5">
              <img
                src={coverImageUrl}
                alt={post.title}
                className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </Link>
        )}
      </div>
    </article>
  );
};

export default PostCard;
