import DOMPurify from 'dompurify';

const PostContent = ({ title, content, postImageURL }) => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
        {title}
      </h1>

      {/* Hero Image */}
      {postImageURL && (
        <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden bg-muted border shadow-sm">
          <img
            src={postImageURL}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Body */}
      <article className="prose prose-lg dark:prose-invert max-w-none leading-relaxed text-justify">
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(content),
          }}
        />
      </article>
    </div>
  );
};

export default PostContent;
