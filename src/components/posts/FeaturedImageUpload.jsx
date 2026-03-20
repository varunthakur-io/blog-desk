import React from 'react';
import { ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const FeaturedImageUpload = ({ imagePreview, onUpload, onRemove }) => {
  return (
    <Card className="border-border/40 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Featured Image
        </CardTitle>
      </CardHeader>
      <CardContent>
        {imagePreview ? (
          <div className="relative rounded-md overflow-hidden border aspect-video group">
            <img
              src={imagePreview}
              alt="Featured"
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button variant="destructive" size="sm" onClick={onRemove} className="h-8">
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
              onChange={onUpload}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeaturedImageUpload;
