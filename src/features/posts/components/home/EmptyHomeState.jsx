import { NavLink } from 'react-router-dom';
import { Search, BookOpen, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common';

const EmptyHomeState = ({ searchTerm, activeCategory, onClearFilters }) => {
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
              className="rounded-md gap-2 px-5 font-bold text-xs hover:bg-muted border-border/40"
            >
              <X className="size-3.5" /> Clear all filters
            </Button>
          ) : (
            <Button asChild className="mt-2 h-11 rounded-md bg-foreground text-background px-8 font-bold text-xs shadow-md transition-all hover:opacity-90 active:scale-95">
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

export default EmptyHomeState;
