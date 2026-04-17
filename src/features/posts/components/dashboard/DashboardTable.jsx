import { Link } from 'react-router-dom';
import { MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/utils/formatters';
import { cn } from '@/lib/utils';

const DashboardTable = ({ posts, onEdit, onDelete }) => (
  <div className="w-full">
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-b border-border/40">
          <TableHead className="w-[420px] font-bold text-[13px] tracking-tight text-muted-foreground py-4 px-4">
            Title
          </TableHead>
          <TableHead className="font-bold text-[13px] tracking-tight text-muted-foreground py-4">Status</TableHead>
          <TableHead className="font-bold text-[13px] tracking-tight text-muted-foreground py-4">Created</TableHead>
          <TableHead className="text-right font-bold text-[13px] tracking-tight text-muted-foreground py-4 px-4">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.$id} className="hover:bg-muted/30 transition-all border-b border-border/40 last:border-0 group px-4 -mx-4">
            <TableCell className="font-bold py-5 px-4">
              <Link
                to={`/posts/${post.$id}`}
                className="hover:text-primary transition-colors text-[14px] line-clamp-1 leading-tight text-foreground tracking-tight"
              >
                {post.title}
              </Link>
            </TableCell>
            <TableCell className="py-5">
              <Badge
                variant="secondary"
                className={cn(
                  "font-bold text-[11px] rounded-md px-2.5 py-0.5 border-none transition-all",
                  post.status === 'published' 
                    ? "bg-green-500/10 text-green-700 dark:text-green-400" 
                    : "bg-muted text-muted-foreground"
                )}
              >
                {post.status || 'Draft'}
              </Badge>
            </TableCell>
            <TableCell className="text-[13px] font-medium text-muted-foreground/60 py-5 tabular-nums">
              {formatDate(post.$createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}
            </TableCell>
            <TableCell className="text-right py-5 px-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-md hover:bg-muted transition-colors opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="shadow-lg border-border/40 rounded-md min-w-[140px] p-1 text-sm">
                  <DropdownMenuItem onClick={() => onEdit(post)} className="gap-2 cursor-pointer font-bold py-2 px-3 text-xs">
                    <Edit2 className="h-3.5 w-3.5" /> Edit Story
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 border-border/20" />
                  <DropdownMenuItem
                    onClick={() => onDelete(post)}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10 gap-2 cursor-pointer font-bold py-2 px-3 text-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default DashboardTable;
