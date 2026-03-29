import React, { useRef, useEffect } from 'react';
import { Search, Loader2, User, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserSearch, useFollow } from '@/hooks/profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SearchResultItem = ({ user, onSelect }) => {
  const { isFollowing, toggleFollow, isLoading, isOwner } = useFollow(user.$id);

  return (
    <div className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-primary/5 transition-all group text-left relative">
      <button
        onClick={() => onSelect(user.username)}
        className="flex flex-1 items-center gap-3 min-w-0"
      >
        <Avatar className="h-9 w-9 border border-border/50 group-hover:border-primary/30 transition-colors">
          <AvatarImage src={user.avatarUrl} alt={user.name} className="object-cover" />
          <AvatarFallback className="text-xs bg-muted">
            {user.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
            {user.name}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            @{user.username}
          </span>
        </div>
      </button>

      {!isOwner && (
        <Button
          size="sm"
          variant={isFollowing ? 'outline' : 'default'}
          onClick={toggleFollow}
          disabled={isLoading}
          className="h-7 px-3 text-[10px] font-bold rounded-full ml-auto"
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : isFollowing ? (
            'Following'
          ) : (
            'Follow'
          )}
        </Button>
      )}
    </div>
  );
};

const NavUserSearch = ({ isMobile }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { 
    searchTerm, 
    setSearchTerm, 
    results, 
    isLoading, 
    clearSearch 
  } = useUserSearch(400);

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
        "relative flex-1 transition-all duration-300",
        isMobile ? "block mx-1 mb-4" : "hidden md:block max-w-md mx-4"
      )} 
      ref={dropdownRef}
    >
      <div className="relative group">
        <Search
          className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200',
            searchTerm ? 'text-primary' : 'text-muted-foreground group-focus-within:text-primary',
          )}
        />
        <Input
          type="text"
          placeholder="Search authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 h-9 bg-muted/40 border-border/50 rounded-full focus-visible:ring-primary/20 focus-visible:bg-background transition-all duration-300 w-full"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
        <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
          <div className="max-h-[400px] overflow-y-auto p-2 scrollbar-none">
            {isLoading && results.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p>Searching authors...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="grid gap-1">
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                  Authors Found
                </p>
                {results.map((user) => (
                  <SearchResultItem
                    key={user.$id}
                    user={user}
                    onSelect={handleUserClick}
                  />
                ))}
              </div>
            ) : (
              !isLoading && (
                <div className="py-8 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
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
