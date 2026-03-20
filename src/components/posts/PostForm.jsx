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
  const [saveStateLabel, setSaveStateLabel] = useState(mode === 'edit' ? 'Published' : 'Unsaved');
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
      if (saveStateLabel === 'Published' && isEdit) setSaveStateLabel('Unsaved Changes');
    },
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert max-w-none focus:outline-none min-h-96 flex-1 py-4 text-base leading-relaxed prose-headings:font-bold prose-headings:tracking-tight prose-code:bg-muted prose-code:rounded prose-code:px-1 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none',
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
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto py-4 animate-in fade-in duration-500">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBackClick || (() => navigate('/dashboard'))}
            className="h-9 w-9 rounded-full border border-border/50 hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            {isEdit ? 'Edit Post' : 'New Post'}
            <Badge
              variant={saveStateLabel.includes('Unsaved') ? 'outline' : 'secondary'}
              className="font-normal text-[11px] rounded-full"
            >
              {saveStateLabel}
            </Badge>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {!isEdit && import.meta.env.DEV && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRandomData}
              title="Dev: Auto-fill"
              className="h-9 w-9 rounded-full"
            >
              <Code className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-muted-foreground hover:text-foreground"
          >
            Discard
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            size="sm"
            className="min-w-28 rounded-full gap-2"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden min-h-[60vh] flex flex-col">
            <PostEditorToolbar editor={editor} />
            <div className="p-6 md:p-8 flex-1 flex flex-col gap-4">
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Article title…"
                className="text-2xl md:text-3xl font-bold border-none shadow-none px-0 py-2 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/30 bg-transparent"
                autoFocus
              />
              <div className="border-t border-border/30 pt-4 flex-1">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Publishing card — Status + Category together */}
          <div className="rounded-xl border border-border/50 bg-card shadow-sm p-5 space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Publishing
            </p>

            {/* Status */}
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
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

            {/* Category */}
            <div className="space-y-1.5">
              <Label className="text-xs">Category</Label>
              <Select
                value={formData.category || '__none__'}
                onValueChange={(val) =>
                  setFormData((p) => ({ ...p, category: val === '__none__' ? null : val }))
                }
              >
                <SelectTrigger className="h-9 text-sm rounded-lg">
                  <SelectValue placeholder="Select a category" />
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
          </div>

          {/* Featured Image */}
          <FeaturedImageUpload
            imagePreview={postImagePreview}
            onUpload={handleFeaturedImageUpload}
            onRemove={removeFeaturedImage}
          />

          {/* Preview */}
          <Button
            variant="outline"
            className="w-full gap-2 rounded-xl border-dashed border-border/70 text-sm"
            onClick={() => setIsPreviewOpen(true)}
          >
            <Eye className="h-4 w-4" /> Preview Post
          </Button>
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
