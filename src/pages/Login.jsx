import { Link } from 'react-router-dom';
import { LoginForm } from '@/features/auth';

const Login = () => {
  return (
    <main className="page-container flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
      <div className="w-full max-w-[400px] space-y-10 animate-in fade-in zoom-in-95 duration-700">
        {/* Logo/Branding Header */}
        <header className="flex flex-col items-center">
          <Link to="/" className="group flex flex-col items-center gap-4 transition-all">
            <div className="flex size-11 items-center justify-center rounded bg-foreground font-black text-xl text-background transition-all group-hover:opacity-90 active:scale-95 shadow-lg shadow-foreground/10">
              B
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black tracking-tighter text-foreground uppercase">blogdesk</span>
              <div className="h-0.5 w-4 bg-primary/20 mt-0.5" />
            </div>
          </Link>
        </header>

        {/* Feature Component */}
        <LoginForm />
      </div>
    </main>
  );
};

export default Login;
