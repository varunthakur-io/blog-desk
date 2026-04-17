import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const HomeTabs = ({ activeMode, onModeChange, isAuthenticated, searchTerm, onSearchChange }) => {
  return (
    <div className="sticky top-16 z-30 border-b border-border/20 bg-background/95 backdrop-blur-md mb-2 px-4 -mx-4">
      <div className="flex h-14 items-center justify-between gap-4">
        
        {/* Tabs - Align to the bottom of the container */}
        <div className="flex gap-8 h-full items-end">
          {['explore', 'following']
            .filter((mode) => mode !== 'following' || isAuthenticated)
            .map((mode) => (
            <button
              key={mode}
              onClick={() => onModeChange(mode)}
              className={cn(
                'pb-4 text-[14px] font-bold transition-all duration-300 relative tracking-tight',
                activeMode === mode
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground/70'
              )}
            >
              {mode === 'explore' ? 'For you' : 'Following'}
              {activeMode === mode && (
                <span className="absolute -bottom-px left-0 w-full h-[2px] bg-foreground transition-all" />
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
              placeholder="Search stories..."
              className="pl-9 h-8 text-[13px] w-full rounded-md bg-muted/20 border-border/10 focus:bg-muted/40 transition-all ring-foreground/10 focus:ring-ring shadow-none"
              value={searchTerm}
              onChange={onSearchChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTabs;
