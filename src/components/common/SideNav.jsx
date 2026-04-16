import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Home,
  Bookmark,
  FileText,
  Compass,
  Users,
  Settings,
  PenSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/features/auth';

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
    const isItemActive =
      item.path === '/'
        ? location.pathname === '/' && !location.search
        : location.pathname + location.search === item.path;

    return (
      <NavLink
        key={item.label}
        to={item.path}
        className={cn(
          'group flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-bold tracking-tight transition-all duration-300',
          isItemActive
            ? 'bg-muted text-foreground'
            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
        )}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        {item.label}
      </NavLink>
    );
  };

  return (
    <nav className="flex flex-col h-full pt-6 pb-0 overflow-x-hidden">
      {/* Main Content */}
      <div className="flex flex-col gap-6 flex-1 min-h-0">
        {/* Write Button */}
        {location.pathname !== '/create' && (
          <div className="px-3 pb-2 pt-2">
            <Button
              asChild
              className="w-full rounded-md h-9 font-bold bg-foreground text-background transition-all hover:opacity-90 active:scale-95"
            >
              <Link to="/create">
                <PenSquare className="mr-2 h-4 w-4" />
                Write
              </Link>
            </Button>
          </div>
        )}

        {/* Discovery */}
        <div className="space-y-1.5 px-3">
          <p className="px-2 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-4">
            Discovery
          </p>
          {navItems.map(renderLink)}
        </div>

        {/* Library */}
        <div className="space-y-1.5 px-3">
          <p className="px-2 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-4 mt-2">
            Library
          </p>
          {libraryItems.map(renderLink)}

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-bold tracking-tight transition-all duration-300',
                isActive
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
              )
            }
          >
            <Settings className="h-4 w-4 shrink-0" />
            Settings
          </NavLink>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-border/20 pt-6 pb-6 px-6">
        <Link
          to="/about"
          className="text-[12px] font-bold text-muted-foreground/60 hover:text-foreground transition-all"
        >
          About
        </Link>
        <p className="text-[11px] font-medium text-muted-foreground/30 mt-1">
          © {new Date().getFullYear()} blogdesk
        </p>
      </div>
    </nav>
  );
};

export default SideNav;