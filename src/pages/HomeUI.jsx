import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, BookOpen, ArrowRight, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/constants';
import { EmptyState } from '@/components/common';

export const HomeHeader = ({ searchTerm, onSearchChange }) => (
  <div className="flex items-center justify-between gap-6 mb-6">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Blog Desk</h1>
      <p className="text-sm text-muted-foreground mt-0.5 font-medium">Ideas worth sharing</p>
    </div>
    <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 shadow-sm focus-within:ring-2 focus-within:ring-foreground/20 transition-all w-full max-w-xs group">
      <Search className="h-4 w-4 text-muted-foreground shrink-0 group-focus-within:text-foreground transition-colors" />
      <Input
        type="search"
        placeholder="Search posts…"
        className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-auto py-0 text-sm bg-transparent"
        value={searchTerm}
        onChange={onSearchChange}
      />
    </div>
  </div>
);

export const HomeCategoryFilters = ({ activeCategory, onCategoryChange }) => (
  <div className="flex items-center gap-2 flex-wrap mb-8">
    <button
      onClick={() => activeCategory && onCategoryChange(null)}
      className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all duration-200 ${
        !activeCategory
          ? 'bg-foreground text-background border-foreground shadow-sm'
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
          onClick={() => onCategoryChange(cat)}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all duration-200 ${
            isActive
              ? 'bg-foreground text-background border-foreground shadow-sm'
              : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground bg-card'
          }`}
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
            className="rounded-full gap-2 px-5"
          >
            <X className="h-3.5 w-3.5" /> Clear all filters
          </Button>
        ) : (
          <Button asChild className="rounded-full px-6 mt-2 shadow-md hover:shadow-lg transition-all active:scale-95">
            <NavLink to="/create">
              Write First Post <ArrowRight className="ml-2 h-4 w-4" />
            </NavLink>
          </Button>
        )
      }
    />
  );
};
