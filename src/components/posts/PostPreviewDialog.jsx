import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import DOMPurify from 'dompurify';

const PostPreviewDialog = ({ isOpen, onOpenChange, title, content }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview Post</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <h1 className="text-3xl font-bold">{title || 'Untitled Post'}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <Separator />
          <div className="prose prose-stone dark:prose-invert max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(content),
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostPreviewDialog;
