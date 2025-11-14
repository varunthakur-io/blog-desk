import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
