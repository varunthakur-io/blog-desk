import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { Loader2 } from 'lucide-react';

const lowlight = createLowlight(common);

// UI Helpers
import { PostEditorToolbar, PostPreviewDialog, PostSettingsSidebar } from './editor';

const PostForm = ({ initialData, onSubmit, isSubmitting, mode = 'create', onBackClick }) => {
  const navigate = useNavigate();

  // form state
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    status: initialData?.status || 'draft',
    coverImageUrl: initialData?.coverImageUrl || null,
    coverImageId: initialData?.coverImageId || null,
    category: initialData?.category || null,
  });

  // preview state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // refs
  const titleRef = useRef(null);

  // editor instance
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Disable the default codeBlock to use lowlight instead
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
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
        class:
          'prose prose-neutral prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] font-serif transition-colors',
      },
    },
  });

  // focus title on mount
  useEffect(() => {
    if (mode === 'create' && titleRef.current) {
      titleRef.current.focus();
    }
  }, [mode]);

  // auto resize textarea
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
    }
  }, [formData.title]);

  // handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'title') {
      e.target.style.height = 'auto';
      e.target.style.height = e.target.scrollHeight + 'px';
    }
  };

  // submit wrapper
  const wrapOnSubmit = (e) => {
    e?.preventDefault();
    onSubmit(formData);
  };

  // loading state
  if (!editor) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form className="flex flex-col h-screen bg-background" onSubmit={wrapOnSubmit}>
      {/* toolbar */}
      <PostEditorToolbar
        editor={editor}
        isSubmitting={isSubmitting}
        onPreview={() => setIsPreviewOpen(true)}
        onSave={() => onSubmit(formData)}
        onBack={() => (onBackClick ? onBackClick() : navigate(-1))}
        mode={mode}
      />

      {/* main scroll container */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex w-full">
          {/* editor section */}
          <div className="flex-1 flex flex-col py-8 lg:py-12 border-r border-border/20">
            <div className="max-w-[850px] w-full mx-auto px-4 sm:px-8">
              {/* title */}
              <textarea
                ref={titleRef}
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Story title..."
                rows={1}
                className="w-full bg-transparent text-4xl sm:text-5xl lg:text-5xl font-black tracking-wide text-foreground placeholder:text-muted-foreground/20 resize-none overflow-hidden border-none outline-none focus:outline-none focus:ring-0 focus:border-none"
              />
              <div className="h-px w-full bg-border/40 my-4" />

              {/* editor content */}
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* sidebar */}
          <aside className="hidden lg:block w-[350px] shrink-0 sticky top-0 h-screen border-l border-border/20 overflow-y-auto">
            <div className="p-8">
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

      {/* preview dialog */}
      <PostPreviewDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        post={{ ...formData, title: formData.title || 'Untitled Story' }}
      />
    </form>
  );
};

export default PostForm;
