import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import DOMPurify from 'dompurify';

const PostPreviewDialog = ({ isOpen, onOpenChange, title, content }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Preview
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-foreground">
            {title || <span className="text-muted-foreground/40">Untitled Post</span>}
          </h1>
          <Separator />
          <article
            className="prose dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-a:text-foreground prose-a:underline prose-a:underline-offset-4
              prose-code:bg-muted prose-code:rounded prose-code:px-1.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-xl
              prose-blockquote:border-l-2 prose-blockquote:border-border prose-blockquote:text-muted-foreground prose-blockquote:not-italic
              prose-img:rounded-xl prose-img:border prose-img:border-border"
          >
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
          </article>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostPreviewDialog;
