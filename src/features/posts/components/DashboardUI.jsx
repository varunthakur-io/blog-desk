import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
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

export const DashboardHeader = ({ onNewPost }) => (
  <div className="flex items-center gap-3">
    <div className="p-2 rounded-lg bg-accent">
      <LayoutDashboard className="h-5 w-5 text-primary" />
    </div>
    <div>
      <h1 className="page-header-title text-2xl font-bold tracking-tight">Dashboard</h1>
      <p className="page-header-subtitle text-sm text-muted-foreground">
        Manage and track your posts.
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
      <SelectTrigger className="w-full sm:w-[120px] h-9 text-sm">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="published">Published</SelectItem>
        <SelectItem value="draft">Draft</SelectItem>
      </SelectContent>
    </Select>

    <Select value={sortBy} onValueChange={setSortBy}>
      <SelectTrigger className="w-full sm:w-[120px] h-9 text-sm">
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="oldest">Oldest</SelectItem>
        <SelectItem value="likes">Popular</SelectItem>
      </SelectContent>
    </Select>

    <div className="relative w-full sm:w-[220px]">
      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search posts…"
        className="pl-8 h-9 text-sm w-full"
        value={searchQuery}
        onChange={onSearchChange}
      />
    </div>

    <Button onClick={onNewPost} size="sm" className="shrink-0 gap-2 rounded-full px-4">
      <Plus className="h-4 w-4" /> New Post
    </Button>
  </div>
);

export const DashboardTable = ({ posts, onEdit, onDelete }) => (
  <div className="rounded-xl border border-border/50 overflow-hidden shadow-sm">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/40 hover:bg-muted/40">
          <TableHead className="w-[420px] font-semibold text-xs uppercase tracking-wider">
            Title
          </TableHead>
          <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
          <TableHead className="font-semibold text-xs uppercase tracking-wider">Created</TableHead>
          <TableHead className="text-right font-semibold text-xs uppercase tracking-wider">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.$id} className="hover:bg-muted/20 transition-colors">
            <TableCell className="font-medium py-3.5">
              <Link
                to={`/posts/${post.$id}`}
                className="hover:text-primary transition-colors text-sm line-clamp-1"
              >
                {post.title}
              </Link>
            </TableCell>
            <TableCell className="py-3.5">
              <Badge
                variant={post.status === 'published' ? 'default' : 'secondary'}
                className="font-medium capitalize text-[11px] rounded-full px-2.5"
              >
                {post.status || 'Draft'}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground py-3.5">
              {formatDate(post.$createdAt, { month: 'short' })}
            </TableCell>
            <TableCell className="text-right py-3.5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-muted">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="shadow-lg border-border/60">
                  <DropdownMenuItem onClick={() => onEdit(post)} className="gap-2 cursor-pointer">
                    <Edit2 className="h-3.5 w-3.5" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(post)}
                    className="text-destructive focus:text-destructive gap-2 cursor-pointer"
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
  <div className="flex items-center justify-between py-1">
    <p className="text-xs text-muted-foreground">
      Showing <span className="font-semibold text-foreground">{currentCount}</span> of{' '}
      <span className="font-semibold text-foreground">{totalPosts}</span> posts
    </p>
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrev}
        disabled={page === 1}
        className="h-8 rounded-full px-3 gap-1 text-xs"
      >
        <ChevronLeft className="h-3.5 w-3.5" /> Prev
      </Button>
      <span className="text-xs font-medium text-muted-foreground px-1">
        {page} / {totalPages || 1}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={page >= totalPages}
        className="h-8 rounded-full px-3 gap-1 text-xs"
      >
        Next <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  </div>
);
