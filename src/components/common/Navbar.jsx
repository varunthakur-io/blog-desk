import { useState, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon, Menu, X, LogOut, User, Settings, PenSquare } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { NavUserSearch } from './index';
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
} from '@/store/auth';
import { selectProfileById } from '@/store/profile';
import { authService } from '@/services/auth';
import useDarkMode from '@/hooks/common/useDarkMode';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector(selectAuthUserId);
  const userName = useSelector(selectAuthName);
  const userEmail = useSelector(selectAuthEmail);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const profile = useSelector((state) => selectProfileById(state, userId));

  const [isDarkMode, setDarkMode] = useDarkMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
      dispatch(clearAuthUser());
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      dispatch(clearAuthUser());
      toast.error(error.message || 'Session ended with errors.');
    }
  }, [dispatch, navigate]);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  const navItems = [
    { name: 'Home', slug: '/', requiresAuth: false },
    { name: 'Dashboard', slug: '/dashboard', requiresAuth: true },
    { name: 'Write', slug: '/create', requiresAuth: true },
    { name: 'About', slug: '/about', requiresAuth: false },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="page-wrapper flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <NavLink
            to="/"
            className="flex items-center space-x-2.5 group transition-opacity hover:opacity-90"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-base shadow-sm ring-1 ring-primary/20">
              B
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:inline-block">
              Blog Desk
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {navItems.map(
              (item) =>
                (!item.requiresAuth || isAuthenticated) && (
                  <NavLink
                    key={item.name}
                    to={item.slug}
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-md transition-colors ${
                        isActive
                          ? 'text-foreground bg-muted font-semibold'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ),
            )}
          </nav>
        </div>

        <NavUserSearch />

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 md:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!isDarkMode)}
            className="text-muted-foreground hover:text-foreground rounded-full h-9 w-9"
            aria-label="Toggle theme"
          >
            <Sun className="h-4.5 w-4.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4.5 w-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full ring-1 ring-border hover:ring-primary/30 transition-all"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatarUrl} alt={userName} className="object-cover" />
                    <AvatarFallback className="bg-muted text-foreground font-semibold text-sm">
                      {userName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 shadow-lg border-border/60"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal py-2.5">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate mt-1">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer gap-2">
                  <NavLink to="/profile">
                    <User className="h-4 w-4" /> Profile
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer gap-2">
                  <NavLink to="/create">
                    <PenSquare className="h-4 w-4" /> Write Post
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer gap-2">
                  <NavLink to="/settings">
                    <Settings className="h-4 w-4" /> Settings
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive cursor-pointer gap-2"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-sm">
                <NavLink to="/login">Log in</NavLink>
              </Button>
              <Button size="sm" asChild className="text-sm rounded-full px-4">
                <NavLink to="/signup">Sign up</NavLink>
              </Button>
            </div>
          )}

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-9 w-9 rounded-full"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-xl animate-in slide-in-from-top-3 duration-200 z-40">
          <nav className="grid gap-1 p-3">
            <NavUserSearch isMobile />
            {navItems.map(
              (item) =>
                (!item.requiresAuth || isAuthenticated) && (
                  <NavLink
                    key={item.name}
                    to={item.slug}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-muted text-foreground font-semibold'
                          : 'hover:bg-muted text-foreground/70 hover:text-foreground'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ),
            )}
            {!isAuthenticated && (
              <div className="grid grid-cols-2 gap-2 mt-2 px-1">
                <Button variant="outline" size="sm" asChild onClick={closeMobileMenu}>
                  <NavLink to="/login">Log in</NavLink>
                </Button>
                <Button size="sm" asChild onClick={closeMobileMenu}>
                  <NavLink to="/signup">Sign up</NavLink>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
