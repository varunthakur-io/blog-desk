import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { postService } from '@/services/posts';
import toast from 'react-hot-toast';
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
  Eye,
  Heading1,
  Heading2,
  Quote,
  Redo,
  Undo,
  X,
  ImageIcon,
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getRandomPostData } from '@/utils/fakePostData';
import DOMPurify from 'dompurify';

const PostForm = ({ initialData, onSubmit, isSubmitting, mode = 'create', onBackClick }) => {
  const navigate = useNavigate();

  // Form State matching new schema
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    status: initialData?.status || 'draft',
    coverImageUrl: initialData?.coverImageUrl || null,
    coverImageId: initialData?.coverImageId || null,
  });

  // UI State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [postImagePreview, setPostImagePreview] = useState(initialData?.coverImageUrl || null);
  const [localStatus, setLocalStatus] = useState(mode === 'edit' ? 'Published' : 'Unsaved');

  const isEdit = mode === 'edit';
  const [, forceUpdate] = useState();

  const handleFeaturedImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading('Uploading featured image...');
    try {
      const { fileId, imageUrl } = await postService.uploadPostImage(file, formData.coverImageId);
      setFormData((prev) => ({ ...prev, coverImageUrl: imageUrl, coverImageId: fileId }));
      setPostImagePreview(URL.createObjectURL(file));
      toast.success('Image uploaded', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload image', { id: toastId });
    }
  };

  const removeFeaturedImage = () => {
    setFormData((prev) => ({ ...prev, coverImageUrl: null, coverImageId: null }));
    setPostImagePreview(null);
    toast.success('Featured image removed');
  };

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
      const html = editor.getHTML();
      setFormData((prev) => ({ ...prev, content: html }));
      if (localStatus === 'Published' && isEdit) setLocalStatus('Unsaved Changes');
    },
    onSelectionUpdate: () => forceUpdate(Math.random()),
    onTransaction: () => forceUpdate(Math.random()),
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert max-w-none focus:outline-none min-h-96 flex-1 py-4 text-lg leading-relaxed',
      },
    },
  });

  useEffect(() => {
    if (editor && initialData && initialData.content !== editor.getHTML()) {
      editor.commands.setContent(initialData.content, false, { preserveCursor: true });
    }
  }, [editor, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editor) {
      onSubmit({ ...formData, content: editor.getHTML() });
    }
  };

  const handleRandomData = () => {
    const data = getRandomPostData();
    const randomContentHtml = `<p><strong>${data.title}</strong></p><p>${data.content}</p>`;
    setFormData((prev) => ({ ...prev, title: data.title }));
    if (editor) editor.commands.setContent(randomContentHtml);
  };

  const Toolbar = useCallback(
    () => (
      <div
        className="border-b bg-muted/20 p-2 flex items-center gap-1 flex-wrap"
        onMouseDown={(e) => e.preventDefault()}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`h-8 w-8 ${editor.isActive('bold') ? 'bg-accent' : ''}`}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`h-8 w-8 ${editor.isActive('italic') ? 'bg-accent' : ''}`}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`h-8 w-8 ${editor.isActive('code') ? 'bg-accent' : ''}`}
        >
          <Code className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`h-8 w-8 ${editor.isActive('bulletList') ? 'bg-accent' : ''}`}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`h-8 w-8 ${editor.isActive('orderedList') ? 'bg-accent' : ''}`}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`h-8 w-8 ${editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}`}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`h-8 w-8 ${editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}`}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`h-8 w-8 ${editor.isActive('blockquote') ? 'bg-accent' : ''}`}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    ),
    [editor],
  );

  if (!editor)
    return <Loader2 className="h-8 w-8 animate-spin mx-auto my-16 text-muted-foreground" />;

  return (
    <div className="max-w-6xl mx-auto py-4 animate-in fade-in duration-500">
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
                variant={localStatus.includes('Unsaved') ? 'outline' : 'secondary'}
                className="font-normal text-xs"
              >
                {localStatus}
              </Badge>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEdit && import.meta.env.DEV && (
            <Button variant="ghost" size="icon" onClick={handleRandomData} title="Dev: Auto-fill">
              <Code className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            Discard
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="min-w-32">
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
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/40 shadow-sm overflow-hidden min-h-[60vh] flex flex-col">
            <Toolbar />
            <CardContent className="p-6 md:p-8 flex-1 flex flex-col gap-6">
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Article Title..."
                className="text-3xl md:text-4xl font-bold border-none shadow-none px-0 py-4 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/30 bg-transparent"
                autoFocus
              />
              <EditorContent editor={editor} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Publishing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => setFormData((p) => ({ ...p, status: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Featured Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              {postImagePreview ? (
                <div className="relative rounded-md overflow-hidden border aspect-video group">
                  <img
                    src={postImagePreview}
                    alt="Featured"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={removeFeaturedImage}
                      className="h-8"
                    >
                      <X className="mr-2 h-4 w-4" /> Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer relative min-h-40">
                  <ImageIcon className="h-8 w-8 opacity-50" />
                  <span className="text-sm font-medium">Click to upload</span>
                  <Input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer h-full"
                    onChange={handleFeaturedImageUpload}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10 border-dashed">
            <CardContent className="p-4 text-center">
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

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview Post</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <h1 className="text-3xl font-bold">{formData.title || 'Untitled Post'}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <Separator />
            <div className="prose prose-stone dark:prose-invert max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(editor ? editor.getHTML() : formData.content),
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
