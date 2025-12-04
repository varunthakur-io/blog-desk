import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Save, Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
    category: initialData?.category || '', // Add category to form data
  });

  // Update local state if initialData changes (e.g., after fetch)
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

  const isEdit = mode === 'edit';

  return (
    <Card className="border-none shadow-none">
      <CardHeader className={isEdit ? 'px-0 flex-row items-center justify-between' : ''}>
        <div>
          <CardTitle className={isEdit ? 'text-2xl' : ''}>
            {isEdit ? 'Edit Post' : 'Create a New Post'}
          </CardTitle>
          <CardDescription>
            {isEdit
              ? 'Make changes to your existing post.'
              : 'Share your thoughts with the community.'}
          </CardDescription>
        </div>
        {isEdit && onBackClick && (
          <Button
            variant="ghost"
            className="pl-0 hover:pl-2 transition-all"
            onClick={onBackClick}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        )}
      </CardHeader>

      <CardContent className={isEdit ? 'px-0' : ''}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Give your post a catchy title"
              required
              disabled={isSubmitting}
              className="font-medium text-lg"
            />
          </div>

          {/* Category */}
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}
              disabled={isSubmitting}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your masterpiece here..."
              className="min-h-[400px] resize-none leading-relaxed"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-2">
            {/* Left side: Random Data (Dev only) or Cancel (Edit only) */}
            <div>
              {isEdit ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              ) : (
                import.meta.env.DEV && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRandomData}
                    disabled={isSubmitting}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    🎲 Auto-Fill
                  </Button>
                )
              )}
            </div>

            {/* Right side: Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEdit ? 'Saving...' : 'Publishing...'}
                </>
              ) : (
                <>
                  {isEdit ? (
                    <Save className="mr-2 h-4 w-4" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  {isEdit ? 'Update Post' : 'Create Post'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostForm;
