import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DashboardFilters = ({
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  searchQuery,
  onSearchChange,
  onNewPost,
}) => (
  <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center md:w-auto">
    <Select value={statusFilter} onValueChange={setStatusFilter}>
      <SelectTrigger className="border-border/40 bg-muted/20 hover:bg-muted/30 h-9 w-full rounded-md px-3 text-[13px] font-medium shadow-none transition-colors sm:w-37.5">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent className="border-border/40 rounded-md shadow-xl">
        <SelectItem value="all">All Stories</SelectItem>
        <SelectItem value="published">Published</SelectItem>
        <SelectItem value="draft">Drafts</SelectItem>
      </SelectContent>
    </Select>

    <Select value={sortBy} onValueChange={setSortBy}>
      <SelectTrigger className="border-border/40 bg-muted/20 hover:bg-muted/30 h-9 w-full rounded-md px-3 text-[13px] font-medium shadow-none transition-colors sm:w-37.5">
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent className="border-border/40 rounded-md shadow-xl">
        <SelectItem value="newest">Newest First</SelectItem>
        <SelectItem value="oldest">Oldest First</SelectItem>
        <SelectItem value="likes">Most Popular</SelectItem>
      </SelectContent>
    </Select>

    <div className="relative w-full sm:w-55">
      <Search className="text-muted-foreground/50 absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
      <Input
        type="search"
        placeholder="Search stories…"
        className="bg-muted/20 border-border/40 focus:bg-background h-9 w-full rounded-md pl-9 text-[13px] tracking-tight transition-colors shadow-none"
        value={searchQuery}
        onChange={onSearchChange}
      />
    </div>

    <Button
      onClick={onNewPost}
      className="bg-foreground text-background hover:bg-foreground/90 h-9 shrink-0 gap-2 rounded-md px-4 text-[13px] font-bold shadow-sm transition-all duration-200 active:scale-[0.98]"
    >
      <Plus className="h-4 w-4" /> New Story
    </Button>
  </div>
);

export default DashboardFilters;
