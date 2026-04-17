import { useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon, Menu, LogOut, User, Settings, PenSquare } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
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
import useDarkMode from '@/hooks/useDarkMode';

/**
 * Navbar component for global navigation and user actions.
 * Layout (position, z-index, background) is handled internally as a sticky header.
 */
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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/40">
      <div className="flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6">
        
        {/* Branding & Sidebar Toggle */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleSidebar}
            className="hidden rounded-md text-muted-foreground hover:text-foreground md:flex shrink-0 transition-all hover:bg-muted"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link to="/" className="group flex shrink-0 items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded bg-foreground font-black text-[15px] text-background transition-all group-hover:opacity-90">
              B
            </div>
            <span className="hidden font-sans font-bold tracking-tight text-[17px] text-foreground sm:inline-block">
              blogdesk
            </span>
          </Link>
        </div>

        {/* Search: Layout-decoupled through flex-1 */}
        <div className="hidden max-w-2xl flex-1 sm:block">
          <NavUserSearch />
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!isDarkMode)}
            className="h-9 w-9 rounded-md text-muted-foreground hover:text-foreground shrink-0"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" className="hidden h-9 px-4 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground md:flex shrink-0" asChild>
                <Link to="/create" className="flex items-center gap-2">
                  <PenSquare className="h-4 w-4" />
                  Write
                </Link>
              </Button>
              
              <NotificationBell />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 p-0 rounded-full ring-1 ring-border transition-colors hover:bg-accent shrink-0"
                  >
                    <Avatar className="h-8 w-8">
                      {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} className="object-cover" />}
                      <AvatarFallback className="bg-muted text-xs font-medium">
                        {userName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 border-border/60 shadow-lg" align="end">
                  <DropdownMenuLabel className="py-2.5 text-xs font-normal">
                    <div className="flex flex-col gap-0.5">
                      <p className="font-bold leading-none">{userName}</p>
                      <p className="mt-1 truncate leading-none text-muted-foreground">{userEmail}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer gap-2 py-2">
                    <Link to="/profile">
                      <User className="size-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer gap-2 py-2">
                    <Link to="/settings">
                      <Settings className="size-4" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer gap-2 py-2 text-destructive focus:text-destructive"
                  >
                    <LogOut className="size-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="hidden rounded-md text-sm font-medium sm:flex">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="h-9 rounded-md px-4 text-sm font-medium shadow-sm">
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
