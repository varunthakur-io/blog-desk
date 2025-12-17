import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow page-wrapper section-spacing">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
