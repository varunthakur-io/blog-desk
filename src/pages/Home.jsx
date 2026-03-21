import { NavLink } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Search, ArrowRight, X, ArrowUpRight, Clock, Heart, MessageSquare, Calendar } from 'lucide-react';
import DOMPurify from 'dompurify';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PostCard, PostCardSkeleton } from '@/components/posts';
import { useSelector, useDispatch } from 'react-redux';
import { selectProfileById } from '@/store/profile';
import { setActiveCategory } from '@/store/posts';

import { useHome } from '@/hooks/posts';
import { CATEGORIES } from '@/constants';

// ── Magazine featured post — large card taking up ~60% width ──────────────────
const MagazineFeatured = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authorName = useSelector((state) => selectProfileById(state, post.authorId))?.name;

  const readTime = Math.max(1, Math.ceil((post.content || '').split(' ').length / 200));
  const category = post.category || null;
  const plainContent = DOMPurify.sanitize(post.content || '', { USE_PROFILES: { html: false } });

  const handleCategoryClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (category) { dispatch(setActiveCategory(category)); navigate('/'); }
  };

  return (
    <Link to={`/posts/${post.$id}`} className="group block h-full">
      <div className="relative overflow-hidden rounded-xl h-full min-h-[420px] border border-border bg-card transition-shadow duration-300 group-hover:shadow-md">
        {post.coverImageUrl ? (
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}

        {/* dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

        {/* top badges */}
        <div className="absolute top-4 left-5 right-5 flex items-center justify-between">
          {category ? (
            <button
              onClick={handleCategoryClick}
              className="bg-white/15 text-white border border-white/25 backdrop-blur-sm font-semibold text-[10px] uppercase tracking-wider rounded-full px-2.5 py-1 hover:bg-white hover:text-black transition-all duration-200"
            >
              {category}
            </button>
          ) : (
            <span className="bg-white/15 text-white border border-white/25 backdrop-blur-sm font-semibold text-[10px] uppercase tracking-wider rounded-full px-2.5 py-1">
              Featured
            </span>
          )}
          <div className="flex items-center gap-2.5 text-white/60 text-[11px] bg-black/25 backdrop-blur-sm rounded-full px-2.5 py-1">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{readTime}m</span>
            <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{post.likesCount || 0}</span>
          </div>
        </div>

        {/* bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight tracking-tight mb-2 line-clamp-2">
            {post.title}
          </h2>
          <p className="text-white/55 text-sm line-clamp-2 mb-5 leading-relaxed">
            {plainContent}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {authorName?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <p className="text-white text-xs font-semibold leading-none mb-0.5">{authorName || 'Anonymous'}</p>
                <div className="flex items-center gap-1 text-white/50 text-[11px]">
                  <Calendar className="h-2.5 w-2.5" />
                  <time>{new Date(post.$createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-white text-xs font-semibold bg-white/10 border border-white/20 rounded-full px-3 py-1.5 transition-all duration-300 group-hover:bg-white group-hover:text-black">
              Read <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// ── Small side post — stacks in the right column ──────────────────────────────
const MagazineSidePost = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authorName = useSelector((state) => selectProfileById(state, post.authorId))?.name;

  const readTime = Math.max(1, Math.ceil((post.content || '').split(' ').length / 200));
  const category = post.category || null;
  const plainContent = DOMPurify.sanitize(post.content || '', { USE_PROFILES: { html: false } });

  const handleCategoryClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (category) { dispatch(setActiveCategory(category)); navigate('/'); }
  };

  return (
    <Link to={`/posts/${post.$id}`} className="group flex gap-3 w-full">
      {/* thumbnail — fixed size */}
      <div className="w-24 h-16 shrink-0 rounded-lg overflow-hidden bg-muted border border-border">
        {post.coverImageUrl ? (
          <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
      </div>

      {/* text */}
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        {category && (
          <button
            onClick={handleCategoryClick}
            className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors text-left"
          >
            {category}
          </button>
        )}
        <h3 className="text-sm font-semibold leading-snug text-foreground line-clamp-2 group-hover:opacity-70 transition-opacity">
          {post.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {plainContent}
        </p>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-0.5">
          <span>{authorName || 'Anonymous'}</span>
          <span>·</span>
          <span>{readTime}m read</span>
          <span>·</span>
          <span className="flex items-center gap-1"><MessageSquare className="h-2.5 w-2.5" />{post.commentsCount || 0}</span>
        </div>
      </div>
    </Link>
  );
};

// ── Main Home page ─────────────────────────────────────────────────────────────
const Home = () => {
  const {
    posts,
    postsLoading,
    postsError,
    hasMore,
    searchTerm,
    activeCategory,
    handleSearchChange,
    handleCategoryChange,
    LIMIT,
  } = useHome();

  const renderContent = () => {
    if (postsLoading && posts.length === 0) {
      return (
        <div className="space-y-8">
          {/* Magazine skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <div className="lg:col-span-3 rounded-xl bg-muted animate-pulse min-h-[420px]" />
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="flex-1 rounded-xl bg-muted animate-pulse" />
              <div className="flex-1 rounded-xl bg-muted animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)}
          </div>
        </div>
      );
    }

    if (postsError) {
      return (
        <div className="flex justify-center py-20">
          <Alert variant="destructive" className="max-w-md">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>{postsError}</AlertDescription>
          </Alert>
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="text-center py-32">
          <div className="flex flex-col items-center gap-5">
            <div className="rounded-full bg-muted p-6">
              {searchTerm || activeCategory
                ? <Search className="h-10 w-10 text-muted-foreground/50" />
                : <BookOpen className="h-10 w-10 text-muted-foreground/50" />
              }
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold tracking-tight">
                {searchTerm || activeCategory ? 'No Results Found' : 'No Posts Yet'}
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                {searchTerm
                  ? `Nothing matched "${searchTerm}". Try a different keyword.`
                  : activeCategory
                  ? `No posts in "${activeCategory}" yet.`
                  : 'Be the first to share your ideas with the world.'}
              </p>
            </div>
            {activeCategory && (
              <Button variant="outline" size="sm" onClick={() => handleCategoryChange(activeCategory)} className="rounded-full gap-2">
                <X className="h-3.5 w-3.5" /> Clear filter
              </Button>
            )}
            {!searchTerm && !activeCategory && (
              <Button asChild className="rounded-full px-6 mt-2">
                <NavLink to="/create">Write First Post <ArrowRight className="ml-2 h-4 w-4" /></NavLink>
              </Button>
            )}
          </div>
        </div>
      );
    }

    // when searching or filtering — no magazine layout, just a plain grid
    if (searchTerm || activeCategory) {
      return (
        <div className="space-y-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <span>
              <span className="font-semibold text-foreground">{posts.length}</span>{' '}
              {posts.length === 1 ? 'post' : 'posts'}
              {activeCategory && <> in <span className="font-semibold text-foreground">{activeCategory}</span></>}
              {searchTerm && <> matching <span className="font-semibold text-foreground">&ldquo;{searchTerm}&rdquo;</span></>}
            </span>
            {activeCategory && (
              <button onClick={() => handleCategoryChange(activeCategory)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => <PostCard key={post.$id} post={post} />)}
            {postsLoading && hasMore && [...Array(LIMIT)].map((_, i) => <PostCardSkeleton key={i} />)}
          </div>
        </div>
      );
    }

    // normal view — magazine layout at top, grid below
    const featuredPost  = posts[0];
    const sidePosts     = posts.slice(1, 3);   // next 2 go in the right column
    const gridPosts     = posts.slice(3);       // rest go in the 3-col grid

    return (
      <div className="space-y-10">

        {/* Magazine block — featured large left, 2 side posts right */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-stretch">
          {/* featured — takes 3/5 columns */}
          <div className="lg:col-span-3">
            <MagazineFeatured post={featuredPost} />
          </div>

          {/* side posts — take 2/5 columns, wrapped in a card matching featured height */}
          {sidePosts.length > 0 && (
            <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden flex flex-col divide-y divide-border">
              {sidePosts.map((post) => (
                <div key={post.$id} className="p-4 flex items-center">
                  <MagazineSidePost post={post} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* rest of posts in normal 3-col grid */}
        {gridPosts.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">More posts</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridPosts.map((post) => <PostCard key={post.$id} post={post} />)}
              {postsLoading && hasMore && [...Array(LIMIT)].map((_, i) => <PostCardSkeleton key={i} />)}
            </div>
          </div>
        )}

      </div>
    );
  };

  return (
    <div className="page-root">

      {/* Slim header — title left, search right */}
      <div className="flex items-center justify-between gap-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog Desk</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Ideas worth sharing</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 shadow-sm focus-within:ring-2 focus-within:ring-foreground/20 transition-all w-full max-w-xs">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            type="search"
            placeholder="Search posts…"
            className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-auto py-0 text-sm bg-transparent"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-2 flex-wrap mb-8">
        <button
          onClick={() => activeCategory && handleCategoryChange(activeCategory)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all duration-200 ${
            !activeCategory
              ? 'bg-foreground text-background border-foreground'
              : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground bg-card'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all duration-200 ${
                isActive
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground bg-card'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {renderContent()}

    </div>
  );
};

export default Home;
