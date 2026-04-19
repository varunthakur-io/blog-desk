import { useState, useMemo } from 'react';
import { ProfileTabs, NetworkDialog, ProfileSkeleton } from '@/features/profile';
import { Button } from '@/components/ui/button';
import { Settings, Edit, CalendarDays, Heart, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/features/profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Profile: user identity and post publication history
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

  // Calculate total likes
  const totalLikes = useMemo(
    () => userPosts.reduce((acc, post) => acc + (post.likesCount || 0), 0),
    [userPosts],
  );

  // Get top 3 categories
  const categories = useMemo(
    () => [...new Set(userPosts.map((p) => p.category).filter(Boolean))].slice(0, 3),
    [userPosts],
  );

  // Loading state
  if (isFetchingUsername) return <ProfileSkeleton />;

  // Error handling
  if (usernameFetchError) {
    return (
      <div className="flex justify-center py-20">
        <div className="border-destructive/20 bg-destructive/5 text-destructive rounded-2xl border px-8 py-4 text-sm font-bold tracking-widest uppercase shadow-sm">
          {usernameFetchError}
        </div>
      </div>
    );
  }

  // Open network dialog
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
    <article className="section-grid animate-in fade-in duration-700">
        <div className="main-content">
          {/* Mobile header */}
          <header className="mb-10 space-y-6 lg:hidden">
            <div className="flex items-center gap-4">
              <Avatar className="border-border size-20 border-2">
                <AvatarImage src={avatarUrl} className="object-cover" />
                <AvatarFallback className="bg-muted text-2xl font-black uppercase">
                  {name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-black tracking-tight">{name}</h1>
                <p className="text-muted-foreground text-sm font-bold">@{username}</p>
              </div>
            </div>
            <p className="text-foreground/80 leading-relaxed italic">
              {bio || 'No bio provided yet.'}
            </p>
            <div className="flex items-center gap-4">
              {isOwner ? (
                <Button
                  variant="outline"
                  className="rounded-full px-6 text-xs font-bold"
                  onClick={() => navigate('/settings')}
                >
                  Edit Profile
                </Button>
              ) : (
                <Button
                  className="rounded-full px-8 text-xs font-bold"
                  onClick={handleToggleFollow}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
            </div>
            <Separator className="opacity-50" />
          </header>

          <section>
            <header className="flex h-[52px] items-center justify-between pb-1">
              <h2 className="text-4xl font-black tracking-tighter">Stories</h2>
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

        <aside className="right-sidebar">
          <div className="sticky top-[calc(var(--header-height,4rem)+2.5rem)] space-y-10">
            <section className="space-y-6">
              <Avatar className="border-border size-24 border-2 shadow-sm transition-transform hover:scale-[1.02]">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={name} className="object-cover" />}
                <AvatarFallback className="bg-muted text-muted-foreground text-3xl font-black uppercase">
                  {name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <h1 className="truncate text-xl font-black tracking-tight">{name}</h1>
                <p className="text-muted-foreground text-sm font-bold tracking-wide">@{username}</p>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <button
                  onClick={() => handleOpenNetwork('followers')}
                  className="group flex flex-col text-left transition-all active:scale-95"
                  aria-label="View followers"
                >
                  <span className="text-foreground group-hover:text-primary text-sm font-black">
                    {profile?.followersCount || 0}
                  </span>
                  <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                    Followers
                  </span>
                </button>
                <button
                  onClick={() => handleOpenNetwork('following')}
                  className="group flex flex-col text-left transition-all active:scale-95"
                  aria-label="View following"
                >
                  <span className="text-foreground group-hover:text-primary text-sm font-black">
                    {profile?.followingCount || 0}
                  </span>
                  <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                    Following
                  </span>
                </button>
              </div>

              {bio ? (
                <p className="border-primary/10 border-l-2 py-1 pl-4 text-[14px] leading-relaxed italic">
                  {bio}
                </p>
              ) : (
                <p className="text-muted-foreground/50 text-[13px] italic">No bio provided yet.</p>
              )}

              <nav className="flex flex-col gap-3 pt-2">
                {isOwner ? (
                  <>
                    <Button
                      variant="outline"
                      className="border-border/60 hover:bg-muted/50 h-10 w-full rounded-full text-xs font-bold transition-all active:scale-95"
                      onClick={() => navigate('/settings')}
                    >
                      <Edit className="mr-2 size-3.5" />
                      Edit Profile
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-muted-foreground hover:text-primary h-9 w-full justify-start px-2 text-xs font-bold transition-all"
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
                      'h-10 w-full rounded-full text-xs font-black shadow-sm transition-all active:scale-95',
                      !isFollowing && 'border-none bg-[#1a8917] text-white hover:bg-[#156d12]',
                    )}
                    disabled={isFollowLoading || !authUserId}
                  >
                    {isFollowLoading ? (
                      <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : isFollowing ? (
                      'Following'
                    ) : (
                      'Follow'
                    )}
                  </Button>
                )}
              </nav>
            </section>

            {/* Insights */}
            <section className="border-border/40 space-y-6 border-t pt-8">
              <div className="space-y-4">
                <h3 className="text-muted-foreground/50 flex items-center gap-2 text-[11px] font-black tracking-[0.2em] uppercase">
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
                    <dd className="flex items-center gap-1.5">
                      <CalendarDays className="size-3.5 opacity-50" />
                      {profile?.$createdAt
                        ? new Date(profile.$createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Recently'}
                    </dd>
                  </div>
                </dl>
              </div>

              {categories.length > 0 && (
                <div className="border-border/20 space-y-4 border-t pt-4">
                  <h3 className="text-muted-foreground/50 text-[11px] font-black tracking-[0.2em] uppercase">
                    Top Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <span
                        key={cat}
                        className="border-border/40 bg-muted text-muted-foreground rounded-lg border px-2.5 py-1 text-[10px] font-black tracking-wider uppercase"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </aside>

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
