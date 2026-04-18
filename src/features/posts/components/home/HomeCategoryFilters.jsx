import { cn } from '@/lib/utils';

const HomeCategoryFilters = ({ categories = [], activeCategory, onCategoryChange }) => (
  <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 py-4">
    <button
      onClick={() => activeCategory && onCategoryChange(null)}
      className={cn(
        'border-border/20 h-8 shrink-0 rounded-md border px-4 text-[11px] font-bold transition-all duration-300',
        !activeCategory
          ? 'bg-foreground text-background border-none shadow-sm'
          : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground',
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
            'border-border/20 h-8 shrink-0 rounded-md border px-4 text-[11px] font-bold transition-all duration-300',
            isActive
              ? 'bg-foreground text-background border-none shadow-sm'
              : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          {cat}
        </button>
      );
    })}
  </div>
);

export default HomeCategoryFilters;
