import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, MessageSquare, Heart, Share2, MoreHorizontal, ArrowUpRight } from 'lucide-react';
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
 * A Premium, Minimalist Post Card.
 * Designed for high readability and subtle elegance.
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

  const excerpt = generateExcerpt(post.content, post.title, 160);
  const coverImageUrl = post.coverImageUrl || null;
  const category = post.category || null;

  const handleCategoryClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setActiveCategory(category));
    navigate('/');
  };

  return (
    <div className="group relative py-10 border-b border-border/40 last:border-0 transition-all duration-500 hover:bg-muted/5">
      <ShareDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        url={`/posts/${post.slug}`}
        title={post.title}
      />

      <div className="flex flex-col sm:flex-row gap-8 items-start">
        {/* ── Content Section ── */}
        <div className="flex-1 min-w-0 space-y-4 order-2 sm:order-1">
          {/* Author Meta */}
          <div className="flex items-center gap-3">
            <Link to={`/profile/${authorProfile?.username}`} className="shrink-0 transition-transform hover:scale-110 active:scale-95">
              <Avatar className="h-6 w-6 border-none ring-1 ring-border/50">
                {authorProfile?.avatarUrl && <AvatarImage src={authorProfile.avatarUrl} className="object-cover" />}
                <AvatarFallback className="text-[9px] font-black bg-muted uppercase text-muted-foreground">
                  {authorName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex items-center gap-2 min-w-0 text-[13px] font-bold">
              <Link to={`/profile/${authorProfile?.username}`} className="text-foreground hover:text-primary transition-colors truncate">
                {authorName}
              </Link>
              <span className="text-muted-foreground/30 font-normal">·</span>
              <time className="text-muted-foreground font-medium whitespace-nowrap" dateTime={post.$createdAt}>
                {formatDate(post.$createdAt)}
              </time>
            </div>
          </div>

          {/* Title & Excerpt */}
          <div className="space-y-2.5">
            <Link to={`/posts/${post.$id}`} className="block group/title">
              <h2 className="text-xl sm:text-2xl font-black leading-[1.2] tracking-tight text-foreground group-hover/title:text-primary transition-all duration-300">
                {post.title}
              </h2>
            </Link>
            <Link to={`/posts/${post.$id}`} className="block">
              <p className="text-[15px] leading-relaxed text-muted-foreground/80 line-clamp-3 font-serif">
                {excerpt}
              </p>
            </Link>
          </div>

          {/* Actions & Footer */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-5">
              {category && (
                <button 
                  onClick={handleCategoryClick}
                  className="px-2.5 py-0.5 rounded-full bg-muted/50 text-muted-foreground text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all"
                >
                  {category}
                </button>
              )}
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-muted-foreground/60">
                <Clock className="h-3.5 w-3.5" />
                <span>{readTime} min read</span>
              </div>
              
              <div className="h-3 w-px bg-border/40 hidden xs:block" />

              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleLike}
                  disabled={isLiking}
                  className={cn(
                    "flex items-center gap-1.5 transition-all active:scale-90",
                    isLiked ? "text-rose-500 font-bold scale-110" : "text-muted-foreground/60 hover:text-rose-500"
                  )}
                >
                  <Heart className={cn("h-4 w-4 transition-all", isLiked && "fill-current")} />
                  <span className="text-xs">{likesCount}</span>
                </button>
                <div className="flex items-center gap-1.5 text-muted-foreground/60">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs">{post.commentsCount || 0}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsShareOpen(true);
                }}
                className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground/40 hover:bg-muted hover:text-foreground transition-all"
                title="Share"
              >
                <Share2 className="h-4 w-4" />
              </button>

              <BookmarkButton
                isBookmarked={isBookmarked}
                onClick={toggleBookmark}
                isLoading={isBookmarkLoading}
                className="h-8 w-8 border-none bg-transparent hover:bg-muted rounded-full"
              />
            </div>
          </div>
        </div>

        {/* ── Thumbnail Section ── */}
        {coverImageUrl && (
          <Link to={`/posts/${post.$id}`} className="shrink-0 order-1 sm:order-2 w-full sm:w-auto">
            <div className="relative aspect-[16/10] sm:aspect-square w-full sm:w-28 md:w-36 lg:w-44 rounded-2xl overflow-hidden bg-muted border border-border/40 group-hover:shadow-xl transition-all duration-700 ease-in-out group-hover:scale-[1.02]">
              <img
                src={coverImageUrl}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default PostCard;
