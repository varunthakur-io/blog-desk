import { Link } from 'react-router-dom';
import { LoginForm } from '@/features/auth';

const Login = () => {
  return (
    <main className="flex min-h-screen">
      {/* ── Left Side: Editorial Canvas ── */}
      <section className="relative isolate hidden w-1/2 lg:block">
        {/* Layer 0: Isolated Clipping Container */}
        <div className="absolute inset-0 overflow-hidden select-none">
          <img
            src="/auth_hero.webp"
            alt="Architectural Writing Studio"
            className="absolute inset-0 h-full w-full transform-gpu object-cover grayscale-10 transition-all duration-10000 ease-out backface-hidden hover:scale-110 hover:grayscale-0"
          />
        </div>

        {/* Layer 1: Darkening Overlay */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-r from-black/70 via-black/40 to-black/0" />

        {/* Layer 2: Typographic Overlay */}
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end p-12 text-white lg:p-16 xl:p-20">
          <div className="max-w-md space-y-4">
            <h2 className="text-4xl leading-tight font-black tracking-tighter text-white/90 xl:text-5xl">
              The space where words find their gravity.
            </h2>
            <div className="h-px w-10 bg-white/30" />
            <p className="text-sm font-medium text-white/50">BlogDesk — Digital Magazine</p>
          </div>
        </div>
      </section>

      {/* ── Right Side: Entry Interface ── */}
      <section className="flex w-full flex-col items-center justify-center p-6 sm:p-8 lg:w-1/2 lg:p-12 xl:p-20">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center lg:justify-start">
            <Link to="/" className="group flex items-center gap-3">
              <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg text-sm font-bold">
                B
              </div>
              <div className="flex flex-col">
                <span className="text-foreground text-lg font-black tracking-tighter">BlogDesk</span>
                <span className="text-muted-foreground -mt-0.5 text-[10px] font-medium">
                  Digital Magazine
                </span>
              </div>
            </Link>
          </div>

          <LoginForm />
        </div>
      </section>
    </main>
  );
};

export default Login;
