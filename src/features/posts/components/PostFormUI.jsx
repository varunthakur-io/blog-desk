import React from 'react';
import {
  ArrowLeft,
  Save,
  Loader2,
  Eye,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Undo,
  Redo,
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
    <div className="group relative">
      {imagePreview ? (
        <div className="relative aspect-video rounded-md overflow-hidden bg-muted/30 border border-border/40 shadow-sm transition-all duration-300 group-hover:shadow-md">
          <img
            src={imagePreview}
            alt="Featured image"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onRemove}
              className="gap-2 text-[11px] font-bold rounded-md h-8 px-4 shadow-xl active:scale-95"
            >
              <X className="h-3 w-3" /> Remove Header
            </Button>
          </div>
        </div>
      ) : (
        <label className="relative flex flex-col items-center justify-center gap-4 aspect-video rounded-md border border-dashed border-border/60 bg-muted/5 hover:bg-muted/10 hover:border-primary/20 transition-all cursor-pointer group">
          <div className="p-3 rounded-md bg-background border border-border/40 text-muted-foreground group-hover:text-foreground group-hover:border-border/60 transition-all shadow-sm">
            <Upload className="h-5 w-5" />
          </div>
          <div className="space-y-1 text-center">
            <p className="text-[13px] font-bold text-foreground">Header Image</p>
            <p className="text-[11px] font-medium text-muted-foreground">Click to upload · 16:9 recommended</p>
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
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto rounded-md">
        <DialogHeader>
          <DialogTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-left">
            Preview
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-foreground text-left">
            {title || <span className="text-muted-foreground/40">Untitled Post</span>}
          </h1>
          <Separator className="opacity-40" />
          <article
            className="prose dark:prose-invert max-w-none text-left
              prose-headings:font-bold prose-headings:tracking-tight
              prose-a:text-foreground prose-a:underline prose-a:underline-offset-4
              prose-code:bg-muted prose-code:rounded prose-code:px-1.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-md
              prose-blockquote:border-l-2 prose-blockquote:border-border prose-blockquote:text-muted-foreground prose-blockquote:not-italic
              prose-img:rounded-md prose-img:border prose-img:border-border"
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
    <div className="flex items-center gap-0.5 flex-wrap">
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

      <Separator orientation="vertical" className="h-4 mx-1 opacity-50" />

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

      <Separator orientation="vertical" className="h-4 mx-1 opacity-50" />

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

      <Separator orientation="vertical" className="h-4 mx-1 opacity-50" />

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
    <aside className="hidden lg:flex w-[350px] shrink-0 flex-col gap-10 py-10 px-10 bg-muted/5 h-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col gap-10">
        
        {/* Header Metadata */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-foreground tracking-tight">Post Details</h3>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted border border-border/40">
              <span className={`h-1.5 w-1.5 rounded-full ${saveStateLabel.includes('Unsaved') ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="text-[10px] font-bold text-muted-foreground tracking-tight">{saveStateLabel.includes('Unsaved') ? 'Unsaved' : 'Saved'}</span>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2.5">
              <Label className="text-[13px] font-bold text-foreground">Category</Label>
              <Select
                value={category || '__none__'}
                onValueChange={(val) => onCategoryChange(val === '__none__' ? null : val)}
              >
                <SelectTrigger className="h-9 rounded-md bg-transparent border-border/60 text-[13px] font-medium focus:ring-1 focus:ring-primary/20">
                  <SelectValue placeholder="Add category" />
                </SelectTrigger>
                <SelectContent className="rounded-md border-border/60 shadow-xl">
                  <SelectItem value="__none__" className="text-xs font-medium text-muted-foreground">None</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-xs font-medium">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2.5">
              <Label className="text-[13px] font-bold text-foreground">Visibility</Label>
              <Select value={status} onValueChange={onStatusChange}>
                <SelectTrigger className="h-9 rounded-md bg-transparent border-border/60 text-[13px] font-medium focus:ring-1 focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-md border-border/60 shadow-xl">
                  <SelectItem value="published" className="text-xs font-medium">Publicly Live</SelectItem>
                  <SelectItem value="draft" className="text-xs font-medium">Hidden Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Media Selection */}
        <div className="space-y-4">
          <h3 className="text-[13px] font-bold text-foreground tracking-tight">Header Media</h3>
          <FeaturedImageUpload
            imagePreview={imagePreview}
            onUpload={onImageUpload}
            onRemove={onImageRemove}
          />
        </div>

        <Separator className="opacity-40" />

        {/* Advanced Actions */}
        <div className="space-y-3">
          {!isEdit && import.meta.env.DEV && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRandomData}
              className="w-full justify-start gap-3 text-foreground hover:bg-muted transition-all text-xs font-bold h-9 rounded-md border-border/40"
            >
              <span className="size-4 flex items-center justify-center rounded-sm bg-muted text-[10px]">✨</span>
              Magic Gen
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDiscard}
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all text-xs font-bold h-9 rounded-md"
          >
            <X className="h-3.5 w-3.5" />
            Discard
          </Button>
          
          <Button
            type="button"
            size="sm"
            className="w-full text-xs font-bold gap-2 h-9 rounded-md shadow-sm bg-foreground text-background transition-all hover:opacity-90 active:scale-95"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {isEdit ? 'Save Changes' : 'Publish Story'}
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
    <div className="md:hidden rounded-md border border-border bg-card p-4 mb-4 space-y-4 text-left">
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Status
        </Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="h-8 text-xs rounded-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* ... similar updates for mobile ... */}
    </div>
  );
};
