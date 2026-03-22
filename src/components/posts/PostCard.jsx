import DOMPurify from 'dompurify';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Calendar, Clock, MessageSquare, Heart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectProfileById } from '@/store/profile';
import { setActiveCategory } from '@/store/posts';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authorProfile = useSelector((state) => selectProfileById(state, post.authorId));
  const authorName = authorProfile?.name;
  const readTime = Math.max(1, Math.ceil((post.content || '').split(' ').length / 200));

  const plainContent = DOMPurify.sanitize(post.content || '', {
    USE_PROFILES: { html: false },
  });

  const coverImageUrl = post.coverImageUrl || null;
  const category = post.category || null;

  const handleCategoryClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setActiveCategory(category));
    navigate('/');
  };

  return (
    // h-full makes the card stretch to fill the grid row height — all cards in a row stay same height
    <div className="group flex flex-col h-full overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Cover Image — fixed aspect ratio so cards with/without images don't cause height jumps */}
      {coverImageUrl && (
        <div className="aspect-[16/9] w-full overflow-hidden bg-muted shrink-0">
          <img
            src={coverImageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
      )}

      {/* flex-1 so this section grows to fill remaining card height */}
      <div className={`flex flex-col flex-1 ${coverImageUrl ? 'pt-4' : 'pt-5'} px-5 pb-5`}>
        {/* Top meta row — category badge + stats */}
        <div className="flex items-center justify-between mb-3">
          {/* Clickable category badge — uses neutral secondary colors, no blue */}
          {category ? (
            <button
              onClick={handleCategoryClick}
              className="text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider rounded-md bg-secondary text-secondary-foreground hover:bg-foreground hover:text-background transition-colors duration-200"
            >
              {category}
            </button>
          ) : (
            <span className="text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider rounded-md bg-muted text-muted-foreground">
              Article
            </span>
          )}

          <div className="flex items-center gap-3 text-muted-foreground/60">
            <span className="flex items-center gap-1 text-[11px]">
              <MessageSquare className="h-3 w-3" />
              {post.commentsCount || 0}
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <Heart className="h-3 w-3" />
              {post.likesCount || 0}
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <Clock className="h-3 w-3" />
              {readTime}m
            </span>
          </div>
        </div>

        {/* Title — always reserves exactly 2 lines of height so short titles don't shrink the card */}
        <Link to={`/posts/${post.$id}`} className="block mb-3">
          <h3
            className="text-[0.975rem] font-bold leading-snug tracking-tight text-foreground line-clamp-2 group-hover:opacity-70 transition-opacity duration-200"
            style={{ minHeight: '2.75rem' }} // 2 lines × line-height ~1.375rem each
          >
            {post.title}
          </h3>
        </Link>

        {/* Excerpt — flex-1 fills all available space, pushing footer to the bottom */}
        <p className="text-muted-foreground text-[13px] line-clamp-3 leading-relaxed flex-1 mb-4">
          {plainContent}
        </p>

        {/* Footer — always pinned to the bottom of the card */}
        <div className="flex items-center justify-between pt-3 border-t border-border/40">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Author avatar — neutral muted bg instead of bg-accent which can have blue tint */}
            <div className="h-7 w-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold shrink-0 ring-1 ring-border">
              {authorName?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground/80 truncate leading-none mb-0.5">
                {authorName || 'Anonymous'}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
                <Calendar className="h-3 w-3 shrink-0" />
                <time dateTime={post.$createdAt} className="truncate">
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
          </div>

          <Link
            to={`/posts/${post.$id}`}
            className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200 ml-2 group/link"
          >
            Read
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
