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
  <div className="flex items-center gap-4">
    <div className="p-2.5 rounded-xl bg-primary/5 text-primary border border-primary/10">
      <FileText className="h-5 w-5" />
    </div>
    <div>
      <h1 className="text-3xl font-black tracking-tight text-foreground">Your Stories</h1>
      <p className="text-sm text-muted-foreground font-medium">
        Manage and track your published posts and drafts.
      </p>
    </div>
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
      <SelectTrigger className="w-full sm:w-[120px] h-9 text-sm rounded-full border-border/60">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-border/40 shadow-xl">
        <SelectItem value="all">All Stories</SelectItem>
        <SelectItem value="published">Published</SelectItem>
        <SelectItem value="draft">Drafts</SelectItem>
      </SelectContent>
    </Select>

    <Select value={sortBy} onValueChange={setSortBy}>
      <SelectTrigger className="w-full sm:w-[120px] h-9 text-sm rounded-full border-border/60">
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-border/40 shadow-xl">
        <SelectItem value="newest">Newest First</SelectItem>
        <SelectItem value="oldest">Oldest First</SelectItem>
        <SelectItem value="likes">Most Popular</SelectItem>
      </SelectContent>
    </Select>

    <div className="relative w-full sm:w-[220px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search stories…"
        className="pl-9 h-9 text-sm w-full rounded-full bg-muted/20 border-border/60 focus:bg-background transition-all"
        value={searchQuery}
        onChange={onSearchChange}
      />
    </div>

    <Button onClick={onNewPost} size="sm" className="shrink-0 gap-2 rounded-full px-5 font-bold text-xs shadow-md bg-primary hover:shadow-xl transition-all">
      <Plus className="h-4 w-4" /> New Story
    </Button>
  </div>
);

export const DashboardTable = ({ posts, onEdit, onDelete }) => (
  <div className="rounded-2xl border border-border/40 overflow-hidden shadow-sm bg-background">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/40">
          <TableHead className="w-[420px] font-bold text-[11px] uppercase tracking-[0.15em] text-muted-foreground py-4 px-6">
            Title
          </TableHead>
          <TableHead className="font-bold text-[11px] uppercase tracking-[0.15em] text-muted-foreground py-4">Status</TableHead>
          <TableHead className="font-bold text-[11px] uppercase tracking-[0.15em] text-muted-foreground py-4">Created</TableHead>
          <TableHead className="text-right font-bold text-[11px] uppercase tracking-[0.15em] text-muted-foreground py-4 px-6">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.$id} className="hover:bg-muted/10 transition-colors border-b border-border/40 last:border-0">
            <TableCell className="font-bold py-5 px-6">
              <Link
                to={`/posts/${post.$id}`}
                className="hover:text-primary transition-all text-[15px] line-clamp-1 leading-tight"
              >
                {post.title}
              </Link>
            </TableCell>
            <TableCell className="py-5">
              <Badge
                variant={post.status === 'published' ? 'default' : 'secondary'}
                className={cn(
                  "font-bold uppercase tracking-widest text-[9px] rounded-full px-2.5 py-0.5 border-none",
                  post.status === 'published' ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"
                )}
              >
                {post.status || 'Draft'}
              </Badge>
            </TableCell>
            <TableCell className="text-[13px] font-medium text-muted-foreground py-5">
              {formatDate(post.$createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}
            </TableCell>
            <TableCell className="text-right py-5 px-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-muted/80 transition-all">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="shadow-2xl border-border/40 rounded-xl min-w-[140px] p-1.5">
                  <DropdownMenuItem onClick={() => onEdit(post)} className="gap-2.5 cursor-pointer rounded-lg font-bold text-xs py-2 px-3">
                    <Edit2 className="h-3.5 w-3.5 text-muted-foreground" /> Edit Story
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1.5 opacity-50" />
                  <DropdownMenuItem
                    onClick={() => onDelete(post)}
                    className="text-destructive focus:text-destructive focus:bg-destructive/5 gap-2.5 cursor-pointer rounded-lg font-bold text-xs py-2 px-3"
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
  <div className="flex items-center justify-between py-4 px-2">
    <p className="text-[13px] font-medium text-muted-foreground">
      Showing <span className="font-bold text-foreground">{currentCount}</span> of{' '}
      <span className="font-bold text-foreground">{totalPosts}</span> stories
    </p>
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={onPrev}
        disabled={page === 1}
        className="h-9 rounded-full px-4 gap-2 text-xs font-bold hover:bg-muted"
      >
        <ChevronLeft className="h-4 w-4" /> Newer
      </Button>
      <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 px-2">
        {page} / {totalPages || 1}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onNext}
        disabled={page >= totalPages}
        className="h-9 rounded-full px-4 gap-2 text-xs font-bold hover:bg-muted"
      >
        Older <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
);
