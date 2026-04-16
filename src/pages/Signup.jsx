import { Link } from 'react-router-dom';
import { SignupForm } from '@/features/auth';

const Signup = () => {
  return (
    <main className="flex min-h-screen">
      {/* ── Left Side: Editorial Canvas ── */}
      <section className="relative hidden w-1/2 lg:block isolate">
        {/* Layer 0: Isolated Clipping Container */}
        <div className="absolute inset-0 overflow-hidden select-none">
          <img 
            src="/auth_hero.webp"
            alt="Architectural Writing Studio"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-10000 ease-out hover:scale-110 transform-gpu backface-hidden"
          />
        </div>
        
        {/* Layer 1: Darkening Overlay */}
        <div className="absolute inset-0 z-10 bg-linear-to-r from-black/70 via-black/40 to-black/0 pointer-events-none" />
        
        {/* Layer 2: Typographic Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-12 lg:p-16 xl:p-20 text-white pointer-events-none">
          <div className="max-w-md space-y-4">
            <h2 className="text-4xl xl:text-5xl font-bold tracking-tight leading-tight text-white/90">
              Every story begins with a single intention.
            </h2>
            <div className="h-px w-10 bg-white/30" />
            <p className="text-sm font-medium text-white/50">
              BlogDesk — Digital Magazine
            </p>
          </div>
        </div>
      </section>

      {/* ── Right Side: Entry Interface ── */}
      <section className="flex w-full flex-col items-center justify-center p-6 sm:p-8 lg:w-1/2 lg:p-12 xl:p-20 bg-background">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center lg:justify-start">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary font-bold text-sm text-primary-foreground">
                B
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-foreground">BlogDesk</span>
                <span className="text-[10px] font-medium text-muted-foreground -mt-0.5">Digital Magazine</span>
              </div>
            </Link>
          </div>

          <SignupForm />
        </div>
      </section>
    </main>
  );
};

export default Signup;
