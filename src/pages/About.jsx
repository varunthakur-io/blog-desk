import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  BookOpen,
  Code2,
  Lightbulb,
  Users,
  ArrowRight,
  Zap,
  LayoutDashboard,
  PenLine,
} from 'lucide-react';
import { selectIsAuthenticated } from '@/features/auth';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <article className="hover:border-border border-border bg-card flex flex-col items-center rounded-xl border p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
    <div className="bg-muted mb-4 rounded-xl p-3">
      <Icon className="text-foreground size-6" aria-hidden="true" />
    </div>
    <h3 className="mb-1.5 text-base font-bold">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </article>
);

const WhyItem = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-5">
    <div className="bg-muted mt-0.5 shrink-0 rounded-xl p-2.5">
      <Icon className="text-foreground size-5" aria-hidden="true" />
    </div>
    <div>
      <h3 className="mb-1 text-base font-bold">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

const About = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <div className="animate-in fade-in page-py space-y-16 duration-500">
      {/* Hero */}
      <section className="mx-auto max-w-3xl space-y-6 pt-8 text-center">
        <div className="border-border bg-muted text-muted-foreground mx-auto inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold">
          <Zap className="size-3" />
          About Blog Desk
        </div>
        <h1 className="text-4xl leading-tight font-black tracking-tighter md:text-6xl">
          Crafting Stories,{' '}
          <span className="from-foreground via-foreground/80 to-foreground/60 bg-gradient-to-r bg-clip-text text-transparent">
            Empowering Voices.
          </span>
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed sm:text-lg">
          Blog Desk is built for creators, developers, and thinkers who want to share their
          perspectives with the world — without the noise.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/create"
                className="bg-foreground text-background inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-80"
              >
                <PenLine className="size-4" /> Start Writing
              </Link>
              <Link
                to="/dashboard"
                className="border-border hover:bg-muted inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                <LayoutDashboard className="size-4" /> Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="bg-foreground text-background inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-80"
              >
                Get Started <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/"
                className="border-border hover:bg-muted inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                Browse Posts
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Mission / Vision / Community */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <FeatureCard
          icon={BookOpen}
          title="Our Mission"
          description="To provide a seamless, intuitive, and beautiful space for authentic storytelling and knowledge sharing."
        />
        <FeatureCard
          icon={Lightbulb}
          title="Our Vision"
          description="To foster a vibrant community where ideas flourish, conversations ignite, and every voice finds its audience."
        />
        <FeatureCard
          icon={Users}
          title="Our Community"
          description="Join a growing network of passionate writers and engaged readers. Your next big idea starts here."
        />
      </section>

      {/* Why Blog Desk */}
      <section className="mx-auto max-w-3xl space-y-10">
        <header className="space-y-2 text-center">
          <h2 className="text-3xl font-black tracking-tighter">Why Blog Desk?</h2>
          <p className="text-muted-foreground text-sm">
            Built with modern tools and real attention to detail.
          </p>
        </header>
        <div className="border-border bg-card space-y-7 rounded-2xl border p-8 shadow-sm">
          <WhyItem
            icon={Code2}
            title="Built for Performance"
            description="Leveraging React 19, Vite, and Appwrite — Blog Desk delivers blazing-fast load times and a highly responsive interface so your content always shines."
          />
          <div className="border-border border-t" aria-hidden="true" />
          <WhyItem
            icon={BookOpen}
            title="Intuitive Authoring"
            description="Our rich-text editor powered by Tiptap gives you a comfortable, distraction-free writing environment. Focus on your words — we handle the rest."
          />
          <div className="border-border border-t" aria-hidden="true" />
          <WhyItem
            icon={Lightbulb}
            title="Engaging Reader Experience"
            description="Clean, distraction-free reading with comments, likes, and sharing built-in. Dark mode ensures comfortable reading day or night."
          />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-border bg-muted/40 mx-auto mb-20 max-w-lg rounded-2xl border px-8 py-10 text-center">
        {isAuthenticated ? (
          <>
            <h2 className="mb-2 text-2xl font-black tracking-tighter">
              What will you write today?
            </h2>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Head to your dashboard to manage posts or start a new one.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/create"
                className="bg-foreground text-background inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-80"
              >
                <PenLine className="size-4" /> New Post
              </Link>
              <Link
                to="/dashboard"
                className="border-border hover:bg-muted inline-flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-semibold transition-colors"
              >
                <LayoutDashboard className="size-4" /> Dashboard
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2 className="mb-2 text-2xl font-black tracking-tighter">Ready to start writing?</h2>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Join Blog Desk today and turn your ideas into stories that matter.
            </p>
            <Link
              to="/signup"
              className="bg-foreground text-background inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-80"
            >
              Create Free Account <ArrowRight className="size-4" />
            </Link>
          </>
        )}
      </section>
    </div>
  );
};

export default About;
