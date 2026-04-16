import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import { postService } from '@/features/posts';
import toast from 'react-hot-toast';
import { Loader2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { getRandomPostData } from '@/utils/fakePostData';
import { CATEGORIES } from '@/constants';

// UI Helpers
import {
  PostEditorToolbar,
  PostPreviewDialog,
  FeaturedImageUpload,
  PostSettingsSidebar,
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

  const titleRef = useRef(null);

  // Auto-resize title textarea on mount and change
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [formData.title]);

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
      TiptapLink.configure({ openOnClick: false }),
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
      if (saveStateLabelRef.current === 'Saved' && isEdit) setSaveStateLabel('Unsaved changes');
    },
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert max-w-none focus:outline-none min-h-[500px] py-2 text-base leading-relaxed prose-headings:font-bold prose-headings:tracking-tight prose-code:bg-muted prose-code:rounded prose-code:px-1.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-blockquote:border-l-2 prose-blockquote:border-border prose-blockquote:text-muted-foreground prose-blockquote:not-italic',
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
    <div className="flex-1 flex flex-col bg-background animate-in fade-in duration-700">
      {/* Editor Header (Sleek sticky top-bar) */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40 px-6 sm:px-10 h-14 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-6">
          <RouterLink to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </RouterLink>
          <div className="h-5 w-px bg-border/60" />
          {/* Integrated Toolbar */}
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar max-w-sm sm:max-w-md lg:max-w-none">
            <PostEditorToolbar editor={editor} />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsPreviewOpen(true)}
            className="rounded-md text-[13px] font-bold text-muted-foreground hover:text-foreground h-9 px-4 transition-all border border-border/40 bg-muted/5 hover:bg-muted/20"
          >
            Preview
          </Button>
          
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-md px-6 font-bold text-[13px] bg-foreground text-background h-9 shadow-sm transition-all active:scale-95 gap-2 border-none"
          >
            {isSubmitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : null}
            {isEdit ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar bg-background">
        <div className="w-full h-full flex flex-col lg:flex-row gap-0">
          {/* Main Writing Area */}
          <div className="flex-1 flex flex-col py-8 lg:py-12 border-r border-border/20 overflow-y-auto no-scrollbar">
            <div className="max-w-[850px] w-full mx-auto px-4 sm:px-8 space-y-10">
              <textarea
                ref={titleRef}
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Story Title"
                rows={1}
                className="w-full text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tighter border-none shadow-none px-0 py-0 focus:outline-none placeholder:text-muted-foreground/10 bg-transparent leading-[1.05] resize-none overflow-hidden min-h-[1.1em]"
                autoFocus
              />
              
              <div className="relative">
                <EditorContent 
                  editor={editor} 
                  className="prose-xl font-serif prose-headings:font-serif prose-p:text-foreground/90 leading-relaxed min-h-[60vh]"
                />
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <PostSettingsSidebar
            isEdit={isEdit}
            onBackClick={onBackClick}
            saveStateLabel={saveStateLabel}
            status={formData.status}
            onStatusChange={(val) => setFormData(p => ({ ...p, status: val }))}
            category={formData.category}
            onCategoryChange={(val) => setFormData(p => ({ ...p, category: val }))}
            imagePreview={postImagePreview}
            onImageUpload={handleFeaturedImageUpload}
            onImageRemove={removeFeaturedImage}
            onPreviewClick={() => setIsPreviewOpen(true)}
            onRandomData={handleRandomData}
            onDiscard={() => navigate(-1)}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
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
