import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, Ghost } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * A professional 404 "Page Not Found" screen.
 */
const NotFound = () => {
  return (
    <div className="page-root flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-in fade-in duration-500">
      {/* Visual Element */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
        <div className="relative h-24 w-24 bg-card border border-border rounded-3xl flex items-center justify-center shadow-sm">
          <Ghost className="h-12 w-12 text-primary animate-bounce" />
        </div>
      </div>

      {/* Text Content */}
      <div className="max-w-md space-y-3 mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          404
        </h1>
        <h2 className="text-xl font-bold text-foreground/90">
          Page not found
        </h2>
        <p className="text-muted-foreground">
          The page you are looking for doesn&apos;t exist or has been moved to a new galaxy.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild variant="default" className="rounded-full px-8 h-11 gap-2 shadow-md">
          <Link to="/">
            <Home className="h-4 w-4" /> Return Home
          </Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full px-8 h-11 gap-2">
          <button onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" /> Go Back
          </button>
        </Button>
      </div>

      {/* Helpful Links */}
      <div className="mt-16 pt-8 border-t border-border w-full max-w-xs">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
          Need help finding something?
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary font-medium transition-colors">
            Articles
          </Link>
          <Link to="/about" className="text-muted-foreground hover:text-primary font-medium transition-colors">
            About
          </Link>
          <Link to="/signup" className="text-muted-foreground hover:text-primary font-medium transition-colors">
            Join Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
