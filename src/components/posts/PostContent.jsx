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
    <div className="space-y-7">
      {/* Category + title block */}
      <div className="space-y-3">
        {category && (
          <button
            onClick={handleCategoryClick}
            className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-colors duration-200"
          >
            {category}
          </button>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight leading-[1.15] text-foreground">
          {title}
        </h1>
      </div>

      {/* Cover image */}
      {coverImageUrl && (
        <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden bg-muted border border-border shadow-sm">
          <img
            src={coverImageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}

      {/* Body */}
      <article
        className="prose prose-base lg:prose-lg dark:prose-invert max-w-none
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
          prose-p:text-foreground/85 prose-p:leading-relaxed
          prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 hover:prose-a:opacity-70
          prose-strong:text-foreground
          prose-code:bg-muted prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-pre:text-sm
          prose-blockquote:border-l-2 prose-blockquote:border-border prose-blockquote:text-muted-foreground prose-blockquote:not-italic
          prose-img:rounded-xl prose-img:shadow-sm prose-img:border prose-img:border-border
          prose-hr:border-border
          prose-li:text-foreground/85"
      >
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
      </article>
    </div>
  );
};

export default PostContent;
