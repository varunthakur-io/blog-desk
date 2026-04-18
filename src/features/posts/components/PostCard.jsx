import { useState, useMemo, memo } from 'react';
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
 * ── SUB-COMPONENTS (Internal) ──
 * Split for better performance tracking and cleaner main component body.
 */

const PostCardMeta = memo(({ authorProfile, authorName, createdAt }) => (
  <div className="mb-2 flex items-center gap-2">
    <Link
      to={`/profile/${authorProfile?.username}`}
      className="group/meta flex shrink-0 items-center gap-2"
    >
      <Avatar className="bg-muted ring-border/20 group-hover/meta:ring-primary/20 size-5 border-none ring-1 transition-all">
        {authorProfile?.avatarUrl && (
          <AvatarImage src={authorProfile.avatarUrl} className="object-cover" />
        )}
        <AvatarFallback className="bg-muted text-muted-foreground/60 text-[8px] font-bold uppercase">
          {authorName.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <span className="text-foreground hover:text-primary truncate text-[12px] font-bold tracking-tight transition-colors">
        {authorName}
      </span>
    </Link>
    <span className="text-muted-foreground/40 text-[10px]">•</span>
    <time className="text-muted-foreground/60 text-[12px] font-medium" dateTime={createdAt}>
      {formatDate(createdAt, { month: 'short', day: 'numeric' })}
    </time>
  </div>
));

const PostCardContent = memo(({ postId, title, excerpt }) => (
  <div className="space-y-2">
    <Link to={`/posts/${postId}`} className="group/title block">
      <h2 className="text-foreground group-hover/title:text-primary text-xl leading-[1.2] font-black tracking-tighter transition-all duration-300 md:text-2xl">
        {title}
      </h2>
    </Link>
    <p className="text-muted-foreground/80 line-clamp-2 text-[14px] leading-relaxed font-medium tracking-tight">
      {excerpt}
    </p>
  </div>
));

const PostCardActions = memo(
  ({
    category,
    readTime,
    onCategoryClick,
    onShareClick,
    likesCount,
    isLiked,
    isLiking,
    toggleLike,
    isBookmarked,
    isBookmarkLoading,
    toggleBookmark,
  }) => (
    <div className="flex items-center justify-between pt-3">
      <div className="flex items-center gap-4">
        {category && (
          <button
            onClick={onCategoryClick}
            className="bg-muted/60 border-border/40 text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/20 rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-tight uppercase transition-all"
          >
            {category}
          </button>
        )}
        <span className="text-muted-foreground/40 text-[11px] font-bold tabular-nums">
          {readTime} min read
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={toggleLike}
          disabled={isLiking}
          className={cn(
            'group/like flex h-8 items-center justify-center gap-1.5 rounded-md px-2 transition-all hover:bg-rose-500/5',
            isLiked ? 'text-rose-500' : 'text-muted-foreground/40 hover:text-rose-500',
          )}
        >
          <Heart
            className={cn(
              'size-3.5 transition-transform group-active/like:scale-125',
              isLiked && 'fill-current',
            )}
          />
          {likesCount > 0 && <span className="text-[11px] font-bold tabular-nums">{likesCount}</span>}
        </button>

        <div className="bg-border/20 mx-1 h-4 w-px" />

        <button
          onClick={onShareClick}
          className="text-muted-foreground/40 hover:bg-muted/50 hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md transition-all"
          aria-label="Share"
        >
          <Share2 className="size-3.5" />
        </button>

        <BookmarkButton
          isBookmarked={isBookmarked}
          onClick={toggleBookmark}
          isLoading={isBookmarkLoading}
          className="hover:bg-muted/50 size-8 rounded-md border-none bg-transparent"
        />
      </div>
    </div>
  ),
);

/**
 * ── MAIN COMPONENT ──
 * Optimized with memoization and internal decomposition.
 */
const PostCard = memo(({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isShareOpen, setIsShareOpen] = useState(false);

  const authorProfile = useSelector((state) => selectProfileById(state, post.authorId));

  // Derived state memoization
  const authorName = useMemo(() => authorProfile?.name || 'Anonymous', [authorProfile]);
  const readTime = useMemo(() => calculateReadTime(post.content), [post.content]);
  const excerpt = useMemo(() => generateExcerpt(post.content, post.title, 140), [
    post.content,
    post.title,
  ]);
  const coverImageUrl = useMemo(() => post.coverImageUrl || null, [post.coverImageUrl]);
  const category = useMemo(() => post.category || null, [post.category]);

  // Hook-based feature states
  const { likesCount, isLiked, isLiking, toggleLike } = useLike(post);
  const { isBookmarked, isLoading: isBookmarkLoading, toggleBookmark } = useBookmark(post);

  const handleCategoryClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setActiveCategory(category));
    navigate('/');
  };

  const handleShareClick = (e) => {
    e.preventDefault();
    setIsShareOpen(true);
  };

  return (
    <article className="group border-border/40 hover:bg-muted/50 relative -mx-4 overflow-hidden border-b px-4 py-10 transition-all duration-500 last:border-0 hover:rounded-2xl">
      <ShareDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        url={`/posts/${post.slug}`}
        title={post.title}
      />

      <div className="flex flex-col items-center justify-between gap-8 sm:flex-row md:gap-12">
        {/* ── Content Section ── */}
        <div className="order-2 min-w-0 flex-1 space-y-5 sm:order-1">
          <PostCardMeta
            authorProfile={authorProfile}
            authorName={authorName}
            createdAt={post.$createdAt}
          />

          <PostCardContent postId={post.$id} title={post.title} excerpt={excerpt} />

          <PostCardActions
            category={category}
            readTime={readTime}
            onCategoryClick={handleCategoryClick}
            onShareClick={handleShareClick}
            likesCount={likesCount}
            isLiked={isLiked}
            isLiking={isLiking}
            toggleLike={toggleLike}
            isBookmarked={isBookmarked}
            isBookmarkLoading={isBookmarkLoading}
            toggleBookmark={toggleBookmark}
          />
        </div>

        {/* ── Visual Section (Asymmetric Right) ── */}
        {coverImageUrl && (
          <Link to={`/posts/${post.$id}`} className="order-1 shrink-0 sm:order-2">
            <div className="bg-muted border-border/40 group-hover:shadow-primary/5 relative aspect-square w-24 overflow-hidden rounded-md border transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-xl sm:w-32 md:w-40">
              <img
                src={coverImageUrl}
                alt={post.title}
                className="h-full w-full object-cover grayscale-[10%] transition-all duration-700 group-hover:grayscale-0"
              />
            </div>
          </Link>
        )}
      </div>
    </article>
  );
});

PostCard.displayName = 'PostCard';

export default PostCard;
