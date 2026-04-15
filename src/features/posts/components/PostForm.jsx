import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import { postService } from '@/features/posts';
import toast from 'react-hot-toast';
import { Loader2, Save } from 'lucide-react';
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
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden animate-in fade-in duration-700">
      {/* Editor Header (Fixed at the top of this component) */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/40 px-4 sm:px-6 lg:px-10 h-14 flex items-center justify-between shadow-sm shrink-0">
        {/* Integrated Toolbar (Left aligned) */}
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
          <PostEditorToolbar editor={editor} />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsPreviewOpen(true)}
            className="rounded-full text-[10px] font-bold text-muted-foreground hover:text-foreground h-8 px-4 uppercase tracking-wider transition-all hidden sm:flex"
          >
            Preview
          </Button>
          
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-full px-6 font-bold text-[10px] bg-[#1a8917] hover:bg-[#156d12] text-white h-8 shadow-sm active:scale-95 transition-all gap-2 border-none uppercase tracking-wider"
          >
            {isSubmitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : null}
            {isEdit ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>

      {/* Main Content Area (Scrollable internally) */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-16 xl:gap-32 items-start px-6">
          {/* Main Writing Area */}
          <div className="flex-1 w-full max-w-[820px] mx-auto lg:mx-0 pt-8 pb-32">
            <div className="space-y-6">
              <textarea
                ref={titleRef}
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                rows={1}
                className="w-full text-3xl md:text-4xl lg:text-5xl font-serif font-bold border-none shadow-none px-0 py-0 focus:outline-none placeholder:text-muted-foreground/20 bg-transparent leading-tight resize-none overflow-hidden min-h-[1.2em]"
                autoFocus
              />
              
              <Separator className="opacity-20" />
              
              <div className="relative pt-4">
                <EditorContent 
                  editor={editor} 
                  className="prose-lg font-serif prose-headings:font-serif prose-p:text-foreground/90 leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <aside className="w-full lg:w-[320px] shrink-0 space-y-16 pb-20 pt-16 lg:sticky lg:top-0 h-fit">
            <div className="space-y-12">
              <div className="space-y-8">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 border-b border-border/40 pb-3">Story Settings</h3>
                
                <div className="space-y-8 px-1">
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold text-foreground/80">Category</Label>
                    <Select
                      value={formData.category || '__none__'}
                      onValueChange={(val) => setFormData(p => ({ ...p, category: val === '__none__' ? null : val }))}
                    >
                      <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/40 text-xs font-bold hover:bg-muted/40 transition-all">
                        <SelectValue placeholder="Add category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl shadow-2xl border-border/40">
                        <SelectItem value="__none__" className="text-xs font-bold">Uncategorised</SelectItem>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat} className="text-xs font-bold">{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-[11px] text-muted-foreground/60 font-medium leading-relaxed italic px-1">Helping readers find your story.</p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold text-foreground/80">Visibility</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(val) => setFormData(p => ({ ...p, status: val }))}
                    >
                      <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/40 text-xs font-bold hover:bg-muted/40 transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl shadow-2xl border-border/40">
                        <SelectItem value="published" className="text-xs font-bold">Public (Visible to all)</SelectItem>
                        <SelectItem value="draft" className="text-xs font-bold">Draft (Only you)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 border-b border-border/40 pb-3">Cover Image</h3>
                <div className="px-1 space-y-5">
                  <div className="rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ring-1 ring-border/40">
                    <FeaturedImageUpload
                      imagePreview={postImagePreview}
                      onUpload={handleFeaturedImageUpload}
                      onRemove={removeFeaturedImage}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground/60 leading-relaxed font-medium italic px-1">
                    High-quality images capture more readers.
                  </p>
                </div>
              </div>

              {!isEdit && import.meta.env.DEV && (
                <div className="pt-10 border-t border-border/40">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleRandomData}
                    className="w-full justify-start gap-4 text-muted-foreground/60 hover:text-primary transition-all text-[10px] font-black uppercase tracking-widest h-12 rounded-2xl px-4 hover:bg-primary/5"
                  >
                    <span className="flex items-center justify-center size-6 rounded-lg bg-primary/10 text-primary shadow-sm">✨</span>
                    Generate Content
                  </Button>
                </div>
              )}
            </div>
          </aside>
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
