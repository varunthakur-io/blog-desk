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
  <div className="flex min-h-[calc(100vh-10rem)] flex-col">
    <div className="flex-1 space-y-12">
      {/* Digest: Staff Picks / Trending */}
      <section className="space-y-6">
        <div className="border-border/10 flex items-center justify-between border-b pb-2">
          <h3 className="text-foreground/50 text-[10px] font-black tracking-[0.2em] uppercase">
            Staff Picks
          </h3>
          <TrendingUp className="text-foreground/20 size-3" />
        </div>

        <div className="divide-border/10 divide-y">
          {isStaffPicksLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex animate-pulse gap-4 py-4 first:pt-0">
                <div className="flex-1 space-y-2">
                  <div className="bg-muted h-3 w-20 rounded" />
                  <div className="bg-muted h-4 w-full rounded" />
                </div>
                <div className="bg-muted size-12 shrink-0 rounded" />
              </div>
            ))
          ) : staffPicks.length > 0 ? (
            staffPicks.map((post) => (
              <article
                key={post.$id}
                className="group hover:bg-muted/30 -mx-2 flex items-start gap-4 rounded-xl px-2 py-3 transition-all duration-300 first:pt-0"
              >
                <div className="min-w-0 flex-1 space-y-2">
                  <Link
                    to={`/profile/${post.author?.username || post.authorId}`}
                    className="flex items-center gap-2 transition-opacity hover:opacity-80"
                  >
                    <Avatar className="bg-muted size-4 border-none">
                      {post.author?.avatarUrl && (
                        <AvatarImage src={post.author.avatarUrl} className="object-cover" />
                      )}
                      <AvatarFallback className="text-muted-foreground text-[7px] font-bold">
                        {(post.author?.name || 'A').charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-foreground/60 truncate text-[10px] font-bold">
                      {post.author?.name || 'Anonymous'}
                    </span>
                  </Link>
                  <Link to={`/posts/${post.$id}`} className="block">
                    <h4 className="text-foreground group-hover:text-primary line-clamp-2 text-[13px] leading-snug font-bold tracking-tight transition-colors">
                      {post.title}
                    </h4>
                  </Link>
                </div>
                {post.coverImageUrl && (
                  <Link to={`/posts/${post.$id}`} className="shrink-0">
                    <div className="bg-muted border-border/10 size-12 overflow-hidden rounded-md border">
                      <img
                        src={post.coverImageUrl}
                        className="h-full w-full object-cover grayscale-[30%] transition-all duration-500 group-hover:grayscale-0"
                      />
                    </div>
                  </Link>
                )}
              </article>
            ))
          ) : (
            <p className="text-muted-foreground/30 py-4 text-[11px] font-medium italic">
              No recommendations available.
            </p>
          )}
        </div>
      </section>

      {/* Digest: Creators */}
      {isAuthenticated && (
        <section className="space-y-6">
          <div className="border-border/10 flex items-center justify-between border-b pb-2">
            <h3 className="text-foreground/50 text-[10px] font-black tracking-[0.2em] uppercase">
              Who to follow
            </h3>
            <Users className="text-foreground/20 size-3" />
          </div>

          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex animate-pulse items-center gap-3">
                  <div className="bg-muted size-10 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <div className="bg-muted h-3 w-24 rounded" />
                    <div className="bg-muted h-2 w-full rounded" />
                  </div>
                </div>
              ))
            ) : authors.length > 0 ? (
              authors.slice(0, 3).map((author) => (
                <div
                  key={author.$id}
                  className="group/author flex items-center justify-between gap-4 py-1"
                >
                  <Link
                    to={`/profile/${author.username}`}
                    className="flex min-w-0 items-center gap-3"
                  >
                    <Avatar className="bg-muted ring-border/20 group-hover/author:ring-primary/20 size-10 border-none ring-1 transition-all">
                      {author.avatarUrl && (
                        <AvatarImage src={author.avatarUrl} className="object-cover" />
                      )}
                      <AvatarFallback className="bg-muted text-muted-foreground text-[11px] font-bold">
                        {author.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-foreground hover:text-primary truncate text-[13px] font-bold tracking-tight transition-colors">
                        {author.name}
                      </p>
                      <p className="text-muted-foreground/40 truncate text-[11px] font-medium tracking-tight">
                        {author.bio?.substring(0, 30) || 'Verified Writer'}...
                      </p>
                    </div>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-foreground text-background h-7 rounded-md border-none px-3 text-[10px] font-black tracking-tighter uppercase transition-all hover:opacity-90 active:scale-95"
                  >
                    Follow
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground/30 text-[11px] font-medium italic">
                No suggestions found.
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  </div>
);

export default RecommendedSidebar;
