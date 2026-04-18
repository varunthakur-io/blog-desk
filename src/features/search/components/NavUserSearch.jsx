import React, { useRef, useEffect } from 'react';
import { Search, Loader2, User, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserSearch } from '../hooks/useUserSearch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { FollowButton } from '@/features/follows';
import { cn } from '@/lib/utils';

const SearchResultItem = ({ user, onSelect }) => {
  return (
    <div className="hover:bg-primary/5 group relative flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-all">
      <button
        onClick={() => onSelect(user.username)}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <Avatar className="border-border/50 group-hover:border-primary/30 h-9 w-9 border transition-colors">
          <AvatarImage src={user.avatarUrl} alt={user.name} className="object-cover" />
          <AvatarFallback className="bg-muted text-xs">
            {user.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
          <span className="group-hover:text-primary truncate text-sm font-semibold transition-colors">
            {user.name}
          </span>
          <span className="text-muted-foreground truncate text-xs">@{user.username}</span>
        </div>
      </button>

      <FollowButton
        userId={user.$id}
        size="sm"
        className="ml-auto h-7 rounded-full px-3 text-[10px] font-bold"
      />
    </div>
  );
};

const NavUserSearch = ({ isMobile }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { searchTerm, setSearchTerm, results, isLoading, clearSearch } = useUserSearch(400);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        clearSearch();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clearSearch]);

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
    clearSearch();
  };

  return (
    <div
      className={cn(
        'relative flex-1 transition-all duration-300',
        isMobile ? 'mx-1 mb-4 block' : 'mx-4 hidden md:block',
      )}
      ref={dropdownRef}
    >
      <div className="group relative">
        <Search
          className={cn(
            'absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transition-colors duration-200',
            searchTerm ? 'text-primary' : 'text-muted-foreground group-focus-within:text-primary',
          )}
        />
        <Input
          type="text"
          placeholder="Search authors... (⌘K)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-muted/40 border-border/50 focus-visible:ring-primary/20 focus-visible:bg-background h-9 w-full rounded-full pr-10 pl-10 text-xs font-medium transition-all duration-300"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <X className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {searchTerm.trim().length >= 2 && (
        <div className="bg-background/95 border-border/60 animate-in fade-in zoom-in-95 absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl duration-200">
          <div className="scrollbar-none max-h-[400px] overflow-y-auto p-2">
            {isLoading && results.length === 0 ? (
              <div className="text-muted-foreground flex flex-col items-center gap-2 py-8 text-center text-sm">
                <Loader2 className="text-primary h-5 w-5 animate-spin" />
                <p>Searching authors...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="grid gap-1">
                <p className="text-muted-foreground/70 px-3 py-2 text-[10px] font-bold tracking-wider uppercase">
                  Authors Found
                </p>
                {results.map((user) => (
                  <SearchResultItem key={user.$id} user={user} onSelect={handleUserClick} />
                ))}
              </div>
            ) : (
              !isLoading && (
                <div className="text-muted-foreground flex flex-col items-center gap-2 py-8 text-center text-sm">
                  <User className="h-5 w-5 opacity-20" />
                  <p>No authors found matching "{searchTerm}"</p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavUserSearch;
