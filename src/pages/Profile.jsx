import { useState, useMemo } from 'react';
import { ProfileTabs, NetworkDialog, ProfileSkeleton } from '@/features/profile';
import { Button } from '@/components/ui/button';
import { Settings, Edit, CalendarDays, Heart, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/features/profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

/**
 * Public/Private profile page.
 * Uses semantic structure to divide author identity from their content feed.
 */
export default function Profile() {
  const navigate = useNavigate();
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [networkType, setNetworkType] = useState('followers');

  const {
    profile,
    isOwner,
    userPosts,
    likedPosts,
    savedPosts,
    activeTab,
    setActiveTab,
    isFollowing,
    isFollowLoading,
    handleToggleFollow,
    authUserId,
    followersProfiles,
    followingProfiles,
    isFollowersLoading,
    isFollowingLoading,
    fetchFollowers,
    fetchFollowing,
    isSavedLoading,
    savedError,
    isFetchingUsername,
    usernameFetchError,
    postsLoading,
    postsError,
    isLoadingLikes,
    likesError,
  } = useProfile();

  // Calculated insights for author authority
  const totalLikes = useMemo(() => userPosts.reduce((acc, post) => acc + (post.likesCount || 0), 0), [userPosts]);
  const categories = useMemo(() => [...new Set(userPosts.map(p => p.category).filter(Boolean))].slice(0, 3), [userPosts]);

  if (isFetchingUsername) return <ProfileSkeleton />;
  
  if (usernameFetchError) {
    return (
      <div className="flex justify-center py-20">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-8 py-4 text-sm font-bold uppercase tracking-widest text-destructive shadow-sm">
          {usernameFetchError}
        </div>
      </div>
    );
  }

  const handleOpenNetwork = (type) => {
    setNetworkType(type);
    setIsNetworkOpen(true);
    if (type === 'followers') fetchFollowers();
    else fetchFollowing();
  };

  const name = profile?.name || 'Anonymous User';
  const username = profile?.username;
  const avatarUrl = profile?.avatarUrl;
  const bio = profile?.bio;

  return (
    <article className="animate-in fade-in duration-700">
      <div className="flex flex-col items-start gap-16 lg:flex-row">
        
        {/* ── Main Content Area (Stories & Activity) ── */}
        <div className="order-2 w-full min-w-0 flex-1 lg:order-1">
          {/* Responsive Header (Visible on Mobile Only) */}
          <header className="mb-10 space-y-6 lg:hidden">
             <div className="flex items-center gap-4">
                <Avatar className="size-20 border-2 border-border">
                  <AvatarImage src={avatarUrl} className="object-cover" />
                  <AvatarFallback className="bg-muted text-2xl font-black uppercase">{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h1 className="truncate text-2xl font-black tracking-tight">{name}</h1>
                  <p className="text-sm font-bold text-muted-foreground">@{username}</p>
                </div>
             </div>
             <p className="italic leading-relaxed text-foreground/80">{bio || 'No bio provided yet.'}</p>
             <div className="flex items-center gap-4">
                {isOwner ? (
                  <Button variant="outline" className="rounded-full px-6 text-xs font-bold" onClick={() => navigate('/settings')}>
                    Edit Profile
                  </Button>
                ) : (
                  <Button className="rounded-full px-8 text-xs font-bold" onClick={handleToggleFollow}>
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
             </div>
             <Separator className="opacity-50" />
          </header>

          <section>
            <header className="pb-1 flex items-center justify-between h-[52px]">
              <h2 className="text-4xl font-black tracking-tighter text-foreground">
                Stories
              </h2>
            </header>

            <ProfileTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isOwner={isOwner}
              postsLoading={postsLoading}
              postsError={postsError}
              userPosts={userPosts}
              likedPosts={likedPosts}
              isLoadingLikes={isLoadingLikes}
              likesError={likesError}
              savedPosts={savedPosts}
              isSavedLoading={isSavedLoading}
              savedError={savedError}
            />
          </section>
        </div>

        {/* ── Sidebar Identity (Sticky Desktop) ── */}
        <aside className="sticky top-16 order-2 hidden w-[320px] shrink-0 flex-col gap-10 border-l border-border/20 pl-10 lg:flex transition-all">
          <section className="space-y-6">
            <Avatar className="size-24 border-2 border-border shadow-sm transition-transform hover:scale-[1.02]">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={name} className="object-cover" />}
              <AvatarFallback className="bg-muted text-3xl font-black uppercase text-muted-foreground">
                {name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h1 className="truncate text-xl font-black tracking-tight text-foreground">
                {name}
              </h1>
              <p className="text-sm font-bold tracking-wide text-muted-foreground">@{username}</p>
            </div>

            {/* Social Network Access */}
            <div className="flex items-center gap-6 pt-1">
              <button 
                onClick={() => handleOpenNetwork('followers')}
                className="group flex flex-col text-left transition-all active:scale-95"
                aria-label="View followers"
              >
                <span className="text-sm font-black text-foreground group-hover:text-primary">{profile?.followersCount || 0}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Followers</span>
              </button>
              <button 
                onClick={() => handleOpenNetwork('following')}
                className="group flex flex-col text-left transition-all active:scale-95"
                aria-label="View following"
              >
                <span className="text-sm font-black text-foreground group-hover:text-primary">{profile?.followingCount || 0}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Following</span>
              </button>
            </div>

            {bio ? (
              <p className="border-l-2 border-primary/10 py-1 pl-4 text-[14px] italic leading-relaxed text-foreground/70">
                {bio}
              </p>
            ) : (
              <p className="text-[13px] italic text-muted-foreground/50">No bio provided yet.</p>
            )}

            <nav className="flex flex-col gap-3 pt-2">
              {isOwner ? (
                <>
                  <Button 
                    variant="outline" 
                    className="h-10 w-full rounded-full border-border/60 text-xs font-bold transition-all active:scale-95 hover:bg-muted/50"
                    onClick={() => navigate('/settings')}
                  >
                    <Edit className="mr-2 size-3.5" />
                    Edit Profile
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="h-9 w-full justify-start px-2 text-xs font-bold text-muted-foreground transition-all hover:text-primary"
                    onClick={() => navigate('/settings')}
                  >
                    <Settings className="mr-2 size-3.5" />
                    Settings
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleToggleFollow}
                  variant={isFollowing ? 'outline' : 'default'}
                  className={cn(
                    "h-10 w-full rounded-full text-xs font-black shadow-sm transition-all active:scale-95",
                    !isFollowing && "border-none bg-[#1a8917] text-white hover:bg-[#156d12]"
                  )}
                  disabled={isFollowLoading || !authUserId}
                >
                  {isFollowLoading ? (
                    <span className="size-3.5 animate-spin border-2 border-current border-t-transparent rounded-full" />
                  ) : isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
            </nav>
          </section>

          {/* Secondary Insights (Meta-information) */}
          <section className="border-t border-border/40 space-y-6 pt-8">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                <Award className="size-3.5" />
                Author Insights
              </h3>
              <dl className="space-y-3">
                <div className="flex items-center justify-between text-[13px] font-bold">
                  <dt className="text-muted-foreground">Total Appreciation</dt>
                  <dd className="flex items-center gap-1.5 text-rose-500">
                    <Heart className="size-3.5 fill-current" />
                    {totalLikes}
                  </dd>
                </div>
                <div className="flex items-center justify-between text-[13px] font-bold">
                  <dt className="text-muted-foreground">Joined</dt>
                  <dd className="flex items-center gap-1.5 text-foreground">
                    <CalendarDays className="size-3.5 opacity-50" />
                    {profile?.$createdAt ? new Date(profile.$createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}
                  </dd>
                </div>
              </dl>
            </div>

            {categories.length > 0 && (
              <div className="border-t border-border/20 space-y-4 pt-4">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Top Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <span key={cat} className="rounded-lg border border-border/40 bg-muted px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        </aside>
      </div>

      <NetworkDialog 
        isOpen={isNetworkOpen}
        onOpenChange={setIsNetworkOpen}
        title={networkType === 'followers' ? 'Followers' : 'Following'}
        users={networkType === 'followers' ? followersProfiles : followingProfiles}
        isLoading={networkType === 'followers' ? isFollowersLoading : isFollowingLoading}
      />
    </article>
  );
}
