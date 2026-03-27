import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, BookOpen, ArrowRight, X, Compass, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/constants';
import { EmptyState } from '@/components/common';
import { cn } from '@/lib/utils';

export const HomeHeader = ({ searchTerm, onSearchChange }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
    <div className="space-y-1">
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
        Discover Stories
      </h1>
      <p className="text-sm text-muted-foreground font-medium opacity-80">
        Explore the latest ideas from our community
      </p>
    </div>
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/50 backdrop-blur-sm px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all w-full sm:max-w-xs group">
      <Search className="h-4 w-4 text-muted-foreground shrink-0 group-focus-within:text-primary transition-colors" />
      <Input
        type="search"
        placeholder="Search articles…"
        className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-auto py-0 text-sm bg-transparent"
        value={searchTerm}
        onChange={onSearchChange}
      />
    </div>
  </div>
);

export const HomeTabs = ({ activeMode, onModeChange, isAuthenticated }) => {
  if (!isAuthenticated) return null;

  return (
    <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-xl w-fit border border-border/50">
      <button
        onClick={() => onModeChange('explore')}
        className={cn(
          'flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200',
          activeMode === 'explore'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Compass className="h-3.5 w-3.5" />
        Explore
      </button>
      <button
        onClick={() => onModeChange('following')}
        className={cn(
          'flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200',
          activeMode === 'following'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Users className="h-3.5 w-3.5" />
        Following
      </button>
    </div>
  );
};

export const HomeCategoryFilters = ({ activeCategory, onCategoryChange }) => (
  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none no-scrollbar">
    <button
      onClick={() => activeCategory && onCategoryChange(null)}
      className={cn(
        'inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold border transition-all duration-200 shrink-0',
        !activeCategory
          ? 'bg-primary text-primary-foreground border-primary shadow-md'
          : 'bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-primary'
      )}
    >
      All Feed
    </button>
    {CATEGORIES.map((cat) => {
      const isActive = activeCategory === cat;
      return (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={cn(
            'rounded-full px-4 py-1.5 text-xs font-bold border transition-all duration-200 shrink-0',
            isActive
              ? 'bg-primary text-primary-foreground border-primary shadow-md'
              : 'bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-primary'
          )}
        >
          {cat}
        </button>
      );
    })}
  </div>
);

export const EmptyHomeState = ({ searchTerm, activeCategory, onClearFilters, feedMode }) => {
  const isSearch = searchTerm || activeCategory;
  
  if (feedMode === 'following' && !isSearch) {
    return (
      <EmptyState
        animate
        icon={Users}
        title="Your feed is empty"
        description="Follow some talented authors to see their latest stories here in your personalized feed."
        className="py-24"
        action={
          <Button 
            onClick={onClearFilters} 
            variant="default"
            className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
          >
            Discover Authors
          </Button>
        }
      />
    );
  }

  return (
    <EmptyState
      animate
      className="border-none bg-transparent"
      iconClassName="ring-8 ring-muted/20 bg-muted/50"
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
            className="rounded-full gap-2 px-5 hover:bg-muted"
          >
            <X className="h-3.5 w-3.5" /> Clear all filters
          </Button>
        ) : (
          <Button asChild className="rounded-full px-8 mt-2 shadow-md hover:shadow-xl transition-all active:scale-95 bg-primary">
            <NavLink to="/create">
              Write First Post <ArrowRight className="ml-2 h-4 w-4" />
            </NavLink>
          </Button>
        )
      }
    />
  );
};
