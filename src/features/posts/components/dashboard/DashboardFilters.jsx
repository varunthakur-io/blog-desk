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

export default DashboardFilters;
