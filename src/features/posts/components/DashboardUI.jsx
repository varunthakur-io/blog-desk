import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Plus,
  Search,
  MoreHorizontal,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDate } from '@/utils/formatters';
import { cn } from '@/lib/utils';

export const DashboardHeader = () => (
  <div className="flex items-center gap-4 py-5">
    <div className="size-8 rounded bg-foreground flex items-center justify-center text-background">
      <FileText className="h-4 w-4" />
    </div>
    <h1 className="text-3xl font-black tracking-tighter text-foreground">My stories</h1>
  </div>
);

export const DashboardFilters = ({
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  searchQuery,
  onSearchChange,
  onNewPost,
}) => (
  <div className="flex flex-col sm:flex-row w-full md:w-auto items-stretch sm:items-center gap-2">
    <Select value={statusFilter} onValueChange={setStatusFilter}>
      <SelectTrigger className="w-full sm:w-[120px] h-9 text-sm rounded-md border-border/60">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent className="rounded-md border-border/40 shadow-xl">
        <SelectItem value="all">All Stories</SelectItem>
        <SelectItem value="published">Published</SelectItem>
        <SelectItem value="draft">Drafts</SelectItem>
      </SelectContent>
    </Select>

    <Select value={sortBy} onValueChange={setSortBy}>
      <SelectTrigger className="w-full sm:w-[120px] h-9 text-sm rounded-md border-border/60">
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent className="rounded-md border-border/40 shadow-xl">
        <SelectItem value="newest">Newest First</SelectItem>
        <SelectItem value="oldest">Oldest First</SelectItem>
        <SelectItem value="likes">Most Popular</SelectItem>
      </SelectContent>
    </Select>

    <div className="relative w-full sm:w-[220px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
      <Input
        type="search"
        placeholder="Search stories…"
        className="pl-9 h-9 text-[13px] w-full rounded-md bg-muted/20 border-border/40 focus:bg-background transition-colors shadow-none tracking-tight"
        value={searchQuery}
        onChange={onSearchChange}
      />
    </div>

    <Button onClick={onNewPost} size="sm" className="shrink-0 gap-2 rounded-md px-4 font-bold text-xs shadow-sm transition-all bg-foreground text-background hover:opacity-90 active:scale-95">
      <Plus className="h-4 w-4" /> New Story
    </Button>
  </div>
);

export const DashboardTable = ({ posts, onEdit, onDelete }) => (
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

export const DashboardPagination = ({
  page,
  totalPages,
  totalPosts,
  currentCount,
  onPrev,
  onNext,
}) => (
  <div className="flex items-center justify-between py-10 px-0">
    <p className="text-[13px] font-medium text-muted-foreground">
      Showing <span className="font-bold text-foreground tabular-nums">{currentCount}</span> of{' '}
      <span className="font-bold text-foreground tabular-nums">{totalPosts}</span> stories
    </p>
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrev}
        disabled={page === 1}
        className="h-9 rounded-md px-4 gap-2 text-xs font-bold hover:bg-muted transition-all"
      >
        <ChevronLeft className="h-4 w-4" /> Newer
      </Button>
      <span className="text-xs font-bold text-muted-foreground px-2 tabular-nums">
        {page} / {totalPages || 1}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={page >= totalPages}
        className="h-9 rounded-md px-4 gap-2 text-xs font-bold hover:bg-muted transition-all"
      >
        Older <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
);
