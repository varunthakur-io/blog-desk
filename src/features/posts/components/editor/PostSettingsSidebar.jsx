import { Save, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORIES } from '@/constants';
import FeaturedImageUpload from './FeaturedImageUpload';

const PostSettingsSidebar = ({
  formData,
  setFormData,
  onPublish,
  isSubmitting,
  mode = 'create'
}) => {
  const isEdit = mode === 'edit';
  
  const handleStatusChange = (status) => {
    setFormData(prev => ({ ...prev, status }));
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({ ...prev, category: category === '__none__' ? null : category }));
  };

  const onImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In professional apps, we'd handle the actual upload here or in the parent
      // For now, mirroring the logic expectation
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, coverImageUrl: reader.result, coverImageFile: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const onImageRemove = () => {
    setFormData(prev => ({ ...prev, coverImageUrl: null, coverImageFile: null, coverImageId: null }));
  };

  return (
    <div className="space-y-10">
      {/* Header Metadata */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-bold text-foreground tracking-tight">Post Details</h3>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted border border-border/40">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-muted-foreground tracking-tight">Saved</span>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2.5">
            <Label className="text-[13px] font-bold text-foreground">Category</Label>
            <Select
              value={formData.category || '__none__'}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="h-9 rounded-md bg-transparent border-border/60 text-[13px] font-medium focus:ring-1 focus:ring-primary/20">
                <SelectValue placeholder="Add category" />
              </SelectTrigger>
              <SelectContent className="rounded-md border-border/60 shadow-xl">
                <SelectItem value="__none__" className="text-xs font-medium text-muted-foreground">None</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-xs font-medium">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2.5">
            <Label className="text-[13px] font-bold text-foreground">Visibility</Label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-9 rounded-md bg-transparent border-border/60 text-[13px] font-medium focus:ring-1 focus:ring-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-md border-border/60 shadow-xl">
                <SelectItem value="published" className="text-xs font-medium">Publicly Live</SelectItem>
                <SelectItem value="draft" className="text-xs font-medium">Hidden Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Media Selection */}
      <div className="space-y-4">
        <h3 className="text-[13px] font-bold text-foreground tracking-tight">Header Media</h3>
        <FeaturedImageUpload
          imagePreview={formData.coverImageUrl}
          onUpload={onImageUpload}
          onRemove={onImageRemove}
        />
      </div>

      <Separator className="opacity-40" />

      {/* Advanced Actions */}
      <div className="space-y-3">
        <Button
          type="button"
          size="sm"
          className="w-full text-xs font-bold gap-2 h-9 rounded-md shadow-sm bg-foreground text-background transition-all hover:opacity-90 active:scale-95"
          onClick={onPublish}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          {isEdit ? 'Save Changes' : 'Publish Story'}
        </Button>
      </div>
    </div>
  );
};

export default PostSettingsSidebar;
