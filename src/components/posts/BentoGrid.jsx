import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Clock, Heart, Calendar, ArrowUpRight, MessageSquare } from 'lucide-react';
import DOMPurify from 'dompurify';
import { selectProfileById } from '@/store/profile';
import { setActiveCategory } from '@/store/posts';

export const BentoFeatured = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authorName = useSelector((state) => selectProfileById(state, post.authorId))?.name;
  const readTime = Math.max(1, Math.ceil((post.content || '').split(' ').length / 200));
  const category = post.category || null;
  const plainContent = DOMPurify.sanitize(post.content || '', { USE_PROFILES: { html: false } });
  const hasImage = !!post.coverImageUrl;

  const handleCategoryClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (category) {
      dispatch(setActiveCategory(category));
      navigate('/');
    }
  };

  return (
    <Link to={`/posts/${post.$id}`} className="group block h-full">
      <div className="relative overflow-hidden rounded-xl h-full min-h-[420px] border border-border bg-card transition-all duration-300 group-hover:shadow-lg">
        {hasImage ? (
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-background" />
          </div>
        )}

        {hasImage && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/35 to-transparent" />
        )}

        <div className="absolute top-4 left-5 right-5 flex items-center justify-between">
          {category ? (
            <button
              onClick={handleCategoryClick}
              className={`font-semibold text-[10px] uppercase tracking-wider rounded-full px-2.5 py-1 border transition-all duration-200 ${
                hasImage
                  ? 'bg-white/15 text-white border-white/25 backdrop-blur-sm hover:bg-white hover:text-black'
                  : 'bg-foreground/10 text-foreground border-border hover:bg-foreground hover:text-background'
              }`}
            >
              {category}
            </button>
          ) : (
            <span
              className={`font-semibold text-[10px] uppercase tracking-wider rounded-full px-2.5 py-1 border ${
                hasImage
                  ? 'bg-white/15 text-white border-white/25 backdrop-blur-sm'
                  : 'bg-foreground/10 text-foreground border-border'
              }`}
            >
              Featured
            </span>
          )}
          <div
            className={`flex items-center gap-2 text-[11px] rounded-full px-2.5 py-1 ${
              hasImage
                ? 'text-white/60 bg-black/25 backdrop-blur-sm'
                : 'text-muted-foreground bg-muted'
            }`}
          >
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readTime}m
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {post.likesCount || 0}
            </span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h2
            className={`text-2xl sm:text-3xl font-bold leading-tight tracking-tight mb-2 line-clamp-2 ${
              hasImage ? 'text-white' : 'text-foreground'
            }`}
          >
            {post.title}
          </h2>
          <p
            className={`text-sm line-clamp-2 mb-5 leading-relaxed max-w-lg ${
              hasImage ? 'text-white/55' : 'text-muted-foreground'
            }`}
          >
            {plainContent}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  hasImage
                    ? 'bg-white/20 border border-white/30 text-white'
                    : 'bg-muted border border-border text-foreground'
                }`}
              >
                {authorName?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <p
                  className={`text-xs font-semibold leading-none mb-0.5 ${
                    hasImage ? 'text-white' : 'text-foreground'
                  }`}
                >
                  {authorName || 'Anonymous'}
                </p>
                <div
                  className={`flex items-center gap-1 text-[11px] ${
                    hasImage ? 'text-white/50' : 'text-muted-foreground'
                  }`}
                >
                  <Calendar className="h-2.5 w-2.5" />
                  <time>
                    {new Date(post.$createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </div>
              </div>
            </div>
            <div
              className={`flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 border transition-all duration-300 ${
                hasImage
                  ? 'text-white bg-white/10 border-white/20 group-hover:bg-white group-hover:text-black'
                  : 'text-foreground bg-muted border-border group-hover:bg-foreground group-hover:text-background'
              }`}
            >
              Read <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const BentoSmall = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authorName = useSelector((state) => selectProfileById(state, post.authorId))?.name;
  const readTime = Math.max(1, Math.ceil((post.content || '').split(' ').length / 200));
  const category = post.category || null;
  const hasImage = !!post.coverImageUrl;

  const handleCategoryClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (category) {
      dispatch(setActiveCategory(category));
      navigate('/');
    }
  };

  return (
    <Link to={`/posts/${post.$id}`} className="group block h-full">
      <div className="relative overflow-hidden rounded-xl h-full min-h-[196px] border border-border bg-card transition-all duration-300 group-hover:shadow-md">
        {hasImage ? (
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-muted flex items-center justify-center overflow-hidden">
            <span className="text-[5rem] font-black text-foreground/5 select-none leading-none uppercase">
              {category?.charAt(0) || 'B'}
            </span>
          </div>
        )}

        {hasImage && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        )}

        {category && (
          <div className="absolute top-3 left-3">
            <button
              onClick={handleCategoryClick}
              className={`font-semibold text-[10px] uppercase tracking-wider rounded-full px-2.5 py-1 border transition-all duration-200 ${
                hasImage
                  ? 'bg-white/15 text-white border-white/25 backdrop-blur-sm hover:bg-white hover:text-black'
                  : 'bg-foreground/10 text-foreground border-border hover:bg-foreground hover:text-background'
              }`}
            >
              {category}
            </button>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3
            className={`text-sm font-bold leading-snug tracking-tight line-clamp-2 mb-2 transition-opacity group-hover:opacity-80 ${
              hasImage ? 'text-white' : 'text-foreground'
            }`}
          >
            {post.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] ${hasImage ? 'text-white/50' : 'text-muted-foreground'}`}>
              {authorName || 'Anonymous'} · {readTime}m
            </span>
            <div
              className={`flex items-center gap-2.5 text-[11px] ${
                hasImage ? 'text-white/50' : 'text-muted-foreground'
              }`}
            >
              <span className="flex items-center gap-1">
                <Heart className="h-2.5 w-2.5" />
                {post.likesCount || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-2.5 w-2.5" />
                {post.commentsCount || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const BentoGrid = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  const featuredPost = posts[0];
  const bentoSide = posts.slice(1, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
      <div className="lg:col-span-2 lg:row-span-2">
        <BentoFeatured post={featuredPost} />
      </div>
      {bentoSide.map((post) => (
        <div key={post.$id} className="lg:col-span-1">
          <BentoSmall post={post} />
        </div>
      ))}
    </div>
  );
};

export default BentoGrid;
