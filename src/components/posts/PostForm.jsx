import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link'; // not included in StarterKit by default, need to add separately
import { postService } from '@/services/posts';
import toast from 'react-hot-toast';
import {
  Loader2, Save, ArrowLeft, Eye, Code, ImageIcon, X, Settings2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { getRandomPostData } from '@/utils/fakePostData';
import { CATEGORIES } from '@/constants';

import PostEditorToolbar from './PostEditorToolbar';
import PostPreviewDialog from './PostPreviewDialog';

// used for both create (/create) and edit (/edit/:id) — mode prop controls the difference
const PostForm = ({ initialData, onSubmit, isSubmitting, mode = 'create', onBackClick }) => {
  const navigate = useNavigate();

  // all the fields i need to send to appwrite when submitting
  const [formData, setFormData] = useState({
    title:         initialData?.title         || '',
    content:       initialData?.content       || '',
    status:        initialData?.status        || 'draft',
    coverImageUrl: initialData?.coverImageUrl || null,
    coverImageId:  initialData?.coverImageId  || null,
    category:      initialData?.category      || null,
  });

  const [isPreviewOpen,     setIsPreviewOpen]     = useState(false);
  const [mobileOptionsOpen, setMobileOptionsOpen] = useState(false); // toggles the mobile options panel
  const [postImagePreview,  setPostImagePreview]  = useState(initialData?.coverImageUrl || null); // local blob preview before upload completes
  const [saveStateLabel,    setSaveStateLabel]    = useState(mode === 'edit' ? 'Saved' : 'Unsaved');
  const isEdit = mode === 'edit';

  // keep a ref in sync with saveStateLabel so the tiptap onUpdate closure
  // always reads the latest value — without this it captures the initial value
  // and never updates (stale closure bug)
  const saveStateLabelRef = useRef(saveStateLabel);
  useEffect(() => { saveStateLabelRef.current = saveStateLabel; }, [saveStateLabel]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: true, italic: true, code: true, bulletList: true, orderedList: true,
        heading: { levels: [1, 2, 3] },
        blockquote: true, codeBlock: true,
        // note: link is NOT in StarterKit, i'm adding it below separately
      }),
      Link.configure({ openOnClick: false }), // openOnClick: false so clicking a link in the editor doesn't navigate away
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      // sync editor html back into formData on every keystroke
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
      // only mark as unsaved if we're in edit mode and the post was previously saved
      if (saveStateLabelRef.current === 'Saved' && isEdit) setSaveStateLabel('Unsaved changes');
    },
    editorProps: {
      attributes: {
        // tailwind prose classes to style the editor content nicely
        class:
          'prose dark:prose-invert max-w-none focus:outline-none min-h-[calc(100vh-20rem)] py-2 text-base leading-relaxed prose-headings:font-bold prose-headings:tracking-tight prose-code:bg-muted prose-code:rounded prose-code:px-1.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-blockquote:border-l-2 prose-blockquote:border-border prose-blockquote:text-muted-foreground prose-blockquote:not-italic',
      },
    },
  });

  // when editing an existing post, load the saved content into the editor once it's ready
  // using a ref to track what content we already loaded — this prevents the content
  // from being reset on every re-render (which would wipe what the user is typing)
  const initialContentRef = useRef(initialData?.content);
  useEffect(() => {
    if (editor && initialData?.content && initialData.content !== initialContentRef.current) {
      initialContentRef.current = initialData.content;
      editor.commands.setContent(initialData.content, false, { preserveCursor: true });
    }
  }, [editor, initialData?.content]);

  // upload the cover image to appwrite storage and store the returned url + id
  const handleFeaturedImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const toastId = toast.loading('Uploading image…');
    try {
      const { fileId, imageUrl } = await postService.uploadPostImage(file, formData.coverImageId);
      setFormData((prev) => ({ ...prev, coverImageUrl: imageUrl, coverImageId: fileId }));
      // show a local blob preview immediately so the user sees it without waiting for appwrite
      setPostImagePreview(URL.createObjectURL(file));
      toast.success('Image uploaded', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Upload failed', { id: toastId });
    }
  };

  // clear cover image from both local preview state and formData
  const removeFeaturedImage = () => {
    setFormData((prev) => ({ ...prev, coverImageUrl: null, coverImageId: null }));
    setPostImagePreview(null);
    toast.success('Featured image removed');
  };

  // generic handler for text inputs — uses the input's name attribute to update the right field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // grab the latest html from tiptap and pass everything up to the parent (useCreatePost / useEditPost)
  const handleSubmit = (e) => {
    e?.preventDefault();
    if (editor) onSubmit({ ...formData, content: editor.getHTML() });
  };

  // dev only — fills the form with random fake data so i don't have to type every time i test
  const handleRandomData = () => {
    const randomPost = getRandomPostData();
    setFormData((prev) => ({ ...prev, title: randomPost.title }));
    if (editor)
      editor.commands.setContent(
        `<p><strong>${randomPost.title}</strong></p><p>${randomPost.content}</p>`,
      );
  };

  // show a spinner while tiptap is initialising (usually instant but good to handle)
  if (!editor)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="page-root flex gap-8">

      {/* ── Left sidebar — post options (desktop only, hidden on mobile) ── */}
      <aside className="hidden md:flex w-48 shrink-0 flex-col gap-6">
        <div className="sticky top-24 flex flex-col gap-6 relative pr-6">
          {/* vertical fading line — exactly like shadcn docs */}
          <div className="absolute top-0 right-0 bottom-0 hidden h-full w-px bg-gradient-to-b from-transparent via-border to-transparent lg:block" />

          {/* back button + post title + save indicator */}
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
              {/* small dot indicator — filled = unsaved, checkmark = saved */}
              <span className={`inline-flex items-center justify-center h-4 w-4 rounded-full shrink-0 ${saveStateLabel.includes('Unsaved') ? 'bg-muted border border-border' : 'bg-muted'}`}>
                {saveStateLabel.includes('Unsaved')
                  ? <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  : <span className="text-[9px] text-muted-foreground">✓</span>
                }
              </span>
            </div>
          </div>

          {/* publish status — draft or published */}
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

          {/* category — maps to the CATEGORIES constant, stored as a string in appwrite */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Category
            </Label>
            <Select
              value={formData.category || '__none__'}
              onValueChange={(val) =>
                // store null instead of the placeholder string when nothing is selected
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

          {/* cover image — shows preview if uploaded, upload prompt if not */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Cover Image
            </Label>
            {postImagePreview ? (
              // show the uploaded image with a hover-reveal remove button
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
              // using a label wrapping a hidden file input — clicking anywhere on the label opens file picker
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

          {/* preview — opens a dialog showing how the post will look when published */}
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Eye className="h-4 w-4 shrink-0" /> Preview post
          </button>

          {/* only show this in dev mode — fills the form with fake data for testing */}
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

          {/* discard navigates back without saving, publish/update calls handleSubmit */}
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

      {/* ── Right side — the actual editor ── */}
      <main className="flex-1 min-w-0">

        {/* mobile top bar — sidebar is hidden on mobile so i show a compact row instead */}
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
          <div className="flex items-center gap-2">
            {/* options button toggles the collapsible panel below */}
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
              {isSubmitting
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <Save className="h-3.5 w-3.5" />
              }
              {isEdit ? 'Update' : 'Publish'}
            </Button>
          </div>
        </div>

        {/* mobile collapsible options panel — same fields as the desktop sidebar */}
        {mobileOptionsOpen && (
          <div className="md:hidden rounded-xl border border-border bg-card p-4 mb-4 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</Label>
              <Select value={formData.status} onValueChange={(val) => setFormData((p) => ({ ...p, status: val }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</Label>
              <Select
                value={formData.category || '__none__'}
                onValueChange={(val) => setFormData((p) => ({ ...p, category: val === '__none__' ? null : val }))}
              >
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__"><span className="text-muted-foreground">Uncategorised</span></SelectItem>
                  {CATEGORIES.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cover Image</Label>
              {postImagePreview ? (
                <div className="relative rounded-lg overflow-hidden border border-border aspect-video group">
                  <img src={postImagePreview} alt="Cover" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button type="button" variant="destructive" size="sm" onClick={removeFeaturedImage} className="gap-1 text-xs h-7 px-2">
                      <X className="h-3 w-3" /> Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer py-3 text-xs text-muted-foreground">
                  <ImageIcon className="h-3.5 w-3.5" /> Click to upload
                  <input type="file" accept="image/*" className="hidden" onChange={handleFeaturedImageUpload} />
                </label>
              )}
            </div>
            <Separator />
            <button type="button" onClick={() => setIsPreviewOpen(true)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Eye className="h-4 w-4" /> Preview post
            </button>
            <Button type="button" variant="outline" size="sm" className="w-full text-xs" onClick={() => navigate('/dashboard')}>
              Discard
            </Button>
          </div>
        )}

        {/* main editor card — toolbar on top, title input + tiptap editor below */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <PostEditorToolbar editor={editor} />
          <div className="p-6 md:p-8">
            {/* title is a plain input styled to look like a heading, not a form field */}
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Post title…"
              className="text-2xl md:text-3xl font-bold border-none shadow-none px-0 py-1 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/30 bg-transparent leading-snug mb-4"
              autoFocus
            />
            <Separator className="mb-4" />
            {/* tiptap renders its editor here */}
            <EditorContent editor={editor} />
          </div>
        </div>

      </main>

      {/* preview dialog — shows a sanitized render of the current title + content */}
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
