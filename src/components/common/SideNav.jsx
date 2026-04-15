import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Home, Bookmark, FileText, Compass, Users, Settings, PenSquare, Info, Shield, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/features/auth';

/**
 * Descriptive Sidebar for main navigation with Icons + Labels.
 * Handles active state logic including query parameters.
 */
const SideNav = ({ isOpen }) => {
  const location = useLocation();
  const user = useSelector(selectAuthUser);
  const userIdentifier = user?.username || user?.userId || user?.$id;

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Users, label: 'Following', path: '/?feed=following' },
  ];

  const libraryItems = [
    { icon: Bookmark, label: 'Bookmarks', path: '/profile?tab=saved' },
    { icon: FileText, label: 'My Stories', path: '/dashboard' },
  ];

  if (!isOpen) return null;

  const renderLink = (item) => {
    // Custom active logic: 
    // - Home is active ONLY if path is / and there is no search query
    // - Others are active if path matches exactly or starts with it (default)
    const isItemActive = item.path === '/' 
      ? (location.pathname === '/' && !location.search) 
      : (location.pathname + location.search === item.path);

    return (
      <NavLink
        key={item.label}
        to={item.path}
        className={cn(
          "flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[14px] font-bold tracking-tight transition-all duration-200",
          isItemActive 
            ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20" 
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        )}
      >
        <item.icon className={cn("h-5 w-5", "transition-transform group-hover:scale-110")} />
        {item.label}
      </NavLink>
    );
  };

  return (
    <aside className="h-full w-full flex flex-col py-6 bg-background overflow-x-hidden">
      <div className="flex flex-col gap-8 flex-1 min-w-0">
        {/* Write Action Button (Prominent) */}
        <div className="px-4">
          <Button asChild className="w-full rounded-full h-11 font-bold gap-2 shadow-sm hover:shadow-md transition-all active:scale-95">
            <Link to="/create">
              <PenSquare className="h-4 w-4" />
              Write Story
            </Link>
          </Button>
        </div>

        {/* Main Feed Section */}
        <div className="space-y-1 px-2">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 mb-3">
            Discovery
          </p>
          {navItems.map(renderLink)}
        </div>

        {/* Library Section */}
        <div className="space-y-1 px-2">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 mb-3">
            Your Library
          </p>
          {libraryItems.map(renderLink)}
          
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[14px] font-bold tracking-tight transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )
            }
          >
            <Settings className="h-5 w-5" />
            Settings
          </NavLink>
        </div>
      </div>

      {/* Subtle Footer with meta links */}
      <div className="mt-auto pt-6 px-6 border-t border-border/40">
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
          <Link to="/about" className="text-[10px] text-muted-foreground/60 hover:text-primary transition-colors font-bold uppercase tracking-wider flex items-center gap-1">
            About
          </Link>
          {[
            { label: 'Privacy', icon: Shield },
            { label: 'Terms', icon: HelpCircle }
          ].map(item => (
            <span key={item.label} className="text-[10px] text-muted-foreground/60 hover:text-primary transition-colors cursor-pointer font-bold uppercase tracking-wider flex items-center gap-1">
              {item.label}
            </span>
          ))}
        </div>
        <p className="text-[10px] font-medium text-muted-foreground/30 px-1">
          © 2026 Blog Desk Inc.
        </p>
      </div>
    </aside>
  );
};

const Separator = () => <div className="h-px bg-border/50 w-full" />;

export default SideNav;
