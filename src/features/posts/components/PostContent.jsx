import { useEffect, useState, useRef } from 'react';
import DOMPurify from 'dompurify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setActiveCategory } from '@/features/posts';

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
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-border/50">
        <div
          className="h-full bg-foreground transition-all duration-75 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-8">
        {/* title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] text-foreground">
          {title}
        </h1>

        {/* cover image */}
        {coverImageUrl && (
          <div
            className="relative w-full rounded-2xl overflow-hidden bg-muted border border-border shadow-sm"
            style={{ maxHeight: '500px' }}
          >
            <img
              src={coverImageUrl}
              alt={title}
              className="w-full h-full object-cover"
              style={{ maxHeight: '500px' }}
            />
          </div>
        )}

        {/* article body */}
        <article
          ref={articleRef}
          className="prose prose-base lg:prose-lg dark:prose-invert w-full max-w-full
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
            prose-headings:border-b prose-headings:border-border prose-headings:pb-2 prose-headings:mb-4
            prose-p:text-foreground/85 prose-p:leading-relaxed
            prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 hover:prose-a:opacity-70
            prose-strong:text-foreground
            prose-code:bg-muted prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-pre:text-sm
            prose-blockquote:border-l-2 prose-blockquote:border-border prose-blockquote:text-muted-foreground prose-blockquote:not-italic
            prose-img:rounded-xl prose-img:border prose-img:border-border
            prose-hr:border-border
            prose-li:text-foreground/85"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      </div>
    </>
  );
};

export default PostContent;
