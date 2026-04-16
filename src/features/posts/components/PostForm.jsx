import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import { postService } from '@/features/posts';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// UI Helpers
import {
  PostEditorToolbar,
  PostPreviewDialog,
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

  const titleRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapLink.configure({
        openOnClick: false,
      }),
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] font-serif',
      },
    },
  });

  // Focus title on mount if creating
  useEffect(() => {
    if (mode === 'create' && titleRef.current) {
      titleRef.current.focus();
    }
  }, [mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const wrapOnSubmit = (e) => {
    e?.preventDefault();
    onSubmit(formData);
  };

  if (!editor) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={wrapOnSubmit} className="relative flex flex-col h-full bg-background">
      {/* Zen Toolbar */}
      <PostEditorToolbar 
        editor={editor} 
        isSubmitting={isSubmitting} 
        onPreview={() => setIsPreviewOpen(true)}
        onSave={() => onSubmit(formData)}
        onBack={() => (onBackClick ? onBackClick() : navigate(-1))}
        mode={mode}
      />

      <div className="flex-1 overflow-y-auto no-scrollbar bg-background">
        <div className="w-full h-full flex flex-col lg:flex-row gap-0">
          {/* Main Writing Area */}
          <div className="flex-1 flex flex-col py-8 lg:py-12 border-r border-border/20 overflow-y-auto no-scrollbar">
            <div className="max-w-[850px] w-full mx-auto px-4 sm:px-8 space-y-10">
              <textarea
                ref={titleRef}
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Story title..."
                className="w-full bg-transparent border-0 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-foreground placeholder:text-muted-foreground/20 focus:ring-0 resize-none min-h-[120px] leading-[1.1]"
              />

              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Settings Tray - ALWAYS FULL RIGHT */}
          <aside className="hidden lg:block w-[350px] shrink-0 h-full sticky top-0 overflow-y-auto border-l border-border/20 no-scrollbar">
            <div className="p-8 space-y-0">
               <PostSettingsSidebar 
                formData={formData} 
                setFormData={setFormData}
                onPublish={wrapOnSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </aside>
        </div>
      </div>

      <PostPreviewDialog 
        open={isPreviewOpen} 
        onOpenChange={setIsPreviewOpen} 
        post={{ ...formData, title: formData.title || 'Untitled Story' }} 
      />
    </form>
  );
};

export default PostForm;
