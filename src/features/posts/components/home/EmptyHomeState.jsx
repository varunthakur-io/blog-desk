import { NavLink } from 'react-router-dom';
import { Search, BookOpen, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common';

const EmptyHomeState = ({ searchTerm, activeCategory, onClearFilters }) => {
  const isSearch = searchTerm || activeCategory;

  return (
    <div className="animate-in fade-in py-20 duration-700">
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
              className="hover:bg-muted border-border/40 gap-2 rounded-md px-5 text-xs font-bold"
            >
              <X className="size-3.5" /> Clear all filters
            </Button>
          ) : (
            <Button
              asChild
              className="bg-foreground text-background mt-2 h-11 rounded-md px-8 text-xs font-bold shadow-md transition-all hover:opacity-90 active:scale-95"
            >
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
