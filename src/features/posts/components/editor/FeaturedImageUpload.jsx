import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FeaturedImageUpload = ({ imagePreview, onUpload, onRemove }) => {
  return (
    <div className="group relative">
      {imagePreview ? (
        <div className="relative aspect-video rounded-md overflow-hidden bg-muted/30 border border-border/40 shadow-sm transition-all duration-300 group-hover:shadow-md">
          <img
            src={imagePreview}
            alt="Featured image"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onRemove}
              className="gap-2 text-[11px] font-bold rounded-md h-8 px-4 shadow-xl active:scale-95"
            >
              <X className="h-3 w-3" /> Remove Header
            </Button>
          </div>
        </div>
      ) : (
        <label className="relative flex flex-col items-center justify-center gap-4 aspect-video rounded-md border border-dashed border-border/60 bg-muted/5 hover:bg-muted/10 hover:border-primary/20 transition-all cursor-pointer group">
          <div className="p-3 rounded-md bg-background border border-border/40 text-muted-foreground group-hover:text-foreground group-hover:border-border/60 transition-all shadow-sm">
            <Upload className="h-5 w-5" />
          </div>
          <div className="space-y-1 text-center">
            <p className="text-[13px] font-bold text-foreground">Header Image</p>
            <p className="text-[11px] font-medium text-muted-foreground">Click to upload · 16:9 recommended</p>
          </div>
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={onUpload}
          />
        </label>
      )}
    </div>
  );
};

export default FeaturedImageUpload;
