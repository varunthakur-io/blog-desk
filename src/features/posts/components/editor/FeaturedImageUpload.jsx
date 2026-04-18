import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FeaturedImageUpload = ({ imagePreview, onUpload, onRemove }) => {
  return (
    <div className="group relative">
      {imagePreview ? (
        <div className="bg-muted/30 border-border/40 relative aspect-video overflow-hidden rounded-md border shadow-sm transition-all duration-300 group-hover:shadow-md">
          <img
            src={imagePreview}
            alt="Featured image"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 backdrop-blur-[2px] transition-all group-hover:opacity-100">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onRemove}
              className="h-8 gap-2 rounded-md px-4 text-[11px] font-bold shadow-xl active:scale-95"
            >
              <X className="h-3 w-3" /> Remove Header
            </Button>
          </div>
        </div>
      ) : (
        <label className="border-border/60 bg-muted/5 hover:bg-muted/10 hover:border-primary/20 group relative flex aspect-video cursor-pointer flex-col items-center justify-center gap-4 rounded-md border border-dashed transition-all">
          <div className="bg-background border-border/40 text-muted-foreground group-hover:text-foreground group-hover:border-border/60 rounded-md border p-3 shadow-sm transition-all">
            <Upload className="h-5 w-5" />
          </div>
          <div className="space-y-1 text-center">
            <p className="text-foreground text-[13px] font-bold">Header Image</p>
            <p className="text-muted-foreground text-[11px] font-medium">
              Click to upload · 16:9 recommended
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={onUpload}
          />
        </label>
      )}
    </div>
  );
};

export default FeaturedImageUpload;
