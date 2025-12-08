import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Loader2,
  Save,
  ArrowLeft,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Code,
  MoreVertical,
  Calendar,
  Hash,
  Eye,
  Heading1,
  Heading2,
  Quote,
  Redo,
  Undo,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getRandomPostData } from '@/utils/fakePostData';
import DOMPurify from 'dompurify'; // For sanitizing preview

const CATEGORIES = [
  'Technology',
  'Lifestyle',
  'Travel',
  'Programming',
  'Thoughts',
  'Science',
  'Art',
  'Health',
];

const PostForm = ({
  initialData,
  onSubmit,
  isSubmitting,
  mode = 'create',
  onBackClick,
}) => {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '', // This will now store HTML
    category: initialData?.category || '',
    published: initialData?.published ?? true, // Default to public
  });

  // UI State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [status, setStatus] = useState(mode === 'edit' ? 'Draft' : 'Unsaved'); // Placeholder for actual status

  const isEdit = mode === 'edit';

  // Force re-render on selection change to update toolbar state
  const [, forceUpdate] = useState();

  // TipTap Editor Initialization
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: true,
        italic: true,
        bulletList: true,
        orderedList: true,
        heading: {
          levels: [1, 2, 3], // Allow h1, h2, h3
        },
        blockquote: true,
        codeBlock: true,
        link: true,
      }),
    ],
    content: formData.content, // Initial content for the editor
    onUpdate: ({ editor }) => {
      // Update formData with the new HTML content
      const html = editor.getHTML();
      setFormData((prev) => ({ ...prev, content: html }));
      // Update status if content changes
      if (status === 'Published' && mode === 'edit')
        setStatus('Unsaved Changes');
      if (status === 'Draft' && mode === 'create') setStatus('Unsaved Draft');
    },
    onSelectionUpdate: () => forceUpdate(Math.random()), // Force re-render for toolbar active states
    onTransaction: () => forceUpdate(Math.random()), // Catch-all for other state changes
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert max-w-none focus:outline-none min-h-[400px] flex-1 py-4 text-lg leading-relaxed',
      },
    },
  });

  // Update editor content when initialData changes
  useEffect(() => {
    if (editor && initialData && initialData.content !== editor.getHTML()) {
      editor.commands.setContent(initialData.content, false, {
        preserveCursor: true,
      });
      if (mode === 'edit') setStatus('Published'); // Assuming fetched posts are published
    }
  }, [editor, initialData, mode]);

  // Update formData when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        title: initialData.title || '',
        category: initialData.category || '',
        published: initialData.published ?? true,
      }));
    }
  }, [initialData]);

  // Handle changes for title and category (still using input/select)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleVisibilityChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      published: value === 'public' ? true : false,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editor) {
      onSubmit({ ...formData, content: editor.getHTML() }); // Ensure latest HTML from editor is submitted
    }
  };

  const handleRandomData = () => {
    const data = getRandomPostData();
    // For Tiptap, content needs to be HTML
    const randomContentHtml = `<p><strong>${data.title}</strong></p><p>${data.content}</p>`;
    setFormData((prev) => ({ ...prev, title: data.title }));
    if (editor) editor.commands.setContent(randomContentHtml);
  };

  // --- Toolbar Commands ---
  const Toolbar = useCallback(
    () => (
      <div
        className="border-b bg-muted/20 p-2 flex items-center gap-1 flex-wrap"
        onMouseDown={(e) => e.preventDefault()} // Prevent losing editor focus
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={`h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground ${editor.isActive('bold') ? 'bg-accent text-accent-foreground' : ''}`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={`h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground ${editor.isActive('italic') ? 'bg-accent text-accent-foreground' : ''}`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleCode().run();
          }}
          className={`h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground ${editor.isActive('code') ? 'bg-accent text-accent-foreground' : ''}`}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={`h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground ${editor.isActive('bulletList') ? 'bg-accent text-accent-foreground' : ''}`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={`h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground ${editor.isActive('orderedList') ? 'bg-accent text-accent-foreground' : ''}`}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          }}
          className={`h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground ${editor.isActive('heading', { level: 1 }) ? 'bg-accent text-accent-foreground' : ''}`}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={`h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground ${editor.isActive('heading', { level: 2 }) ? 'bg-accent text-accent-foreground' : ''}`}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBlockquote().run();
          }}
          className={`h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground ${editor.isActive('blockquote') ? 'bg-accent text-accent-foreground' : ''}`}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            const url = window.prompt('URL');
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          className={`h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground ${editor.isActive('link') ? 'bg-accent text-accent-foreground' : ''}`}
          title="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().undo().run();
          }}
          disabled={!editor.can().undo()}
          className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().redo().run();
          }}
          disabled={!editor.can().redo()}
          className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    ),
    [editor],
  );

  if (!editor) {
    return (
      <Loader2 className="h-8 w-8 animate-spin mx-auto my-16 text-muted-foreground" />
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 animate-in fade-in duration-500">
      {/* Header / Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onBackClick || (() => navigate('/dashboard'))}
            className="h-10 w-10 rounded-full border-muted-foreground/20"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              {isEdit ? 'Edit Post' : 'New Entry'}
              <Badge
                variant={status.includes('Unsaved') ? 'outline' : 'secondary'}
                className="font-normal text-xs"
              >
                {status}
              </Badge>
            </h1>
            <p className="text-muted-foreground text-sm">
              {isEdit
                ? 'Refine your content.'
                : 'Write something amazing today.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEdit && import.meta.env.DEV && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRandomData}
              title="Dev: Auto-fill"
            >
              <Code className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            Discard
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isEdit ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/40 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
            {/* Visual Toolbar */}
            {editor && <Toolbar />}

            <CardContent className="p-6 md:p-8 flex-1 flex flex-col gap-6">
              {/* Title */}
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Article Title..."
                className="text-3xl md:text-4xl font-bold border-none shadow-none px-0 py-4 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/30 bg-transparent"
                autoFocus
              />

              {/* Content Editor */}
              {editor && <EditorContent editor={editor} />}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Publishing / Meta Card */}
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Publishing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Status</Label>
                <div className="flex items-center justify-between border rounded-md p-2 bg-muted/10">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${status.includes('Unsaved') || status === 'Draft' ? 'bg-yellow-500' : 'bg-green-500'}`}
                    />
                    {status}
                  </span>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Visibility</Label>
                <Select
                  value={formData.published ? 'public' : 'private'}
                  onValueChange={handleVisibilityChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Organization Card */}
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Organization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category */}
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-2">
                  <Hash className="h-3 w-3" /> Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Preview (Visual) */}
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> Publish Date
                </Label>
                <div className="text-sm text-muted-foreground border rounded-md p-2 bg-muted/30">
                  Immediately
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card className="bg-primary/5 border-primary/10 border-dashed">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Preview how this post will look.
              </p>
              <Button
                variant="outline"
                className="w-full border-primary/20 text-primary hover:bg-primary/10"
                onClick={() => setIsPreviewOpen(true)}
              >
                <Eye className="mr-2 h-4 w-4" /> Preview
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview Post</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <h1 className="text-3xl font-bold">
              {formData.title || 'Untitled Post'}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge variant="secondary">
                {formData.category || 'Uncategorized'}
              </Badge>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <Separator />
            <div className="prose prose-stone dark:prose-invert max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    editor ? editor.getHTML() : formData.content,
                  ),
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostForm;
