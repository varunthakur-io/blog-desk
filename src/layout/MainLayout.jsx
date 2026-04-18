import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navbar, SideNav, VerificationBanner } from '@/components/common';
import { useBookmarksInit } from '@/features/bookmarks';
import { selectAuthUser } from '@/features/auth';
import { cn } from '@/lib/utils';

/**
 * MainLayout manages the overall application structure, including
 * the global Navbar, SideNav, and main content area.
 */
const MainLayout = () => {
  useBookmarksInit();
  const user = useSelector(selectAuthUser);
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isEditorPage = location.pathname.includes('/create') || location.pathname.includes('/edit');
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div
      className={cn(
        'relative flex min-h-screen flex-col',
        isEditorPage && 'h-screen overflow-hidden',
      )}
    >
      {/* Global Navigation Header */}
      <Navbar onToggleSidebar={toggleSidebar} />

      {/* Contextual Notifications */}
      <VerificationBanner user={user} />

      <div className="flex flex-1 items-start">
        {/* Navigation Sidebar: Managed via layout wrapper to decouple component logic from positioning */}
        <aside
          className={cn(
            'border-border/50 sticky top-16 z-40 hidden h-[calc(100vh-4rem)] shrink-0 border-r transition-all duration-500 md:block',
            isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden border-none',
          )}
        >
          <div className="no-scrollbar h-full overflow-y-auto">
            <SideNav isOpen={isSidebarOpen} />
          </div>
        </aside>

        {/* Primary Content Container */}
        <div className="relative flex min-w-0 flex-1 flex-col">
          {/* Aesthetic Background Grid */}
          {!isEditorPage && (
            <div
              className="bg-dot-grid pointer-events-none fixed inset-0 -z-10 opacity-[0.018] dark:opacity-[0.03]"
              aria-hidden="true"
            />
          )}

          <main
            className={cn(
              'mx-auto w-full transition-all duration-300',
              isEditorPage
                ? 'flex h-[calc(100vh-4rem)] max-w-none flex-col overflow-hidden p-0'
                : 'page-container',
            )}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
