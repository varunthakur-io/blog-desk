import { Link } from 'react-router-dom';
import { TrendingUp, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const RecommendedSidebar = ({ 
  authors = [], 
  isLoading, 
  staffPicks = [], 
  isStaffPicksLoading,
  isAuthenticated = false,
}) => (
  <div className="flex flex-col min-h-[calc(100vh-10rem)]">
    <div className="flex-1 space-y-12">
      
      {/* Digest: Staff Picks / Trending */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-border/10">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50">Staff Picks</h3>
          <TrendingUp className="size-3 text-foreground/20" />
        </div>
        
        <div className="divide-y divide-border/10">
          {isStaffPicksLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="py-4 first:pt-0 flex gap-4 animate-pulse">
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-20 rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                </div>
                <div className="size-12 rounded bg-muted shrink-0" />
              </div>
            ))
          ) : staffPicks.length > 0 ? (
            staffPicks.map((post) => (
              <article key={post.$id} className="group py-3 first:pt-0 flex items-start gap-4 px-2 -mx-2 hover:bg-muted/30 transition-all duration-300 rounded-xl">
                <div className="min-w-0 flex-1 space-y-2">
                  <Link to={`/profile/${post.author?.username || post.authorId}`} className="flex items-center gap-2 transition-opacity hover:opacity-80">
                    <Avatar className="size-4 border-none bg-muted">
                      {post.author?.avatarUrl && <AvatarImage src={post.author.avatarUrl} className="object-cover" />}
                      <AvatarFallback className="text-[7px] font-bold text-muted-foreground">
                        {(post.author?.name || 'A').charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-[10px] font-bold text-foreground/60">{post.author?.name || 'Anonymous'}</span>
                  </Link>
                  <Link to={`/posts/${post.$id}`} className="block">
                    <h4 className="line-clamp-2 text-[13px] font-bold leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                  </Link>
                </div>
                {post.coverImageUrl && (
                   <Link to={`/posts/${post.$id}`} className="shrink-0">
                    <div className="size-12 rounded-md overflow-hidden bg-muted border border-border/10">
                      <img src={post.coverImageUrl} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                  </Link>
                )}
              </article>
            ))
          ) : (
            <p className="py-4 text-[11px] font-medium italic text-muted-foreground/30">No recommendations available.</p>
          )}
        </div>
      </section>

      {/* Digest: Creators */}
      {isAuthenticated && (
        <section className="space-y-6">
           <div className="flex items-center justify-between pb-2 border-b border-border/10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50">Who to follow</h3>
            <Users className="size-3 text-foreground/20" />
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="size-10 rounded-md bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 rounded bg-muted" />
                    <div className="h-2 w-full rounded bg-muted" />
                  </div>
                </div>
              ))
            ) : authors.length > 0 ? (
              authors.slice(0, 3).map((author) => (
                <div key={author.$id} className="group/author flex items-center justify-between gap-4 py-1">
                  <Link to={`/profile/${author.username}`} className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-10 border-none bg-muted ring-1 ring-border/20 transition-all group-hover/author:ring-primary/20">
                      {author.avatarUrl && <AvatarImage src={author.avatarUrl} className="object-cover" />}
                      <AvatarFallback className="bg-muted text-[11px] font-bold text-muted-foreground">{author.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-bold text-foreground hover:text-primary transition-colors tracking-tight">{author.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground/40 font-medium tracking-tight">
                        {author.bio?.substring(0, 30) || 'Verified Writer'}...
                      </p>
                    </div>
                  </Link>
                  <Button variant="outline" size="sm" className="h-7 rounded-md px-3 text-[10px] font-black bg-foreground text-background border-none hover:opacity-90 transition-all active:scale-95 uppercase tracking-tighter">
                    Follow
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-[11px] font-medium italic text-muted-foreground/30">No suggestions found.</p>
            )}
          </div>
        </section>
      )}

    </div>
  </div>
);

export default RecommendedSidebar;
