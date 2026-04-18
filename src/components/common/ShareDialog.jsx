import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Twitter, Linkedin, Send, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * A clean share dialog with perfectly aligned copy-link and social shortcuts.
 */
const ShareDialog = ({ open, onOpenChange, url, title }) => {
  const [copied, setCopied] = useState(false);
  const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const socialLinks = [
    {
      name: 'X',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
      color:
        'hover:bg-slate-900/10 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
      color: 'hover:bg-blue-600/10 hover:text-blue-600',
    },
    {
      name: 'WhatsApp',
      icon: Send,
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${fullUrl}`)}`,
      color: 'hover:bg-green-500/10 hover:text-green-500',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Share2 className="text-primary h-5 w-5" />
            Share this story
          </DialogTitle>
          <DialogDescription className="text-sm">
            Spread the word and share this article with your community.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Copy Link Section - FIXED ALIGNMENT */}
          <div className="space-y-2">
            <Label htmlFor="link" className="text-xs font-bold tracking-wider uppercase opacity-50">
              Page Link
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="link"
                defaultValue={fullUrl}
                readOnly
                className="text-muted-foreground bg-muted/30 border-border focus-visible:ring-primary/20 h-10 flex-1 rounded-lg text-xs"
              />
              <Button
                type="button"
                size="icon"
                onClick={handleCopy}
                className="h-10 w-10 shrink-0 rounded-lg shadow-sm transition-all active:scale-95"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Social Icons Grid */}
          <div className="grid grid-cols-3 gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`border-border bg-muted/10 group flex flex-col items-center gap-2 rounded-xl border p-3 transition-all duration-200 ${social.color}`}
              >
                <social.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="text-[10px] font-bold tracking-wider uppercase opacity-70 group-hover:opacity-100">
                  {social.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
