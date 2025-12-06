import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2,
  Save,
  Send,
  ArrowLeft,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  AlignLeft,
  MoreVertical,
  Calendar,
  Hash,
  Eye,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { getRandomPostData } from '@/utils/fakePostData';

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

const PostForm = ({ initialData, onSubmit, isSubmitting, mode = 'create', onBackClick }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    category: initialData?.category || '',
  });

  const isEdit = mode === 'edit';

  // Update local state if initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        category: initialData.category || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleRandomData = () => {
    const data = getRandomPostData();
    setFormData((prev) => ({ ...prev, title: data.title, content: data.content }));
  };

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
              <Badge variant="secondary" className="font-normal text-xs">
                {isEdit ? 'Draft' : 'Unsaved'}
              </Badge>
            </h1>
            <p className="text-muted-foreground text-sm">
              {isEdit ? 'Refine your content.' : 'Write something amazing today.'}
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
          <Button onClick={handleSubmit} disabled={isSubmitting} className="min-w-[120px]">
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
            <div className="border-b bg-muted/20 p-2 flex items-center gap-1 flex-wrap">
               <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" title="Bold"><Bold className="h-4 w-4" /></Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" title="Italic"><Italic className="h-4 w-4" /></Button>
               <Separator orientation="vertical" className="h-6 mx-1" />
               <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" title="List"><List className="h-4 w-4" /></Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" title="Link"><LinkIcon className="h-4 w-4" /></Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" title="Image"><ImageIcon className="h-4 w-4" /></Button>
               <Separator orientation="vertical" className="h-6 mx-1" />
               <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" title="Align Left"><AlignLeft className="h-4 w-4" /></Button>
            </div>

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
              
              {/* Content */}
              <Textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Start writing your story..."
                className="flex-1 resize-none border-none shadow-none px-0 text-lg leading-relaxed focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/30 min-h-[400px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          
          {/* Publishing / Meta Card */}
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                 <Label className="text-xs">Status</Label>
                 <div className="flex items-center justify-between border rounded-md p-2 bg-muted/10">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-yellow-500" />
                      {isEdit ? 'Draft' : 'Unsaved'}
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6"><MoreVertical className="h-3 w-3" /></Button>
                 </div>
               </div>

               <div className="space-y-2">
                 <Label className="text-xs">Visibility</Label>
                 <Select defaultValue="public">
                    <SelectTrigger>
                      <SelectValue />
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
               <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {/* Category */}
               <div className="space-y-2">
                 <Label className="text-xs flex items-center gap-2"><Hash className="h-3 w-3" /> Category</Label>
                 <Select
                    value={formData.category}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>

               {/* Date Preview (Visual) */}
               <div className="space-y-2">
                  <Label className="text-xs flex items-center gap-2"><Calendar className="h-3 w-3" /> Publish Date</Label>
                  <div className="text-sm text-muted-foreground border rounded-md p-2 bg-muted/30">
                    Immediately
                  </div>
               </div>
            </CardContent>
          </Card>

          {/* Preview Card (Visual Only) */}
          <Card className="bg-primary/5 border-primary/10 border-dashed">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-3">Preview how this post will look.</p>
              <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10">
                <Eye className="mr-2 h-4 w-4" /> Preview
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default PostForm;