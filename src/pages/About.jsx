import { Link } from 'react-router-dom';
import { BookOpen, Code2, Lightbulb, Users, ArrowRight, Zap } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-7 rounded-xl border border-border bg-card shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
    <div className="p-3 rounded-xl bg-muted mb-4">
      <Icon className="h-6 w-6 text-foreground" />
    </div>
    <h3 className="font-bold text-base mb-1.5">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </div>
);

const WhyItem = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-5">
    <div className="p-2.5 rounded-xl bg-muted shrink-0 mt-0.5">
      <Icon className="h-5 w-5 text-foreground" />
    </div>
    <div>
      <h3 className="font-bold text-base mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </div>
);

const About = () => {
  return (
    <div className="page-root">
      {/* Hero */}
      <section className="text-center mb-20 max-w-3xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          <Zap className="h-3 w-3" />
          About Blog Desk
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Crafting Stories,{' '}
          <span className="gradient-brand">Empowering Voices.</span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Blog Desk is built for creators, developers, and thinkers who want to share their
          perspectives with the world — without the noise.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-foreground text-background text-sm font-semibold rounded-full px-5 py-2.5 hover:opacity-80 transition-opacity shadow-sm"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 border border-border text-sm font-semibold rounded-full px-5 py-2.5 hover:bg-muted transition-colors"
          >
            Browse Posts
          </Link>
        </div>
      </section>

      {/* Mission / Vision / Community */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
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
      <section className="max-w-3xl mx-auto mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">Why Blog Desk?</h2>
          <p className="text-muted-foreground text-sm">Built with modern tools and real attention to detail.</p>
        </div>
        <div className="space-y-7 p-8 rounded-2xl border border-border bg-card shadow-sm">
          <WhyItem
            icon={Code2}
            title="Built for Performance"
            description="Leveraging React 19, Vite, and Appwrite — Blog Desk delivers blazing-fast load times and a highly responsive interface so your content always shines."
          />
          <div className="border-t border-border" />
          <WhyItem
            icon={BookOpen}
            title="Intuitive Authoring"
            description="Our rich-text editor powered by Tiptap gives you a comfortable, distraction-free writing environment. Focus on your words — we handle the rest."
          />
          <div className="border-t border-border" />
          <WhyItem
            icon={Lightbulb}
            title="Engaging Reader Experience"
            description="Clean, distraction-free reading with comments, likes, and sharing built-in. Dark mode ensures comfortable reading day or night."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="text-center max-w-lg mx-auto py-10 px-8 rounded-2xl border border-border bg-muted/40">
        <h2 className="text-2xl font-extrabold tracking-tight mb-2">Ready to start writing?</h2>
        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
          Join Blog Desk today and turn your ideas into stories that matter.
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 bg-foreground text-background text-sm font-semibold rounded-full px-6 py-2.5 hover:opacity-80 transition-opacity shadow-sm"
        >
          Create Free Account <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
};

export default About;

