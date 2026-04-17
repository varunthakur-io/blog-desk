import { cn } from '@/lib/utils';

const HomeCategoryFilters = ({ categories = [], activeCategory, onCategoryChange }) => (
  <div className="flex items-center gap-2 overflow-x-auto py-4 no-scrollbar px-4 -mx-4">
    <button
      onClick={() => activeCategory && onCategoryChange(null)}
      className={cn(
        'h-8 shrink-0 rounded-md border border-border/20 px-4 text-[11px] font-bold transition-all duration-300',
        !activeCategory
          ? 'bg-foreground text-background shadow-sm border-none'
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
            'h-8 shrink-0 rounded-md border border-border/20 px-4 text-[11px] font-bold transition-all duration-300',
            isActive
              ? 'bg-foreground text-background shadow-sm border-none'
              : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          {cat}
        </button>
      );
    })}
  </div>
);

export default HomeCategoryFilters;
