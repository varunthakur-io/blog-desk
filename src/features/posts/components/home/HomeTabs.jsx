import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const TabButton = ({ isActive, onClick, children }) => (
  <button
    onClick={onClick}
    className={cn(
      'relative pb-4 text-sm font-bold tracking-tight transition-all',
      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/70',
    )}
  >
    {children}
    {isActive && <span className="bg-foreground absolute -bottom-px left-0 h-[2px] w-full" />}
  </button>
);

const HomeTabs = ({ activeMode, onModeChange, isAuthenticated, searchTerm, onSearchChange }) => {
  const modes = ['explore', 'following'].filter((m) => m !== 'following' || isAuthenticated);

  return (
    <nav className="bg-background/95 border-border/10  sticky top-[calc(var(--header-height,4rem))] z-30 -mx-4 mb-2 border-b px-4 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-end gap-8 pt-4">
          {modes.map((mode) => (
            <TabButton
              key={mode}
              isActive={activeMode === mode}
              onClick={() => onModeChange(mode)}
            >
              {mode === 'explore' ? 'For you' : 'Following'}
            </TabButton>
          ))}
        </div>

        <div className="hidden items-center sm:flex">
          <div className="group relative w-64">
            <Search className="text-muted-foreground/50 group-focus-within:text-foreground absolute top-1/2 left-3 size-3.5 -translate-y-1/2 transition-colors" />
            <Input
              type="search"
              placeholder="Search stories..."
              className="bg-muted/30 border-none focus:bg-muted/50 h-8 w-full rounded-md pl-9 text-xs shadow-none transition-all"
              value={searchTerm}
              onChange={onSearchChange}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HomeTabs;
