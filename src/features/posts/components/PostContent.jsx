import { useEffect, useState, useRef } from 'react';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/common';

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

// injects id attributes and syntax highlighting into the html string
const processContentHtml = (html) => {
  const div = document.createElement('div');
  div.innerHTML = DOMPurify.sanitize(html);

  // Highlighting
  div.querySelectorAll('pre code').forEach((block) => {
    try {
      const result = hljs.highlightAuto(block.textContent);
      block.innerHTML = result.value;
      block.classList.add('hljs');
    } catch (e) {
      console.error('Highlight error:', e);
    }
  });

  // TOC IDs
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

  const processedContent = content ? processContentHtml(content) : '';

  return (
    <>
      {/* premium minimalist progress bar */}
      <div className="bg-muted/20 fixed top-0 right-0 left-0 z-[100] h-0.5">
        <div
          className="bg-foreground h-full shadow-[0_0_10px_rgba(0,0,0,0.2)] transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-8">
        {/* cover image - strictly geometric rounded-md */}
        {coverImageUrl && (
          <div className="bg-muted border-border/40 relative w-full overflow-hidden rounded-md border">
            <img
              src={coverImageUrl}
              className="h-auto max-h-[600px] w-full object-cover transition-transform duration-700 hover:scale-[1.01]"
            />
          </div>
        )}

        {/* article body - premium editorial typography */}
        <article
          ref={articleRef}
          className="prose prose-lg dark:prose-invert prose-headings:font-sans prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-foreground prose-p:font-serif prose-p:text-foreground/90 prose-p:leading-[1.8] prose-p:mb-8 prose-p:text-[18px] prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 hover:prose-a:opacity-70 prose-strong:text-foreground prose-strong:font-bold prose-code:bg-muted prose-code:rounded-md prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:border prose-pre:border-border/40 prose-pre:rounded-md prose-pre:p-6 prose-blockquote:border-l-2 prose-blockquote:border-border prose-blockquote:bg-muted/5 prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:text-xl prose-blockquote:font-serif prose-blockquote:font-medium prose-blockquote:italic prose-blockquote:text-foreground/80 prose-img:rounded-md prose-img:border prose-img:border-border/40 prose-hr:border-border/20 prose-li:text-foreground/90 prose-li:leading-relaxed w-full max-w-none transition-all"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      </div>
    </>
  );
};

export default PostContent;
