import { Link } from 'react-router-dom';
import { LoginForm } from '@/features/auth';

const Login = () => {
  return (
    <main className="page-container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500">
        {/* Logo/Branding Header */}
        <header className="flex justify-center">
          <Link to="/" className="flex items-center gap-2.5 group transition-transform hover:scale-105 active:scale-95">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-lg font-black text-primary-foreground shadow-md ring-2 ring-primary/20">
              B
            </div>
            <span className="text-2xl font-black tracking-tight text-foreground">Blog Desk</span>
          </Link>
        </header>

        {/* Feature Component */}
        <LoginForm />
      </div>
    </main>
  );
};

export default Login;
