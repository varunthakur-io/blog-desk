import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Search, BookOpen, ArrowRight, X, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EmptyState } from '@/components/common';
import { cn } from '@/lib/utils';

// ─── Recommended Sidebar (Medium Style) ───────────────────────

export const RecommendedSidebar = ({ 
  authors = [], 
  isLoading, 
  staffPicks = [], 
  isStaffPicksLoading,
}) => (
  <div className="flex flex-col min-h-[calc(100vh-10rem)]">
    <div className="flex-1 space-y-12">
      {/* Trending Stories */}
    <section className="space-y-6 text-foreground">
      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Trending on blogdesk</h3>
      <div className="space-y-6">
        {isStaffPicksLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="size-8 rounded bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
              </div>
            </div>
          ))
        ) : staffPicks.length > 0 ? (
          staffPicks.map((post, idx) => (
            <article key={post.$id} className="group/item flex items-start gap-4">
              <span className="pt-1 text-3xl font-black tabular-nums tracking-tighter text-muted-foreground/20 transition-colors group-hover/item:text-primary/40">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1 space-y-2 mt-1">
                <Link to={`/profile/${post.author?.username || post.authorId}`} className="flex items-center gap-2 transition-opacity hover:opacity-80">
                  <Avatar className="size-5 border-none ring-1 ring-border/50">
                    {post.author?.avatarUrl && <AvatarImage src={post.author.avatarUrl} />}
                    <AvatarFallback className="bg-muted text-[10px] font-medium text-muted-foreground">
                      {(post.author?.name || 'A').charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-xs font-semibold">{post.author?.name || 'Anonymous'}</span>
                </Link>
                <Link to={`/posts/${post.$id}`}>
                  <h4 className="line-clamp-2 text-sm font-bold leading-snug transition-colors hover:text-primary">
                    {post.title}
                  </h4>
                </Link>
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="size-3 fill-current text-rose-500/60" />
                    {post.likesCount || 0}
                  </span>
                  <span>·</span>
                  <span>{new Date(post.$createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </article>
          ))
        ) : (
          <p className="text-xs font-medium italic text-muted-foreground">No trending stories found.</p>
        )}
      </div>
      <Button variant="link" className="h-auto p-0 text-[11px] font-bold text-primary hover:no-underline group uppercase tracking-widest opacity-60 hover:opacity-100">
        See the full list
        <ArrowRight className="ml-1.5 size-3 transition-transform group-hover:translate-x-0.5" />
      </Button>
    </section>

    {/* Who to Follow */}
    <section className="space-y-6 pt-2">
      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Who to follow</h3>
      <div className="space-y-5">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="size-8 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 rounded bg-muted" />
                <div className="h-2 w-full rounded bg-muted" />
              </div>
            </div>
          ))
        ) : authors.length > 0 ? (
          authors.slice(0, 3).map((author) => (
            <div key={author.$id} className="group/author flex items-start justify-between gap-4 px-4 -mx-4 py-2 hover:bg-muted/30 transition-colors rounded-lg">
              <Link to={`/profile/${author.username}`} className="flex min-w-0 items-start gap-3">
                <Avatar className="size-8 border border-border/50 transition-all ring-primary/10 ring-offset-background group-hover/author:ring-2">
                  {author.avatarUrl && <AvatarImage src={author.avatarUrl} />}
                  <AvatarFallback className="bg-muted text-[10px] font-bold text-muted-foreground">{author.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground hover:underline">{author.name}</p>
                  <p className="line-clamp-2 text-xs text-muted-foreground mt-0.5">
                    {author.bio || 'Sharing thoughts and stories on blogdesk.'}
                  </p>
                </div>
              </Link>
              <Button variant="outline" size="sm" className="h-8 shrink-0 rounded-md px-4 text-xs font-bold transition-all active:scale-95">
                Follow
              </Button>
            </div>
          ))
        ) : (
          <p className="text-xs font-medium italic text-muted-foreground">No suggestions yet.</p>
        )}
      </div>
      <Button variant="link" className="h-auto p-0 text-[11px] font-bold text-primary hover:no-underline group uppercase tracking-widest opacity-60 hover:opacity-100">
        See more suggestions
        <ArrowRight className="ml-1.5 size-3 transition-transform group-hover:translate-x-0.5" />
      </Button>
    </section>

    </div>
    
    {/* Footer Links */}
    <footer className="border-t border-border/40 pt-10 mt-12 pb-6">
      <nav className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
        {['About', 'Help', 'Terms', 'Privacy'].map(link => (
          <Link
            key={link}
            to="/about"
            className="text-[12px] font-medium text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            {link}
          </Link>
        ))}
      </nav>
      <p className="text-[11px] font-medium text-muted-foreground/30 tabular-nums">
        © {new Date().getFullYear()} blogdesk
      </p>
    </footer>
  </div>
);

export const HomeTabs = ({ activeMode, onModeChange, isAuthenticated, searchTerm, onSearchChange }) => {
  return (
    <div className="sticky top-16 z-30 border-b border-border/40 bg-background/95 backdrop-blur-md mb-2 px-4 -mx-4">
      <div className="flex h-14 items-center justify-between gap-4">
        
        {/* Tabs - Align to the bottom of the container */}
        <div className="flex gap-8 h-full items-end">
          {['explore', 'following'].map((mode) => (
            <button
              key={mode}
              onClick={() => {
                if (mode === 'following' && !isAuthenticated) return;
                onModeChange(mode);
              }}
              className={cn(
                'pb-4 text-[14px] font-bold transition-all duration-300 relative tracking-tight',
                activeMode === mode
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground/70',
                mode === 'following' && !isAuthenticated && 'opacity-40 cursor-not-allowed'
              )}
            >
              {mode === 'explore' ? 'For you' : 'Following'}
              {activeMode === mode && (
                <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-foreground transition-all" />
              )}
            </button>
          ))}
        </div>

        {/* Search - Vertically centered in the height */}
        <div className="hidden sm:flex items-center">
          <div className="relative w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 group-focus-within:text-foreground transition-colors" />
            <Input
              type="search"
              placeholder="Search feed..."
              className="pl-9 h-8 text-[13px] w-full rounded-md bg-muted/40 border-none focus:bg-muted/60 transition-all ring-1 ring-border/40 focus:ring-ring shadow-none"
              value={searchTerm}
              onChange={onSearchChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const HomeCategoryFilters = ({ categories = [], activeCategory, onCategoryChange }) => (
  <div className="flex items-center gap-2 overflow-x-auto py-4 no-scrollbar px-4 -mx-4">
    <button
      onClick={() => activeCategory && onCategoryChange(null)}
      className={cn(
        'h-8 shrink-0 rounded-full px-5 text-[12px] font-bold transition-all duration-300',
        !activeCategory
          ? 'bg-foreground text-background shadow-sm'
          : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      All Stories
    </button>
    {categories.map((cat) => {
      const isActive = activeCategory === cat;
      return (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={cn(
            'h-8 shrink-0 rounded-full px-5 text-[12px] font-bold transition-all duration-300',
            isActive
              ? 'bg-foreground text-background shadow-sm'
              : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          {cat}
        </button>
      );
    })}
  </div>
);

export const EmptyHomeState = ({ searchTerm, activeCategory, onClearFilters }) => {
  const isSearch = searchTerm || activeCategory;
  
  return (
    <div className="py-20 animate-in fade-in duration-700">
      <EmptyState
        animate
        className="border-none bg-transparent"
        icon={isSearch ? Search : BookOpen}
        title={isSearch ? 'No Results Found' : 'No Posts Yet'}
        description={
          searchTerm
            ? `Nothing matched "${searchTerm}". Try a different keyword.`
            : activeCategory
              ? `No posts in "${activeCategory}" yet.`
              : 'Be the first to share your ideas with the world.'
        }
        action={
          isSearch ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="rounded-full gap-2 px-5 font-bold text-xs hover:bg-muted"
            >
              <X className="size-3.5" /> Clear all filters
            </Button>
          ) : (
            <Button asChild className="mt-2 h-11 rounded-full bg-primary px-8 font-bold text-xs shadow-md transition-all hover:shadow-xl active:scale-95">
              <NavLink to="/create">
                Write First Post <ArrowRight className="ml-2 size-4" />
              </NavLink>
            </Button>
          )
        }
      />
    </div>
  );
};
