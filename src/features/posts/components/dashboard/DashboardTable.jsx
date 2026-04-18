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
        <TableRow className="border-border/40 border-b hover:bg-transparent">
          <TableHead className="text-muted-foreground w-[420px] px-4 py-4 text-[13px] font-bold tracking-tight">
            Title
          </TableHead>
          <TableHead className="text-muted-foreground py-4 text-[13px] font-bold tracking-tight">
            Status
          </TableHead>
          <TableHead className="text-muted-foreground py-4 text-[13px] font-bold tracking-tight">
            Created
          </TableHead>
          <TableHead className="text-muted-foreground px-4 py-4 text-right text-[13px] font-bold tracking-tight">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow
            key={post.$id}
            className="hover:bg-muted/30 border-border/40 group -mx-4 border-b px-4 transition-all last:border-0"
          >
            <TableCell className="px-4 py-5 font-bold">
              <Link
                to={`/posts/${post.$id}`}
                className="hover:text-primary text-foreground line-clamp-1 text-[14px] leading-tight tracking-tight transition-colors"
              >
                {post.title}
              </Link>
            </TableCell>
            <TableCell className="py-5">
              <Badge
                variant="secondary"
                className={cn(
                  'rounded-md border-none px-2.5 py-0.5 text-[11px] font-bold transition-all',
                  post.status === 'published'
                    ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {post.status || 'Draft'}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground/60 py-5 text-[13px] font-medium tabular-nums">
              {formatDate(post.$createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}
            </TableCell>
            <TableCell className="px-4 py-5 text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hover:bg-muted h-8 w-8 rounded-md p-0 opacity-0 transition-colors group-hover:opacity-100 data-[state=open]:opacity-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="border-border/40 min-w-[140px] rounded-md p-1 text-sm shadow-lg"
                >
                  <DropdownMenuItem
                    onClick={() => onEdit(post)}
                    className="cursor-pointer gap-2 px-3 py-2 text-xs font-bold"
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Edit Story
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="border-border/20 my-1" />
                  <DropdownMenuItem
                    onClick={() => onDelete(post)}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer gap-2 px-3 py-2 text-xs font-bold"
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
