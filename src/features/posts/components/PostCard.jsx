import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Clock, MessageSquare, Heart, Loader2, Share2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import BookmarkButton from '@/features/bookmarks/components/BookmarkButton';
import { useBookmark } from '@/features/bookmarks/hooks/useBookmark';
import { selectProfileById } from '@/features/profile';
import { setActiveCategory } from '@/features/posts';
import { useLike } from '@/features/posts';
import { ShareDialog } from '@/components/common';
import { cn } from '@/lib/utils';
import { calculateReadTime, generateExcerpt } from '@/utils/formatters';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isShareOpen, setIsShareOpen] = useState(false);

  const authorProfile = useSelector((state) => selectProfileById(state, post.authorId));
  const authorName = authorProfile?.name;
  const readTime = calculateReadTime(post.content);

  const { likesCount, isLiked, isLiking, toggleLike } = useLike(post);
  const { isBookmarked, isLoading: isBookmarkLoading, toggleBookmark } = useBookmark(post);

  const excerpt = generateExcerpt(post.content, post.title);

  const coverImageUrl = post.coverImageUrl || null;
  const category = post.category || null;

  const handleCategoryClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setActiveCategory(category));
    navigate('/');
  };

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShareOpen(true);
  };

  return (
    <div className={cn(
      "group relative flex flex-col h-full rounded-2xl overflow-hidden border transition-all duration-300",
      coverImageUrl 
        ? "border-transparent shadow-lg text-white" 
        : "border-border bg-card shadow-sm hover:-translate-y-1 hover:shadow-md text-foreground"
    )}>
      {/* BACKGROUND IMAGE (Only if it exists) */}
      {coverImageUrl && (
        <>
          <div
            className="absolute inset-0 opacity-[0.8] bg-cover bg-center transition-opacity duration-500 group-hover:opacity-[0.50]"
            style={{ backgroundImage: `url(${coverImageUrl})` }}
          />
          {/* DARK OVERLAY - Only for background images to ensure readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90 z-0" />
        </>
      )}

      <ShareDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        url={`/posts/${post.slug}`}
        title={post.title}
      />

      {/* CONTENT */}
      <div className={cn(
        "relative z-10 flex flex-col flex-1 p-5",
        coverImageUrl ? "text-white" : "text-foreground"
      )}>
        {/* HEADER BAR */}
        <div className="flex items-center justify-between gap-4 mb-4">
          {category ? (
            <button
              onClick={handleCategoryClick}
              className={cn(
                "text-[9px] font-bold px-2.5 py-0.5 uppercase tracking-widest rounded-md transition-all",
                coverImageUrl 
                  ? "bg-white/10 text-white border border-white/20 backdrop-blur-sm hover:bg-white hover:text-black" 
                  : "bg-secondary text-secondary-foreground border border-transparent hover:bg-foreground hover:text-background"
              )}
            >
              {category}
            </button>
          ) : (
            <span className="text-[9px] font-bold opacity-50 uppercase tracking-widest">Article</span>
          )}

          <div className={cn(
            "flex items-center gap-3 text-[11px] font-medium",
            coverImageUrl ? "text-white/60" : "text-muted-foreground/60"
          )}>
            <button
              onClick={toggleLike}
              disabled={isLiking}
              className="flex items-center gap-1 transition-colors hover:opacity-80"
            >
              {isLiking ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Heart className={cn('h-3.5 w-3.5', isLiked && 'fill-rose-500 text-rose-500')} />
              )}
              {likesCount}
            </button>

            <span className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {post.commentsCount || 0}
            </span>
          </div>
        </div>

        {/* TITLE */}
        <Link to={`/posts/${post.$id}`} className="block mb-2.5">
          <h3 className={cn(
            "text-[1rem] font-bold leading-snug line-clamp-2 min-h-[2.75rem] transition-colors",
            coverImageUrl ? "group-hover:text-white/80" : "group-hover:text-primary"
          )}>
            {post.title}
          </h3>
        </Link>

        {/* EXCERPT */}
        <p className={cn(
          "text-[13px] line-clamp-3 leading-relaxed",
          coverImageUrl ? "text-white/70" : "text-muted-foreground"
        )}>
          {excerpt}
        </p>

        {/* FOOTER */}
        <div className={cn(
          "flex items-center justify-between pt-4 mt-auto border-t",
          coverImageUrl ? "border-white/10" : "border-border/40"
        )}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={cn(
              "h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ring-1",
              coverImageUrl ? "bg-white/20 ring-white/10" : "bg-muted ring-border/50"
            )}>
              {authorName?.charAt(0).toUpperCase() || 'A'}
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-bold truncate">{authorName || 'Anonymous'}</p>
              <div className={cn(
                "flex items-center gap-1 text-[10px]",
                coverImageUrl ? "text-white/60" : "text-muted-foreground/60"
              )}>
                <Clock className="h-2.5 w-2.5" />
                <span>{readTime}m read</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleShareClick}
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90",
                coverImageUrl ? "hover:bg-white/10" : "hover:bg-muted"
              )}
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>

            <BookmarkButton
              isBookmarked={isBookmarked}
              onClick={toggleBookmark}
              isLoading={isBookmarkLoading}
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90",
                coverImageUrl ? "hover:bg-white/10" : "hover:bg-muted"
              )}
            />

            <Link
              to={`/posts/${post.$id}`}
              className={cn(
                "h-8 pl-3 pr-2 rounded-full flex items-center gap-1 text-[11px] font-bold transition-all duration-300 ml-1",
                coverImageUrl ? "text-white hover:bg-white/10" : "text-foreground hover:bg-muted"
              )}
            >
              Read
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />       
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
