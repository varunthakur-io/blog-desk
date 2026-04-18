import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PostMobileOptions = ({ status, onStatusChange }) => {
  return (
    <div className="border-border bg-card mb-4 space-y-4 rounded-md border p-4 text-left md:hidden">
      <div className="space-y-1.5">
        <Label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
          Status
        </Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="h-8 rounded-md text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PostMobileOptions;
