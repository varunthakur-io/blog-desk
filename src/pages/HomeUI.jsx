import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Search, BookOpen, ArrowRight, X, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EmptyState } from '@/components/common';
import { cn } from '@/lib/utils';

// ─── Header ──────────────────────────────────────────────────

export const HomeHeader = () => (
  <div className="mb-8 space-y-1">
    <h1 className="text-4xl font-black tracking-tight text-foreground lg:text-5xl">
      Discover Stories
    </h1>
    <p className="text-base md:text-lg text-muted-foreground font-medium max-w-xl leading-relaxed">
      Insights, stories, and expertise from writers on any topic.
    </p>
  </div>
);

// ─── Recommended Sidebar (Medium Style) ───────────────────────

export const RecommendedSidebar = ({ 
  authors = [], 
  isLoading, 
  staffPicks = [], 
  isStaffPicksLoading,
  isEmailVerified 
}) => (
  <aside className="hidden xl:flex w-80 shrink-0 flex-col gap-12 pl-10 sticky h-fit border-l border-border/40 transition-all duration-300 top-24">
    {/* Trending Stories */}
    <div className="space-y-6">
      <h3 className="text-[13px] font-black uppercase tracking-[0.15em] text-foreground">Trending on Blog Desk</h3>
      <div className="space-y-6">
        {isStaffPicksLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="h-8 w-8 rounded bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
              </div>
            </div>
          ))
        ) : staffPicks.length > 0 ? (
          staffPicks.map((post, idx) => (
            <div key={post.$id} className="flex gap-4 group/item items-start">
              <span className="text-2xl font-black text-muted-foreground/15 group-hover/item:text-primary/20 transition-colors tabular-nums leading-none pt-1">
                {idx + 1}
              </span>
              <div className="space-y-1.5 min-w-0 flex-1">
                <Link to={`/profile/${post.author?.username || post.authorId}`} className="flex items-center gap-2 transition-opacity hover:opacity-80">
                  <Avatar className="h-5 w-5 border-none ring-1 ring-border/50">
                    {post.author?.avatarUrl && <AvatarImage src={post.author.avatarUrl} />}
                    <AvatarFallback className="text-[7px] font-black bg-muted uppercase text-muted-foreground">
                      {(post.author?.name || 'A').charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[11px] font-bold text-foreground truncate">{post.author?.name || 'Anonymous'}</span>
                </Link>
                <Link to={`/posts/${post.$id}`}>
                  <h4 className="text-[13px] font-black leading-snug hover:text-primary transition-all line-clamp-2">
                    {post.title}
                  </h4>
                </Link>
                <div className="flex items-center gap-2.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <Heart className="h-2.5 w-2.5 fill-current text-rose-500/60" />
                    {post.likesCount || 0}
                  </span>
                  <span>·</span>
                  <span>{new Date(post.$createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground font-medium italic">No trending stories found.</p>
        )}
      </div>
      <button className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors pt-2 group flex items-center gap-1.5">
        See the full list
        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>

    {/* Who to Follow */}
    <div className="space-y-6 pt-2">
      <h3 className="text-[13px] font-black uppercase tracking-[0.15em] text-foreground">Who to follow</h3>
      <div className="space-y-5">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="h-8 w-8 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 rounded bg-muted" />
                <div className="h-2 w-full rounded bg-muted" />
              </div>
            </div>
          ))
        ) : authors.length > 0 ? (
          authors.slice(0, 3).map((author) => (
            <div key={author.$id} className="flex items-start justify-between gap-4 group/author">
              <Link to={`/profile/${author.username}`} className="flex items-start gap-3 min-w-0">
                <Avatar className="h-8 w-8 border border-border/50 ring-offset-background group-hover/author:ring-2 ring-primary/10 transition-all">
                  {author.avatarUrl && <AvatarImage src={author.avatarUrl} />}
                  <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground">{author.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-[13px] font-black text-foreground truncate group-hover/author:underline decoration-primary/30">{author.name}</p>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug font-medium italic">
                    {author.bio || 'Sharing thoughts and stories on Blog Desk.'}
                  </p>
                </div>
              </Link>
              <Button variant="outline" size="sm" className="h-7 rounded-full text-[10px] font-black uppercase tracking-wider px-4 border-foreground/20 hover:bg-foreground hover:text-background transition-all shrink-0">
                Follow
              </Button>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground font-medium italic">No suggestions yet.</p>
        )}
      </div>
      <button className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors pt-2 group flex items-center gap-1.5">
        See more suggestions
        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>

    {/* Footer Links */}
    <div className="pt-8 flex flex-wrap gap-x-4 gap-y-2 border-t border-border/40">
      {['Help', 'Status', 'About', 'Careers', 'Privacy', 'Terms'].map((link) => (
        <span key={link} className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/40 hover:text-foreground cursor-pointer transition-colors">
          {link}
        </span>
      ))}
    </div>
  </aside>
);

export const HomeTabs = ({ activeMode, onModeChange, isAuthenticated, searchTerm, onSearchChange }) => {
  return (
    <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-border/50 -mx-4 px-4 sm:mx-0 sm:px-0 py-3">
      <div className="flex items-center gap-8">
        <button
          onClick={() => onModeChange('explore')}
          className={cn(
            'pb-3 text-[13px] font-black uppercase tracking-widest transition-all relative',
            activeMode === 'explore'
              ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          For you
        </button>
        {isAuthenticated && (
          <button
            onClick={() => onModeChange('following')}
            className={cn(
              'pb-3 text-[13px] font-black uppercase tracking-widest transition-all relative',
              activeMode === 'following'
                ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Following
          </button>
        )}
      </div>

      <div className="relative pb-3 flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 -mt-1.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search within feed…"
          className="h-8 rounded-full pl-9 bg-muted/20 border-border/40 focus:bg-background transition-all text-[11px] font-bold"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
    </div>
  );
};

export const HomeCategoryFilters = ({ categories = [], activeCategory, onCategoryChange }) => (
  <div className="flex items-center gap-3 overflow-x-auto py-4 no-scrollbar [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mb-2">
    <button
      onClick={() => activeCategory && onCategoryChange(null)}
      className={cn(
        'inline-flex items-center rounded-full px-4 h-8 text-xs font-bold uppercase tracking-wider border transition-all shrink-0',
        !activeCategory
          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
          : 'bg-muted/20 border-border/40 text-muted-foreground hover:bg-muted/40 hover:text-foreground'
      )}
    >
      All
    </button>
    {categories.map((cat) => {
      const isActive = activeCategory === cat;
      return (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={cn(
            'inline-flex items-center rounded-full px-4 h-8 text-xs font-bold uppercase tracking-wider border transition-all shrink-0',
            isActive
              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
              : 'bg-muted/20 border-border/40 text-muted-foreground hover:bg-muted/40 hover:text-foreground'
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
              className="rounded-full gap-2 px-5 hover:bg-muted font-bold text-xs"
            >
              <X className="h-3.5 w-3.5" /> Clear all filters
            </Button>
          ) : (
            <Button asChild className="rounded-full px-8 mt-2 shadow-md hover:shadow-xl transition-all active:scale-95 bg-primary font-bold text-xs">
              <NavLink to="/create">
                Write First Post <ArrowRight className="ml-2 h-4 w-4" />
              </NavLink>
            </Button>
          )
        }
      />
    </div>
  );
};
