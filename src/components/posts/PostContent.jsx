import DOMPurify from 'dompurify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setActiveCategory } from '@/store/posts';

const PostContent = ({ title, content, coverImageUrl, category }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    if (category) {
      dispatch(setActiveCategory(category));
      navigate('/');
    }
  };

  return (
    <div className="space-y-6">
      {/* Category pill */}
      {category && (
        <button
          onClick={handleCategoryClick}
          className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
        >
          {category}
        </button>
      )}

      <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight leading-tight text-foreground">
        {title}
      </h1>

      {coverImageUrl && (
        <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden bg-muted border border-border/40 shadow-sm">
          <img
            src={coverImageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}

      <article
        className="prose prose-base lg:prose-lg dark:prose-invert max-w-none leading-relaxed
          prose-headings:font-bold prose-headings:tracking-tight
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-code:bg-muted prose-code:rounded prose-code:px-1 prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-muted prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl
          prose-blockquote:border-l-primary/50 prose-blockquote:text-muted-foreground
          prose-img:rounded-xl prose-img:shadow-sm"
      >
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
      </article>
    </div>
  );
};

export default PostContent;
