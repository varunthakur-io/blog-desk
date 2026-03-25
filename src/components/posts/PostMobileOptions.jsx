import React from 'react';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import FeaturedImageUpload from './FeaturedImageUpload';
import { CATEGORIES } from '@/constants';

const PostMobileOptions = ({
  status,
  onStatusChange,
  category,
  onCategoryChange,
  imagePreview,
  onImageUpload,
  onImageRemove,
  onPreviewClick,
  onDiscard,
}) => {
  return (
    <div className="md:hidden rounded-xl border border-border bg-card p-4 mb-4 space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Status
        </Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Category
        </Label>
        <Select
          value={category || '__none__'}
          onValueChange={(val) => onCategoryChange(val === '__none__' ? null : val)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">
              <span className="text-muted-foreground">Uncategorised</span>
            </SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <FeaturedImageUpload
        imagePreview={imagePreview}
        onUpload={onImageUpload}
        onRemove={onImageRemove}
      />

      <Separator />
      <button
        type="button"
        onClick={onPreviewClick}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Eye className="h-4 w-4" /> Preview post
      </button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full text-xs"
        onClick={onDiscard}
      >
        Discard
      </Button>
    </div>
  );
};

export default PostMobileOptions;
