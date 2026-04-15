import { useState, useCallback } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon, Menu, X, LogOut, User, Settings, PenSquare, Search } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  selectAuthUserId,
  selectAuthName,
  selectAuthEmail,
  selectIsAuthenticated,
  clearAuthUser,
  authService,
} from '@/features/auth';
import { selectProfileById } from '@/features/profile';
import { NavUserSearch } from '@/features/search';
import { NotificationBell } from '@/features/notifications';
import useDarkMode from '@/hooks/common/useDarkMode';

const Navbar = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector(selectAuthUserId);
  const userName = useSelector(selectAuthName);
  const userEmail = useSelector(selectAuthEmail);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const profile = useSelector((state) => selectProfileById(state, userId));

  const [isDarkMode, setDarkMode] = useDarkMode();

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
      dispatch(clearAuthUser());
      toast.success('Logged out');
      navigate('/login');
    } catch {
      dispatch(clearAuthUser());
      navigate('/login');
    }
  }, [dispatch, navigate]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 h-16 flex items-center shrink-0">
      <div className="w-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* LEFT: Brand & Toggle */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleSidebar}
            className="hidden md:flex rounded-full text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-base shadow-sm ring-1 ring-primary/20 transition-transform group-hover:scale-105">
              B
            </div>
            <span className="font-bold text-lg tracking-tight hidden lg:inline-block">
              Blog Desk
            </span>
          </Link>
        </div>

        {/* CENTER: Global Search */}
        <div className="flex-1 max-w-2xl hidden sm:block">
          <NavUserSearch />
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!isDarkMode)}
            className="text-muted-foreground hover:text-foreground rounded-full h-9 w-9 flex"
          >
            <Sun className="h-4.5 w-4.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4.5 w-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {isAuthenticated && (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link to="/create" className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mr-2">
                <PenSquare className="h-4.5 w-4.5" />
                Write
              </Link>
              
              <NotificationBell />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full ring-1 ring-border hover:ring-primary/30 transition-all p-0"
                  >
                    <Avatar className="h-8 w-8">
                      {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} className="object-cover" />}
                      <AvatarFallback className="bg-muted text-foreground font-semibold text-xs">
                        {userName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 shadow-lg border-border/60" align="end">
                  <DropdownMenuLabel className="font-normal py-2.5 text-xs">
                    <div className="flex flex-col gap-0.5">
                      <p className="font-bold leading-none">{userName}</p>
                      <p className="leading-none text-muted-foreground truncate mt-1">{userEmail}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer gap-2 py-2">
                    <Link to="/profile">
                      <User className="h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer gap-2 py-2">
                    <Link to="/settings">
                      <Settings className="h-4 w-4" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive cursor-pointer gap-2 py-2"
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {!isAuthenticated && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-xs font-bold rounded-full">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="text-xs font-bold rounded-full px-5 h-9">
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
