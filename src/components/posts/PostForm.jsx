import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { postService } from '@/services/posts';
import toast from 'react-hot-toast';
import { Loader2, Save, ArrowLeft, Eye, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getRandomPostData } from '@/utils/fakePostData';
import { CATEGORIES } from '@/constants';

import PostEditorToolbar from './PostEditorToolbar';
import FeaturedImageUpload from './FeaturedImageUpload';
import PostPreviewDialog from './PostPreviewDialog';

const SidebarCard = ({ title, children }) => (
  <div className="rounded-xl border border-border bg-card p-5 space-y-4">
    {title && (
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
    )}
    {children}
  </div>
);

const PostForm = ({ initialData, onSubmit, isSubmitting, mode = 'create', onBackClick }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    status: initialData?.status || 'draft',
    coverImageUrl: initialData?.coverImageUrl || null,
    coverImageId: initialData?.coverImageId || null,
    category: initialData?.category || null,
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [postImagePreview, setPostImagePreview] = useState(initialData?.coverImageUrl || null);
  const [saveStateLabel, setSaveStateLabel] = useState(mode === 'edit' ? 'Saved' : 'Unsaved');
  const isEdit = mode === 'edit';

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: true,
        italic: true,
        bulletList: true,
        orderedList: true,
        heading: { levels: [1, 2, 3] },
        blockquote: true,
        codeBlock: true,
        link: true,
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
          'prose dark:prose-invert max-w-none focus:outline-none min-h-[420px] py-4 text-base leading-relaxed prose-headings:font-bold prose-headings:tracking-tight prose-code:bg-muted prose-code:rounded prose-code:px-1.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-blockquote:border-l-2 prose-blockquote:border-border prose-blockquote:text-muted-foreground prose-blockquote:not-italic',
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
    e.preventDefault();
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
    <div className="max-w-6xl mx-auto py-4 animate-in fade-in duration-500">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onBackClick || (() => navigate('/dashboard'))}
            className="h-9 w-9 rounded-full border border-border hover:bg-muted shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight">
              {isEdit ? 'Edit Post' : 'New Post'}
            </h1>
            <Badge
              variant={saveStateLabel.includes('Unsaved') ? 'outline' : 'secondary'}
              className="text-[11px] font-normal rounded-full px-2"
            >
              {saveStateLabel}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEdit && import.meta.env.DEV && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRandomData}
              title="Dev: Auto-fill"
              className="h-9 w-9 rounded-full text-muted-foreground"
            >
              <Code className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            Discard
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            size="sm"
            className="min-w-28 rounded-full gap-2 text-sm"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isEdit ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Editor */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col shadow-sm">
            <PostEditorToolbar editor={editor} />
            <div className="p-6 md:p-8 flex flex-col gap-3 flex-1">
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Post title…"
                className="text-2xl md:text-[1.75rem] font-bold border-none shadow-none px-0 py-1 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/30 bg-transparent leading-snug"
                autoFocus
              />
              <div className="border-t border-border pt-4 flex-1">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          {/* Publishing — Status + Category */}
          <SidebarCard title="Publishing">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val) => setFormData((p) => ({ ...p, status: val }))}
              >
                <SelectTrigger className="h-9 text-sm rounded-lg">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Category</Label>
              <Select
                value={formData.category || '__none__'}
                onValueChange={(val) =>
                  setFormData((p) => ({ ...p, category: val === '__none__' ? null : val }))
                }
              >
                <SelectTrigger className="h-9 text-sm rounded-lg">
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
          </SidebarCard>

          {/* Featured Image */}
          <FeaturedImageUpload
            imagePreview={postImagePreview}
            onUpload={handleFeaturedImageUpload}
            onRemove={removeFeaturedImage}
          />

          {/* Preview */}
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card hover:bg-muted/50 transition-colors py-2.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <Eye className="h-4 w-4" /> Preview Post
          </button>
        </div>
      </div>

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
