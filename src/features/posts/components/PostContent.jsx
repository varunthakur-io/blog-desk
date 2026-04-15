import { useEffect, useState, useRef } from 'react';
import DOMPurify from 'dompurify';

// extracts all h2/h3 headings from html string for the TOC
const extractHeadings = (html) => {
  const div = document.createElement('div');
  div.innerHTML = DOMPurify.sanitize(html);
  const nodes = div.querySelectorAll('h2, h3');
  return Array.from(nodes).map((node, i) => ({
    id: `heading-${i}`,
    text: node.textContent,
    level: node.tagName === 'H2' ? 2 : 3,
  }));
};

// injects id attributes into heading elements in the html string
const injectHeadingIds = (html) => {
  const div = document.createElement('div');
  div.innerHTML = DOMPurify.sanitize(html);
  div.querySelectorAll('h2, h3').forEach((node, i) => {
    node.id = `heading-${i}`;
  });
  return div.innerHTML;
};

const PostContent = ({ title, content, coverImageUrl, onHeadingsReady }) => {
  const articleRef = useRef(null);

  // reading progress bar
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // extract headings and pass them up to parent for the TOC
  useEffect(() => {
    if (content && onHeadingsReady) {
      onHeadingsReady(extractHeadings(content));
    }
  }, [content, onHeadingsReady]);

  const processedContent = content ? injectHeadingIds(content) : '';

  return (
    <>
      {/* reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-muted/20">
        <div
          className="h-full bg-gradient-to-r from-primary/40 via-primary to-primary transition-all duration-150 ease-out shadow-[0_0_8px_rgba(var(--primary),0.4)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-8">
        {/* cover image */}
        {coverImageUrl && (
          <div className="relative w-full rounded-3xl overflow-hidden bg-muted border border-border/40 shadow-sm">
            <img
              src={coverImageUrl}
              className="w-full h-auto object-cover max-h-[600px]"
            />
          </div>
        )}

        {/* article body */}
        <article
          ref={articleRef}
          className="prose prose-lg dark:prose-invert w-full max-w-none font-serif
            prose-headings:font-serif prose-headings:font-black prose-headings:tracking-tight prose-headings:text-foreground
            prose-p:text-foreground/90 prose-p:leading-[1.8] prose-p:mb-8
            prose-a:text-primary prose-a:underline prose-a:underline-offset-4 hover:prose-a:opacity-70
            prose-strong:text-foreground prose-strong:font-bold
            prose-code:bg-muted prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-2xl prose-pre:p-6
            prose-blockquote:border-l-4 prose-blockquote:border-primary/20 prose-blockquote:bg-primary/[0.02] prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:text-xl prose-blockquote:font-medium prose-blockquote:italic prose-blockquote:text-foreground/80
            prose-img:rounded-3xl prose-img:border prose-img:border-border/40 prose-img:shadow-lg
            prose-hr:border-border/40
            prose-li:text-foreground/90 prose-li:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      </div>
    </>
  );
};

export default PostContent;
