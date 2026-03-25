import React from 'react';
import { ArrowLeft, Save, Loader2, Eye, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import FeaturedImageUpload from './FeaturedImageUpload';
import { CATEGORIES } from '@/constants';

const PostSettingsSidebar = ({
  isEdit,
  onBackClick,
  saveStateLabel,
  status,
  onStatusChange,
  category,
  onCategoryChange,
  imagePreview,
  onImageUpload,
  onImageRemove,
  onPreviewClick,
  onRandomData,
  onDiscard,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <aside className="hidden md:flex w-48 shrink-0 flex-col gap-6">
      <div className="sticky top-24 flex flex-col gap-6 relative pr-6">
        <div className="absolute top-0 right-0 bottom-0 hidden h-full w-px bg-gradient-to-b from-transparent via-border to-transparent lg:block" />

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onBackClick}
            className="h-7 w-7 rounded-full shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </Button>
          <div className="flex items-center gap-1.5 min-w-0">
            <p className="text-sm font-semibold truncate">{isEdit ? 'Edit Post' : 'New Post'}</p>
            <span
              className={`inline-flex items-center justify-center h-4 w-4 rounded-full shrink-0 ${saveStateLabel.includes('Unsaved') ? 'bg-muted border border-border' : 'bg-muted'}`}
            >
              {saveStateLabel.includes('Unsaved') ? (
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              ) : (
                <span className="text-[9px] text-muted-foreground">✓</span>
              )}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Status
          </Label>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select status" />
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
              <SelectValue placeholder="Select category" />
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
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
        >
          <Eye className="h-4 w-4 shrink-0" /> Preview post
        </button>

        {!isEdit && import.meta.env.DEV && (
          <button
            type="button"
            onClick={onRandomData}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
          >
            <Code className="h-4 w-4 shrink-0" /> Auto-fill (dev)
          </button>
        )}

        <Separator />

        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={onDiscard}
          >
            Discard
          </Button>
          <Button
            type="button"
            size="sm"
            className="w-full text-xs gap-1.5"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {isEdit ? 'Update post' : 'Publish post'}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default PostSettingsSidebar;
