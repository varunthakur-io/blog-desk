import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Ghost } from 'lucide-react';
import { Button } from '@/components/ui/button';

// NotFound: fallback error state for invalid routes
const NotFound = () => {
  return (
    <div className="animate-in fade-in flex flex-col items-center justify-center space-y-8 px-4 py-20 text-center duration-500">
      {/* Visuals */}
      <div className="relative">
        <div className="bg-primary/10 absolute inset-0 rounded-full blur-3xl" />
        <div className="bg-card border-border relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border shadow-sm">
          <Ghost className="text-primary h-12 w-12 animate-bounce" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">404</h1>
        <h2 className="text-foreground/90 text-xl font-bold">Page not found</h2>
        <p className="text-muted-foreground">
          The page you are looking for doesn&apos;t exist or has been moved to a new galaxy.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-4 sm:flex-row">
        <Button asChild variant="default" className="h-11 gap-2 rounded-full px-8 shadow-md">
          <Link to="/">
            <Home className="h-4 w-4" /> Return Home
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-11 gap-2 rounded-full px-8">
          <button onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" /> Go Back
          </button>
        </Button>
      </div>

      {/* Nav */}
      <div className="border-border mt-16 w-full max-w-xs border-t pt-8">
        <p className="text-muted-foreground mb-4 text-xs font-bold tracking-widest uppercase">
          Need help finding something?
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <Link
            to="/"
            className="text-muted-foreground hover:text-primary font-medium transition-colors"
          >
            Articles
          </Link>
          <Link
            to="/about"
            className="text-muted-foreground hover:text-primary font-medium transition-colors"
          >
            About
          </Link>
          <Link
            to="/signup"
            className="text-muted-foreground hover:text-primary font-medium transition-colors"
          >
            Join Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
