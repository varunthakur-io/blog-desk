import { useState, useMemo } from 'react';
import { EditProfileDialog, ProfileTabs, NetworkDialog } from '@/features/profile';
import { Button } from '@/components/ui/button';
import { Settings, Edit, CalendarDays, Mail, Loader2, Heart, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/features/profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

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

  // Calculated insights
  const totalLikes = useMemo(() => userPosts.reduce((acc, post) => acc + (post.likesCount || 0), 0), [userPosts]);
  const categories = useMemo(() => [...new Set(userPosts.map(p => p.category).filter(Boolean))].slice(0, 3), [userPosts]);

  if (isFetchingUsername) return <ProfileSkeletonDetailed />;
  if (usernameFetchError)
    return <div className="py-20 text-center text-sm text-destructive font-bold uppercase tracking-widest">{usernameFetchError}</div>;

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
    <div className="max-w-screen-xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        
        {/* ── Main Content (Left) ── */}
        <div className="flex-1 w-full min-w-0 order-2 lg:order-1">
          {/* Mobile Profile View */}
          <div className="lg:hidden mb-10 space-y-6">
             <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-border">
                  <AvatarImage src={avatarUrl} className="object-cover" />
                  <AvatarFallback className="text-2xl font-black bg-muted">{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h1 className="text-2xl font-black tracking-tight truncate">{name}</h1>
                  <p className="text-muted-foreground font-bold text-sm">@{username}</p>
                </div>
             </div>
             <p className="text-sm text-foreground/80 leading-relaxed italic">{bio || 'No bio provided yet.'}</p>
             <div className="flex items-center gap-4">
                {isOwner ? (
                  <Button variant="outline" className="rounded-full font-bold text-xs px-6" onClick={() => navigate('/settings')}>
                    Edit Profile
                  </Button>
                ) : (
                  <Button className="rounded-full font-bold text-xs px-8" onClick={handleToggleFollow}>
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
             </div>
             <Separator className="opacity-50" />
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-border/40 pb-1">
              <h2 className="text-4xl font-black tracking-tighter text-foreground">{isOwner ? 'Your Stories' : `${name.split(' ')[0]}'s Stories`}</h2>
            </div>

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
          </div>
        </div>

        {/* ── Sidebar Info (Right Sticky) ── */}
        <aside className="hidden lg:flex w-[320px] shrink-0 flex-col gap-10 sticky top-24 order-2 border-l border-border/20 pl-10 h-fit pb-10">
          <div className="space-y-6">
            <Avatar className="h-24 w-24 border-2 border-border shadow-sm transition-transform hover:scale-[1.02]">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={name} className="object-cover" />}
              <AvatarFallback className="bg-muted text-3xl font-black text-muted-foreground uppercase">
                {name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h1 className="text-xl font-black tracking-tight text-foreground truncate">
                {name}
              </h1>
              <p className="text-muted-foreground font-bold text-sm tracking-wide">@{username}</p>
            </div>

            <div className="flex items-center gap-6 pt-1">
              <button 
                onClick={() => handleOpenNetwork('followers')}
                className="flex flex-col group transition-all active:scale-95 text-left"
              >
                <span className="text-sm font-black text-foreground group-hover:text-primary">{profile?.followersCount || 0}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Followers</span>
              </button>
              <button 
                onClick={() => handleOpenNetwork('following')}
                className="flex flex-col group transition-all active:scale-95 text-left"
              >
                <span className="text-sm font-black text-foreground group-hover:text-primary">{profile?.followingCount || 0}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Following</span>
              </button>
            </div>

            {bio ? (
              <p className="text-[14px] text-foreground/70 leading-relaxed italic border-l-2 border-primary/10 pl-4 py-1">
                {bio}
              </p>
            ) : (
              <p className="text-[13px] text-muted-foreground/50 italic">No bio provided yet.</p>
            )}

            <div className="pt-2 flex flex-col gap-3">
              {isOwner ? (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full rounded-full font-bold text-xs h-10 border-border/60 hover:bg-muted/50 transition-all active:scale-95"
                    onClick={() => navigate('/settings')}
                  >
                    <Edit className="h-3.5 w-3.5 mr-2" />
                    Edit Profile
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start font-bold text-xs text-muted-foreground hover:text-primary transition-all px-2"
                    onClick={() => navigate('/settings')}
                  >
                    <Settings className="h-3.5 w-3.5 mr-2" />
                    Settings
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleToggleFollow}
                  variant={isFollowing ? 'outline' : 'default'}
                  className={cn(
                    "w-full rounded-full font-black text-xs h-10 shadow-sm transition-all active:scale-95",
                    !isFollowing && "bg-[#1a8917] hover:bg-[#156d12] text-white border-none"
                  )}
                  disabled={isFollowLoading || !authUserId}
                >
                  {isFollowLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-6 pt-8 border-t border-border/40">
            <section className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 flex items-center gap-2">
                <Award className="size-3.5" />
                Author Insights
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[13px] font-bold">
                  <span className="text-muted-foreground">Total Appreciation</span>
                  <div className="flex items-center gap-1.5 text-rose-500">
                    <Heart className="size-3.5 fill-current" />
                    {totalLikes}
                  </div>
                </div>
                <div className="flex items-center justify-between text-[13px] font-bold">
                  <span className="text-muted-foreground">Member Since</span>
                  <div className="flex items-center gap-1.5 text-foreground">
                    <CalendarDays className="size-3.5 opacity-50" />
                    {profile?.$createdAt ? new Date(profile.$createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}
                  </div>
                </div>
              </div>
            </section>

            {categories.length > 0 && (
              <section className="space-y-4 pt-4 border-t border-border/20">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Top Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <span key={cat} className="px-2.5 py-1 rounded-lg bg-muted text-[10px] font-black uppercase tracking-wider text-muted-foreground border border-border/40">
                      {cat}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </aside>
      </div>

      <NetworkDialog 
        isOpen={isNetworkOpen}
        onOpenChange={setIsNetworkOpen}
        title={networkType === 'followers' ? 'Followers' : 'Following'}
        users={networkType === 'followers' ? followersProfiles : followingProfiles}
        isLoading={networkType === 'followers' ? isFollowersLoading : isFollowingLoading}
      />
    </div>
  );
}

const ProfileSkeletonDetailed = () => (
  <div className="max-w-screen-xl mx-auto py-10">
    <div className="flex flex-col lg:flex-row gap-16 items-start">
      <div className="flex-1 w-full space-y-12">
        <div className="flex justify-between items-end border-b border-border/40 pb-4">
          <Skeleton className="h-12 w-64 rounded-xl" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="space-y-10">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-8 items-start">
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </div>
              <Skeleton className="size-24 rounded-2xl hidden sm:block" />
            </div>
          ))}
        </div>
      </div>
      <aside className="hidden lg:flex w-[320px] flex-col gap-8 sticky top-24 border-l border-border/40 pl-10">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 rounded-md" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-full" />
      </aside>
    </div>
  </div>
);
