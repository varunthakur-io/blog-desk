import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '@/components/common/Navbar';
import { useBookmarksInit } from '@/features/bookmarks';
import { VerificationBanner, selectAuthUser } from '@/features/auth';

const MainLayout = () => {
  useBookmarksInit();
  const user = useSelector(selectAuthUser);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Global verification reminder */}
      <VerificationBanner user={user} />

      {/* Subtle top-of-page dot grid accent */}
      <div className="fixed inset-0 bg-dot-grid opacity-[0.018] dark:opacity-[0.03] pointer-events-none -z-10" />
      
      <Navbar />
      
      <main className="flex-grow page-wrapper section-spacing">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
