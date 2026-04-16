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
  <article className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-border flex flex-col items-center rounded-xl border border-border bg-card p-7 text-center shadow-sm">
    <div className="mb-4 rounded-xl bg-muted p-3">
      <Icon className="size-6 text-foreground" aria-hidden="true" />
    </div>
    <h3 className="mb-1.5 text-base font-bold">{title}</h3>
    <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
  </article>
);

const WhyItem = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-5">
    <div className="mt-0.5 shrink-0 rounded-xl bg-muted p-2.5">
      <Icon className="size-5 text-foreground" aria-hidden="true" />
    </div>
    <div>
      <h3 className="mb-1 text-base font-bold">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  </div>
);

const About = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <div className="animate-in fade-in page-py space-y-16 duration-500">
      {/* Hero */}
      <section className="mx-auto max-w-3xl space-y-6 pt-8 text-center">
        <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          <Zap className="size-3" />
          About Blog Desk
        </div>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
          Crafting Stories, <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">Empowering Voices.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Blog Desk is built for creators, developers, and thinkers who want to share their
          perspectives with the world — without the noise.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/create"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-sm transition-opacity hover:opacity-80"
              >
                <PenLine className="size-4" /> Start Writing
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
              >
                <LayoutDashboard className="size-4" /> Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-sm transition-opacity hover:opacity-80"
              >
                Get Started <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
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
          <h2 className="text-3xl font-extrabold tracking-tight">Why Blog Desk?</h2>
          <p className="text-sm text-muted-foreground">
            Built with modern tools and real attention to detail.
          </p>
        </header>
        <div className="space-y-7 rounded-2xl border border-border bg-card p-8 shadow-sm">
          <WhyItem
            icon={Code2}
            title="Built for Performance"
            description="Leveraging React 19, Vite, and Appwrite — Blog Desk delivers blazing-fast load times and a highly responsive interface so your content always shines."
          />
          <div className="border-t border-border" aria-hidden="true" />
          <WhyItem
            icon={BookOpen}
            title="Intuitive Authoring"
            description="Our rich-text editor powered by Tiptap gives you a comfortable, distraction-free writing environment. Focus on your words — we handle the rest."
          />
          <div className="border-t border-border" aria-hidden="true" />
          <WhyItem
            icon={Lightbulb}
            title="Engaging Reader Experience"
            description="Clean, distraction-free reading with comments, likes, and sharing built-in. Dark mode ensures comfortable reading day or night."
          />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mb-20 mx-auto max-w-lg rounded-2xl border border-border bg-muted/40 px-8 py-10 text-center">
        {isAuthenticated ? (
          <>
            <h2 className="mb-2 text-2xl font-extrabold tracking-tight">
              What will you write today?
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              Head to your dashboard to manage posts or start a new one.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/create"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background shadow-sm transition-opacity hover:opacity-80"
              >
                <PenLine className="size-4" /> New Post
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
              >
                <LayoutDashboard className="size-4" /> Dashboard
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2 className="mb-2 text-2xl font-extrabold tracking-tight">Ready to start writing?</h2>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              Join Blog Desk today and turn your ideas into stories that matter.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background shadow-sm transition-opacity hover:opacity-80"
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
