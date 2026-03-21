import DOMPurify from 'dompurify';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Calendar, Clock, Heart, MessageSquare } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectProfileById } from '@/store/profile';
import { setActiveCategory } from '@/store/posts';

const FeaturedPost = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authorName = useSelector((state) => selectProfileById(state, post.authorId))?.name;

  if (!post) return null;

  const readTime = Math.max(1, Math.ceil((post.content || '').split(' ').length / 200));
  const category = post.category || null;

  const plainContent = DOMPurify.sanitize(post.content || '', {
    USE_PROFILES: { html: false },
  });

  const handleCategoryClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (category) {
      dispatch(setActiveCategory(category));
      navigate('/');
    }
  };

  return (
    <Link to={`/posts/${post.$id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl h-[480px] shadow-md border border-border/30 transition-shadow duration-500 group-hover:shadow-xl">
        {/* Background */}
        {post.coverImageUrl ? (
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/5 transition-opacity duration-500 group-hover:from-black/90" />

        {/* Top badges */}
        <div className="absolute top-5 left-6 right-6 flex items-center justify-between">
          {/* Clickable category */}
          {category ? (
            <button
              onClick={handleCategoryClick}
              className="bg-white/15 text-white border border-white/25 backdrop-blur-sm font-semibold text-[11px] uppercase tracking-wider rounded-full px-3 py-1 hover:bg-white hover:text-black transition-all duration-200"
            >
              {category}
            </button>
          ) : (
            <span className="bg-white/15 text-white border border-white/25 backdrop-blur-sm font-semibold text-[11px] uppercase tracking-wider rounded-full px-3 py-1">
              Featured
            </span>
          )}

          <div className="flex items-center gap-3 text-white/60 text-xs bg-black/25 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {readTime}m
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" /> {post.likesCount || 0}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" /> {post.commentsCount || 0}
            </span>
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight mb-3 transition-transform duration-300 group-hover:-translate-y-0.5">
            {post.title}
          </h2>
          <p className="text-white/60 text-sm sm:text-base line-clamp-2 mb-7 max-w-2xl leading-relaxed">
            {plainContent}
          </p>

          <div className="flex items-center justify-between">
            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white font-bold text-sm backdrop-blur-sm shrink-0 ring-1 ring-white/10">
                {authorName?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-none mb-1">
                  {authorName || 'Anonymous'}
                </p>
                <div className="flex items-center gap-1.5 text-white/50 text-xs">
                  <Calendar className="h-3 w-3" />
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

            {/* CTA */}
            <div className="flex items-center gap-2 text-white text-sm font-semibold bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-4 py-2 transition-all duration-300 group-hover:bg-white group-hover:text-black">
              Read Story
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedPost;
