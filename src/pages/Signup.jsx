import { Link } from 'react-router-dom';
import { SignupForm } from '@/features/auth';

const Signup = () => {
  return (
    <main className="flex min-h-screen">
      {/* ── Left Side: Editorial Canvas (Architectural Build) ── */}
      <section className="relative hidden w-1/2 lg:block isolate">
        {/* Layer 0: Isolated Clipping Container */}
        <div className="absolute inset-0 overflow-hidden select-none">
          <div 
            className="absolute inset-0 transition-transform duration-[10000ms] ease-out hover:scale-110 transform-gpu [backface-visibility:hidden] will-change-transform bg-cover bg-center" 
            style={{ backgroundImage: 'url("/auth_hero.png")' }}
            title="Architectural Writing Studio"
          />
        </div>
        
        {/* Layer 1: Darkening Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 via-black/40 to-black/0 pointer-events-none" />
        
        {/* Layer 2: Typographic Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-20 text-white pointer-events-none">
          <div className="max-w-md space-y-6">
            <h2 className="text-5xl font-black tracking-tighter leading-tight italic text-white/80 drop-shadow-lg">
              "Every story begins with a single intention."
            </h2>
            <div className="h-1 w-12 bg-white/40" />
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/60">
              Identity Protocol // BlogDesk
            </p>
          </div>
        </div>
      </section>

      {/* ── Right Side: Entry Interface ── */}
      <section className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2 lg:p-20">
        <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-right-10 duration-1000">
          <div className="mb-12 flex justify-center lg:justify-start">
            <Link to="/" className="group flex items-center gap-4 transition-all">
              <div className="flex size-11 items-center justify-center rounded bg-foreground font-black text-xl text-background transition-all group-hover:opacity-90 active:scale-95 shadow-lg shadow-foreground/10">
                B
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-foreground uppercase">blogdesk</span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 -mt-1">Digital Magazine</span>
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
