import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navbar, SideNav, VerificationBanner } from '@/components/common';
import { useBookmarksInit } from '@/features/bookmarks';
import { selectAuthUser } from '@/features/auth';
import { cn } from '@/lib/utils';

const MainLayout = () => {
  useBookmarksInit();
  const user = useSelector(selectAuthUser);
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isEditorPage = location.pathname.includes('/create') || location.pathname.includes('/edit');
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <div className={cn(
      "min-h-screen bg-background flex flex-col",
      isEditorPage && "h-screen overflow-hidden"
    )}>
      {/* Universal Top Navbar */}
      <Navbar onToggleSidebar={toggleSidebar} />
      
      {/* Verification Banner */}
      <VerificationBanner user={user} />

      <div className="flex-1 flex items-start">
        {/* Global SideNav */}
        <div className={cn(
          "hidden md:block sticky top-16 h-[calc(100vh-64px)] transition-all duration-300 border-r border-border/50 bg-background z-40 shrink-0",
          isSidebarOpen ? "w-64" : "w-0 border-none overflow-hidden"
        )}>
          <div className="h-full overflow-y-auto no-scrollbar">
            <SideNav isOpen={isSidebarOpen} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-background relative">
          {/* Subtle top-of-page dot grid accent */}
          {!isEditorPage && <div className="fixed inset-0 bg-dot-grid opacity-[0.018] dark:opacity-[0.03] pointer-events-none -z-10" />}
          
          <main className={cn(
            "w-full mx-auto transition-all duration-300",
            isEditorPage 
              ? "max-w-none p-0 overflow-hidden flex flex-col h-[calc(100vh-64px)]" 
              : "max-w-screen-2xl px-4 sm:px-6 lg:px-10 py-8"
          )}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
