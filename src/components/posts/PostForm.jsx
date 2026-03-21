import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { postService } from '@/services/posts';
import toast from 'react-hot-toast';
import {
  Loader2, Save, ArrowLeft, Eye, Code, ImageIcon, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { getRandomPostData } from '@/utils/fakePostData';
import { CATEGORIES } from '@/constants';

import PostEditorToolbar from './PostEditorToolbar';
import PostPreviewDialog from './PostPreviewDialog';

const PostForm = ({ initialData, onSubmit, isSubmitting, mode = 'create', onBackClick }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title:         initialData?.title         || '',
    content:       initialData?.content       || '',
    status:        initialData?.status        || 'draft',
    coverImageUrl: initialData?.coverImageUrl || null,
    coverImageId:  initialData?.coverImageId  || null,
    category:      initialData?.category      || null,
  });

  const [isPreviewOpen,    setIsPreviewOpen]    = useState(false);
  const [postImagePreview, setPostImagePreview] = useState(initialData?.coverImageUrl || null);
  const [saveStateLabel,   setSaveStateLabel]   = useState(mode === 'edit' ? 'Saved' : 'Unsaved');
  const isEdit = mode === 'edit';

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: true, italic: true, code: true, bulletList: true, orderedList: true,
        heading: { levels: [1, 2, 3] },
        blockquote: true, codeBlock: true, link: true,
      }),
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
      if (saveStateLabel === 'Saved' && isEdit) setSaveStateLabel('Unsaved changes');
    },
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert max-w-none focus:outline-none min-h-[calc(100vh-20rem)] py-2 text-base leading-relaxed prose-headings:font-bold prose-headings:tracking-tight prose-code:bg-muted prose-code:rounded prose-code:px-1.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-blockquote:border-l-2 prose-blockquote:border-border prose-blockquote:text-muted-foreground prose-blockquote:not-italic',
      },
    },
  });

  useEffect(() => {
    if (editor && initialData && initialData.content !== editor.getHTML()) {
      editor.commands.setContent(initialData.content, false, { preserveCursor: true });
    }
  }, [editor, initialData]);

  const handleFeaturedImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const toastId = toast.loading('Uploading image…');
    try {
      const { fileId, imageUrl } = await postService.uploadPostImage(file, formData.coverImageId);
      setFormData((prev) => ({ ...prev, coverImageUrl: imageUrl, coverImageId: fileId }));
      setPostImagePreview(URL.createObjectURL(file));
      toast.success('Image uploaded', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Upload failed', { id: toastId });
    }
  };

  const removeFeaturedImage = () => {
    setFormData((prev) => ({ ...prev, coverImageUrl: null, coverImageId: null }));
    setPostImagePreview(null);
    toast.success('Featured image removed');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (editor) onSubmit({ ...formData, content: editor.getHTML() });
  };

  const handleRandomData = () => {
    const randomPost = getRandomPostData();
    setFormData((prev) => ({ ...prev, title: randomPost.title }));
    if (editor)
      editor.commands.setContent(
        `<p><strong>${randomPost.title}</strong></p><p>${randomPost.content}</p>`,
      );
  };

  if (!editor)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="page-root flex gap-8">

      {/* ── Left sidebar ── */}
      <aside className="hidden md:flex w-48 shrink-0 flex-col gap-6">
        <div className="sticky top-24 flex flex-col gap-6">

          {/* Back + title */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onBackClick || (() => navigate('/dashboard'))}
              className="h-7 w-7 rounded-full shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
            <div className="flex items-center gap-1.5 min-w-0">
              <p className="text-sm font-semibold truncate">
                {isEdit ? 'Edit Post' : 'New Post'}
              </p>
              <span className={`inline-flex items-center justify-center h-4 w-4 rounded-full shrink-0 ${saveStateLabel.includes('Unsaved') ? 'bg-muted border border-border' : 'bg-muted'}`}>
                {saveStateLabel.includes('Unsaved')
                  ? <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  : <span className="text-[9px] text-muted-foreground">✓</span>
                }
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(val) => setFormData((p) => ({ ...p, status: val }))}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Category
            </Label>
            <Select
              value={formData.category || '__none__'}
              onValueChange={(val) =>
                setFormData((p) => ({ ...p, category: val === '__none__' ? null : val }))
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">
                  <span className="text-muted-foreground">Uncategorised</span>
                </SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cover image */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Cover Image
            </Label>
            {postImagePreview ? (
              <div className="relative rounded-lg overflow-hidden border border-border aspect-video group">
                <img
                  src={postImagePreview}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeFeaturedImage}
                    className="gap-1 text-xs h-7 px-2"
                  >
                    <X className="h-3 w-3" /> Remove
                  </Button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer py-4 text-center">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Click to upload</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFeaturedImageUpload}
                />
              </label>
            )}
          </div>

          <Separator />

          {/* Preview */}
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Eye className="h-4 w-4 shrink-0" /> Preview post
          </button>

          {/* Dev auto-fill */}
          {!isEdit && import.meta.env.DEV && (
            <button
              type="button"
              onClick={handleRandomData}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Code className="h-4 w-4 shrink-0" /> Auto-fill (dev)
            </button>
          )}

          <Separator />

          {/* Actions */}
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => navigate('/dashboard')}
            >
              Discard
            </Button>
            <Button
              type="button"
              size="sm"
              className="w-full text-xs gap-1.5"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <Save className="h-3.5 w-3.5" />
              }
              {isEdit ? 'Update post' : 'Publish post'}
            </Button>
          </div>

        </div>
      </aside>

      {/* ── Right — editor ── */}
      <main className="flex-1 min-w-0">

        {/* Mobile: compact controls row */}
        <div className="md:hidden flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onBackClick || (() => navigate('/dashboard'))}
              className="h-8 w-8 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold">
              {isEdit ? 'Edit Post' : 'New Post'}
            </span>
          </div>
          <Button
            type="button"
            size="sm"
            className="gap-1.5 rounded-full"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <Save className="h-3.5 w-3.5" />
            }
            {isEdit ? 'Update' : 'Publish'}
          </Button>
        </div>

        {/* Editor card */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <PostEditorToolbar editor={editor} />
          <div className="p-6 md:p-8">
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Post title…"
              className="text-2xl md:text-3xl font-bold border-none shadow-none px-0 py-1 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/30 bg-transparent leading-snug mb-4"
              autoFocus
            />
            <Separator className="mb-4" />
            <EditorContent editor={editor} />
          </div>
        </div>

      </main>

      <PostPreviewDialog
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        title={formData.title}
        content={editor.getHTML()}
      />

    </div>
  );
};

export default PostForm;
