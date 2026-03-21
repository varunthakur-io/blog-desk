import { Outlet } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
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
