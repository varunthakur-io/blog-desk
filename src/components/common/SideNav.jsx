import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Home, Bookmark, FileText, Compass, Users, Settings, PenSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/features/auth';

const SideNav = ({ isOpen }) => {
  const location = useLocation();
  const user = useSelector(selectAuthUser);
  const isAuthenticated = !!user;

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
          'group flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-bold tracking-tight transition-all duration-300',
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
    <nav className="flex h-full flex-col overflow-x-hidden pt-6 pb-0">
      {/* Main Content */}
      <div className="flex min-h-0 flex-1 flex-col gap-6">
        {/* Write Button - ONLY AUTHENTICATED */}
        {isAuthenticated && location.pathname !== '/create' && (
          <div className="px-3 pt-2 pb-2">
            <Button
              asChild
              className="bg-foreground text-background h-9 w-full rounded-md font-bold transition-all hover:opacity-90 active:scale-95"
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
          <p className="text-muted-foreground/50 mb-4 px-2 text-[11px] font-black tracking-[0.2em] uppercase">
            Discovery
          </p>
          {navItems.filter((item) => item.label !== 'Following' || isAuthenticated).map(renderLink)}
        </div>

        {/* Library - ONLY AUTHENTICATED */}
        {isAuthenticated && (
          <div className="space-y-1.5 px-3">
            <p className="text-muted-foreground/50 mt-2 mb-4 px-2 text-[11px] font-black tracking-[0.2em] uppercase">
              Library
            </p>
            {libraryItems.map(renderLink)}

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-bold tracking-tight transition-all duration-300',
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
        )}
      </div>

      {/* Footer */}
      <div className="border-border/20 mt-auto border-t px-6 pt-6 pb-6">
        <Link
          to="/about"
          className="text-muted-foreground/60 hover:text-foreground text-[12px] font-bold transition-all"
        >
          About
        </Link>
        <p className="text-muted-foreground/30 mt-1 text-[11px] font-medium">
          © {new Date().getFullYear()} blogdesk
        </p>
      </div>
    </nav>
  );
};

export default SideNav;
