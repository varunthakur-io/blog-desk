import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Sun,
  Moon,
  Menu,
  X,
  Search,
  LogOut,
  User,
  Settings,
  PenSquare,
} from 'lucide-react';

import { authService } from '../services/authService';
import { clearUser } from '../store/authSlice';
import { setSearchTerm } from '../store/postSlice';
import useDarkMode from '../hooks/useDarkMode';

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

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isDarkMode, setDarkMode] = useDarkMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Derived state for auth status
  const isLoggedIn = !!user;

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(clearUser());
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err.message);
    }
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navItems = [
    { name: 'Home', slug: '/', requiresAuth: false },
    { name: 'Dashboard', slug: '/dashboard', requiresAuth: true },
    { name: 'Create Post', slug: '/create', requiresAuth: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo Area */}
        <NavLink
          to="/"
          className="flex items-center space-x-2.5 transition-opacity hover:opacity-80"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-sm">
            B
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
            Blog Desk
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map(
            (item) =>
              (!item.requiresAuth || isLoggedIn) && (
                <NavLink
                  key={item.name}
                  to={item.slug}
                  className={({ isActive }) =>
                    `transition-colors hover:text-primary ${
                      isActive
                        ? 'text-foreground font-semibold'
                        : 'text-muted-foreground'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ),
          )}
        </nav>

        {/* Right Actions Area */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search Bar (Desktop) */}
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts..."
              className="pl-9 h-9 w-48 lg:w-64 bg-muted/50 border-transparent focus:bg-background transition-all"
              onChange={handleSearchChange}
            />
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!isDarkMode)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* User Dropdown or Login */}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full border border-border/50"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user?.profile?.avatarUrl}
                      alt={user?.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <NavLink to="/profile" className="flex items-center w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <NavLink to="/create" className="flex items-center w-full">
                    <PenSquare className="mr-2 h-4 w-4" />
                    <span>Write Post</span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <NavLink to="/settings" className="flex items-center w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="hidden sm:flex">
                <NavLink to="/login">Log in</NavLink>
              </Button>
              <Button asChild>
                <NavLink to="/signup">Sign up</NavLink>
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-background border-b shadow-lg animate-in slide-in-from-top-5 z-40">
          <nav className="grid gap-2 p-4">
            {/* Mobile Search */}
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts..."
                className="pl-9 bg-muted/50"
                onChange={handleSearchChange}
              />
            </div>

            {navItems.map(
              (item) =>
                (!item.requiresAuth || isLoggedIn) && (
                  <NavLink
                    key={item.name}
                    to={item.slug}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted text-foreground/80'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ),
            )}

            {!isLoggedIn && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button variant="outline" asChild onClick={closeMobileMenu}>
                  <NavLink to="/login">Log in</NavLink>
                </Button>
                <Button asChild onClick={closeMobileMenu}>
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
