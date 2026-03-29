import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { postService } from '@/features/posts';
import toast from 'react-hot-toast';
import { Loader2, Save, ArrowLeft, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { getRandomPostData } from '@/utils/fakePostData';

// UI Helpers
import {
  PostEditorToolbar,
  PostPreviewDialog,
  PostSettingsSidebar,
  PostMobileOptions,
} from './PostFormUI';

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
  const [mobileOptionsOpen, setMobileOptionsOpen] = useState(false);
  const [postImagePreview, setPostImagePreview] = useState(initialData?.coverImageUrl || null);
  const [saveStateLabel, setSaveStateLabel] = useState(mode === 'edit' ? 'Saved' : 'Unsaved');
  const isEdit = mode === 'edit';

  const saveStateLabelRef = useRef(saveStateLabel);
  useEffect(() => {
    saveStateLabelRef.current = saveStateLabel;
  }, [saveStateLabel]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: true,
        italic: true,
        code: true,
        bulletList: true,
        orderedList: true,
        heading: { levels: [1, 2, 3] },
        blockquote: true,
        codeBlock: true,
        // Disable link in starter kit to avoid duplication with standalone Link extension
        link: false,
      }),
      Link.configure({ openOnClick: false }),
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
      if (saveStateLabelRef.current === 'Saved' && isEdit) setSaveStateLabel('Unsaved changes');
    },
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert max-w-none focus:outline-none min-h-[calc(100vh-20rem)] py-2 text-base leading-relaxed prose-headings:font-bold prose-headings:tracking-tight prose-code:bg-muted prose-code:rounded prose-code:px-1.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-blockquote:border-l-2 prose-blockquote:border-border prose-blockquote:text-muted-foreground prose-blockquote:not-italic',
      },
    },
  });

  const initialContentRef = useRef(initialData?.content);
  useEffect(() => {
    if (editor && initialData?.content && initialData.content !== initialContentRef.current) {
      initialContentRef.current = initialData.content;
      editor.commands.setContent(initialData.content, false, { preserveCursor: true });
    }
  }, [editor, initialData?.content]);

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
      <PostSettingsSidebar
        isEdit={isEdit}
        onBackClick={onBackClick || (() => navigate('/dashboard'))}
        saveStateLabel={saveStateLabel}
        status={formData.status}
        onStatusChange={(val) => setFormData((p) => ({ ...p, status: val }))}
        category={formData.category}
        onCategoryChange={(val) => setFormData((p) => ({ ...p, category: val }))}
        imagePreview={postImagePreview}
        onImageUpload={handleFeaturedImageUpload}
        onImageRemove={removeFeaturedImage}
        onPreviewClick={() => setIsPreviewOpen(true)}
        onRandomData={handleRandomData}
        onDiscard={() => navigate('/dashboard')}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <main className="flex-1 min-w-0">
        {/* mobile top bar */}
        <div className="md:hidden flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 text-left">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onBackClick || (() => navigate('/dashboard'))}
              className="h-8 w-8 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold">{isEdit ? 'Edit Post' : 'New Post'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOptionsOpen((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-full px-3 py-1.5 transition-colors"
            >
              <Settings2 className="h-3.5 w-3.5" />
              Options
            </button>
            <Button
              type="button"
              size="sm"
              className="gap-1.5 rounded-full"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {isEdit ? 'Update' : 'Publish'}
            </Button>
          </div>
        </div>

        {mobileOptionsOpen && (
          <PostMobileOptions
            status={formData.status}
            onStatusChange={(val) => setFormData((p) => ({ ...p, status: val }))}
            category={formData.category}
            onCategoryChange={(val) => setFormData((p) => ({ ...p, category: val }))}
            imagePreview={postImagePreview}
            onImageUpload={handleFeaturedImageUpload}
            onImageRemove={removeFeaturedImage}
            onPreviewClick={() => setIsPreviewOpen(true)}
            onDiscard={() => navigate('/dashboard')}
          />
        )}

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
