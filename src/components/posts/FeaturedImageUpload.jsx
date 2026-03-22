import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FeaturedImageUpload = ({ imagePreview, onUpload, onRemove }) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Featured Image
      </p>

      {imagePreview ? (
        <div className="relative rounded-lg overflow-hidden border border-border aspect-video group">
          <img
            src={imagePreview}
            alt="Featured"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onRemove}
              className="gap-1.5 text-xs rounded-lg"
            >
              <X className="h-3.5 w-3.5" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <label className="relative flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer min-h-32 p-4 text-center">
          <div className="p-2 rounded-full bg-muted">
            <Upload className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs font-medium text-foreground">Click to upload</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">PNG, JPG, WebP up to 5MB</p>
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
