import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PostMobileOptions = ({
  status,
  onStatusChange,
}) => {
  return (
    <div className="md:hidden rounded-md border border-border bg-card p-4 mb-4 space-y-4 text-left">
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Status
        </Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="h-8 text-xs rounded-md">
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
