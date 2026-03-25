import React from 'react';
import {
  X,
  Upload,
  ArrowLeft,
  Save,
  Loader2,
  Eye,
  Code,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Undo,
  Redo,
  CodeSquare,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DOMPurify from 'dompurify';
import { CATEGORIES } from '@/constants';

// ─── Featured Image Upload ───────────────────────────────────────────

export const FeaturedImageUpload = ({ imagePreview, onUpload, onRemove }) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Featured Image
      </p>

      {imagePreview ? (
        <div className="relative rounded-lg overflow-hidden border border-border aspect-video group">
          <img
            src={imagePreview}
            alt="Featured"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onRemove}
              className="gap-1.5 text-xs rounded-lg"
            >
              <X className="h-3.5 w-3.5" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <label className="relative flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer min-h-32 p-4 text-center">
          <div className="p-2 rounded-full bg-muted">
            <Upload className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs font-medium text-foreground">Click to upload</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">PNG, JPG, WebP up to 5MB</p>
          </div>
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={onUpload}
          />
        </label>
      )}
    </div>
  );
};

// ─── Post Preview Dialog ─────────────────────────────────────────────

export const PostPreviewDialog = ({ isOpen, onOpenChange, title, content }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-left">
            Preview
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-foreground text-left">
            {title || <span className="text-muted-foreground/40">Untitled Post</span>}
          </h1>
          <Separator />
          <article
            className="prose dark:prose-invert max-w-none text-left
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

// ─── Post Editor Toolbar ─────────────────────────────────────────────

const ToolbarButton = ({ onClick, isActive, disabled, title, children }) => (
  <button
    type="button"
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    disabled={disabled}
    title={title}
    className={`h-8 w-8 flex items-center justify-center rounded-md text-sm transition-colors
      ${
        isActive
          ? 'bg-foreground text-background'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }
      disabled:opacity-30 disabled:cursor-not-allowed`}
  >
    {children}
  </button>
);

export const PostEditorToolbar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="border-b border-border bg-muted/30 px-3 py-2 flex items-center gap-0.5 flex-wrap">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Bold"
      >
        <Bold className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic"
      >
        <Italic className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        title="Inline code"
      >
        <Code className="h-3.5 w-3.5" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-5 mx-1.5" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        <Heading1 className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <Heading2 className="h-3.5 w-3.5" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-5 mx-1.5" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Bullet list"
      >
        <List className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Ordered list"
      >
        <ListOrdered className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        title="Blockquote"
      >
        <Quote className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
        title="Code block"
      >
        <CodeSquare className="h-3.5 w-3.5" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-5 mx-1.5" />

      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo"
      >
        <Undo className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo"
      >
        <Redo className="h-3.5 w-3.5" />
      </ToolbarButton>
    </div>
  );
};

// ─── Post Settings Sidebar ───────────────────────────────────────────

export const PostSettingsSidebar = ({
  isEdit,
  onBackClick,
  saveStateLabel,
  status,
  onStatusChange,
  category,
  onCategoryChange,
  imagePreview,
  onImageUpload,
  onImageRemove,
  onPreviewClick,
  onRandomData,
  onDiscard,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <aside className="hidden md:flex w-48 shrink-0 flex-col gap-6">
      <div className="sticky top-24 flex flex-col gap-6 relative pr-6">
        <div className="absolute top-0 right-0 bottom-0 hidden h-full w-px bg-gradient-to-b from-transparent via-border to-transparent lg:block" />

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onBackClick}
            className="h-7 w-7 rounded-full shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </Button>
          <div className="flex items-center gap-1.5 min-w-0">
            <p className="text-sm font-semibold truncate">{isEdit ? 'Edit Post' : 'New Post'}</p>
            <span
              className={`inline-flex items-center justify-center h-4 w-4 rounded-full shrink-0 ${saveStateLabel.includes('Unsaved') ? 'bg-muted border border-border' : 'bg-muted'}`}
            >
              {saveStateLabel.includes('Unsaved') ? (
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              ) : (
                <span className="text-[9px] text-muted-foreground">✓</span>
              )}
            </span>
          </div>
        </div>

        <div className="space-y-1.5 text-left">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Status
          </Label>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 text-left">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Category
          </Label>
          <Select
            value={category || '__none__'}
            onValueChange={(val) => onCategoryChange(val === '__none__' ? null : val)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">
                <span className="text-muted-foreground">Uncategorised</span>
              </SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <FeaturedImageUpload
          imagePreview={imagePreview}
          onUpload={onImageUpload}
          onRemove={onImageRemove}
        />

        <Separator />

        <button
          type="button"
          onClick={onPreviewClick}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
        >
          <Eye className="h-4 w-4 shrink-0" /> Preview post
        </button>

        {!isEdit && import.meta.env.DEV && (
          <button
            type="button"
            onClick={onRandomData}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
          >
            <Code className="h-4 w-4 shrink-0" /> Auto-fill (dev)
          </button>
        )}

        <Separator />

        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={onDiscard}
          >
            Discard
          </Button>
          <Button
            type="button"
            size="sm"
            className="w-full text-xs gap-1.5"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {isEdit ? 'Update post' : 'Publish post'}
          </Button>
        </div>
      </div>
    </aside>
  );
};

// ─── Post Mobile Options ─────────────────────────────────────────────

export const PostMobileOptions = ({
  status,
  onStatusChange,
  category,
  onCategoryChange,
  imagePreview,
  onImageUpload,
  onImageRemove,
  onPreviewClick,
  onDiscard,
}) => {
  return (
    <div className="md:hidden rounded-xl border border-border bg-card p-4 mb-4 space-y-4 text-left">
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Status
        </Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Category
        </Label>
        <Select
          value={category || '__none__'}
          onValueChange={(val) => onCategoryChange(val === '__none__' ? null : val)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">
              <span className="text-muted-foreground">Uncategorised</span>
            </SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <FeaturedImageUpload
        imagePreview={imagePreview}
        onUpload={onImageUpload}
        onRemove={onImageRemove}
      />

      <Separator />
      <button
        type="button"
        onClick={onPreviewClick}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Eye className="h-4 w-4" /> Preview post
      </button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full text-xs"
        onClick={onDiscard}
      >
        Discard
      </Button>
    </div>
  );
};
